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
  },
}

const flags = { en: 'https://flagcdn.com/w20/gb.png', pt: 'https://flagcdn.com/w20/pt.png', es: 'https://flagcdn.com/w20/es.png' }

// ─── Platform configs ─────────────────────────────────────────────────────────
const PLATFORM_CONFIGS = {
  meta: {
    name: 'Meta Ads', color: '#1877f2',
    formats: [
      { label: 'meta_1x1_1080x1080',   display: '1:1',    size: '1080×1080' },
      { label: 'meta_4x5_1080x1350',   display: '4:5',    size: '1080×1350' },
      { label: 'meta_9x16_1080x1920',  display: '9:16',   size: '1080×1920' },
      { label: 'meta_1.91x1_1200x628', display: '1.91:1', size: '1200×628'  },
    ],
  },
  google: {
    name: 'Google Ads', color: '#4285f4',
    formats: [
      { label: 'google_1.91x1_1200x628', display: '1.91:1', size: '1200×628'  },
      { label: 'google_1x1_1200x1200',   display: '1:1',    size: '1200×1200' },
      { label: 'google_4x5_1200x1500',   display: '4:5',    size: '1200×1500' },
    ],
  },
  tiktok: {
    name: 'TikTok Ads', color: '#ff0050',
    formats: [
      { label: 'tiktok_9x16_1080x1920', display: '9:16', size: '1080×1920' },
      { label: 'tiktok_1x1_1080x1080',  display: '1:1',  size: '1080×1080' },
    ],
    safeZone: { topPct: 6.77, bottomPct: 13.02 },
  },
  snapchat: {
    name: 'Snapchat', color: '#fffc00',
    formats: [
      { label: 'snapchat_9x16_1080x1920', display: '9:16', size: '1080×1920' },
    ],
    safeZone: { topPct: 8.85, bottomPct: 8.85 },
  },
  pinterest: {
    name: 'Pinterest', color: '#e60023',
    formats: [
      { label: 'pinterest_2x3_1000x1500', display: '2:3', size: '1000×1500' },
      { label: 'pinterest_1x1_1000x1000', display: '1:1', size: '1000×1000' },
    ],
  },
  linkedin: {
    name: 'LinkedIn', color: '#0a66c2',
    formats: [
      { label: 'linkedin_1.91x1_1200x628', display: '1.91:1', size: '1200×628'  },
      { label: 'linkedin_1x1_1200x1200',   display: '1:1',    size: '1200×1200' },
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
      <svg width="28" height="28" viewBox="0 0 56 56" fill="none">
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
      <span style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif', fontSize:'18px', letterSpacing:'-0.7px', lineHeight:1}}>
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
  const fileInputRef = useRef(null)

  const i = t[lang]

  // Init formats when platform changes
  useEffect(() => {
    const fmts = PLATFORM_CONFIGS[selectedPlatform].formats.map(f => f.label)
    setSelectedFormats(new Set(fmts))
  }, [selectedPlatform])

  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.replace('/login'); return }
      setUser(data.session.user)
      await loadProfile(data.session.user.id)
      await loadHistory(data.session.user.id)
      setLoading(false)
      if (searchParams.get('upgraded') === '1') setUpgradedNotice(true)
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

  const handleFiles = (e) => { setFiles(Array.from(e.target.files)); setDone(false); setLimitReached(false) }
  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    setFiles(Array.from(e.dataTransfer.files))
    setDone(false)
    setLimitReached(false)
  }

  const processImages = async () => {
    if (selectedFormats.size === 0 || files.length === 0) return
    setProcessing(true)
    setLimitReached(false)

    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token

    for (const file of files) {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('platform', selectedPlatform)
      formData.append('name', file.name)
      formData.append('formats', JSON.stringify([...selectedFormats]))

      const res = await fetch('/api/process', {
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
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `metaclean_${file.name.replace(/\.[^.]+$/, '')}_${selectedPlatform}.zip`
      a.click()
      URL.revokeObjectURL(url)
    }

    // Refresh stats
    if (user) {
      await loadProfile(user.id)
      await loadHistory(user.id)
    }

    setProcessing(false)
    if (!limitReached) setDone(true)
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

  return (
    <main className="min-h-screen bg-[#060609] text-white" style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]" style={{background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.06) 0%, transparent 65%)'}} />
      </div>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-4" style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
        <Logo />
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Usage pill */}
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
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider" style={{
            background: isPro ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.04)',
            border: isPro ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.07)',
            color: isPro ? '#a5b4fc' : 'rgba(255,255,255,0.4)',
          }}>
            {isPro && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
            {isPro ? i.plan_pro : i.plan_free}
          </div>

          {/* Language */}
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] text-gray-400 hover:text-gray-200 transition-colors" style={{border: '1px solid rgba(255,255,255,0.07)'}}>
              <img src={flags[lang]} alt={lang} style={{width:'14px', height:'10px', objectFit:'cover', borderRadius:'2px'}} />
              <span className="uppercase font-medium tracking-wider text-[11px]">{lang}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1.5 w-28 rounded-xl overflow-hidden z-30" style={{background: '#0d0d14', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
                {Object.keys(t).map((l) => (
                  <button key={l} onClick={() => { setLang(l); setLangOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2.5 text-[12px] hover:bg-white/5 transition-colors">
                    <img src={flags[l]} alt={l} style={{width:'14px', height:'10px', objectFit:'cover', borderRadius:'2px'}} />
                    <span className={`uppercase font-medium tracking-wider ${lang === l ? 'text-blue-400' : 'text-gray-400'}`}>{l}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleSignOut} className="text-[12px] text-gray-500 hover:text-gray-300 transition-colors px-2 py-1.5">
            {i.signout}
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

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
        <div className="rounded-2xl mb-6" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)'}}>
          <div className="p-5 sm:p-6" style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>

            {/* Platform selector */}
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-medium">{i.choose_platform}</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {Object.entries(PLATFORM_CONFIGS).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPlatform(key)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-200"
                  style={{
                    background: selectedPlatform === key ? `${p.color}18` : 'rgba(255,255,255,0.03)',
                    border: selectedPlatform === key ? `1px solid ${p.color}55` : '1px solid rgba(255,255,255,0.07)',
                    color: selectedPlatform === key ? 'white' : 'rgba(255,255,255,0.4)',
                    transform: selectedPlatform === key ? 'scale(1.03)' : 'scale(1)',
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{background: p.color}} />
                  {p.name}
                </button>
              ))}
            </div>

            {/* Format toggles */}
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-medium">{i.formats_label}</p>
              <div className="flex flex-wrap gap-2">
                {platformCfg.formats.map((fmt) => {
                  const active = selectedFormats.has(fmt.label)
                  return (
                    <button
                      key={fmt.label}
                      onClick={() => toggleFormat(fmt.label)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150"
                      style={{
                        background: active ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                        border: active ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(255,255,255,0.07)',
                        color: active ? '#a5b4fc' : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded flex items-center justify-center shrink-0 transition-colors"
                        style={{background: active ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)', border: active ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.1)'}}
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

          {/* Upload zone */}
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
                  <div className="flex flex-wrap gap-2 justify-center mb-6 max-h-28 overflow-y-auto">
                    {files.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs" style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)'}}>
                        <IconFile />
                        <span className="text-gray-300 max-w-[100px] truncate">{f.name}</span>
                        <span className="text-gray-600">{(f.size/1024).toFixed(0)}kb</span>
                      </div>
                    ))}
                  </div>

                  {limitReached ? (
                    <div className="mb-4 px-4 py-3 rounded-xl text-[13px]" style={{background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)'}}>
                      <p className="text-red-300 font-semibold mb-1">{i.limit_title}</p>
                      <p className="text-red-400/70 text-[12px] mb-3">{i.limit_sub}</p>
                      <button onClick={handleUpgrade} {...glowHandlers} className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white" style={glowStyle}>
                        {i.upgrade_cta}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <button
                        onClick={processImages}
                        disabled={processing || selectedFormats.size === 0}
                        {...glowHandlers}
                        className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
                        style={glowStyle}
                      >
                        {processing ? <><IconSpin />{i.processing}</> : <><IconDownload />{i.process}</>}
                      </button>
                      <button onClick={() => { setFiles([]); setDone(false); setLimitReached(false); if (fileInputRef.current) fileInputRef.current.value = '' }} className="px-4 py-3 text-xs text-gray-500 hover:text-gray-300 transition-colors">{i.clear}</button>
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
        </div>

        {/* ─── Conversion history ─── */}
        <div>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest font-medium mb-4">{i.history_title}</p>
          {history.length === 0 ? (
            <div className="px-5 py-8 rounded-xl text-center text-[13px] text-gray-600" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)'}}>
              {i.history_empty}
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{border: '1px solid rgba(255,255,255,0.06)'}}>
              {history.map((entry, idx) => {
                const platformCfgEntry = PLATFORM_CONFIGS[entry.platform]
                const ts = new Date(entry.created_at)
                const timeStr = ts.toLocaleDateString(lang === 'pt' ? 'pt-PT' : lang === 'es' ? 'es-ES' : 'en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between px-4 py-3 text-[12px]"
                    style={{
                      background: idx % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                      borderBottom: idx < history.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{background: platformCfgEntry?.color || '#6366f1'}} />
                      <span className="text-gray-300 truncate max-w-[140px]">{entry.filename}</span>
                      <span className="text-gray-600 shrink-0">{platformCfgEntry?.name || entry.platform}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-gray-600">{entry.formats?.length || 0} {i.history_formats}</span>
                      <span className="text-gray-700">{timeStr}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}

