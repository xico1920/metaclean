'use client'
import { useState } from 'react'

const t = {
  en: {
    nav_features: 'Features', nav_pricing: 'Pricing', nav_cta: 'Get started',
    badge: 'Trusted by 500+ dropshippers',
    hero1: 'Your ads keep getting', hero2: 'rejected by Meta.',
    hero3: "We fix that.",
    subtitle: 'Strip metadata, resize to every Meta format, and clean your creatives automatically. One click. No blocked ads.',
    drop: 'Drop images here', drop_sub: 'PNG, JPG, WEBP · Up to 50MB each',
    select: 'Choose files', process: 'Process & Download', processing: 'Processing...',
    clear: 'Clear', success: 'images processed successfully',
    f1_title: 'Metadata stripped', f1_desc: 'EXIF, GPS, device info removed on every export',
    f2_title: 'Every Meta format', f2_desc: '1:1 · 4:5 · 9:16 · 1.91:1 — auto-resized instantly',
    f3_title: 'Bulk processing', f3_desc: 'Upload and process 50+ images in a single pass',
    stats: '50,000+ images processed this month',
    free: 'Free', free_sub: 'Get started', free_desc: '10 images per day',
    pro: 'Pro', pro_sub: 'Most popular', pro_desc: 'Unlimited images · All formats · Priority processing',
  },
  pt: {
    nav_features: 'Funcionalidades', nav_pricing: 'Preços', nav_cta: 'Começar',
    badge: 'Usado por +500 dropshippers',
    hero1: 'Os teus anúncios continuam', hero2: 'a ser rejeitados pelo Meta.',
    hero3: 'Nós resolvemos isso.',
    subtitle: 'Remove metadata, redimensiona para todos os formatos Meta e limpa os teus criativos automaticamente. Um clique. Sem bloqueios.',
    drop: 'Arrasta imagens aqui', drop_sub: 'PNG, JPG, WEBP · Até 50MB cada',
    select: 'Escolher ficheiros', process: 'Processar e Descarregar', processing: 'A processar...',
    clear: 'Limpar', success: 'imagens processadas com sucesso',
    f1_title: 'Metadata removida', f1_desc: 'EXIF, GPS, dados do dispositivo eliminados em cada exportação',
    f2_title: 'Todos os formatos Meta', f2_desc: '1:1 · 4:5 · 9:16 · 1.91:1 — redimensionados automaticamente',
    f3_title: 'Processamento em massa', f3_desc: 'Carrega e processa 50+ imagens de uma vez',
    stats: '+50.000 imagens processadas este mês',
    free: 'Grátis', free_sub: 'Começar', free_desc: '10 imagens por dia',
    pro: 'Pro', pro_sub: 'Mais popular', pro_desc: 'Imagens ilimitadas · Todos os formatos · Processamento prioritário',
  },
  es: {
    nav_features: 'Funciones', nav_pricing: 'Precios', nav_cta: 'Empezar',
    badge: 'Usado por +500 dropshippers',
    hero1: 'Tus anuncios siguen siendo', hero2: 'rechazados por Meta.',
    hero3: 'Nosotros lo solucionamos.',
    subtitle: 'Elimina metadatos, redimensiona a todos los formatos Meta y limpia tus creativos automáticamente. Un clic. Sin bloqueos.',
    drop: 'Arrastra imágenes aquí', drop_sub: 'PNG, JPG, WEBP · Hasta 50MB cada una',
    select: 'Elegir archivos', process: 'Procesar y Descargar', processing: 'Procesando...',
    clear: 'Limpiar', success: 'imágenes procesadas correctamente',
    f1_title: 'Metadatos eliminados', f1_desc: 'EXIF, GPS, datos del dispositivo eliminados en cada exportación',
    f2_title: 'Todos los formatos Meta', f2_desc: '1:1 · 4:5 · 9:16 · 1.91:1 — redimensionado automático',
    f3_title: 'Procesamiento masivo', f3_desc: 'Sube y procesa 50+ imágenes en un solo paso',
    stats: '+50.000 imágenes procesadas este mes',
    free: 'Gratis', free_sub: 'Empezar', free_desc: '10 imágenes por día',
    pro: 'Pro', pro_sub: 'Más popular', pro_desc: 'Imágenes ilimitadas · Todos los formatos · Procesamiento prioritario',
  },
}

const flags = { en: '🇬🇧', pt: '🇵🇹', es: '🇪🇸' }

const btnBase = {
  background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6, #6366f1)',
  backgroundSize: '300% 300%',
  backgroundPosition: '0% 50%',
  boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 8px 24px rgba(79,70,229,0.2)',
  transition: 'box-shadow 0.4s ease, transform 0.2s ease, background-position 0.1s ease',
}

function useGlowBtn() {
  const onMouseEnter = (e) => {
    e.currentTarget.style.backgroundPosition = '100% 50%'
    e.currentTarget.style.boxShadow = '0 0 0 1px rgba(139,92,246,0.6), 0 0 20px rgba(99,102,241,0.5), 0 0 45px rgba(139,92,246,0.25), 0 8px 24px rgba(79,70,229,0.3)'
    e.currentTarget.style.transform = 'scale(1.02)'
  }
  const onMouseLeave = (e) => {
    e.currentTarget.style.backgroundPosition = '0% 50%'
    e.currentTarget.style.boxShadow = '0 0 0 1px rgba(99,102,241,0.3), 0 8px 24px rgba(79,70,229,0.2)'
    e.currentTarget.style.transform = 'scale(1)'
  }
  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1)
    e.currentTarget.style.backgroundPosition = `${x}% 50%`
  }
  return { onMouseEnter, onMouseLeave, onMouseMove }
}

function IconUpload() {
  return <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
}

function IconFile() {
  return <svg className="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
}

function IconDownload() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
}

function IconCheck() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" /></svg>
}

function IconSpin() {
  return <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
}

function IconShield() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
}

function IconResize() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
}

function IconBolt() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
}

function Logo() {
  return (
    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
      <svg width="32" height="32" viewBox="0 0 56 56" fill="none">
        <defs>
          <clipPath id="iconClip">
            <rect width="56" height="56" rx="13"/>
          </clipPath>
        </defs>
        <rect width="56" height="56" rx="13" fill="#4338ca"/>
        <g clipPath="url(#iconClip)">
          <circle cx="14" cy="18" r="5" fill="rgba(255,255,255,0.9)"/>
          <polygon points="6,52 22,26 38,52" fill="rgba(255,255,255,0.9)"/>
          <polygon points="24,52 36,34 50,52" fill="rgba(255,255,255,0.7)"/>
          <polygon points="34,0 56,0 56,24" fill="#060609"/>
          <line x1="34" y1="0" x2="56" y2="24" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round"/>
        </g>
      </svg>
      <span style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif', fontSize:'20px', letterSpacing:'-0.8px', lineHeight:1}}>
        <span style={{fontWeight:800, color:'white'}}>meta</span>
        <span style={{fontWeight:200, color:'rgba(255,255,255,0.45)'}}>clean</span>
      </span>
    </div>
  )
}

export default function Home() {
  const [files, setFiles] = useState([])
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [lang, setLang] = useState('en')
  const [langOpen, setLangOpen] = useState(false)
  const i = t[lang]
  const glow = useGlowBtn()

  const handleFiles = (e) => { setFiles(Array.from(e.target.files)); setDone(false) }
  const handleDrop = (e) => { e.preventDefault(); setDragging(false); setFiles(Array.from(e.dataTransfer.files)); setDone(false) }

  const processImages = async () => {
    setProcessing(true)
    for (const file of files) {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch('/api/process', { method: 'POST', body: formData })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `metaclean_${file.name}`
      a.click()
    }
    setProcessing(false)
    setDone(true)
  }

  return (
    <main className="min-h-screen bg-[#060609] text-white overflow-x-hidden" style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px]" style={{background: 'radial-gradient(ellipse at top, rgba(59,130,246,0.07) 0%, transparent 65%)'}} />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full" style={{background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)'}} />
      </div>

      <nav className="relative z-20 flex items-center justify-between px-8 py-5" style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
        <Logo />
        <div className="flex items-center gap-8">
          <a href="#features" className="text-[13px] text-gray-400 hover:text-gray-200 transition-colors tracking-wide">{i.nav_features}</a>
          <a href="#pricing" className="text-[13px] text-gray-400 hover:text-gray-200 transition-colors tracking-wide">{i.nav_pricing}</a>
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] text-gray-400 hover:text-gray-200 transition-colors" style={{border: '1px solid rgba(255,255,255,0.07)'}}>
              <span className="text-sm">{flags[lang]}</span>
              <span className="uppercase font-medium tracking-wider">{lang}</span>
              <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1.5 w-32 rounded-xl overflow-hidden z-30" style={{background: '#0d0d14', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
                {Object.keys(t).map((l) => (
                  <button key={l} onClick={() => { setLang(l); setLangOpen(false) }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] hover:bg-white/5 transition-colors">
                    <span className="text-sm">{flags[l]}</span>
                    <span className={`uppercase font-medium tracking-wider ${lang === l ? 'text-blue-400' : 'text-gray-400'}`}>{l}</span>
                    {lang === l && <svg className="w-3 h-3 text-blue-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" /></svg>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            {...glow}
            className="px-5 py-2 rounded-lg text-[13px] font-medium text-white"
            style={btnBase}
          >
            {i.nav_cta}
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-28 pb-32">

        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wide mb-10 uppercase" style={{background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)', color: '#93bbfd', letterSpacing: '0.08em'}}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block"></span>
            {i.badge}
          </div>

          <h1 className="font-bold mb-6 tracking-tight leading-[1.05]" style={{fontSize: 'clamp(42px, 6vw, 72px)'}}>
            <span className="text-gray-100">{i.hero1}</span><br />
            <span
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = ((e.clientX - rect.left) / rect.width) * 100
                e.currentTarget.style.backgroundPosition = `${x}% 50%`
              }}
              style={{
                background: 'linear-gradient(135deg, #38bdf8, #6366f1, #e879f9, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '300% 300%',
                backgroundPosition: '0% 50%',
                transition: 'background-position 0.05s ease',
              }}
            ><span style={{textTransform: 'uppercase'}}>R</span>{i.hero2.slice(1)}</span>
            <br />
            <span className="text-gray-100">{i.hero3}</span>
          </h1>

          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed" style={{fontSize: '17px'}}>{i.subtitle}</p>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          className="rounded-2xl transition-all duration-300 mb-4"
          style={{
            background: dragging ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.025)',
            border: dragging ? '1.5px solid rgba(99,102,241,0.5)' : '1.5px dashed rgba(255,255,255,0.08)',
            boxShadow: dragging ? '0 0 0 4px rgba(99,102,241,0.08)' : 'none',
            padding: '56px 40px',
            textAlign: 'center',
          }}
        >
          {files.length === 0 ? (
            <>
              <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)'}}>
                <IconUpload />
              </div>
              <p className="text-white font-semibold text-lg mb-2">{i.drop}</p>
              <p className="text-gray-500 text-sm mb-8">{i.drop_sub}</p>
              <label
                {...glow}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer"
                style={btnBase}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                {i.select}
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
              </label>
            </>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 justify-center mb-8 max-h-36 overflow-y-auto">
                {files.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs" style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)'}}>
                    <IconFile />
                    <span className="text-gray-300 max-w-[120px] truncate">{f.name}</span>
                    <span className="text-gray-600">{(f.size/1024).toFixed(0)}kb</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={processImages}
                  disabled={processing}
                  {...glow}
                  className="inline-flex items-center gap-2.5 px-9 py-3.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
                  style={btnBase}
                >
                  {processing ? <><IconSpin />{i.processing}</> : <><IconDownload />{i.process}</>}
                </button>
                <button onClick={() => { setFiles([]); setDone(false) }} className="px-4 py-3.5 text-xs text-gray-500 hover:text-gray-300 transition-colors tracking-wide">{i.clear}</button>
              </div>
              {done && (
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium" style={{background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)', color: '#86efac'}}>
                  <IconCheck />{files.length} {i.success}
                </div>
              )}
            </>
          )}
        </div>

        <p className="text-center text-[11px] text-gray-600 mb-24 tracking-wide">{i.stats}</p>

        <div id="features" className="grid grid-cols-3 gap-3 mb-28">
          {[
            { Icon: IconShield, title: i.f1_title, desc: i.f1_desc, accent: '#3b82f6' },
            { Icon: IconResize, title: i.f2_title, desc: i.f2_desc, accent: '#8b5cf6' },
            { Icon: IconBolt, title: i.f3_title, desc: i.f3_desc, accent: '#6366f1' },
          ].map(({ Icon, title, desc, accent }, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1)
                const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1)
                e.currentTarget.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(99,102,241,0.08) 0%, rgba(255,255,255,0.02) 60%)`
                e.currentTarget.style.borderColor = `rgba(99,102,241,0.25)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
              }}
              style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)'}}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{background: `${accent}18`, color: accent}}>
                <Icon />
              </div>
              <p className="font-semibold text-[14px] text-white mb-2">{title}</p>
              <p className="text-gray-500 text-[13px] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div id="pricing">
          <p className="text-center text-[11px] text-gray-500 uppercase tracking-widest mb-3 font-medium">Pricing</p>
          <h2 className="text-center text-3xl font-bold tracking-tight mb-12">Simple, transparent pricing</h2>

          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="rounded-2xl p-7" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)'}}>
              <p className="text-[11px] text-gray-500 uppercase tracking-widest font-medium mb-4">{i.free}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold">€0</span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>
              <p className="text-gray-500 text-[13px] mb-6">{i.free_desc}</p>
              <button className="w-full py-2.5 rounded-xl text-[13px] font-medium text-gray-300 transition-colors hover:text-white" style={{border: '1px solid rgba(255,255,255,0.1)'}}>
                {i.free_sub}
              </button>
            </div>

            <div className="rounded-2xl p-7 relative overflow-hidden" style={{background: 'linear-gradient(145deg, rgba(37,99,235,0.15), rgba(79,70,229,0.2))', border: '1px solid rgba(99,102,241,0.35)', boxShadow: '0 0 40px rgba(79,70,229,0.1)'}}>
              <div className="absolute top-0 right-0 left-0 h-px" style={{background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)'}} />
              <p className="text-[11px] uppercase tracking-widest font-medium mb-4" style={{color: '#818cf8'}}>{i.pro_sub}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold">€9</span>
                <span className="text-gray-400 text-sm">/mo</span>
              </div>
              <p className="text-gray-300 text-[13px] mb-6">{i.pro_desc}</p>
              <button
                {...glow}
                className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white"
                style={btnBase}
              >
                {i.nav_cta}
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}