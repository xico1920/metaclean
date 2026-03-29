'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const flags = {
  en: 'https://flagcdn.com/w20/gb.png',
  pt: 'https://flagcdn.com/w20/pt.png',
  es: 'https://flagcdn.com/w20/es.png',
}

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
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.backgroundPosition = `${((e.clientX - r.left) / r.width * 100).toFixed(1)}% 50%`
  },
}

function Logo() {
  return (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
      <svg width="30" height="30" viewBox="0 0 56 56" fill="none">
        <defs><clipPath id="snClip"><rect width="56" height="56" rx="13" /></clipPath></defs>
        <rect width="56" height="56" rx="13" fill="#4338ca" />
        <g clipPath="url(#snClip)">
          <circle cx="14" cy="18" r="5" fill="rgba(255,255,255,0.9)" />
          <polygon points="6,52 22,26 38,52" fill="rgba(255,255,255,0.9)" />
          <polygon points="24,52 36,34 50,52" fill="rgba(255,255,255,0.7)" />
          <polygon points="34,0 56,0 56,24" fill="#060609" />
          <line x1="34" y1="0" x2="56" y2="24" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
      <span style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif', fontSize: '19px', letterSpacing: '-0.7px', lineHeight: 1 }}>
        <span style={{ fontWeight: 800, color: 'white' }}>meta</span>
        <span style={{ fontWeight: 200, color: 'rgba(255,255,255,0.4)' }}>clean</span>
      </span>
    </Link>
  )
}

export default function SiteNav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [lang, setLang] = useState('en')
  const [session, setSession] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('metaclean_lang')
    if (saved && ['en', 'pt', 'es'].includes(saved)) setLang(saved)

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setMounted(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
    })
    return () => subscription.unsubscribe()
  }, [])

  const setLangAndSave = (l) => {
    setLang(l)
    localStorage.setItem('metaclean_lang', l)
    window.dispatchEvent(new CustomEvent('metaclean:lang', { detail: l }))
    setLangOpen(false)
  }

  const navLink = (href, label) => {
    const active = pathname === href
    return (
      <Link
        href={href}
        className="hidden sm:block text-[13px] transition-colors"
        style={{ color: active ? 'rgba(255,255,255,0.9)' : 'rgba(156,163,175,1)' }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.9)' }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(156,163,175,1)' }}
      >
        {label}
      </Link>
    )
  }

  const mobileLink = (href, label) => (
    <Link
      href={href}
      onClick={() => setMenuOpen(false)}
      className="block px-3 py-2.5 rounded-lg text-[13px] text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors"
    >
      {label}
    </Link>
  )

  const authCta = mounted
    ? session
      ? <Link href="/dashboard" {...glowHandlers} className="px-4 sm:px-5 py-2 rounded-lg text-[13px] font-semibold text-white" style={glowStyle}>Dashboard</Link>
      : <Link href="/login" {...glowHandlers} className="px-4 sm:px-5 py-2 rounded-lg text-[13px] font-semibold text-white" style={glowStyle}>Get started</Link>
    : <div style={{ width: 88, height: 34 }} />

  const mobileAuthCta = mounted && session
    ? <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-[13px] font-medium text-indigo-400 hover:bg-white/5 transition-colors">Dashboard →</Link>
    : <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-[13px] text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors">Login</Link>

  return (
    <nav className="relative z-20" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-5">
          {navLink('/features', 'Features')}
          {navLink('/pricing', 'Pricing')}
          {!session && mounted && navLink('/login', 'Login')}

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(o => !o)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] text-gray-400 hover:text-gray-200 transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <img src={flags[lang]} alt={lang} style={{ width: '16px', height: '11px', objectFit: 'cover', borderRadius: '2px' }} />
              <span className="uppercase font-medium tracking-wider hidden sm:inline">{lang}</span>
              <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1.5 w-32 rounded-xl overflow-hidden z-30" style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                {['en', 'pt', 'es'].map((l) => (
                  <button key={l} onClick={() => setLangAndSave(l)} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] hover:bg-white/5 transition-colors">
                    <img src={flags[l]} alt={l} style={{ width: '16px', height: '11px', objectFit: 'cover', borderRadius: '2px' }} />
                    <span className={`uppercase font-medium tracking-wider ${lang === l ? 'text-blue-400' : 'text-gray-400'}`}>{l}</span>
                    {lang === l && (
                      <svg className="w-3 h-3 text-blue-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="sm:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {menuOpen
              ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            }
          </button>

          {authCta}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden pb-2" style={{ background: 'rgba(6,6,9,0.98)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.05)', animation: 'fadeInDown 0.2s cubic-bezier(0.16,1,0.3,1) both' }}>
          <div className="px-4 py-2 space-y-1">
            {mobileLink('/features', 'Features')}
            {mobileLink('/pricing', 'Pricing')}
            {mobileAuthCta}
          </div>
        </div>
      )}
    </nav>
  )
}
