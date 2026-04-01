'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AdReadyBadge from '@/app/components/AdReadyBadge'
import { loadPresets, savePreset, deletePreset, MAX_PRESETS_FREE, MAX_PRESETS_PRO } from '@/lib/presets'
import Footer from '@/app/components/Footer'
import Logo from '@/app/components/Logo'
import { PLATFORM_CONFIGS, PlatformIcon } from '@/lib/platforms'
import { glowStyle, glowHandlers } from '@/lib/glow'
import JSZip from 'jszip'

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
    preset_label: 'Saved presets',
    preset_save: 'Save preset',
    preset_name_ph: 'Name this preset…',
    preset_limit: (n, max) => `${n}/${max} presets`,
    zip_mode: 'Upload ZIP',
    zip_normal: 'Images',
    zip_drop: 'Drop a ZIP file here',
    zip_drop_sub: 'ZIP containing images · up to 50 per batch',
    zip_select: 'Choose ZIP',
    zip_process: 'Process ZIP',
    zip_processing: 'Processing ZIP…',
    zip_success: (n) => `${n} image${n === 1 ? '' : 's'} processed`,
    zip_limit_free: 'Free plan: max 5 images per ZIP',
    guest_tut_title: 'Clean your ad creatives — free',
    guest_tut_s1_t: 'Strip metadata automatically',
    guest_tut_s1_d: 'Hidden EXIF data causes ad rejections. MetaClean removes it before your image hits the platform.',
    guest_tut_s2_t: 'Resize to every ad format',
    guest_tut_s2_d: 'Meta, TikTok, Google, Pinterest — get every placement size generated in one click.',
    guest_tut_s3_t: 'Get more with a free account',
    guest_tut_s3_d: 'Create an account to process 10 images/day, save presets, and track your conversion history.',
    guest_tut_cta: 'Create free account',
    guest_tut_skip: 'Continue as guest',
    session_kicked_title: 'Session ended',
    session_blocked_title: 'Already active elsewhere',
    session_kicked_body: 'Your account was opened on another device. Only one active session is allowed at a time, it may take up to 1 minute to update.',
    session_blocked_body: 'Your account is already open on another device. Close that session first, then try again. It may take up to 1 minute to update.',
    session_signout: 'Sign out',
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
    preset_label: 'Presets guardados',
    preset_save: 'Guardar preset',
    preset_name_ph: 'Nome do preset…',
    preset_limit: (n, max) => `${n}/${max} presets`,
    zip_mode: 'Upload ZIP',
    zip_normal: 'Imagens',
    zip_drop: 'Arrasta um ficheiro ZIP aqui',
    zip_drop_sub: 'ZIP com imagens · até 50 por lote',
    zip_select: 'Escolher ZIP',
    zip_process: 'Processar ZIP',
    zip_processing: 'A processar ZIP…',
    zip_success: (n) => `${n} imagem${n === 1 ? '' : 'ns'} processada${n === 1 ? '' : 's'}`,
    zip_limit_free: 'Plano gratuito: máx 5 imagens por ZIP',
    guest_tut_title: 'Limpa os teus criativos — grátis',
    guest_tut_s1_t: 'Remove metadata automaticamente',
    guest_tut_s1_d: 'Dados EXIF ocultos causam rejeições. O MetaClean remove-os antes de a imagem chegar à plataforma.',
    guest_tut_s2_t: 'Redimensiona para todos os formatos',
    guest_tut_s2_d: 'Meta, TikTok, Google, Pinterest — gera todos os tamanhos de placement com um clique.',
    guest_tut_s3_t: 'Mais com uma conta gratuita',
    guest_tut_s3_d: 'Cria uma conta para processar 10 imagens/dia, guardar presets e ver o histórico.',
    guest_tut_cta: 'Criar conta gratuita',
    guest_tut_skip: 'Continuar como convidado',
    session_kicked_title: 'Sessão terminada',
    session_blocked_title: 'Conta já ativa noutro dispositivo',
    session_kicked_body: 'A sua conta foi aberta noutro dispositivo. Apenas é permitida uma sessão ativa de cada vez e a atualização pode demorar até 1 minuto.',
    session_blocked_body: 'A sua conta já está aberta noutro dispositivo. Feche essa sessão primeiro e tente novamente. A atualização pode demorar até 1 minuto.',
    session_signout: 'Terminar sessão',
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
    preset_label: 'Presets guardados',
    preset_save: 'Guardar preset',
    preset_name_ph: 'Nombre del preset…',
    preset_limit: (n, max) => `${n}/${max} presets`,
    zip_mode: 'Subir ZIP',
    zip_normal: 'Imágenes',
    zip_drop: 'Arrastra un archivo ZIP aquí',
    zip_drop_sub: 'ZIP con imágenes · hasta 50 por lote',
    zip_select: 'Elegir ZIP',
    zip_process: 'Procesar ZIP',
    zip_processing: 'Procesando ZIP…',
    zip_success: (n) => `${n} imagen${n === 1 ? '' : 'es'} procesada${n === 1 ? '' : 's'}`,
    zip_limit_free: 'Plan gratuito: máx 5 imágenes por ZIP',
    guest_tut_title: 'Limpia tus creatividades — gratis',
    guest_tut_s1_t: 'Elimina metadata automáticamente',
    guest_tut_s1_d: 'Los datos EXIF ocultos causan rechazos. MetaClean los elimina antes de que la imagen llegue a la plataforma.',
    guest_tut_s2_t: 'Redimensiona a todos los formatos',
    guest_tut_s2_d: 'Meta, TikTok, Google, Pinterest — genera todos los tamaños de placement con un clic.',
    guest_tut_s3_t: 'Más con una cuenta gratuita',
    guest_tut_s3_d: 'Crea una cuenta para procesar 10 imágenes/día, guardar presets y ver tu historial.',
    guest_tut_cta: 'Crear cuenta gratuita',
    guest_tut_skip: 'Continuar como invitado',
    session_kicked_title: 'Sesión terminada',
    session_blocked_title: 'Cuenta ya activa en otro dispositivo',
    session_kicked_body: 'Tu cuenta se abrió en otro dispositivo. Solo se permite una sesión activa a la vez; la actualización puede tardar hasta 1 minuto.',
    session_blocked_body: 'Tu cuenta ya está abierta en otro dispositivo. Cierra esa sesión primero y luego inténtalo de nuevo. La actualización puede tardar hasta un minuto.',
    session_signout: 'Cerrar sesión',
  },
}

const flags = { en: 'https://flagcdn.com/w20/gb.png', pt: 'https://flagcdn.com/w20/pt.png', es: 'https://flagcdn.com/w20/es.png' }

// ─── Platform icons ───────────────────────────────────────────────────────────
const FREE_LIMIT = 10

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconUpload = () => <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
const IconFile = () => <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
const IconDownload = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
const IconSpin = () => <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
const IconCheck = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" /></svg>

function ProcessingOverlay({ progress, current, total, filename, mode, meta }) {
  const pct = Math.min(progress, 100)

  // Build tags from real EXIF when available, fall back to generic placeholders
  const leftTags = [
    { label: meta?.gps      || 'GPS · — '            , y:  6 },
    { label: meta?.aperture && meta?.shutter ? `${meta.aperture} · ${meta.shutter}` : 'f/— · —s', y: 22 },
    { label: meta?.copyright ? `© ${meta.copyright}` : 'Author · —', y: 38 },
    { label: meta?.camera   || '—'                    , y: 54 },
    { label: meta?.software || '—'                    , y: 70 },
    { label: 'EXIF · stripping'                        , y: 86 },
  ]
  const rightTags = [
    { label: 'EXIF 2.31'                              , y: 13 },
    { label: meta?.iso      || 'ISO · —'              , y: 29 },
    { label: meta?.date     || '—'                    , y: 45 },
    { label: meta?.dpi      ? `sRGB · ${meta.dpi}`   : 'sRGB · —', y: 61 },
    { label: filename || '—'                          , y: 77 },
    { label: meta?.altitude || 'Altitude · —'         , y: 93 },
  ]

  const tag = (label, erased, side) => ({
    fontSize: 10,
    padding: '3px 8px',
    borderRadius: 4,
    whiteSpace: 'nowrap',
    border: `1px solid ${erased ? 'transparent' : 'rgba(99,102,241,0.28)'}`,
    background: erased ? 'transparent' : 'rgba(99,102,241,0.07)',
    color: erased ? 'transparent' : 'rgba(165,180,252,0.7)',
    opacity: erased ? 0 : 1,
    transform: erased
      ? `translateX(${side === 'l' ? -18 : 18}px) scale(0.82) skewX(${side === 'l' ? -4 : 4}deg)`
      : 'none',
    filter: erased ? 'blur(3px)' : 'none',
    transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
  })

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{background: 'rgba(6,6,9,0.97)', backdropFilter: 'blur(24px)'}}>
      <style>{`
        @keyframes mc-beam {
          0%,100% { box-shadow: 0 0 0 1px rgba(99,102,241,0.15), 0 0 18px 3px rgba(99,102,241,0.45), 0 0 48px 8px rgba(99,102,241,0.1); }
          50%     { box-shadow: 0 0 0 1px rgba(139,92,246,0.2),  0 0 28px 5px rgba(139,92,246,0.6),  0 0 70px 12px rgba(139,92,246,0.12); }
        }
        @keyframes mc-float {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-3px); }
        }
        @keyframes mc-scanline {
          0%   { opacity: 0.6; }
          50%  { opacity: 1;   }
          100% { opacity: 0.6; }
        }
      `}</style>

      {/* Faint background glow */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',
        background:'radial-gradient(ellipse 40% 50% at 50% 42%, rgba(99,102,241,0.05) 0%, transparent 70%)'}} />

      {/* ── Scanner stage ── */}
      <div style={{position:'relative', marginBottom: 36}}>

        {/* Left tags */}
        <div style={{position:'absolute', right:'calc(100% + 18px)', top:0, bottom:0, width:156}}>
          {leftTags.map((t, i) => {
            const erased = t.y < pct
            return (
              <div key={i} style={{
                position:'absolute', right:0, top:`${t.y}%`,
                ...tag(t.label, erased, 'l'),
                animation: erased ? 'none' : `mc-float ${3.2 + i * 0.35}s ease-in-out ${i * 0.22}s infinite`,
              }}>{t.label}</div>
            )
          })}
        </div>

        {/* The image frame */}
        <div style={{
          width: 224, height: 298, borderRadius: 10, position:'relative', overflow:'hidden',
          border:'1px solid rgba(255,255,255,0.07)',
        }}>
          {/* Unscanned zone — subtle dot grid (below beam = still dirty) */}
          <div style={{
            position:'absolute', top:`${pct}%`, left:0, right:0, bottom:0,
            backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize:'14px 14px',
            transition:'top 0.8s cubic-bezier(0.4,0,0.2,1)',
          }} />

          {/* Scanned zone — clean solid (above beam) */}
          <div style={{
            position:'absolute', top:0, left:0, right:0, height:`${pct}%`,
            background:'rgba(6,6,9,0.92)',
            transition:'height 0.8s cubic-bezier(0.4,0,0.2,1)',
          }} />

          {/* Scan beam line */}
          <div style={{
            position:'absolute', left:0, right:0,
            top:`calc(${pct}% - 1px)`, height:2,
            background:'linear-gradient(90deg, transparent 0%, #4f46e5 18%, #a5b4fc 50%, #4f46e5 82%, transparent 100%)',
            animation:'mc-beam 1.8s ease-in-out infinite',
            transition:'top 0.8s cubic-bezier(0.4,0,0.2,1)',
          }} />

          {/* Beam reflection — faint wider glow below beam */}
          <div style={{
            position:'absolute', left:0, right:0,
            top:`calc(${pct}% + 1px)`, height:18,
            background:'linear-gradient(180deg, rgba(99,102,241,0.08) 0%, transparent 100%)',
            transition:'top 0.8s cubic-bezier(0.4,0,0.2,1)',
            pointerEvents:'none',
          }} />

          {/* Corner brackets */}
          {[
            {top:8, left:8,  borderTop:'1px solid rgba(99,102,241,0.55)', borderLeft:'1px solid rgba(99,102,241,0.55)'},
            {top:8, right:8, borderTop:'1px solid rgba(99,102,241,0.55)', borderRight:'1px solid rgba(99,102,241,0.55)'},
            {bottom:8, left:8,  borderBottom:'1px solid rgba(99,102,241,0.55)', borderLeft:'1px solid rgba(99,102,241,0.55)'},
            {bottom:8, right:8, borderBottom:'1px solid rgba(99,102,241,0.55)', borderRight:'1px solid rgba(99,102,241,0.55)'},
          ].map((s, i) => (
            <div key={i} style={{position:'absolute', width:13, height:13, ...s}} />
          ))}

          {/* Center icon fades in as cleaning completes */}
          <div style={{
            position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
            opacity: pct / 120, transition:'opacity 0.6s ease',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="1.25">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
            </svg>
          </div>
        </div>

        {/* Right tags */}
        <div style={{position:'absolute', left:'calc(100% + 18px)', top:0, bottom:0, width:156}}>
          {rightTags.map((t, i) => {
            const erased = t.y < pct
            return (
              <div key={i} style={{
                position:'absolute', left:0, top:`${t.y}%`,
                ...tag(t.label, erased, 'r'),
                animation: erased ? 'none' : `mc-float ${3 + i * 0.3}s ease-in-out ${i * 0.18}s infinite`,
              }}>{t.label}</div>
            )
          })}
        </div>
      </div>

      {/* Counter */}
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase',
          color:'rgba(255,255,255,0.22)', marginBottom:10}}>
          {mode === 'clean' ? 'Stripping metadata' : 'Processing images'}
        </div>
        <div style={{fontSize:56, fontWeight:800, letterSpacing:'-3px', lineHeight:1,
          color:'#fff', fontVariantNumeric:'tabular-nums',
          textShadow:'0 0 40px rgba(99,102,241,0.45)'}}>
          {Math.round(pct)}<span style={{fontSize:22, fontWeight:300, opacity:0.35, letterSpacing:0}}>%</span>
        </div>
        <div style={{fontSize:12, color:'rgba(255,255,255,0.28)', marginTop:10}}>
          {pct >= 100 ? 'Finalizing download…' : `Image ${Math.min(current + 1, total)} of ${total}`}
        </div>
        <div style={{fontSize:10, color:'rgba(255,255,255,0.14)', marginTop:5,
          maxWidth:300, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
          {filename}
        </div>
      </div>
    </div>
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
  const [sessionKicked, setSessionKicked] = useState(false) // true = kicked by another device, 'blocked' = tried to enter while session active
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
  const [cleanResults, setCleanResults] = useState([])
  const [progressCount, setProgressCount] = useState(0)
  const [progressTotal, setProgressTotal] = useState(0)
  const [progressFile, setProgressFile] = useState('')
  const [progressMeta, setProgressMeta] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const cleanFileInputRef = useRef(null)

  // AdReady stats
  const [processedStats, setProcessedStats] = useState(null)

  // Preview before download
  const [pendingResults, setPendingResults] = useState(null) // { results, previewUrl, platform, formatCount }

  // ZIP mode
  const [zipMode, setZipMode] = useState(false)
  const [zipUploadFile, setZipUploadFile] = useState(null)
  const [zipProcessing, setZipProcessing] = useState(false)
  const [zipDone, setZipDone] = useState(false)
  const [zipProcessed, setZipProcessed] = useState(0)
  const zipFileInputRef = useRef(null)

  // Presets
  const [presets, setPresets] = useState([])
  const [savePresetOpen, setSavePresetOpen] = useState(false)
  const [presetNameInput, setPresetNameInput] = useState('')
  const [presetSaving, setPresetSaving] = useState(false)

  // Onboarding
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Guest mode
  const GUEST_LIMIT = 2
  const [guestCount, setGuestCount] = useState(() => {
    if (typeof window === 'undefined') return 0
    return parseInt(localStorage.getItem('metaclean_guest_count') || '0', 10)
  })
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)
  const [showGuestTutorial, setShowGuestTutorial] = useState(false)

  const i = t[lang]

  // Init formats when platform changes — only first format selected by default
  useEffect(() => {
    setSelectedFormats(new Set([PLATFORM_CONFIGS[selectedPlatform].formats[0].label]))
  }, [selectedPlatform])

  // Auth check + restore any files saved before login
  useEffect(() => {
    const saved = localStorage.getItem('metaclean_lang')
    if (saved && ['en', 'pt', 'es'].includes(saved)) setLang(saved)

    const modeParam = searchParams.get('mode')
    if (modeParam === 'clean') setDashMode('clean')

    if (new URLSearchParams(window.location.search).get('error')) {
      window.history.replaceState({}, '', window.location.pathname)
    }

    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        setLoading(false)
        setTimeout(() => setLoaded(true), 40)
        if (!localStorage.getItem('metaclean_guest_tutorial_seen')) {
          setTimeout(() => setShowGuestTutorial(true), 700)
        }
        return
      }
      setUser(data.session.user)
      await loadProfile(data.session.user.id)
      await loadHistory(data.session.user.id)
      setPresets(await loadPresets(supabase, data.session.user.id))
      localStorage.removeItem('metaclean_guest_count')
      setGuestCount(0)
      setLoading(false)
      setTimeout(() => setLoaded(true), 40)
      if (searchParams.get('upgraded') === '1') setUpgradedNotice(true)

      // Show onboarding on first login ever
      if (!localStorage.getItem('metaclean_onboarded')) {
        setTimeout(() => setShowOnboarding(true), 800)
      }

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

  // ── Single-session enforcement ────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    const sessionId = crypto.randomUUID()
    let interval

    const register = async () => {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, sessionId, action: 'register' }),
      })
      const data = await res.json()

      if (data.blocked) {
        setSessionKicked('blocked')
        return
      }

      // Heartbeat every 15s to keep session alive
      interval = setInterval(async () => {
        const hbRes = await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, sessionId, action: 'heartbeat' }),
        })
        const hbData = await hbRes.json()
        if (hbData.kicked) {
          setSessionKicked(true)
          clearInterval(interval)
        }
      }, 15000)
    }

    register()

    return () => {
      clearInterval(interval)
    }
  }, [user])

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
    setProcessedStats(null)
    setZipMode(false); setZipUploadFile(null); setZipDone(false)
  }

  const handleSavePreset = async () => {
    if (!presetNameInput.trim() || presetSaving) return
    setPresetSaving(true)
    try {
      await savePreset(supabase, user.id, { name: presetNameInput, platform: selectedPlatform, formats: selectedFormats })
      setPresets(await loadPresets(supabase, user.id))
      setSavePresetOpen(false)
      setPresetNameInput('')
    } catch {}
    setPresetSaving(false)
  }

  const handleDeletePreset = async (presetId) => {
    await deletePreset(supabase, presetId)
    setPresets(await loadPresets(supabase, user.id))
  }

  const processZip = async () => {
    if (!zipUploadFile) return
    setZipProcessing(true)
    setLimitReached(false)
    try {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      const formData = new FormData()
      formData.append('zip', zipUploadFile)
      formData.append('platform', selectedPlatform)
      formData.append('formats', JSON.stringify([...selectedFormats]))
      const res = await fetch('/api/process-zip', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        if (err.limitReached) setLimitReached(true)
        return
      }
      const blob = await res.blob()
      const processed = parseInt(res.headers.get('X-MC-Processed') || '0')
      setZipProcessed(processed)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `metaclean_${selectedPlatform}_batch.zip`
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setZipDone(true)
      if (user) { await loadProfile(user.id); await loadHistory(user.id) }
    } catch (err) {
      console.error('processZip error:', err)
    } finally {
      setZipProcessing(false)
    }
  }

  const handleCleanFiles = (e) => setCleanFiles(prev => [...prev, ...Array.from(e.target.files)])
  const handleCleanDrop = (e) => {
    e.preventDefault()
    setCleanDragging(false)
    setCleanFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)])
  }

  const extractFileMeta = async (file) => {
    // Always-available info from the browser
    const fmtBytes = (b) => b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`
    const ext = file.name.split('.').pop()?.toUpperCase() || 'IMG'
    const filesize = fmtBytes(file.size)
    const filetype = `${ext} · ${filesize}`
    const modified = file.lastModified
      ? new Date(file.lastModified).toISOString().replace('T', '  ').slice(0, 19)
      : null

    // Image dimensions via browser
    let dimensions = null
    try {
      const url = URL.createObjectURL(file)
      await new Promise((resolve) => {
        const img = new Image()
        img.onload = () => { dimensions = `${img.naturalWidth} × ${img.naturalHeight} px`; resolve() }
        img.onerror = resolve
        img.src = url
      })
      URL.revokeObjectURL(url)
    } catch {}

    // EXIF (may be empty for screenshots / already-edited images)
    let exif = null
    try {
      const exifr = (await import('exifr')).default
      exif = await exifr.parse(file, {
        pick: ['Make', 'Model', 'ISO', 'FNumber', 'ExposureTime', 'DateTimeOriginal',
               'Software', 'Copyright', 'GPSLatitude', 'GPSLongitude', 'GPSAltitude',
               'ColorSpace', 'XResolution'],
      })
    } catch {}

    const formatGPS = (lat, lon) => {
      if (lat == null || lon == null) return null
      return `GPS · ${Math.abs(lat).toFixed(3)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(3)}°${lon >= 0 ? 'E' : 'W'}`
    }
    const formatShutter = (t) => {
      if (!t) return null
      return t < 1 ? `1/${Math.round(1/t)}s` : `${t}s`
    }
    const formatDate = (d) => {
      if (!d) return null
      const dt = typeof d === 'string' ? new Date(d.replace(':', '-').replace(':', '-')) : d
      if (isNaN(dt)) return null
      return dt.toISOString().replace('T', '  ').slice(0, 19)
    }

    return {
      // EXIF fields — fall back to file info so tags are never empty
      gps:       (exif && formatGPS(exif.GPSLatitude, exif.GPSLongitude)) || dimensions || 'GPS · not found',
      aperture:  exif?.FNumber ? `f/${exif.FNumber}` : null,
      shutter:   formatShutter(exif?.ExposureTime),
      iso:       exif?.ISO ? `ISO · ${exif.ISO}` : filesize,
      camera:    (exif?.Make && exif?.Model) ? `${exif.Make} ${exif.Model}`.slice(0, 24) : filetype,
      software:  exif?.Software ? exif.Software.slice(0, 22) : (dimensions || '—'),
      copyright: exif?.Copyright ? exif.Copyright.slice(0, 22) : 'No copyright tag',
      date:      formatDate(exif?.DateTimeOriginal) || modified || '—',
      altitude:  exif?.GPSAltitude ? `Altitude · ${exif.GPSAltitude.toFixed(1)} m` : 'No GPS altitude',
      dpi:       exif?.XResolution ? `${exif.XResolution} dpi` : 'No DPI tag',
    }
  }

  const processClean = async () => {
    if (cleanFiles.length === 0) return
    setCleanProcessing(true)
    setLimitReached(false)

    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    const results = []
    setProgressTotal(cleanFiles.length)
    setProgressCount(0)
    setProgressFile('')

    for (let cleanIdx = 0; cleanIdx < cleanFiles.length; cleanIdx++) {
      const file = cleanFiles[cleanIdx]
      setProgressFile(file.name)
      extractFileMeta(file).then(setProgressMeta)
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
      setProgressCount(cleanIdx + 1)
    }

    setCleanResults(results)

    if (user) { await loadProfile(user.id); await loadHistory(user.id) }
    setCleanProcessing(false)
    setCleanDone(true)
  }

  // cropData: { [fileIndex]: { [formatLabel]: { xPct, yPct, autocrop } } }
  const processImages = async (cropData = {}) => {
    if (selectedFormats.size === 0 || files.length === 0) return

    if (!user && guestCount >= GUEST_LIMIT) { setShowSignupPrompt(true); return }

    setProcessing(true)
    setLimitReached(false)
    let hitLimit = false

    try {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token

    // Collect all results, then decide how to download
    const results = [] // { blob, filename, isZip }
    const allStats = []
    setProgressTotal(files.length)
    setProgressCount(0)
    setProgressFile('')

    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const file = files[fileIndex]
      setProgressFile(file.name)
      extractFileMeta(file).then(setProgressMeta)
      const formData = new FormData()
      formData.append('image', file)
      formData.append('platform', selectedPlatform)
      formData.append('name', file.name)
      formData.append('formats', JSON.stringify([...selectedFormats]))
      if (cropData[fileIndex]) {
        formData.append('cropData', JSON.stringify(cropData[fileIndex]))
      }

      const headers = token
        ? { 'Authorization': `Bearer ${token}` }
        : { 'X-Guest-Count': String(guestCount) }

      const res = await fetch('/api/process', {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        if (err.limitReached) { setLimitReached(true); hitLimit = true; break }
        if (err.guestLimitReached) { setShowSignupPrompt(true); hitLimit = true; break }
        continue
      }

      const contentType = res.headers.get('Content-Type') || ''
      const statsHeader = res.headers.get('X-MC-Stats')
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
      if (statsHeader) {
        try { allStats.push(...JSON.parse(statsHeader)) } catch {}
      }
      if (!token) {
        const newCount = guestCount + fileIndex + 1
        localStorage.setItem('metaclean_guest_count', String(newCount))
        setGuestCount(newCount)
      }
      setProgressCount(fileIndex + 1)
    }

    // Build preview URL from first result (jpeg only — skip zip preview to avoid JSZip client issues)
    let previewUrl = null
    if (results.length > 0 && !results[0].isZip) {
      try { previewUrl = URL.createObjectURL(results[0].blob) } catch {}
    }

    const formatCount = allStats.length || selectedFormats.size
    setPendingResults(results.length > 0 ? { results, previewUrl, platform: selectedPlatform, formatCount } : null)
    setProcessedStats(allStats.length > 0 ? { platform: selectedPlatform, formats: allStats } : null)
    setStep('upload')
    if (!hitLimit) setDone(true)

    // Refresh history/profile in background — failures here won't affect the download UI
    if (user) {
      loadProfile(user.id).catch(console.error)
      loadHistory(user.id).catch(console.error)
    }
    } catch (err) {
      console.error('processImages error:', err)
    } finally {
      setProcessing(false)
    }
  }

  const performDownload = async (results) => {
    if (!results || results.length === 0) return
    const dl = (blob, filename) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = filename
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 2000)
    }
    if (results.length === 1) {
      dl(results[0].blob, results[0].filename)
    } else {
      const zip = new JSZip()
      for (const { blob, filename } of results) {
        zip.file(filename, blob)
      }
      const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
      dl(zipBlob, 'metaclean_batch.zip')
    }
  }

  const triggerDownload = async () => {
    if (!pendingResults) return
    await performDownload(pendingResults.results)
    setPendingResults(null)
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

  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
  const isPro = isAdmin || profile?.plan === 'pro'
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

  const processingActive = processing || cleanProcessing || zipProcessing
  const processingMode = cleanProcessing ? 'clean' : 'ad'
  const processingProgress = progressTotal > 0 ? (progressCount / progressTotal) * 100 : 0

  if (sessionKicked) {
    return (
      <main className="min-h-screen bg-[#060609] text-white flex items-center justify-center p-4" style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}>
        <div className="fixed inset-0 pointer-events-none" style={{background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(239,68,68,0.06) 0%, transparent 70%)'}} />
        <div className="relative z-10 w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)'}}>
            <svg className="w-8 h-8" fill="none" stroke="#f87171" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">
            {sessionKicked === 'blocked' ? i.session_blocked_title : i.session_kicked_title}
          </h1>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            {sessionKicked === 'blocked' ? i.session_blocked_body : i.session_kicked_body}
          </p>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
            style={{background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)'}}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.25)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)' }}
          >
            {i.session_signout}
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#060609] text-white" style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}>

      {/* Guest tutorial modal */}
      {showGuestTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background: 'rgba(6,6,9,0.88)', backdropFilter: 'blur(12px)'}}>
          <div className="w-full max-w-md rounded-2xl p-8" style={{background: '#0d0d14', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)'}}>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)'}}>
                <svg width="28" height="28" fill="none" stroke="#a5b4fc" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{i.guest_tut_title}</h2>
            </div>
            <div className="space-y-4 mb-8">
              {[
                { n: '1', title: i.guest_tut_s1_t, desc: i.guest_tut_s1_d },
                { n: '2', title: i.guest_tut_s2_t, desc: i.guest_tut_s2_d },
                { n: '3', title: i.guest_tut_s3_t, desc: i.guest_tut_s3_d },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[12px] font-bold" style={{background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)'}}>{n}</div>
                  <div>
                    <p className="text-white font-semibold text-[13px] mb-0.5">{title}</p>
                    <p className="text-gray-500 text-[12px] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="/login"
              onClick={() => localStorage.setItem('metaclean_guest_tutorial_seen', '1')}
              {...glowHandlers}
              className="block w-full py-3 rounded-xl text-[14px] font-semibold text-white text-center mb-3"
              style={glowStyle}
            >
              {i.guest_tut_cta} →
            </a>
            <button
              onClick={() => { setShowGuestTutorial(false); localStorage.setItem('metaclean_guest_tutorial_seen', '1') }}
              className="block w-full py-2.5 text-[13px] text-gray-500 hover:text-gray-300 transition-colors text-center"
            >
              {i.guest_tut_skip}
            </button>
          </div>
        </div>
      )}

      {/* Guest signup prompt */}
      {showSignupPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background: 'rgba(6,6,9,0.9)', backdropFilter: 'blur(12px)'}}>
          <div className="w-full max-w-sm rounded-2xl p-8" style={{background: '#0d0d14', border: '1px solid rgba(99,102,241,0.25)', boxShadow: '0 32px 80px rgba(0,0,0,0.7)'}}>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)'}}>
                <svg width="26" height="26" fill="none" stroke="#a5b4fc" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">You've used your 2 free tries</h2>
              <p className="text-gray-400 text-[14px] leading-relaxed">Create a free account to get 10 images/day — no credit card needed.</p>
            </div>
            <div className="space-y-3 mb-6">
              {['10 images/day on the free plan', 'All ad platforms & formats', 'Conversion history saved'].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded flex items-center justify-center shrink-0" style={{background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)'}}>
                    <svg className="w-2.5 h-2.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </div>
                  <span className="text-[13px] text-gray-300">{item}</span>
                </div>
              ))}
            </div>
            <a href="/login" className="block w-full py-3 rounded-xl text-[14px] font-semibold text-white text-center mb-3" style={{background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)'}}>
              Create free account →
            </a>
            <button onClick={() => setShowSignupPrompt(false)} className="block w-full py-2.5 text-[13px] text-gray-500 hover:text-gray-300 transition-colors text-center">
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* Onboarding modal */}

      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background: 'rgba(6,6,9,0.85)', backdropFilter: 'blur(12px)'}}>
          <div className="w-full max-w-md rounded-2xl p-8" style={{background: '#0d0d14', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)'}}>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)'}}>
                <svg width="28" height="28" fill="none" stroke="#a5b4fc" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Welcome to MetaClean</h2>
              <p className="text-gray-400 text-[14px] leading-relaxed">Your ad-ready image tool. Here's how to get started in 3 steps.</p>
            </div>
            <div className="space-y-4 mb-8">
              {[
                { n: '1', title: 'Choose your platform', desc: 'Select Meta, Google, TikTok or another platform to get the right ad formats automatically.' },
                { n: '2', title: 'Drop your images', desc: 'Upload your creatives. We strip metadata, compress, and resize to every format.' },
                { n: '3', title: 'Download & publish', desc: 'Preview your results and download a clean ZIP ready to upload to any ad platform.' },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[12px] font-bold" style={{background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)'}}>{n}</div>
                  <div>
                    <p className="text-white font-semibold text-[13px] mb-0.5">{title}</p>
                    <p className="text-gray-500 text-[12px] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setShowOnboarding(false); localStorage.setItem('metaclean_onboarded', '1') }}
              {...glowHandlers}
              className="w-full py-3 rounded-xl text-[14px] font-semibold text-white"
              style={glowStyle}
            >
              Let's go →
            </button>
          </div>
        </div>
      )}

      {/* Processing overlay */}
      {processingActive && (
        <ProcessingOverlay
          progress={processingProgress}
          current={progressCount}
          total={progressTotal}
          filename={progressFile}
          mode={processingMode}
          meta={progressMeta}
        />
      )}

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]" style={{background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.06) 0%, transparent 65%)'}} />
      </div>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-4" style={{borderBottom: '1px solid rgba(255,255,255,0.05)', ...animNav}}>
        <Logo clipId="dashLogo" />
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

          {/* Sign out — desktop only, logged-in users only */}
          {user && (
            <button onClick={handleSignOut} className="hidden sm:block text-[12px] text-gray-500 hover:text-gray-300 transition-colors px-2 py-1.5">
              {i.signout}
            </button>
          )}

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
              {user && (
                <button
                  onClick={() => { handleSignOut(); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all text-left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                  {i.signout}
                </button>
              )}
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

        {/* Guest trial banner */}
        {!user && (
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 rounded-xl" style={{background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(99,102,241,0.1))', border: '1px solid rgba(99,102,241,0.18)'}}>
            <div>
              <p className="text-[13px] text-gray-200 font-medium">Try MetaClean — no account needed</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 h-1 rounded-full overflow-hidden" style={{background: 'rgba(255,255,255,0.08)'}}>
                  <div className="h-full rounded-full transition-all" style={{width: `${(guestCount / GUEST_LIMIT) * 100}%`, background: guestCount >= GUEST_LIMIT ? '#f87171' : '#6366f1'}} />
                </div>
                <span className="text-[11px] text-gray-500">{guestCount}/{GUEST_LIMIT} free tries used</span>
              </div>
            </div>
            <a href="/login" className="shrink-0 px-4 py-2 rounded-xl text-[12px] font-semibold text-white whitespace-nowrap" style={{background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)'}}>
              Create free account →
            </a>
          </div>
        )}

        {/* Upgrade banner */}
        {user && !isPro && (
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

            {/* ── Presets row ── */}
            {presets.length > 0 && (
              <div className="mb-5">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-medium">{i.preset_label}</p>
                <div className="flex flex-wrap gap-2">
                  {presets.map(p => (
                    <div key={p.id} className="flex items-center gap-1">
                      <button
                        onClick={() => { setSelectedPlatform(p.platform); setSelectedFormats(new Set(p.formats)) }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                        style={{background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.2)',color:'#a5b4fc'}}
                      >
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z"/></svg>
                        {p.name}
                      </button>
                      <button
                        onClick={() => handleDeletePreset(p.id)}
                        className="p-1 rounded text-gray-700 hover:text-red-400 transition-colors"
                        title="Delete"
                      >×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

              {/* Save preset */}
              <div className="mt-3 flex items-center gap-3">
                {savePresetOpen ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="text"
                      value={presetNameInput}
                      onChange={e => setPresetNameInput(e.target.value)}
                      placeholder={i.preset_name_ph}
                      autoFocus
                      className="px-3 py-1.5 rounded-lg text-[12px] text-white bg-transparent outline-none"
                      style={{border:'1px solid rgba(99,102,241,0.35)', minWidth:140}}
                      onKeyDown={e => { if (e.key === 'Enter') handleSavePreset(); if (e.key === 'Escape') { setSavePresetOpen(false); setPresetNameInput('') } }}
                    />
                    <button onClick={handleSavePreset} disabled={!presetNameInput.trim() || presetSaving} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white disabled:opacity-40 transition-opacity" style={{background:'rgba(99,102,241,0.3)',border:'1px solid rgba(99,102,241,0.4)'}}>
                      {presetSaving ? '…' : 'Save'}
                    </button>
                    <button onClick={() => { setSavePresetOpen(false); setPresetNameInput('') }} className="text-gray-600 hover:text-gray-400 transition-colors text-sm">✕</button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      const max = isPro ? MAX_PRESETS_PRO : MAX_PRESETS_FREE
                      if (!isAdmin && presets.length >= max) return
                      setSavePresetOpen(true)
                    }}
                    className="flex items-center gap-1.5 text-[11px] text-gray-600 hover:text-indigo-400 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                    {i.preset_save}
                    <span className="text-gray-700">{i.preset_limit(presets.length, isPro ? MAX_PRESETS_PRO : MAX_PRESETS_FREE)}</span>
                  </button>
                )}
              </div>
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

            {/* ZIP / Images toggle */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => { setZipMode(false); setZipUploadFile(null); setZipDone(false) }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                style={{
                  background: !zipMode ? 'rgba(99,102,241,0.12)' : 'transparent',
                  border: !zipMode ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.07)',
                  color: !zipMode ? '#a5b4fc' : 'rgba(255,255,255,0.3)',
                }}
              >{i.zip_normal}</button>
              <button
                onClick={() => { setZipMode(true); setFiles([]); setDone(false); setProcessedStats(null) }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                style={{
                  background: zipMode ? 'rgba(99,102,241,0.12)' : 'transparent',
                  border: zipMode ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.07)',
                  color: zipMode ? '#a5b4fc' : 'rgba(255,255,255,0.3)',
                }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7"/></svg>
                {i.zip_mode}
              </button>
            </div>

            {/* ZIP drop zone */}
            {zipMode ? (
              <div
                onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.name.endsWith('.zip')) setZipUploadFile(f) }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                className="relative rounded-xl transition-all duration-300"
                style={{
                  background: dragging ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.02)',
                  border: dragging ? '1.5px solid rgba(99,102,241,0.5)' : '1.5px dashed rgba(255,255,255,0.08)',
                  textAlign: 'center', padding: '2.5rem 1.5rem', minHeight: '160px',
                }}
              >
                {!zipUploadFile ? (
                  <div>
                    <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7"/></svg>
                    </div>
                    <p className="text-white font-semibold mb-1.5">{i.zip_drop}</p>
                    <p className="text-gray-500 text-sm mb-4">{i.zip_drop_sub}</p>
                    {!isPro && <p className="text-amber-400/60 text-[11px] mb-4">{i.zip_limit_free}</p>}
                    <label {...glowHandlers} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer" style={glowStyle}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                      {i.zip_select}
                      <input ref={zipFileInputRef} type="file" accept=".zip" className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) setZipUploadFile(f) }} />
                    </label>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7"/></svg>
                      <span className="text-gray-300 text-sm font-medium truncate max-w-[200px]">{zipUploadFile.name}</span>
                      <span className="text-gray-600 text-xs shrink-0">{(zipUploadFile.size/1024/1024).toFixed(1)} MB</span>
                    </div>
                    {limitReached ? (
                      <div className="mb-4 px-4 py-3 rounded-xl text-[13px]" style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)'}}>
                        <p className="text-red-300 font-semibold mb-1">{i.limit_title}</p>
                        <p className="text-red-400/70 text-[12px] mb-3">{i.limit_sub}</p>
                        <button onClick={handleUpgrade} {...glowHandlers} className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white" style={glowStyle}>{i.upgrade_cta}</button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3 flex-wrap">
                        <button onClick={processZip} disabled={zipProcessing} {...glowHandlers} className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={glowStyle}>
                          {zipProcessing ? <><IconSpin />{i.zip_processing}</> : <><IconDownload />{i.zip_process}</>}
                        </button>
                        <button onClick={() => { setZipUploadFile(null); setZipDone(false); setLimitReached(false); if (zipFileInputRef.current) zipFileInputRef.current.value = '' }} className="px-4 py-3 text-xs text-gray-500 hover:text-gray-300 transition-colors">{i.clear}</button>
                      </div>
                    )}
                    {zipDone && !limitReached && (
                      <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium" style={{background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.18)',color:'#86efac'}}>
                        <IconCheck />{i.zip_success(zipProcessed)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (

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
                      <button onClick={() => { setFiles([]); setDone(false); setLimitReached(false); setStep('upload'); setProcessedStats(null); setPendingResults(null); if (fileInputRef.current) fileInputRef.current.value = '' }} className="px-4 py-3 text-xs text-gray-500 hover:text-gray-300 transition-colors">{i.clear}</button>
                    </div>
                  )}
                  {done && !limitReached && (
                    <div className="mt-5">
                      {/* Download card — shown whenever there are pending results */}
                      {pendingResults && (
                        <div className="mb-4 rounded-xl overflow-hidden" style={{border: '1px solid rgba(99,102,241,0.25)', background: 'rgba(99,102,241,0.05)'}}>
                          {pendingResults.previewUrl && (
                            <div className="relative" style={{maxHeight: 200, overflow: 'hidden'}}>
                              <img src={pendingResults.previewUrl} alt="Preview" style={{width: '100%', height: 200, objectFit: 'cover', display: 'block'}} />
                              <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom, transparent 40%, rgba(6,6,9,0.9))'}} />
                              <div style={{position:'absolute',bottom:10,left:14,fontSize:11,color:'rgba(255,255,255,0.45)'}}>
                                {pendingResults.formatCount} format{pendingResults.formatCount !== 1 ? 's' : ''} ready
                              </div>
                            </div>
                          )}
                          <div className="px-4 py-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-xs" style={{color:'#86efac'}}>
                              <IconCheck />
                              <span className="font-medium">{i.success(files.length)}</span>
                            </div>
                            <button onClick={triggerDownload} {...glowHandlers} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={glowStyle}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                              Download
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {!pendingResults && (
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium" style={{background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)', color: '#86efac'}}>
                            <IconCheck />{i.success(files.length)}
                          </div>
                        )}
                        {(() => {
                          const stats = processedStats?.formats ?? platformCfg.formats
                            .filter(f => selectedFormats.has(f.label))
                            .map(f => ({ label: f.label, w: f.width, h: f.height, size: 0, quality: 90 }))
                          return <AdReadyBadge platform={processedStats?.platform ?? selectedPlatform} stats={stats} />
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            )} {/* end zipMode ternary */}
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
                      <button onClick={() => { setCleanFiles([]); setCleanDone(false); setCleanResults([]); setLimitReached(false); if (cleanFileInputRef.current) cleanFileInputRef.current.value = '' }} className="px-4 py-3 text-xs text-gray-500 hover:text-gray-300 transition-colors">{i.clear}</button>
                    </div>
                  )}
                  {cleanDone && !limitReached && (
                    <div className="mt-4 rounded-xl overflow-hidden" style={{border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)'}}>
                      <div className="px-4 py-3.5 flex items-center justify-between gap-3 flex-wrap">
                        <div className="inline-flex items-center gap-2 text-xs font-medium" style={{color: '#86efac'}}>
                          <IconCheck />{i.clean_success(cleanFiles.length)}
                        </div>
                        {cleanResults.length > 0 && (
                          <button onClick={async () => { await performDownload(cleanResults) }} {...glowHandlers} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold text-white" style={glowStyle}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download
                          </button>
                        )}
                      </div>
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

      <Footer />

    </main>
  )
}

