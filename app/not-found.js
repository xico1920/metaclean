'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const phrases = {
  en: [
    { title: 'This page got rejected by the algorithm.', sub: "Even we can't approve this one. But your ads? Those we can fix." },
    { title: 'EXIF data found. Page removed for safety.', sub: "Just kidding — this page never existed. Your images, though, we can clean those." },
    { title: 'This URL has hidden metadata we had to strip.', sub: "Along with the actual page. Try going back home — it's cleaner there." },
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

export default function NotFound() {
  const [lang, setLang] = useState('en')
  const [countdown, setCountdown] = useState(15)
  const [phrase] = useState(() => Math.floor(Math.random() * 6))

  useEffect(() => {
    const saved = localStorage.getItem('metaclean_lang')
    if (saved && ['en', 'pt', 'es'].includes(saved)) setLang(saved)
  }, [])

  useEffect(() => {
    if (countdown <= 0) { window.location.href = '/'; return }
    const timer = setTimeout(() => setCountdown(n => n - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const i = t[lang]
  const p = phrases[lang][phrase]

  return (
    <main className="min-h-screen bg-[#060609] text-white flex flex-col items-center justify-center px-4"
      style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}>

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
          style={{background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.07) 0%, transparent 65%)'}} />
      </div>

      <div className="relative z-10 text-center max-w-lg">

        {/* 404 number */}
        <div className="mb-6 select-none" style={{
          fontSize: 'clamp(80px, 20vw, 140px)',
          fontWeight: 800,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #2563eb, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          opacity: 0.35,
        }}>
          {i.code}
        </div>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)'}}>
          <svg width="28" height="28" fill="none" stroke="#f87171" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-snug">
          {p.title}
        </h1>
        <p className="text-gray-400 text-[15px] leading-relaxed mb-10">
          {p.sub}
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-semibold text-white"
          style={{
            background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)',
            boxShadow: '0 0 24px rgba(99,102,241,0.3)',
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          {i.cta}
        </Link>

        <p className="mt-6 text-[12px] text-gray-600">
          {i.redirect(countdown)}
        </p>

      </div>
    </main>
  )
}
