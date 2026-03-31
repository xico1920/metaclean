'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const t = {
  en: {
    code: '404',
    title: 'This page got rejected by the algorithm.',
    sub: "Even we can't approve this one. But your ads? Those we can fix.",
    cta: 'Back to MetaClean',
    redirect: (n) => `Redirecting in ${n}s…`,
  },
  pt: {
    code: '404',
    title: 'Esta página foi rejeitada pelo algoritmo.',
    sub: 'Até nós não conseguimos aprovar esta. Mas os teus anúncios? Esses a gente resolve.',
    cta: 'Voltar ao MetaClean',
    redirect: (n) => `A redirecionar em ${n}s…`,
  },
  es: {
    code: '404',
    title: 'Esta página fue rechazada por el algoritmo.',
    sub: 'Ni nosotros podemos aprobar esta. Pero tus anuncios, esos sí los arreglamos.',
    cta: 'Volver a MetaClean',
    redirect: (n) => `Redirigiendo en ${n}s…`,
  },
}

export default function NotFound() {
  const [lang, setLang] = useState('en')
  const [countdown, setCountdown] = useState(8)

  useEffect(() => {
    const saved = localStorage.getItem('metaclean_lang')
    if (saved && ['en', 'pt', 'es'].includes(saved)) setLang(saved)
  }, [])

  useEffect(() => {
    if (countdown <= 0) { window.location.href = '/'; return }
    const t = setTimeout(() => setCountdown(n => n - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const i = t[lang]

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
          {i.title}
        </h1>
        <p className="text-gray-400 text-[15px] leading-relaxed mb-10">
          {i.sub}
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
