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

const TOTAL = 15

export default function NotFound() {
  const [lang, setLang] = useState('en')
  const [countdown, setCountdown] = useState(TOTAL)
  const [visible, setVisible] = useState(false)
  const [phrase] = useState(() => Math.floor(Math.random() * 6))
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -999, y: -999 })

  useEffect(() => {
    const saved = localStorage.getItem('metaclean_lang')
    if (saved && ['en', 'pt', 'es'].includes(saved)) setLang(saved)
    setTimeout(() => setVisible(true), 60)
  }, [])

  useEffect(() => {
    if (countdown <= 0) { window.location.href = '/'; return }
    const timer = setTimeout(() => setCountdown(n => n - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

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

    const onMouse = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMouse)

    const COUNT = 55
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.35 + 0.08,
      hue: Math.random() < 0.5 ? 240 : 260,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (const p of particles) {
        // Mouse repulsion
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120
          p.vx += (dx / dist) * force * 0.04
          p.vy += (dy / dist) * force * 0.04
        }

        p.vx *= 0.98
        p.vy *= 0.98
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${p.alpha})`
        ctx.fill()
      }

      // Draw connections
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 110) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(99,102,241,${0.07 * (1 - d / 110)})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  const i = t[lang]
  const p = phrases[lang][phrase]
  const pct = ((TOTAL - countdown) / TOTAL) * 100

  const anim = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  })

  return (
    <main className="min-h-screen bg-[#060609] text-white flex flex-col items-center justify-center px-4 overflow-hidden"
      style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}>

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{zIndex: 0}} />

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none" style={{zIndex: 0}}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
          style={{background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.09) 0%, transparent 65%)'}} />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px]"
          style={{background: 'radial-gradient(ellipse, rgba(37,99,235,0.05) 0%, transparent 70%)'}} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px]"
          style={{background: 'radial-gradient(ellipse, rgba(139,92,246,0.05) 0%, transparent 70%)'}} />
      </div>

      <div className="relative text-center max-w-xl w-full" style={{zIndex: 1}}>

        {/* Glitching 404 */}
        <div style={{...anim(0), position: 'relative', display: 'inline-block', marginBottom: '2rem'}}>
          <span style={{
            fontSize: 'clamp(100px, 22vw, 160px)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #1d4ed8 0%, #6366f1 45%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'block',
            filter: 'drop-shadow(0 0 40px rgba(99,102,241,0.35))',
            animation: 'pulse404 4s ease-in-out infinite',
          }}>
            404
          </span>
          {/* Glitch layers */}
          <span aria-hidden style={{
            fontSize: 'clamp(100px, 22vw, 160px)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            position: 'absolute',
            top: 0,
            left: 0,
            background: 'linear-gradient(135deg, #ef4444, #f97316)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            clipPath: 'inset(30% 0 50% 0)',
            animation: 'glitch1 5s steps(1) infinite',
            opacity: 0.7,
          }}>
            404
          </span>
          <span aria-hidden style={{
            fontSize: 'clamp(100px, 22vw, 160px)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            position: 'absolute',
            top: 0,
            left: 0,
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            clipPath: 'inset(55% 0 20% 0)',
            animation: 'glitch2 5s steps(1) infinite',
            opacity: 0.6,
          }}>
            404
          </span>
        </div>

        {/* Rejected badge */}
        <div style={{...anim(100), display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171',
              animation: 'fadePulse 2.5s ease-in-out infinite',
            }}>
            <span style={{width: 6, height: 6, borderRadius: '50%', background: '#f87171', display: 'inline-block', animation: 'blink 1.2s step-start infinite'}} />
            Page Rejected
          </div>
        </div>

        {/* Title */}
        <h1 style={{...anim(200), fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 700, color: 'white', marginBottom: '1rem', lineHeight: 1.3}}>
          {p.title}
        </h1>

        {/* Sub */}
        <p style={{...anim(300), color: 'rgba(156,163,175,1)', fontSize: '15px', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '440px', margin: '0 auto 2.5rem'}}>
          {p.sub}
        </p>

        {/* CTA button */}
        <div style={{...anim(400), marginBottom: '2rem'}}>
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)',
              backgroundSize: '200% 200%',
              boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 0 30px rgba(99,102,241,0.25)',
              animation: 'gradientShift 4s ease infinite',
              transition: 'box-shadow 0.3s ease, transform 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 0 1px rgba(139,92,246,0.6), 0 0 40px rgba(99,102,241,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 0 1px rgba(99,102,241,0.3), 0 0 30px rgba(99,102,241,0.25)'; e.currentTarget.style.transform = 'none' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {i.cta}
          </Link>
        </div>

        {/* Countdown progress */}
        <div style={{...anim(500)}}>
          <p style={{color: 'rgba(75,85,99,1)', fontSize: '11px', marginBottom: '8px', letterSpacing: '0.05em'}}>
            {i.redirect(countdown)}
          </p>
          <div style={{
            width: '120px',
            height: '2px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.06)',
            margin: '0 auto',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #2563eb, #8b5cf6)',
              width: `${pct}%`,
              transition: 'width 1s linear',
            }} />
          </div>
        </div>

      </div>

      <style>{`
        @keyframes pulse404 {
          0%, 100% { filter: drop-shadow(0 0 30px rgba(99,102,241,0.3)); }
          50% { filter: drop-shadow(0 0 55px rgba(99,102,241,0.55)); }
        }
        @keyframes glitch1 {
          0%, 90%, 100% { transform: translate(0); opacity: 0; }
          91% { transform: translate(-3px, 1px); opacity: 0.7; }
          92% { transform: translate(3px, -1px); opacity: 0; }
          93% { transform: translate(-2px, 2px); opacity: 0.6; }
          94% { transform: translate(0); opacity: 0; }
        }
        @keyframes glitch2 {
          0%, 93%, 100% { transform: translate(0); opacity: 0; }
          94% { transform: translate(3px, -2px); opacity: 0.6; }
          95% { transform: translate(-3px, 1px); opacity: 0; }
          96% { transform: translate(2px, -1px); opacity: 0.5; }
          97% { transform: translate(0); opacity: 0; }
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
      `}</style>
    </main>
  )
}
