'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import SiteNav from '@/app/components/SiteNav'
import Footer from '@/app/components/Footer'

const t = {
  en: { back: 'Blog', readTime: 'read', cta: 'Try MetaClean free →', ctaSub: 'Strip metadata and resize to every ad format automatically.' },
  pt: { back: 'Blog', readTime: 'leitura', cta: 'Experimenta o MetaClean →', ctaSub: 'Remove metadados e redimensiona para todos os formatos automaticamente.' },
  es: { back: 'Blog', readTime: 'lectura', cta: 'Prueba MetaClean gratis →', ctaSub: 'Elimina metadatos y redimensiona a todos los formatos automáticamente.' },
}

export default function BlogPost({ children }) {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('metaclean_lang')
    if (saved && ['en', 'pt', 'es'].includes(saved)) setLang(saved)
    const onLang = (e) => setLang(e.detail)
    window.addEventListener('metaclean:lang', onLang)
    return () => window.removeEventListener('metaclean:lang', onLang)
  }, [])

  const i = t[lang] || t.en

  return (
    <div style={{ minHeight: '100vh', background: '#060609', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif' }}>
      <SiteNav />
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          <Link href="/blog" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {i.back}
          </Link>
        </div>
        {children}
        <div style={{
          marginTop: 56,
          background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(139,92,246,0.1))',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 16, padding: '32px 36px', textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 10, marginTop: 0 }}>Stop resizing manually.</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 24, lineHeight: 1.6 }}>{i.ctaSub}</p>
          <Link href="/dashboard" style={{
            display: 'inline-block', padding: '13px 28px',
            background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)',
            borderRadius: 10, fontSize: 15, fontWeight: 600, color: 'white', textDecoration: 'none',
          }}>{i.cta}</Link>
        </div>
      </article>
      <Footer lang={lang} />
    </div>
  )
}
