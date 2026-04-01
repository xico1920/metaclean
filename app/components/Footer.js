'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const t = {
  en: { features: 'Features', pricing: 'Pricing', privacy: 'Privacy', terms: 'Terms', rights: 'All rights reserved.' },
  pt: { features: 'Funcionalidades', pricing: 'Preços', privacy: 'Privacidade', terms: 'Termos', rights: 'Todos os direitos reservados.' },
  es: { features: 'Funcionalidades', pricing: 'Precios', privacy: 'Privacidad', terms: 'Términos', rights: 'Todos los derechos reservados.' },
}

function Logo() {
  return (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
      <svg width="28" height="28" viewBox="0 0 56 56" fill="none">
        <defs><clipPath id="footerClip"><rect width="56" height="56" rx="13" /></clipPath></defs>
        <rect width="56" height="56" rx="13" fill="#4338ca" />
        <g clipPath="url(#footerClip)">
          <circle cx="14" cy="18" r="5" fill="rgba(255,255,255,0.9)" />
          <polygon points="6,52 22,26 38,52" fill="rgba(255,255,255,0.9)" />
          <polygon points="24,52 36,34 50,52" fill="rgba(255,255,255,0.7)" />
          <polygon points="34,0 56,0 56,24" fill="#060609" />
          <line x1="34" y1="0" x2="56" y2="24" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
      <span style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif', fontSize: '17px', letterSpacing: '-0.6px', lineHeight: 1 }}>
        <span style={{ fontWeight: 800, color: 'white' }}>meta</span>
        <span style={{ fontWeight: 200, color: 'rgba(255,255,255,0.4)' }}>clean</span>
      </span>
    </Link>
  )
}

export default function Footer() {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('metaclean_lang')
    if (saved && ['en', 'pt', 'es'].includes(saved)) setLang(saved)
    const onLang = (e) => setLang(e.detail)
    window.addEventListener('metaclean:lang', onLang)
    return () => window.removeEventListener('metaclean:lang', onLang)
  }, [])

  const i = t[lang]
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 border-t border-white/5 px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      <Logo />

      <div className="flex items-center gap-4 sm:gap-5 text-[12px] text-gray-500 flex-wrap justify-center">
        <Link href="/features" className="hover:text-gray-300 transition-colors">{i.features}</Link>
        <Link href="/pricing" className="hover:text-gray-300 transition-colors">{i.pricing}</Link>
        <Link href="/blog" className="hover:text-gray-300 transition-colors">Blog</Link>
        <Link href="/privacy" className="hover:text-gray-300 transition-colors">{i.privacy}</Link>
        <Link href="/terms" className="hover:text-gray-300 transition-colors">{i.terms}</Link>
        <span>© {year} MetaClean</span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="https://github.com/xico1920"
          target="_blank" rel="noopener noreferrer" aria-label="GitHub"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-white transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/francisco-silva-59747619b/"
          target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#60a5fa'; e.currentTarget.style.background = 'rgba(10,102,194,0.08)'; e.currentTarget.style.borderColor = 'rgba(10,102,194,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
      </div>

    </footer>
  )
}
