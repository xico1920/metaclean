'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// ─── Translations ────────────────────────────────────────────────────────────
const t = {
  en: {
    plan_free: 'Free', plan_pro: 'Pro',
    images_used: (used, limit) => limit === null ? 'Unlimited' : `${used} / ${limit} today`,
    signout: 'Sign out',
    choose_platform: 'Choose platform',
    formats_label: 'Ad formats',
    all_formats: 'All',
    drop: 'Drop images here', drop_sub: 'PNG, JPG, WEBP · Up to 50MB each',
    select: 'Choose files', process: 'Process & Download', processing: 'Processing...',
    clear: 'Clear', success: (n) => `${n} image${n === 1 ? '' : 's'} processed`,
    limit_title: "You've reached your daily limit",
    limit_sub: 'Upgrade to Pro for unlimited processing.',
    upgrade_banner: 'You\'re on the free plan — 10 images/day.',
    upgrade_cta: 'Upgrade to Pro · €9/mo',
    manage_sub: 'Manage subscription',
    history_title: 'Recent conversions',
    history_empty: 'No conversions yet. Process your first image above.',
    history_formats: 'formats',
    safe_zone: 'Safe zone',
    danger_ui: (p) => `${p} UI`,
    tiktok_note: 'auto-compressed → 500KB',
    upgraded: 'Welcome to Pro! Your plan has been upgraded.',
    formats_select: 'Select formats',
    mode_ad: 'Ad formats', mode_clean: 'Metadata only',
    clean_drop: 'Drop any files here', clean_drop_sub: 'Images · PDFs · Any format',
    clean_select: 'Choose files', clean_process: 'Strip & Download', clean_processing: 'Stripping...',
    clean_desc: 'Strip metadata from any file. Images, PDFs and more — no resizing, no cropping.',
    clean_success: (n) => `${n} file${n === 1 ? '' : 's'} cleaned`,
    history_clean: 'Metadata only',
  },
  pt: {
    plan_free: 'Grátis', plan_pro: 'Pro',
    images_used: (used, limit) => limit === null ? 'Ilimitado' : `${used} / ${limit} hoje`,
    signout: 'Sair',
    choose_platform: 'Escolhe a plataforma',
    formats_label: 'Formatos de anúncio',
    all_formats: 'Todos',
    drop: 'Arrasta imagens aqui', drop_sub: 'PNG, JPG, WEBP · Até 50MB cada',
    select: 'Escolher ficheiros', process: 'Processar e Descarregar', processing: 'A processar...',
    clear: 'Limpar', success: (n) => `${n} imagem${n === 1 ? '' : 'ns'} processada${n === 1 ? '' : 's'}`,
    limit_title: 'Atingiste o limite diário',
    limit_sub: 'Faz upgrade para Pro para processamento ilimitado.',
    upgrade_banner: 'Estás no plano gratuito — 10 imagens/dia.',
    upgrade_cta: 'Upgrade para Pro · €9/mês',
    manage_sub: 'Gerir subscrição',
    history_title: 'Conversões recentes',
    history_empty: 'Sem conversões ainda. Processa a tua primeira imagem acima.',
    history_formats: 'formatos',
    safe_zone: 'Zona segura',
    danger_ui: (p) => `UI ${p}`,
    tiktok_note: 'comprimido → 500KB',
    upgraded: 'Bem-vindo ao Pro! O teu plano foi atualizado.',
    formats_select: 'Selecionar formatos',
    mode_ad: 'Formatos de anúncio', mode_clean: 'Apenas metadados',
    clean_drop: 'Arrasta qualquer ficheiro', clean_drop_sub: 'Imagens · PDFs · Qualquer formato',
    clean_select: 'Escolher ficheiros', clean_process: 'Limpar e Descarregar', clean_processing: 'A limpar...',
    clean_desc: 'Remove metadados de qualquer ficheiro. Imagens, PDFs e mais — sem redimensionar.',
    clean_success: (n) => `${n} ficheiro${n === 1 ? '' : 's'} limpo${n === 1 ? '' : 's'}`,
    history_clean: 'Apenas metadados',
  },
  es: {
    plan_free: 'Gratis', plan_pro: 'Pro',
    images_used: (used, limit) => limit === null ? 'Ilimitado' : `${used} / ${limit} hoy`,
    signout: 'Cerrar sesión',
    choose_platform: 'Elige la plataforma',
    formats_label: 'Formatos de anuncio',
    all_formats: 'Todos',
    drop: 'Arrastra imágenes aquí', drop_sub: 'PNG, JPG, WEBP · Hasta 50MB cada una',
    select: 'Elegir archivos', process: 'Procesar y Descargar', processing: 'Procesando...',
    clear: 'Limpiar', success: (n) => `${n} imagen${n === 1 ? '' : 'es'} procesada${n === 1 ? '' : 's'}`,
    limit_title: 'Has alcanzado tu límite diario',
    limit_sub: 'Actualiza a Pro para procesamiento ilimitado.',
    upgrade_banner: 'Estás en el plan gratuito — 10 imágenes/día.',
    upgrade_cta: 'Actualizar a Pro · €9/mes',
    manage_sub: 'Gestionar suscripción',
    history_title: 'Conversiones recientes',
    history_empty: 'Sin conversiones aún. Procesa tu primera imagen arriba.',
    history_formats: 'formatos',
    safe_zone: 'Zona segura',
    danger_ui: (p) => `UI ${p}`,
    tiktok_note: 'comprimido → 500KB',
    upgraded: 'Bienvenido a Pro! Tu plan ha sido actualizado.',
    formats_select: 'Seleccionar formatos',
    mode_ad: 'Formatos de anuncio', mode_clean: 'Solo metadatos',
    clean_drop: 'Arrastra cualquier archivo', clean_drop_sub: 'Imágenes · PDFs · Cualquier formato',
    clean_select: 'Elegir archivos', clean_process: 'Limpiar y Descargar', clean_processing: 'Limpiando...',
    clean_desc: 'Elimina metadatos de cualquier archivo. Imágenes, PDFs y más — sin redimensionar.',
    clean_success: (n) => `${n} archivo${n === 1 ? '' : 's'} limpiado${n === 1 ? '' : 's'}`,
    history_clean: 'Solo metadatos',
  },
}

const flags = { en: 'https://flagcdn.com/w20/gb.png', pt: 'https://flagcdn.com/w20/pt.png', es: 'https://flagcdn.com/w20/es.png' }

// ─── Platform icons ───────────────────────────────────────────────────────────
function PlatformIcon({ platform }) {
  const s = { width: 14, height: 14, style: { display: 'block', flexShrink: 0 } }
  if (platform === 'meta') return (
    <svg {...s} viewBox="0 0 24 24" fill="none">
      <path d="M12 9.5c-1.5-2.2-3.2-3.5-5-3.5C4.1 6 2 8.2 2 11c0 1.8.9 3.3 2.3 4.2.9.6 1.8.8 2.7.8 1.8 0 3.5-1.4 5-3.5 1.5 2.1 3.2 3.5 5 3.5.9 0 1.8-.2 2.7-.8C21.1 14.3 22 12.8 22 11c0-2.8-2.1-5-5-5-1.8 0-3.5 1.3-5 3.5z" fill="#1877f2"/>
    </svg>
  )
  if (platform === 'google') return (
    <svg {...s} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
  if (platform === 'tiktok') return (
    <svg {...s} viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z" fill="#ff0050"/>
    </svg>
  )
  if (platform === 'snapchat') return (
    <svg {...s} viewBox="0 0 24 24">
      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.317 4.814l-.004.061c-.004.071-.007.141-.01.211.129.06.264.107.4.117a1.104 1.104 0 00.606-.182c.083-.049.156-.063.225-.063.284 0 .573.211.573.508 0 .395-.3.544-.587.665-.064.028-.134.055-.194.085-.48.247-.646.607-.542.905.262.748 1.177 1.21 1.853 1.482l.06.025c.327.13.614.243.8.38.42.306.634.742.627 1.25-.011.664-.423 1.046-.798 1.046-.153 0-.289-.048-.43-.095-.327-.11-.651-.222-.984-.222-.228 0-.443.044-.645.137-.29.133-.516.308-.734.477-.518.403-1.094.851-2.257.851-.062 0-.127-.003-.194-.009-.527-.049-1.006-.195-1.42-.336-.398-.137-.771-.266-1.141-.266-.37 0-.743.129-1.141.266-.414.141-.893.287-1.42.336-.067.006-.132.009-.194.009-1.163 0-1.739-.448-2.257-.851-.218-.169-.444-.344-.734-.477-.202-.093-.417-.137-.645-.137-.333 0-.657.112-.984.222-.141.047-.277.095-.43.095-.375 0-.787-.382-.798-1.046-.007-.508.207-.944.627-1.25.186-.137.473-.25.8-.38l.06-.025c.676-.272 1.591-.734 1.853-1.482.104-.298-.062-.658-.542-.905-.06-.03-.13-.057-.194-.085-.287-.121-.587-.27-.587-.665 0-.297.289-.508.573-.508.069 0 .142.014.225.063a1.1 1.1 0 00.606.182c.136-.01.271-.057.4-.117l-.01-.211-.004-.061c-.086-1.595-.212-3.621.317-4.814C7.859 1.069 11.216.793 12.206.793z" fill="#fffc00"/>
    </svg>
  )
  if (platform === 'pinterest') return (
    <svg {...s} viewBox="0 0 24 24" fill="#e60023">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
  )
  if (platform === 'linkedin') return (
    <svg {...s} viewBox="0 0 24 24" fill="#0a66c2">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
  return <div style={{width:14,height:14,borderRadius:'50%',background:'#6366f1',flexShrink:0}} />
}

// ─── Platform configs ─────────────────────────────────────────────────────────
const PLATFORM_CONFIGS = {
  meta: {
    name: 'Meta Ads', color: '#1877f2',
    formats: [
      { label: 'meta_1x1_1080x1080',   display: '1:1',    size: '1080×1080', width: 1080, height: 1080 },
      { label: 'meta_4x5_1080x1350',   display: '4:5',    size: '1080×1350', width: 1080, height: 1350 },
      { label: 'meta_9x16_1080x1920',  display: '9:16',   size: '1080×1920', width: 1080, height: 1920 },
      { label: 'meta_1.91x1_1200x628', display: '1.91:1', size: '1200×628',  width: 1200, height: 628  },
    ],
  },
  google: {
    name: 'Google Ads', color: '#4285f4',
    formats: [
      { label: 'google_1.91x1_1200x628', display: '1.91:1', size: '1200×628',  width: 1200, height: 628  },
      { label: 'google_1x1_1200x1200',   display: '1:1',    size: '1200×1200', width: 1200, height: 1200 },
      { label: 'google_4x5_1200x1500',   display: '4:5',    size: '1200×1500', width: 1200, height: 1500 },
    ],
  },
  tiktok: {
    name: 'TikTok Ads', color: '#ff0050',
    formats: [
      { label: 'tiktok_9x16_1080x1920', display: '9:16', size: '1080×1920', width: 1080, height: 1920 },
      { label: 'tiktok_1x1_1080x1080',  display: '1:1',  size: '1080×1080', width: 1080, height: 1080 },
    ],
    safeZone: { topPct: 6.77, bottomPct: 13.02 },
  },
  snapchat: {
    name: 'Snapchat', color: '#fffc00',
    formats: [
      { label: 'snapchat_9x16_1080x1920', display: '9:16', size: '1080×1920', width: 1080, height: 1920 },
    ],
    safeZone: { topPct: 8.85, bottomPct: 8.85 },
  },
  pinterest: {
    name: 'Pinterest', color: '#e60023',
    formats: [
      { label: 'pinterest_2x3_1000x1500', display: '2:3', size: '1000×1500', width: 1000, height: 1500 },
      { label: 'pinterest_1x1_1000x1000', display: '1:1', size: '1000×1000', width: 1000, height: 1000 },
    ],
  },
  linkedin: {
    name: 'LinkedIn', color: '#0a66c2',
    formats: [
      { label: 'linkedin_1.91x1_1200x628', display: '1.91:1', size: '1200×628',  width: 1200, height: 628  },
      { label: 'linkedin_1x1_1200x1200',   display: '1:1',    size: '1200×1200', width: 1200, height: 1200 },
    ],
  },
}

const FREE_LIMIT = 10

// ─── Shared styles ────────────────────────────────────────────────────────────
const glowStyle = {
  background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6, #6366f1)',
  backgroundSize: '300% 300%',
  backgroundPosition: '0% 50%',
  transition: 'box-shadow 0.4s ease, background-position 0.1s ease',
}
const glowHandlers = {
  onMouseEnter: (e) => {
    e.currentTarget.style.backgroundPosition = '100% 50%'
    e.currentTarget.style.boxShadow = '0 0 0 1px rgba(139,92,246,0.6), 0 0 20px rgba(99,102,241,0.5), 0 0 45px rgba(139,92,246,0.25)'
  },
  onMouseLeave: (e) => {
    e.currentTarget.style.backgroundPosition = '0% 50%'
    e.currentTarget.style.boxShadow = 'none'
  },
  onMouseMove: (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1)
    e.currentTarget.style.backgroundPosition = `${x}% 50%`
  },
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconUpload = () => <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
const IconFile = () => <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
const IconDownload = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
const IconSpin = () => <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
const IconCheck = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" /></svg>

function Logo() {
  return (
    <Link href="/" style={{display:'flex', alignItems:'center', gap:'10px', textDecoration:'none'}}>
      <svg width="30" height="30" viewBox="0 0 56 56" fill="none">
        <defs><clipPath id="dashClip"><rect width="56" height="56" rx="13"/></clipPath></defs>
        <rect width="56" height="56" rx="13" fill="#4338ca"/>
        <g clipPath="url(#dashClip)">
          <circle cx="14" cy="18" r="5" fill="rgba(255,255,255,0.9)"/>
          <polygon points="6,52 22,26 38,52" fill="rgba(255,255,255,0.9)"/>
          <polygon points="24,52 36,34 50,52" fill="rgba(255,255,255,0.7)"/>
          <polygon points="34,0 56,0 56,24" fill="#060609"/>
          <line x1="34" y1="0" x2="56" y2="24" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round"/>
        </g>
      </svg>
      <span style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif', fontSize:'19px', letterSpacing:'-0.7px', lineHeight:1}}>
        <span style={{fontWeight:800, color:'white'}}>meta</span>
        <span style={{fontWeight:200, color:'rgba(255,255,255,0.45)'}}>clean</span>
      </span>
    </Link>
  )
}

function SafeZoneOverlay({ platform, i }) {
  const cfg = PLATFORM_CONFIGS[platform]?.safeZone
  if (!cfg) return null
  const platformName = PLATFORM_CONFIGS[platform]?.name || platform
  return (
    <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden" style={{zIndex: 5}}>
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center" style={{height: `${cfg.topPct}%`, background: 'rgba(239,68,68,0.18)', borderBottom: '1px dashed rgba(239,68,68,0.5)'}}>
        <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">{i.danger_ui(platformName)}</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md" style={{background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)'}}>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest">{i.safe_zone}</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center" style={{height: `${cfg.bottomPct}%`, background: 'rgba(239,68,68,0.18)', borderTop: '1px dashed rgba(239,68,68,0.5)'}}>
        <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">{i.danger_ui(platformName)}</span>
      </div>
    </div>
  )
}

// ─── CropEditor ───────────────────────────────────────────────────────────────
function CropEditor({ files, selectedFormats, platformCfg, onProcess, onBack, processing }) {
  const formats = platformCfg.formats.filter(f => selectedFormats.has(f.label))
  const [currentIdx, setCurrentIdx] = useState(0)
  const [activeFormat, setActiveFormat] = useState(() => formats[0]?.label ?? null)
  const [cropState, setCropState] = useState({})
  const [imageURLs, setImageURLs] = useState([])
  const [imageDims, setImageDims] = useState([])
  const dragRef = useRef(null)

  useEffect(() => {
    const urls = files.map(f => URL.createObjectURL(f))
    setImageURLs(urls)
    let cancelled = false
    Promise.all(urls.map(url => new Promise(res => {
      const img = new Image()
      img.onload = () => res({ w: img.naturalWidth || 1, h: img.naturalHeight || 1 })
      img.onerror = () => res({ w: 4, h: 3 })
      img.src = url
    }))).then(dims => { if (!cancelled) setImageDims(dims) })
    return () => { cancelled = true; urls.forEach(u => URL.revokeObjectURL(u)) }
  }, [files]) // eslint-disable-line

  const getCrop = (fi, fmt) => cropState[fi]?.[fmt] ?? { xPct: 0.5, yPct: 0.5, autocrop: false }

  const updateCrop = (fi, fmt, patch) => setCropState(prev => {
    const cur = prev[fi]?.[fmt] ?? { xPct: 0.5, yPct: 0.5, autocrop: false }
    return { ...prev, [fi]: { ...prev[fi], [fmt]: { ...cur, ...patch } } }
  })

  const applyToAll = () => {
    const c = getCrop(currentIdx, activeFormat)
    formats.forEach(f => {
      if (f.label !== activeFormat) {
        // Copy position only — intentionally does NOT copy autocrop flag
        updateCrop(currentIdx, f.label, { xPct: c.xPct, yPct: c.yPct })
      }
    })
  }

  const handleProcessAll = () => {
    const result = {}
    files.forEach((_, fi) => {
      result[fi] = {}
      formats.forEach(fmt => { result[fi][fmt.label] = getCrop(fi, fmt.label) })
    })
    onProcess(result)
  }

  // ── Geometry (all % so container is responsive) ───────────────────────────
  const imgContainerRef = useRef(null)
  const MAX_ASPECT = 500 / 200 // widest container aspect ratio we allow

  const imgDim = imageDims[currentIdx]
  // aspect ratio of the image (w:h). Default 4:3 while loading.
  const imgAspect = (imgDim && imgDim.w > 0 && imgDim.h > 0) ? imgDim.w / imgDim.h : 4 / 3

  const activeFmtObj = formats.find(f => f.label === activeFormat)
  // aspect ratio of the selected ad format
  const fmtAspect = activeFmtObj ? activeFmtObj.width / activeFmtObj.height : imgAspect

  // crop box covers the largest area of the format ratio within the image
  // expressed as fractions of image dimensions (0–1)
  let cropWFrac = 1, cropHFrac = 1
  if (fmtAspect > imgAspect) { cropWFrac = 1; cropHFrac = imgAspect / fmtAspect }
  else { cropHFrac = 1; cropWFrac = fmtAspect / imgAspect }

  const fmtLabel = activeFormat || formats[0]?.label
  const c = fmtLabel ? getCrop(currentIdx, fmtLabel) : { xPct: 0.5, yPct: 0.5, autocrop: false }

  // crop box CSS % values (left/top = upper-left corner of box, width/height = box size)
  const boxWidthPct = cropWFrac * 100
  const boxHeightPct = cropHFrac * 100
  const minXPct = cropWFrac / 2
  const minYPct = cropHFrac / 2
  const clampX = Math.max(minXPct, Math.min(1 - minXPct, c.xPct))
  const clampY = Math.max(minYPct, Math.min(1 - minYPct, c.yPct))
  const boxLeftPct = (clampX - cropWFrac / 2) * 100
  const boxTopPct = (clampY - cropHFrac / 2) * 100

  // ── Drag (uses getBoundingClientRect for true rendered px) ────────────────
  const handlePointerDown = (e) => {
    if (c.autocrop) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = e.currentTarget.getBoundingClientRect()
    dragRef.current = { startX: e.clientX, startY: e.clientY, startXPct: clampX, startYPct: clampY, rW: rect.width, rH: rect.height }
  }
  const handlePointerMove = (e) => {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    const newX = Math.max(minXPct, Math.min(1 - minXPct, dragRef.current.startXPct + dx / dragRef.current.rW))
    const newY = Math.max(minYPct, Math.min(1 - minYPct, dragRef.current.startYPct + dy / dragRef.current.rH))
    updateCrop(currentIdx, fmtLabel, { xPct: newX, yPct: newY })
  }
  const handlePointerUp = () => { dragRef.current = null }

  if (formats.length === 0) return null

  return (
    <div className="rounded-2xl mb-6" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)'}}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5" style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            disabled={processing}
            className="text-[12px] text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1.5 disabled:opacity-40"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <span className="text-[13px] font-semibold text-white">Edit crops</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(idx => idx - 1)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-300 disabled:opacity-30 transition-colors"
            style={{background: 'rgba(255,255,255,0.04)'}}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-[12px] text-gray-500 tabular-nums">{currentIdx + 1} / {files.length}</span>
          <button
            disabled={currentIdx === files.length - 1}
            onClick={() => setCurrentIdx(idx => idx + 1)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-300 disabled:opacity-30 transition-colors"
            style={{background: 'rgba(255,255,255,0.04)'}}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <span className="text-[11px] text-gray-600 ml-1 max-w-[140px] truncate">{files[currentIdx]?.name}</span>
        </div>
      </div>

      {/* Format tabs */}
      <div className="flex gap-1.5 px-5 pt-4 pb-1" style={{overflowX: 'auto', scrollbarWidth: 'none'}}>
        {formats.map(fmt => {
          const fmtCrop = getCrop(currentIdx, fmt.label)
          return (
            <button
              key={fmt.label}
              onClick={() => setActiveFormat(fmt.label)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all shrink-0"
              style={{
                background: activeFormat === fmt.label ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                border: activeFormat === fmt.label ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.07)',
                color: activeFormat === fmt.label ? '#a5b4fc' : 'rgba(255,255,255,0.4)',
              }}
            >
              {fmtCrop.autocrop && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />}
              {fmt.display}
              <span className="text-[10px] opacity-50">{fmt.size}</span>
            </button>
          )
        })}
      </div>

      {/* Image + crop overlay */}
      <div className="py-4 px-5">
        {/* Container: full width up to max, aspect-ratio locks the height */}
        <div
          ref={imgContainerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 560,
            margin: '0 auto',
            aspectRatio: `${imgAspect}`,
            overflow: 'hidden',
            borderRadius: 10,
            background: '#0a0a12',
            cursor: c.autocrop ? 'default' : 'grab',
            userSelect: 'none',
            touchAction: 'none',
          }}
        >
          {/* Image */}
          {imageURLs[currentIdx] && (
            <img
              src={imageURLs[currentIdx]}
              alt=""
              draggable={false}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', display: 'block', pointerEvents: 'none' }}
            />
          )}

          {/* Loading spinner */}
          {!imgDim && (
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            </div>
          )}

          {/* ── SVG mask overlay — punches a hole where the crop box is ── */}
          <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}} viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <mask id="metaclean-crop-mask">
                <rect width="100" height="100" fill="white" />
                <rect x={boxLeftPct} y={boxTopPct} width={boxWidthPct} height={boxHeightPct} fill="black" />
              </mask>
            </defs>
            <rect width="100" height="100" fill="rgba(0,0,0,0.65)" mask="url(#metaclean-crop-mask)" />
          </svg>

          {/* ── Crop box border ── */}
          <div
            style={{
              position: 'absolute',
              left: `${boxLeftPct}%`,
              top: `${boxTopPct}%`,
              width: `${boxWidthPct}%`,
              height: `${boxHeightPct}%`,
              border: c.autocrop ? '2px dashed rgba(99,102,241,0.75)' : '1.5px solid rgba(255,255,255,0.85)',
              borderRadius: 2,
              pointerEvents: 'none',
            }}
          >
            {/* Rule of thirds */}
            <div style={{position:'absolute',inset:0,pointerEvents:'none'}}>
              <div style={{position:'absolute',top:0,bottom:0,left:'33.33%',borderLeft:'1px solid rgba(255,255,255,0.15)'}} />
              <div style={{position:'absolute',top:0,bottom:0,left:'66.66%',borderLeft:'1px solid rgba(255,255,255,0.15)'}} />
              <div style={{position:'absolute',left:0,right:0,top:'33.33%',borderTop:'1px solid rgba(255,255,255,0.15)'}} />
              <div style={{position:'absolute',left:0,right:0,top:'66.66%',borderTop:'1px solid rgba(255,255,255,0.15)'}} />
            </div>

            {/* Corner handles */}
            {[{top:-3,left:-3},{top:-3,right:-3},{bottom:-3,left:-3},{bottom:-3,right:-3}].map((pos, hIdx) => (
              <div key={hIdx} style={{position:'absolute',width:7,height:7,background: c.autocrop ? '#a5b4fc' : 'white',borderRadius:1,...pos}} />
            ))}

            {/* Autocrop label inside box */}
            {c.autocrop && (
              <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
                <div className="text-center px-3 py-2 rounded-lg" style={{background:'rgba(6,6,9,0.8)',border:'1px solid rgba(99,102,241,0.3)'}}>
                  <div className="text-[11px] font-semibold text-indigo-300">AI autocrop</div>
                  <div className="text-[10px] text-indigo-400/55 mt-0.5">approx. preview</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-[11px] text-gray-600 mt-2.5">
          {c.autocrop ? 'Sharp attention strategy · preview is approximate' : 'Drag to reposition crop · stays within image bounds'}
        </p>
      </div>

      {/* Controls */}
      <div className="px-5 pb-5 flex items-center justify-between gap-4 flex-wrap" style={{borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem'}}>
        <div className="flex items-center gap-4 flex-wrap">
          {/* Autocrop toggle */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => fmtLabel && updateCrop(currentIdx, fmtLabel, { autocrop: !c.autocrop })}
          >
            <div className="relative w-8 h-4 rounded-full transition-colors" style={{background: c.autocrop ? '#6366f1' : 'rgba(255,255,255,0.1)'}}>
              <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-200" style={{left: c.autocrop ? 18 : 2}} />
            </div>
            <span className="text-[12px] text-gray-400 select-none">Content-aware autocrop</span>
          </div>

          {/* Apply to all */}
          {!c.autocrop && formats.length > 1 && (
            <button
              onClick={applyToAll}
              className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors px-2.5 py-1 rounded-lg"
              style={{border: '1px solid rgba(255,255,255,0.08)'}}
            >
              Apply to all formats
            </button>
          )}
        </div>

        <button
          onClick={handleProcessAll}
          disabled={processing}
          {...glowHandlers}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white disabled:opacity-40"
          style={glowStyle}
        >
          {processing ? <><IconSpin /> Processing…</> : <><IconDownload /> Process all</>}
        </button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#060609] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </main>
    }>
      <DashboardInner />
    </Suspense>
  )
}

function DashboardInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [lang, setLang] = useState('en')
  const [langOpen, setLangOpen] = useState(false)

  // Processing state
  const [files, setFiles] = useState([])
  const [dragging, setDragging] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState('meta')
  const [selectedFormats, setSelectedFormats] = useState(new Set())
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)
  const [limitReached, setLimitReached] = useState(false)
  const [upgradedNotice, setUpgradedNotice] = useState(false)
  const [step, setStep] = useState('upload') // 'upload' | 'crop'
  const [rejectedFiles, setRejectedFiles] = useState([]) // non-image files dropped
  const [hoveredPlatform, setHoveredPlatform] = useState(null)
  const [hoveredFormat, setHoveredFormat] = useState(null)
  const [fileWarning, setFileWarning] = useState('')
  const fileInputRef = useRef(null)
  // Dashboard mode + mobile nav
  const [dashMode, setDashMode] = useState('ad') // 'ad' | 'clean'
  const [cleanFiles, setCleanFiles] = useState([])
  const [cleanDragging, setCleanDragging] = useState(false)
  const [cleanProcessing, setCleanProcessing] = useState(false)
  const [cleanDone, setCleanDone] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const cleanFileInputRef = useRef(null)

  const i = t[lang]

  // Init formats when platform changes — only first format selected by default
  useEffect(() => {
    setSelectedFormats(new Set([PLATFORM_CONFIGS[selectedPlatform].formats[0].label]))
  }, [selectedPlatform])

  // Auth check + restore any files saved before login
  useEffect(() => {
    const saved = localStorage.getItem('metaclean_lang')
    if (saved && ['en', 'pt', 'es'].includes(saved)) setLang(saved)

    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.replace('/login'); return }
      setUser(data.session.user)
      await loadProfile(data.session.user.id)
      await loadHistory(data.session.user.id)
      setLoading(false)
      setTimeout(() => setLoaded(true), 40)
      if (searchParams.get('upgraded') === '1') setUpgradedNotice(true)

      // Restore files dropped on landing page before auth
      try {
        const raw = sessionStorage.getItem('metaclean_pending')
        if (raw) {
          sessionStorage.removeItem('metaclean_pending')
          const stored = JSON.parse(raw)
          const restored = stored.map(({ name, type, data: dataUrl }) => {
            const arr = dataUrl.split(',')[1]
            const bytes = atob(arr)
            const buf = new Uint8Array(bytes.length)
            for (let i = 0; i < bytes.length; i++) buf[i] = bytes.charCodeAt(i)
            return new File([buf], name, { type })
          })
          const images = restored.filter(f => f.type.startsWith('image/'))
          if (images.length > 0) setFiles(images)
        }
      } catch {}
    })
  }, [router, searchParams])

  const loadProfile = async (uid) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).single()
    if (data) {
      // Check daily reset
      const today = new Date().toISOString().split('T')[0]
      if (data.last_reset_date !== today) {
        await supabase.from('profiles').update({ images_used_today: 0, last_reset_date: today }).eq('id', uid)
        setProfile({ ...data, images_used_today: 0, last_reset_date: today })
      } else {
        setProfile(data)
      }
    }
  }

  const loadHistory = async (uid) => {
    const { data } = await supabase
      .from('conversion_history')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(20)
    setHistory(data || [])
  }

  const toggleFormat = (label) => {
    setSelectedFormats(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  const splitByType = (raw) => {
    const images = raw.filter(f => f.type.startsWith('image/'))
    const rejected = raw.filter(f => !f.type.startsWith('image/'))
    return { images, rejected }
  }
  const applyFiles = (raw) => {
    const { images, rejected } = splitByType(raw)
    const MAX = 50
    let warning = ''
    let finalImages = images
    if (images.length > MAX) {
      finalImages = images.slice(0, MAX)
      warning = `Too many images — only the first ${MAX} were loaded. Processing more at once may cause timeouts.`
    }
    setFiles(finalImages); setRejectedFiles(rejected); setDone(false); setLimitReached(false); setFileWarning(warning)
  }
  const handleFiles = (e) => applyFiles(Array.from(e.target.files))
  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    applyFiles(Array.from(e.dataTransfer.files))
  }

  const switchDashMode = (newMode) => {
    if (newMode === dashMode) return
    setDashMode(newMode)
    setFiles([]); setCleanFiles([])
    setDone(false); setCleanDone(false)
    setLimitReached(false); setRejectedFiles([])
    setFileWarning(''); setStep('upload')
  }

  const handleCleanFiles = (e) => setCleanFiles(prev => [...prev, ...Array.from(e.target.files)])
  const handleCleanDrop = (e) => {
    e.preventDefault()
    setCleanDragging(false)
    setCleanFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)])
  }

  const processClean = async () => {
    if (cleanFiles.length === 0) return
    setCleanProcessing(true)
    setLimitReached(false)

    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    const results = []

    for (const file of cleanFiles) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', file.name)

      const res = await fetch('/api/clean', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        if (err.limitReached) { setLimitReached(true); break }
        continue
      }

      const blob = await res.blob()
      const ext = file.name.split('.').pop() || 'bin'
      const base = file.name.replace(/\.[^.]+$/, '')
      results.push({ blob, filename: `metaclean_${base}_clean.${ext}` })
    }

    if (results.length === 1) {
      const url = URL.createObjectURL(results[0].blob)
      const a = document.createElement('a')
      a.href = url; a.download = results[0].filename; a.click()
      URL.revokeObjectURL(url)
    } else if (results.length > 0) {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      for (const { blob, filename } of results) zip.file(filename, blob)
      const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url; a.download = 'metaclean_clean_batch.zip'; a.click()
      URL.revokeObjectURL(url)
    }

    if (user) { await loadProfile(user.id); await loadHistory(user.id) }
    setCleanProcessing(false)
    setCleanDone(true)
  }

  // cropData: { [fileIndex]: { [formatLabel]: { xPct, yPct, autocrop } } }
  const processImages = async (cropData = {}) => {
    if (selectedFormats.size === 0 || files.length === 0) return
    setProcessing(true)
    setLimitReached(false)

    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    let hitLimit = false

    // Collect all results, then decide how to download
    const results = [] // { blob, filename, isZip }

    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const file = files[fileIndex]
      const formData = new FormData()
      formData.append('image', file)
      formData.append('platform', selectedPlatform)
      formData.append('name', file.name)
      formData.append('formats', JSON.stringify([...selectedFormats]))
      if (cropData[fileIndex]) {
        formData.append('cropData', JSON.stringify(cropData[fileIndex]))
      }

      const res = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        if (err.limitReached) { setLimitReached(true); hitLimit = true; break }
        continue
      }

      const contentType = res.headers.get('Content-Type') || ''
      const blob = await res.blob()
      const base = file.name.replace(/\.[^.]+$/, '')
      const isZip = contentType.includes('zip')
      results.push({
        blob,
        filename: isZip
          ? `metaclean_${base}_${selectedPlatform}.zip`
          : `metaclean_${base}_${[...selectedFormats][0]}.jpg`,
        isZip,
      })
    }

    // Download: single JPG → direct, everything else → one combined zip
    if (results.length === 1 && !results[0].isZip) {
      const url = URL.createObjectURL(results[0].blob)
      const a = document.createElement('a')
      a.href = url; a.download = results[0].filename; a.click()
      URL.revokeObjectURL(url)
    } else if (results.length > 0) {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      for (const { blob, filename, isZip } of results) {
        if (isZip) {
          // Unpack inner zip and add files flat into the outer zip
          const inner = await JSZip.loadAsync(blob)
          await Promise.all(Object.keys(inner.files).map(async (name) => {
            if (!inner.files[name].dir) {
              zip.file(name, await inner.files[name].async('blob'))
            }
          }))
        } else {
          zip.file(filename, blob)
        }
      }
      const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url; a.download = `metaclean_${selectedPlatform}_batch.zip`; a.click()
      URL.revokeObjectURL(url)
    }

    // Refresh stats
    if (user) {
      await loadProfile(user.id)
      await loadHistory(user.id)
    }

    setProcessing(false)
    setStep('upload')
    if (!hitLimit) setDone(true)
  }

  const handleUpgrade = async () => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    const json = await res.json()
    if (json.url) window.location.href = json.url
  }

  const handleManageSub = async () => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    const res = await fetch('/api/stripe/portal', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    const json = await res.json()
    if (json.url) window.location.href = json.url
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#060609] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </main>
    )
  }

  const isPro = profile?.plan === 'pro'
  const imagesUsed = profile?.images_used_today ?? 0
  const usageLimit = isPro ? null : FREE_LIMIT
  const usagePct = usageLimit ? Math.min((imagesUsed / usageLimit) * 100, 100) : 0
  const platformCfg = PLATFORM_CONFIGS[selectedPlatform]

  // Animation helpers
  const anim = (delay = 0) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'none' : 'translateY(14px)',
    transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  })
  const animNav = {
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'none' : 'translateY(-10px)',
    transition: 'opacity 0.4s ease 0ms, transform 0.4s ease 0ms',
  }

  return (
    <main className="min-h-screen bg-[#060609] text-white" style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]" style={{background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.06) 0%, transparent 65%)'}} />
      </div>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-4" style={{borderBottom: '1px solid rgba(255,255,255,0.05)', ...animNav}}>
        <Logo />
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Usage pill — desktop only */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px]" style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)'}}>
            {isPro ? (
              <span style={{color: '#a5b4fc'}}>∞ Unlimited</span>
            ) : (
              <>
                <div className="w-16 h-1 rounded-full overflow-hidden" style={{background: 'rgba(255,255,255,0.08)'}}>
                  <div className="h-full rounded-full transition-all" style={{width: `${usagePct}%`, background: usagePct >= 90 ? '#f87171' : '#6366f1'}} />
                </div>
                <span className="text-gray-400">{imagesUsed}/{FREE_LIMIT}</span>
              </>
            )}
          </div>

          {/* Plan badge */}
          <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider" style={{
            background: isPro ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.04)',
            border: isPro ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.07)',
            color: isPro ? '#a5b4fc' : 'rgba(255,255,255,0.4)',
          }}>
            {isPro && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
            {isPro ? i.plan_pro : i.plan_free}
          </div>

          {/* Language */}
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-[12px] text-gray-400 hover:text-gray-200 transition-colors" style={{border: '1px solid rgba(255,255,255,0.07)'}}>
              <img src={flags[lang]} alt={lang} style={{width:'14px', height:'10px', objectFit:'cover', borderRadius:'2px'}} />
              <span className="uppercase font-medium tracking-wider text-[11px] hidden sm:inline">{lang}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1.5 w-28 rounded-xl overflow-hidden z-30" style={{background: '#0d0d14', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
                {Object.keys(t).map((l) => (
                  <button key={l} onClick={() => { setLang(l); localStorage.setItem('metaclean_lang', l); setLangOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2.5 text-[12px] hover:bg-white/5 transition-colors">
                    <img src={flags[l]} alt={l} style={{width:'14px', height:'10px', objectFit:'cover', borderRadius:'2px'}} />
                    <span className={`uppercase font-medium tracking-wider ${lang === l ? 'text-blue-400' : 'text-gray-400'}`}>{l}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sign out — desktop only */}
          <button onClick={handleSignOut} className="hidden sm:block text-[12px] text-gray-500 hover:text-gray-300 transition-colors px-2 py-1.5">
            {i.signout}
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="sm:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
            style={{border: '1px solid rgba(255,255,255,0.08)'}}
          >
            {menuOpen
              ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            }
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 z-40 pb-2" style={{background: 'rgba(6,6,9,0.98)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)', animation: 'fadeInDown 0.2s cubic-bezier(0.16,1,0.3,1) both'}}>
            {/* Usage on mobile */}
            {!isPro && (
              <div className="px-4 pt-3 pb-2">
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'}}>
                  <div className="flex-1">
                    <p className="text-[11px] text-gray-500 mb-1">Daily usage</p>
                    <div className="w-full h-1 rounded-full overflow-hidden" style={{background: 'rgba(255,255,255,0.08)'}}>
                      <div className="h-full rounded-full transition-all" style={{width: `${usagePct}%`, background: usagePct >= 90 ? '#f87171' : '#6366f1'}} />
                    </div>
                  </div>
                  <span className="text-[12px] text-gray-400 shrink-0">{imagesUsed}/{FREE_LIMIT}</span>
                </div>
              </div>
            )}
            <div className="px-4 py-1">
              <button
                onClick={() => { handleSignOut(); setMenuOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all text-left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                {i.signout}
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12" style={anim(0)}>

        {/* Upgraded notice */}
        {upgradedNotice && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] text-green-300" style={{background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)'}}>
            <IconCheck />
            {i.upgraded}
            <button onClick={() => setUpgradedNotice(false)} className="ml-auto text-green-400/60 hover:text-green-400 transition-colors">×</button>
          </div>
        )}

        {/* Upgrade banner */}
        {!isPro && (
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 rounded-xl" style={{background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(99,102,241,0.1))', border: '1px solid rgba(99,102,241,0.18)'}}>
            <div>
              <p className="text-[13px] text-gray-200 font-medium">{i.upgrade_banner}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 h-1 rounded-full overflow-hidden" style={{background: 'rgba(255,255,255,0.08)'}}>
                  <div className="h-full rounded-full transition-all" style={{width: `${usagePct}%`, background: usagePct >= 90 ? '#f87171' : '#6366f1'}} />
                </div>
                <span className="text-[11px] text-gray-500">{imagesUsed}/{FREE_LIMIT} images used today</span>
              </div>
            </div>
            <button onClick={handleUpgrade} {...glowHandlers} className="shrink-0 px-4 py-2 rounded-xl text-[12px] font-semibold text-white whitespace-nowrap" style={glowStyle}>
              {i.upgrade_cta}
            </button>
          </div>
        )}

        {/* Pro: manage subscription */}
        {isPro && (
          <div className="mb-6 flex items-center justify-between px-5 py-3.5 rounded-xl" style={{background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)'}}>
            <div className="flex items-center gap-2 text-[13px] text-indigo-300">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Pro plan · Unlimited images
            </div>
            <button onClick={handleManageSub} className="text-[12px] text-indigo-400 hover:text-indigo-300 transition-colors">
              {i.manage_sub} →
            </button>
          </div>
        )}

        {/* ─── Processing tool ─── */}
        {step === 'crop' ? (
          <div style={{animation: 'scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) both'}}>
            <CropEditor
              files={files}
              selectedFormats={selectedFormats}
              platformCfg={platformCfg}
              onProcess={processImages}
              onBack={() => setStep('upload')}
              processing={processing}
            />
          </div>
        ) : null}
        <div className="rounded-2xl mb-6" style={{display: step === 'crop' ? 'none' : undefined, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', ...anim(60)}}>

          {/* ── Mode toggle ── */}
          <div className="p-3 sm:p-4" style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
            <div className="flex rounded-xl p-1" style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)'}}>
              <button
                onClick={() => switchDashMode('ad')}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] font-medium transition-all duration-200"
                style={{
                  background: dashMode === 'ad' ? 'rgba(255,255,255,0.09)' : 'transparent',
                  color: dashMode === 'ad' ? 'white' : 'rgba(255,255,255,0.4)',
                  boxShadow: dashMode === 'ad' ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
                {i.mode_ad}
              </button>
              <button
                onClick={() => switchDashMode('clean')}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] font-medium transition-all duration-200"
                style={{
                  background: dashMode === 'clean' ? 'rgba(255,255,255,0.09)' : 'transparent',
                  color: dashMode === 'clean' ? 'white' : 'rgba(255,255,255,0.4)',
                  boxShadow: dashMode === 'clean' ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                {i.mode_clean}
              </button>
            </div>
          </div>

          {/* ── Ad mode: platform + format selectors ── */}
          {dashMode === 'ad' && (
          <div className="p-5 sm:p-6" style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>

            {/* Platform selector */}
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-medium">{i.choose_platform}</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {Object.entries(PLATFORM_CONFIGS).map(([key, p]) => {
                const active = selectedPlatform === key
                const hovered = hoveredPlatform === key
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedPlatform(key)}
                    onMouseEnter={() => setHoveredPlatform(key)}
                    onMouseLeave={() => setHoveredPlatform(null)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-medium"
                    style={{
                      background: active ? `${p.color}18` : hovered ? `${p.color}0d` : 'rgba(255,255,255,0.03)',
                      border: active ? `1px solid ${p.color}55` : hovered ? `1px solid ${p.color}33` : '1px solid rgba(255,255,255,0.07)',
                      color: active ? 'white' : hovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
                      transform: active ? 'scale(1.03)' : hovered ? 'scale(1.01)' : 'scale(1)',
                      boxShadow: active ? `0 0 12px ${p.color}22` : hovered ? `0 0 8px ${p.color}15` : 'none',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <PlatformIcon platform={key} />
                    {p.name}
                  </button>
                )
              })}
            </div>

            {/* Format toggles */}
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-medium">{i.formats_label}</p>
              <div className="flex flex-wrap gap-2">
                {platformCfg.formats.map((fmt) => {
                  const active = selectedFormats.has(fmt.label)
                  const hov = hoveredFormat === fmt.label
                  return (
                    <button
                      key={fmt.label}
                      onClick={() => toggleFormat(fmt.label)}
                      onMouseEnter={() => setHoveredFormat(fmt.label)}
                      onMouseLeave={() => setHoveredFormat(null)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium"
                      style={{
                        background: active ? 'rgba(99,102,241,0.14)' : hov ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                        border: active ? '1px solid rgba(99,102,241,0.4)' : hov ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.07)',
                        color: active ? '#a5b4fc' : hov ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)',
                        transform: hov && !active ? 'translateY(-1px)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded flex items-center justify-center shrink-0"
                        style={{background: active ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.05)', border: active ? '1px solid rgba(99,102,241,0.55)' : '1px solid rgba(255,255,255,0.1)', transition: 'all 0.15s ease'}}
                      >
                        {active && <svg className="w-2 h-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M4.5 12.75l6 6 9-13.5" /></svg>}
                      </div>
                      <span>{fmt.display}</span>
                      <span className="text-[10px] opacity-50">{fmt.size}</span>
                    </button>
                  )
                })}
                {selectedPlatform === 'tiktok' && (
                  <span className="flex items-center px-2.5 py-1.5 rounded-lg text-[11px] font-medium" style={{background: 'rgba(255,80,0,0.08)', border: '1px solid rgba(255,80,0,0.25)', color: '#fb923c'}}>
                    {i.tiktok_note}
                  </span>
                )}
              </div>
              {platformCfg.safeZone && (
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-gray-500">
                  <svg className="w-3 h-3 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                  Safe zone overlay active — danger zones highlighted in upload area
                </div>
              )}
            </div>
          </div>
          )} {/* end dashMode === 'ad' selectors */}

          {/* ── Clean mode description ── */}
          {dashMode === 'clean' && (
            <div className="px-5 pt-4 pb-2">
              <p className="text-[12px] text-gray-500 leading-relaxed">{i.clean_desc}</p>
            </div>
          )}

          {/* Too-many-files warning */}
          {fileWarning && (
            <div className="px-5 pb-2">
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl" style={{background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)'}}>
                <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                <p className="text-[12px] text-amber-300 leading-relaxed">{fileWarning}</p>
              </div>
            </div>
          )}

          {/* Rejected files */}
          {rejectedFiles.length > 0 && (
            <div className="px-5 pb-4">
              <div className="flex items-start justify-between gap-3 px-4 py-3 rounded-xl" style={{background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)'}}>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-red-300 mb-1.5 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                    {rejectedFiles.length} file{rejectedFiles.length > 1 ? 's' : ''} skipped — images only
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {rejectedFiles.map((f, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-red-400/70" style={{background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)'}}>
                        {f.name}
                      </span>
                    ))}
                  </div>
                </div>
                <button onClick={() => setRejectedFiles([])} className="text-red-400/50 hover:text-red-400 transition-colors text-lg leading-none shrink-0 mt-0.5">×</button>
              </div>
            </div>
          )}

          {/* ── Ad mode: upload zone ── */}
          {dashMode === 'ad' && (
          <div className="p-4 sm:p-5">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              className="relative rounded-xl transition-all duration-300"
              style={{
                background: dragging ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.02)',
                border: dragging ? '1.5px solid rgba(99,102,241,0.5)' : '1.5px dashed rgba(255,255,255,0.08)',
                boxShadow: dragging ? '0 0 0 3px rgba(99,102,241,0.08)' : 'none',
                textAlign: 'center',
                padding: '2.5rem 1.5rem',
                minHeight: '160px',
              }}
            >
              <SafeZoneOverlay platform={selectedPlatform} i={i} />
              {files.length === 0 ? (
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)'}}>
                    <IconUpload />
                  </div>
                  <p className="text-white font-semibold mb-1.5">{i.drop}</p>
                  <p className="text-gray-500 text-sm mb-6">{i.drop_sub}</p>
                  <label {...glowHandlers} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer" style={glowStyle}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    {i.select}
                    <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
                  </label>
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="flex flex-wrap gap-2 justify-center mb-6 max-h-32 overflow-y-auto">
                    {files.map((f, idx) => (
                      <div key={idx} className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-150"
                        style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)'}}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
                      >
                        <IconFile />
                        <span className="text-gray-300 max-w-[100px] truncate">{f.name}</span>
                        <span className="text-gray-600">{(f.size/1024).toFixed(0)}kb</span>
                        <button onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))} className="text-gray-700 hover:text-red-400 transition-colors ml-0.5" title="Remove">×</button>
                      </div>
                    ))}
                  </div>
                  {limitReached ? (
                    <div className="mb-4 px-4 py-3 rounded-xl text-[13px]" style={{background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)'}}>
                      <p className="text-red-300 font-semibold mb-1">{i.limit_title}</p>
                      <p className="text-red-400/70 text-[12px] mb-3">{i.limit_sub}</p>
                      <button onClick={handleUpgrade} {...glowHandlers} className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white" style={glowStyle}>{i.upgrade_cta}</button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <button onClick={() => setStep('crop')} disabled={selectedFormats.size === 0} {...glowHandlers} className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={glowStyle}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Edit crops →
                      </button>
                      <button onClick={() => { setFiles([]); setDone(false); setLimitReached(false); setStep('upload'); if (fileInputRef.current) fileInputRef.current.value = '' }} className="px-4 py-3 text-xs text-gray-500 hover:text-gray-300 transition-colors">{i.clear}</button>
                    </div>
                  )}
                  {done && !limitReached && (
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium" style={{background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)', color: '#86efac'}}>
                      <IconCheck />{i.success(files.length)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          )} {/* end dashMode === 'ad' upload */}

          {/* ── Clean mode: upload zone ── */}
          {dashMode === 'clean' && (
          <div className="p-4 sm:p-5">
            <div
              onDrop={handleCleanDrop}
              onDragOver={(e) => { e.preventDefault(); setCleanDragging(true) }}
              onDragLeave={() => setCleanDragging(false)}
              className="relative rounded-xl transition-all duration-300"
              style={{
                background: cleanDragging ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.02)',
                border: cleanDragging ? '1.5px solid rgba(99,102,241,0.5)' : '1.5px dashed rgba(255,255,255,0.08)',
                boxShadow: cleanDragging ? '0 0 0 3px rgba(99,102,241,0.08)' : 'none',
                textAlign: 'center',
                padding: '2.5rem 1.5rem',
                minHeight: '160px',
              }}
            >
              {cleanFiles.length === 0 ? (
                <div>
                  <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)'}}>
                    <svg className="w-6 h-6" style={{color: '#a5b4fc'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                  </div>
                  <p className="text-white font-semibold mb-1.5">{i.clean_drop}</p>
                  <p className="text-gray-500 text-sm mb-6">{i.clean_drop_sub}</p>
                  <label {...glowHandlers} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer" style={glowStyle}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    {i.clean_select}
                    <input ref={cleanFileInputRef} type="file" multiple className="hidden" onChange={handleCleanFiles} />
                  </label>
                </div>
              ) : (
                <div>
                  <div className="flex flex-wrap gap-2 justify-center mb-6 max-h-32 overflow-y-auto">
                    {cleanFiles.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-150"
                        style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)'}}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
                      >
                        <svg className="w-3.5 h-3.5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                        <span className="text-gray-300 max-w-[120px] truncate">{f.name}</span>
                        <span className="text-gray-600">{(f.size/1024).toFixed(0)}kb</span>
                        <button onClick={() => setCleanFiles(prev => prev.filter((_, i) => i !== idx))} className="text-gray-700 hover:text-red-400 transition-colors ml-0.5" title="Remove">×</button>
                      </div>
                    ))}
                  </div>
                  {limitReached ? (
                    <div className="mb-4 px-4 py-3 rounded-xl text-[13px]" style={{background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)'}}>
                      <p className="text-red-300 font-semibold mb-1">{i.limit_title}</p>
                      <p className="text-red-400/70 text-[12px] mb-3">{i.limit_sub}</p>
                      <button onClick={handleUpgrade} {...glowHandlers} className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white" style={glowStyle}>{i.upgrade_cta}</button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <button onClick={processClean} disabled={cleanProcessing || cleanFiles.length === 0} {...glowHandlers} className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={glowStyle}>
                        {cleanProcessing ? <><IconSpin />{i.clean_processing}</> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>{i.clean_process}</>}
                      </button>
                      <label className="inline-flex items-center gap-1.5 px-4 py-3 text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add more
                        <input type="file" multiple className="hidden" onChange={handleCleanFiles} />
                      </label>
                      <button onClick={() => { setCleanFiles([]); setCleanDone(false); setLimitReached(false); if (cleanFileInputRef.current) cleanFileInputRef.current.value = '' }} className="px-4 py-3 text-xs text-gray-500 hover:text-gray-300 transition-colors">{i.clear}</button>
                    </div>
                  )}
                  {cleanDone && !limitReached && (
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium" style={{background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)', color: '#86efac'}}>
                      <IconCheck />{i.clean_success(cleanFiles.length)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          )} {/* end dashMode === 'clean' upload */}

        </div>

        {/* ─── Conversion history ─── */}
        <div style={anim(120)}>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest font-medium mb-4">{i.history_title}</p>
          {history.length === 0 ? (
            <div className="px-5 py-8 rounded-xl text-center text-[13px] text-gray-600" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)'}}>
              {i.history_empty}
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{border: '1px solid rgba(255,255,255,0.06)'}}>
              {history.map((entry, idx) => {
                const isClean = entry.platform === 'clean'
                const platformCfgEntry = isClean ? null : PLATFORM_CONFIGS[entry.platform]
                const ts = new Date(entry.created_at)
                const timeStr = ts.toLocaleDateString(lang === 'pt' ? 'pt-PT' : lang === 'es' ? 'es-ES' : 'en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between px-4 py-3 text-[12px] cursor-default"
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.paddingLeft = '18px' }}
                    onMouseLeave={e => { e.currentTarget.style.background = idx % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent'; e.currentTarget.style.paddingLeft = '16px' }}
                    style={{
                      background: idx % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                      borderBottom: idx < history.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      opacity: loaded ? 1 : 0,
                      transform: loaded ? 'none' : 'translateX(-8px)',
                      transition: `opacity 0.4s ease ${140 + idx * 35}ms, transform 0.4s ease ${140 + idx * 35}ms, background 0.15s ease, padding-left 0.2s ease`,
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {isClean
                        ? <div style={{width:14,height:14,borderRadius:'50%',background:'rgba(99,102,241,0.3)',border:'1px solid rgba(99,102,241,0.5)',flexShrink:0}} />
                        : <PlatformIcon platform={entry.platform} />
                      }
                      <span className="text-gray-300 truncate max-w-[140px]">{entry.filename}</span>
                      <span className="text-gray-600 shrink-0">{isClean ? i.history_clean : (platformCfgEntry?.name || entry.platform)}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {!isClean && <span className="text-gray-600">{entry.formats?.length || 0} {i.history_formats}</span>}
                      <span className="text-gray-700">{timeStr}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
        <Logo />
        <div className="flex items-center gap-5 text-[12px] text-gray-500">
          <Link href="/features" className="hover:text-gray-300 transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
          <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
          <span>© 2025 MetaClean</span>
        </div>
      </footer>

    </main>
  )
}

