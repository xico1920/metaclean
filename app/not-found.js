'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const phrases = {
  en: [
    { title: 'This page got rejected by the algorithm.', sub: "Even we can't approve this one. But your ads? Those we can fix." },
    { title: 'EXIF data found. Page removed for safety.', sub: "Just kidding — this page never existed. Your images, though, we can clean those." },
    { title: 'This URL had hidden metadata we had to strip.', sub: "Along with the actual page. Try going back home — it's cleaner there." },
    { title: 'Ad rejected: landing page not found.', sub: "Meta would disapprove of this too. Good thing you have MetaClean for the real stuff." },
    { title: '404: creative not found.', sub: "Looks like this one didn't make it through review. Your images will, though." },
    { title: 'This page exceeded the maximum file size.', sub: "We had to compress it out of existence. Go back and upload something real." },
  ],
  pt: [
    { title: 'Esta página foi rejeitada pelo algoritmo.', sub: 'Até nós não conseguimos aprovar esta. Mas os teus anúncios? Esses a gente resolve.' },
    { title: 'Dados EXIF encontrados. Página removida por segurança.', sub: 'Era de brincadeira — esta página nunca existiu. As tuas imagens, essas sim, limpamos já.' },
    { title: 'Este URL tinha metadata escondida que tivemos de remover.', sub: 'Junto com a página em si. A página principal é muito mais limpa.' },
    { title: 'Anúncio rejeitado: página de destino não encontrada.', sub: 'O Meta também não aprovaria isto. Ainda bem que tens o MetaClean para o resto.' },
    { title: '404: criativo não encontrado.', sub: 'Este não passou na revisão. As tuas imagens vão passar — garante o MetaClean.' },
    { title: 'Esta página excedeu o tamanho máximo do ficheiro.', sub: 'Tivemos de a comprimir até desaparecer. Volta para a página principal.' },
  ],
  es: [
    { title: 'Esta página fue rechazada por el algoritmo.', sub: 'Ni nosotros podemos aprobar esta. Pero tus anuncios, esos sí los arreglamos.' },
    { title: 'Datos EXIF encontrados. Página eliminada por seguridad.', sub: 'Era broma — esta página nunca existió. Tus imágenes, esas sí las limpiamos.' },
    { title: 'Esta URL tenía metadata oculta que tuvimos que eliminar.', sub: 'Junto con la página. La página principal es mucho más limpia.' },
    { title: 'Anuncio rechazado: página de destino no encontrada.', sub: 'Meta tampoco la aprobaría. Menos mal que tienes MetaClean para lo importante.' },
    { title: '404: creativo no encontrado.', sub: 'Este no pasó la revisión. Tus imágenes sí pasarán — MetaClean lo garantiza.' },
    { title: 'Esta página superó el tamaño máximo de archivo.', sub: 'Tuvimos que comprimirla hasta hacerla desaparecer. Vuelve a la página principal.' },
  ],
}

const t = {
  en: { cta: 'Back to MetaClean', redirect: (n) => `Redirecting in ${n}s…` },
  pt: { cta: 'Voltar ao MetaClean', redirect: (n) => `A redirecionar em ${n}s…` },
  es: { cta: 'Volver a MetaClean', redirect: (n) => `Redirigiendo en ${n}s…` },
}

const FLOAT_TAGS = ['EXIF', 'GPS', 'Device Info', 'Rejected', 'Metadata', 'IPTC', 'ColorSpace', 'ISO 400', 'f/1.8', 'RAW', 'Timestamp', '#rejected']

const TOTAL = 15

export default function NotFound() {
  const [lang, setLang] = useState('en')
  const [countdown, setCountdown] = useState(TOTAL)
  const [visible, setVisible] = useState(false)
  const [phrase] = useState(() => Math.floor(Math.random() * 6))
  const [isMobile, setIsMobile] = useState(false)

  // Parallax / spotlight
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 })
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 })
  const btnRef = useRef(null)
  const canvasRef = useRef(null)
  const pointerRef = useRef({ x: -999, y: -999 })

  // Floating tags — generated once
  const [floatTags] = useState(() =>
    FLOAT_TAGS.map((label, idx) => ({
      label,
      x: 5 + (idx * 37 + 11) % 85,
      y: 5 + (idx * 53 + 7) % 88,
      dur: 14 + (idx * 7) % 12,
      delay: -(idx * 3.1),
      opacity: 0.06 + (idx % 4) * 0.04,
      scale: 0.75 + (idx % 3) * 0.12,
    }))
  )

  useEffect(() => {
    const saved = localStorage.getItem('metaclean_lang')
    if (saved && ['en', 'pt', 'es'].includes(saved)) setLang(saved)
    setTimeout(() => setVisible(true), 60)
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  useEffect(() => {
    if (countdown <= 0) { window.location.href = '/'; return }
    const timer = setTimeout(() => setCountdown(n => n - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  // Mouse interactions (desktop)
  useEffect(() => {
    if (isMobile) return

    const onMove = (e) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const dx = (e.clientX - cx) / cx
      const dy = (e.clientY - cy) / cy
      setTilt({ x: dy * -10, y: dx * 10 })
      setSpotlight({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 })
      pointerRef.current = { x: e.clientX, y: e.clientY }

      // Magnetic button
      const btn = btnRef.current
      if (btn) {
        const r = btn.getBoundingClientRect()
        const bx = r.left + r.width / 2
        const by = r.top + r.height / 2
        const dist = Math.sqrt((e.clientX - bx) ** 2 + (e.clientY - by) ** 2)
        const radius = 90
        if (dist < radius) {
          const pull = (1 - dist / radius) * 0.35
          setBtnOffset({ x: (e.clientX - bx) * pull, y: (e.clientY - by) * pull })
        } else {
          setBtnOffset({ x: 0, y: 0 })
        }
      }
    }

    const onLeave = () => {
      setTilt({ x: 0, y: 0 })
      setBtnOffset({ x: 0, y: 0 })
      pointerRef.current = { x: -999, y: -999 }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseleave', onLeave) }
  }, [isMobile])

  // Gyroscope + touch fallback for mobile
  useEffect(() => {
    if (!isMobile) return

    const applyOrientation = (e) => {
      if (e.beta === null || e.gamma === null) return
      const x = Math.max(-1, Math.min(1, (e.beta - 45) / 30))
      const y = Math.max(-1, Math.min(1, e.gamma / 30))
      setTilt({ x: x * -8, y: y * 8 })
    }

    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent)

    if (isIOS && typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ — request permission on first tap
      const requestOnTap = () => {
        DeviceOrientationEvent.requestPermission()
          .then(state => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', applyOrientation)
            }
          })
          .catch(() => {})
        window.removeEventListener('touchstart', requestOnTap)
      }
      window.addEventListener('touchstart', requestOnTap, { once: true })
    } else {
      // Android + older iOS — works directly
      window.addEventListener('deviceorientation', applyOrientation)
    }

    // Touch fallback for when gyro data isn't moving (device flat on table etc.)
    const onTouch = (e) => {
      const touch = e.touches[0]
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      setSpotlight({ x: (touch.clientX / window.innerWidth) * 100, y: (touch.clientY / window.innerHeight) * 100 })
      // Only use touch for tilt if gyro isn't firing
      const dx = (touch.clientX - cx) / cx
      const dy = (touch.clientY - cy) / cy
      setTilt(prev => prev.x === 0 && prev.y === 0 ? { x: dy * -8, y: dx * 8 } : prev)
    }
    window.addEventListener('touchmove', onTouch, { passive: true })

    return () => {
      window.removeEventListener('deviceorientation', applyOrientation)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [isMobile])

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    const COUNT = isMobile ? 30 : 55
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.35 + 0.08,
      hue: Math.random() < 0.5 ? 240 : 260,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const mx = pointerRef.current.x
      const my = pointerRef.current.y

      for (const p of particles) {
        const dx = p.x - mx; const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120
          p.vx += (dx / dist) * force * 0.04
          p.vy += (dy / dist) * force * 0.04
        }
        p.vx *= 0.98; p.vy *= 0.98
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue},70%,70%,${p.alpha})`
        ctx.fill()
      }

      const CONN_DIST = isMobile ? 80 : 110
      for (let a = 0; a < COUNT; a++) {
        for (let b = a + 1; b < COUNT; b++) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < CONN_DIST) {
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.strokeStyle = `rgba(99,102,241,${0.07 * (1 - d / CONN_DIST)})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [isMobile])

  const i = t[lang]
  const p = phrases[lang][phrase]
  const pct = ((TOTAL - countdown) / TOTAL) * 100

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  })

  return (
    <main
      className="min-h-screen bg-[#060609] text-white flex flex-col items-center justify-center px-4 overflow-hidden"
      style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{zIndex: 0}} />

      {/* Noise grain overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{zIndex: 2, opacity: 0.03, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px 128px'}} />

      {/* Spotlight following mouse */}
      <div className="fixed inset-0 pointer-events-none" style={{zIndex: 1, background: `radial-gradient(600px circle at ${spotlight.x}% ${spotlight.y}%, rgba(99,102,241,0.07) 0%, transparent 70%)`, transition: 'background 0.1s ease'}} />

      {/* Static background glows */}
      <div className="fixed inset-0 pointer-events-none" style={{zIndex: 0}}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px]"
          style={{background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.18) 0%, transparent 65%)'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]"
          style={{background: 'radial-gradient(ellipse, rgba(79,70,229,0.08) 0%, transparent 70%)', animation: 'bloom 5s ease-in-out infinite'}} />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px]"
          style={{background: 'radial-gradient(ellipse, rgba(37,99,235,0.09) 0%, transparent 70%)'}} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px]"
          style={{background: 'radial-gradient(ellipse, rgba(139,92,246,0.09) 0%, transparent 70%)'}} />
      </div>

      {/* Floating metadata tags */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex: 1}}>
        {floatTags.map((tag, idx) => (
          <span key={idx} style={{
            position: 'absolute',
            left: `${tag.x}%`,
            top: `${tag.y}%`,
            fontSize: `${11 * tag.scale}px`,
            fontFamily: 'monospace',
            color: `rgba(165,180,252,${tag.opacity})`,
            border: `1px solid rgba(99,102,241,${tag.opacity * 0.8})`,
            padding: '2px 7px',
            borderRadius: '5px',
            background: `rgba(99,102,241,${tag.opacity * 0.15})`,
            animation: `floatTag ${tag.dur}s ease-in-out ${tag.delay}s infinite`,
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}>
            {tag.label}
          </span>
        ))}
      </div>

      {/* Main content with parallax */}
      <div
        className="relative text-center w-full"
        style={{
          zIndex: 3,
          maxWidth: '560px',
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: isMobile ? 'transform 0.6s ease-out' : 'transform 0.15s ease-out',
        }}
      >

        {/* 404 with glow bloom */}
        <div style={{...anim(0), position: 'relative', display: 'inline-block', marginBottom: '1.75rem'}}>
          <span aria-hidden style={{
            fontSize: 'clamp(100px, 22vw, 160px)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em',
            position: 'absolute', top: 0, left: 0, right: 0,
            background: 'linear-gradient(135deg, #2563eb, #6366f1, #8b5cf6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            filter: 'blur(20px)', opacity: 0.75,
            animation: 'bloom 3.5s ease-in-out infinite', pointerEvents: 'none',
          }}>404</span>
          <span aria-hidden style={{
            fontSize: 'clamp(100px, 22vw, 160px)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em',
            position: 'absolute', top: 0, left: 0, right: 0,
            background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            filter: 'blur(45px)', opacity: 0.5,
            animation: 'bloom 3.5s ease-in-out infinite 0.5s', pointerEvents: 'none',
          }}>404</span>
          <span style={{
            fontSize: 'clamp(100px, 22vw, 160px)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 40%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            display: 'block', position: 'relative',
            animation: 'pulse404 3.5s ease-in-out infinite',
          }}>404</span>
        </div>

        {/* Rejected badge */}
        <div style={{...anim(100), display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '5px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', color: '#f87171',
            animation: 'fadePulse 2.5s ease-in-out infinite',
          }}>
            <span style={{width: 6, height: 6, borderRadius: '50%', background: '#f87171', flexShrink: 0, animation: 'blink 1.2s step-start infinite'}} />
            Page Rejected
          </div>
        </div>

        {/* Title */}
        <h1 style={{...anim(200), fontSize: 'clamp(19px, 3.5vw, 27px)', fontWeight: 700, color: 'white', marginBottom: '1rem', lineHeight: 1.35, padding: '0 8px'}}>
          {p.title}
        </h1>

        {/* Sub */}
        <p style={{...anim(300), color: 'rgba(156,163,175,1)', fontSize: '15px', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto 2.5rem', padding: '0 8px'}}>
          {p.sub}
        </p>

        {/* Magnetic CTA button */}
        <div style={{...anim(400), marginBottom: '2.5rem', display: 'inline-block'}}>
          <Link
            ref={btnRef}
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '14px 32px', borderRadius: '14px', fontSize: '14px', fontWeight: 600, color: 'white',
              background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)',
              backgroundSize: '200% 200%',
              boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 0 35px rgba(99,102,241,0.3), 0 8px 32px rgba(0,0,0,0.4)',
              animation: 'gradientShift 4s ease infinite',
              transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)`,
              transition: btnOffset.x === 0 && btnOffset.y === 0
                ? 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease'
                : 'transform 0.1s ease, box-shadow 0.3s ease',
              textDecoration: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 0 1px rgba(139,92,246,0.6), 0 0 50px rgba(99,102,241,0.55), 0 8px 32px rgba(0,0,0,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 0 1px rgba(99,102,241,0.3), 0 0 35px rgba(99,102,241,0.3), 0 8px 32px rgba(0,0,0,0.4)' }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {i.cta}
          </Link>
        </div>

        {/* Countdown */}
        <div style={{...anim(500)}}>
          <p style={{color: 'rgba(75,85,99,1)', fontSize: '11px', marginBottom: '8px', letterSpacing: '0.05em'}}>
            {i.redirect(countdown)}
          </p>
          <div style={{width: '120px', height: '2px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', margin: '0 auto', overflow: 'hidden'}}>
            <div style={{
              height: '100%', borderRadius: '999px',
              background: 'linear-gradient(90deg, #2563eb, #8b5cf6)',
              width: `${pct}%`, transition: 'width 1s linear',
            }} />
          </div>
        </div>

      </div>

      {/* Minimal footer */}
      <div style={{...anim(600), position: 'relative', zIndex: 3, marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'center'}}>
        {[
          { href: '/', label: 'Home' },
          { href: '/features', label: 'Features' },
          { href: '/pricing', label: 'Pricing' },
          { href: '/privacy', label: 'Privacy' },
          { href: '/terms', label: 'Terms' },
        ].map(({ href, label }) => (
          <Link key={href} href={href} style={{fontSize: '12px', color: 'rgba(75,85,99,1)', textDecoration: 'none', transition: 'color 0.2s'}}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(156,163,175,1)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(75,85,99,1)'}
          >{label}</Link>
        ))}
      </div>

      <style>{`
        @keyframes pulse404 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.82; }
        }
        @keyframes bloom {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }
        @keyframes fadePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes floatTag {
          0%, 100% { transform: translateY(0px) rotate(-1deg); opacity: var(--op, 0.08); }
          33% { transform: translateY(-12px) rotate(0.5deg); }
          66% { transform: translateY(-6px) rotate(-0.5deg); }
        }
      `}</style>
    </main>
  )
}
