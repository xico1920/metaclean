'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SiteNav from '@/app/components/SiteNav'
import { supabase } from '@/lib/supabase'

// ── Reveal ────────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 18, className = '' }) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect() } },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      opacity: v ? 1 : 0,
      transform: v ? 'none' : `translateY(${y}px)`,
      transition: `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

// ── Logo ──────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <Link href="/" style={{display:'flex', alignItems:'center', gap:'10px', textDecoration:'none'}}>
      <svg width="30" height="30" viewBox="0 0 56 56" fill="none">
        <defs><clipPath id="pClip"><rect width="56" height="56" rx="13"/></clipPath></defs>
        <rect width="56" height="56" rx="13" fill="#4338ca"/>
        <g clipPath="url(#pClip)">
          <circle cx="14" cy="18" r="5" fill="rgba(255,255,255,0.9)"/>
          <polygon points="6,52 22,26 38,52" fill="rgba(255,255,255,0.9)"/>
          <polygon points="24,52 36,34 50,52" fill="rgba(255,255,255,0.7)"/>
          <polygon points="34,0 56,0 56,24" fill="#060609"/>
          <line x1="34" y1="0" x2="56" y2="24" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round"/>
        </g>
      </svg>
      <span style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif', fontSize:'19px', letterSpacing:'-0.7px', lineHeight:1}}>
        <span style={{fontWeight:800, color:'white'}}>meta</span>
        <span style={{fontWeight:200, color:'rgba(255,255,255,0.4)'}}>clean</span>
      </span>
    </Link>
  )
}

const glowStyle = {
  background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6, #6366f1)',
  backgroundSize: '300% 300%', backgroundPosition: '0% 50%',
  transition: 'box-shadow 0.4s ease, background-position 0.1s ease',
}
const glowHandlers = {
  onMouseEnter: (e) => {
    e.currentTarget.style.backgroundPosition = '100% 50%'
    e.currentTarget.style.boxShadow = '0 0 0 1px rgba(139,92,246,0.6), 0 0 20px rgba(99,102,241,0.5), 0 0 45px rgba(139,92,246,0.25)'
    e.currentTarget.style.transform = 'scale(1.02)'
  },
  onMouseLeave: (e) => { e.currentTarget.style.backgroundPosition = '0% 50%'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)' },
  onMouseMove: (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.backgroundPosition = `${((e.clientX - r.left) / r.width * 100).toFixed(1)}% 50%`
  },
}

function Check() {
  return <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" /></svg>
}
function Cross() {
  return <svg className="w-4 h-4 shrink-0 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
}

function FaqItem({ q, a, delay }) {
  const [open, setOpen] = useState(false)
  return (
    <Reveal delay={delay}>
      <div
        className="border-b border-white/5 last:border-0 overflow-hidden transition-all duration-300"
        style={{paddingBottom: open ? '1.25rem' : '1rem'}}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between py-4 text-left gap-4 group"
        >
          <p className="text-white font-medium text-[13px] sm:text-[14px] group-hover:text-indigo-200 transition-colors">{q}</p>
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
            style={{
              background: open ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
              border: open ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.08)',
              transform: open ? 'rotate(180deg)' : 'none',
            }}
          >
            <svg className="w-3 h-3" style={{color: open ? '#a5b4fc' : '#6b7280'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </button>
        <div style={{
          maxHeight: open ? '200px' : '0',
          opacity: open ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease',
        }}>
          <p className="text-gray-500 text-[13px] leading-relaxed pb-1">{a}</p>
        </div>
      </div>
    </Reveal>
  )
}

export default function Pricing() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [upgrading, setUpgrading] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30)
    return () => clearTimeout(t)
  }, [])

  const handleGetPro = async () => {
    setUpgrading(true)
    try {
      const { data } = await supabase.auth.getSession()
      if (!data.session) { router.push('/login?plan=pro'); return }
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${data.session.access_token}` },
      })
      const json = await res.json()
      if (json.url) window.location.href = json.url
    } finally {
      setUpgrading(false)
    }
  }

  const en = (d = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'none' : 'translateY(-12px)',
    transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${d}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${d}ms`,
  })

  const free = [
    { text: '10 images per day', ok: true },
    { text: 'Metadata removal (images + PDFs)', ok: true },
    { text: 'JPG, PNG, WEBP support', ok: true },
    { text: 'AI Autocrop', ok: true },
    { text: 'All ad formats', ok: false },
    { text: 'Bulk processing', ok: false },
    { text: 'Priority processing', ok: false },
    { text: 'AI Outpainting', ok: false },
    { text: 'Auto Ad Copy', ok: false },
  ]
  const pro = [
    { text: 'Unlimited images', ok: true },
    { text: 'Metadata removal (images + PDFs)', ok: true },
    { text: 'JPG, PNG, WEBP support', ok: true },
    { text: 'All ad formats (5 sizes)', ok: true },
    { text: 'AI Autocrop', ok: true },
    { text: 'Bulk processing', ok: true },
    { text: 'Priority processing', ok: true },
    { text: 'AI Outpainting', ok: false },
    { text: 'Auto Ad Copy', ok: false },
  ]
  const ai = [
    { text: 'Everything in Pro', ok: true },
    { text: 'Unlimited images', ok: true },
    { text: 'All ad formats (5 sizes)', ok: true },
    { text: 'AI Autocrop', ok: true },
    { text: 'Priority processing', ok: true },
    { text: 'AI Outpainting', ok: true },
    { text: 'Auto Ad Copy', ok: true },
  ]

  const faqs = [
    { q: 'Are my images stored after processing?', a: 'No. All processing happens in memory on our servers. Files are never saved to disk and are deleted immediately after your download starts.' },
    { q: 'What file types are supported?', a: 'JPG, PNG, and WEBP. We recommend JPG or PNG for ad creatives as they have the widest platform compatibility.' },
    { q: 'Can I cancel anytime?', a: 'Yes. No contracts, no lock-in. Cancel directly from your account settings and you will not be charged again.' },
    { q: 'What does "Priority processing" mean?', a: 'Pro users have their images processed first in the queue. During high traffic periods, free users may experience slight delays.' },
    { q: 'Is there an API?', a: 'API access is currently in development and will be available to Pro users first. If you need early access, contact us.' },
    { q: 'What is the AI Studio plan?', a: 'AI Studio is our upcoming tier that adds AI Outpainting (background expansion instead of cropping) and Automatic Ad Copy (AI-generated headlines and descriptions per platform). Pricing is not yet set — join the waitlist to lock in founding pricing.' },
  ]

  return (
    <main className="min-h-screen bg-[#060609] text-white overflow-x-hidden" style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px]" style={{background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.07) 0%, transparent 65%)'}} />
        <div className="absolute bottom-1/3 left-1/3 w-[400px] h-[400px]" style={{background: 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, transparent 70%)'}} />
      </div>

      <SiteNav />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 sm:pb-32">

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16" style={en(60)}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-widest mb-5" style={{background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', color: '#a5b4fc'}}>
            Pricing
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Simple, transparent pricing</h1>
          <p className="text-gray-400 text-base sm:text-lg">Start free. Upgrade when you need more.</p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-12 sm:mb-16">

          {/* Free */}
          <Reveal delay={80} className="flex flex-col">
            <div
              className="rounded-2xl p-6 sm:p-8 flex flex-col flex-1 transition-all duration-300"
              onMouseMove={(e) => {
               const r = e.currentTarget.getBoundingClientRect()
                const x = ((e.clientX - r.left) / r.width * 100).toFixed(1)
                const y = ((e.clientY - r.top) / r.height * 100).toFixed(1)
                e.currentTarget.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 60%)`
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.transform = 'none'
              }}
              style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)'}}
            >
              <p className="text-[11px] text-gray-500 uppercase tracking-widest font-medium mb-5">Free</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl sm:text-5xl font-bold">€0</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <p className="text-gray-500 text-[13px] mb-7">Perfect to get started and test the tool.</p>
              <div className="space-y-2.5 mb-8">
                {free.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span style={{color: item.ok ? '#6366f1' : undefined}}>{item.ok ? <Check /> : <Cross />}</span>
                    <span className={`text-[13px] ${item.ok ? 'text-gray-300' : 'text-gray-600'}`}>{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto">
                <Link href="/login" className="block w-full py-3 rounded-xl text-[13px] font-medium text-center text-gray-300 hover:text-white transition-all hover:border-white/20" style={{border: '1px solid rgba(255,255,255,0.1)'}}>
                  Get started free
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Pro */}
          <Reveal delay={140} className="flex flex-col">
            <div
              className="rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col flex-1 transition-all duration-300"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                const x = ((e.clientX - r.left) / r.width * 100).toFixed(1)
                const y = ((e.clientY - r.top) / r.height * 100).toFixed(1)
                e.currentTarget.style.boxShadow = `0 0 50px rgba(79,70,229,0.16), radial-gradient(circle at ${x}% ${y}%, rgba(99,102,241,0.1), transparent 60%)`
                e.currentTarget.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 50px rgba(79,70,229,0.12)'; e.currentTarget.style.transform = 'none' }}
              style={{background: 'linear-gradient(145deg, rgba(37,99,235,0.15), rgba(79,70,229,0.2))', border: '1px solid rgba(99,102,241,0.35)', boxShadow: '0 0 50px rgba(79,70,229,0.12)'}}
            >
              <div className="absolute top-0 right-0 left-0 h-px" style={{background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.7), transparent)'}} />
              <div className="flex items-center justify-between mb-5">
                <p className="text-[11px] uppercase tracking-widest font-medium" style={{color: '#818cf8'}}>Pro</p>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-md" style={{background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)'}}>Most popular</span>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl sm:text-5xl font-bold">€9</span>
                <span className="text-gray-400">/mo</span>
              </div>
              <p className="text-gray-400 text-[13px] mb-7">Everything you need for serious ad campaigns.</p>
              <div className="space-y-2.5 mb-8">
                {pro.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span style={{color: item.ok ? '#6366f1' : undefined}}>{item.ok ? <Check /> : <Cross />}</span>
                    <span className={`text-[13px] ${item.ok ? 'text-gray-300' : 'text-gray-600'}`}>{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto">
                <button onClick={handleGetPro} disabled={upgrading} {...glowHandlers} className="block w-full py-3 rounded-xl text-[13px] font-semibold text-center text-white disabled:opacity-60" style={glowStyle}>
                  {upgrading ? 'Loading…' : 'Get Pro — €9/mo'}
                </button>
              </div>
            </div>
          </Reveal>

          {/* AI Studio */}
          <Reveal delay={200} className="flex flex-col">
            <div
              className="rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col flex-1 transition-all duration-300"
              style={{background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(139,92,246,0.25)'}}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.45)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(139,92,246,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 60%)'}} />
              <div className="absolute top-0 right-0 left-0 h-px" style={{background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)'}} />
              <div className="flex items-center justify-between mb-5">
                <p className="text-[11px] uppercase tracking-widest font-medium" style={{color: '#c084fc'}}>AI Studio</p>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-md" style={{background: 'rgba(192,132,252,0.12)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.25)'}}>Coming soon</span>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl sm:text-5xl font-bold" style={{color: 'rgba(255,255,255,0.3)'}}>€?</span>
                <span className="text-gray-600">/mo</span>
              </div>
              <p className="text-gray-600 text-[13px] mb-7">Pro features plus AI-powered creative automation.</p>
              <div className="space-y-2.5 mb-8">
                {ai.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span style={{color: '#8b5cf6'}}><Check /></span>
                    <span className="text-[13px] text-gray-400">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto">
                <a
                  href="mailto:hello@metaclean.pro?subject=AI%20Waitlist"
                  className="block w-full py-3 rounded-xl text-[13px] font-medium text-center transition-colors"
                  style={{border: '1px solid rgba(139,92,246,0.35)', color: '#c084fc', background: 'rgba(139,92,246,0.08)'}}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.18)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.55)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)' }}
                >
                  Join the waitlist
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Money-back note */}
        <Reveal delay={60} className="text-center mb-12 sm:mb-16">
          <p className="text-[12px] text-gray-600 flex items-center justify-center gap-2">
            <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            7-day refund policy · No questions asked · Cancel anytime
          </p>
        </Reveal>

        {/* FAQ */}
        <Reveal>
          <div className="rounded-2xl overflow-hidden" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)'}}>
            <div className="px-5 sm:px-7 pt-5 sm:pt-6 pb-2">
              <p className="text-[11px] text-gray-500 uppercase tracking-widest font-medium mb-1">FAQ</p>
              <h2 className="text-base sm:text-lg font-semibold">Frequently asked questions</h2>
            </div>
            <div className="px-5 sm:px-7 pb-4">
              {faqs.map((item, idx) => (
                <FaqItem key={idx} q={item.q} a={item.a} delay={idx * 40} />
              ))}
            </div>
          </div>
        </Reveal>

      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
        <Logo />
        <div className="flex items-center gap-5 text-[12px] text-gray-500">
          <Link href="/features" className="hover:text-gray-300 transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
          <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
          <span>© {new Date().getFullYear()} MetaClean</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://github.com/FranciscoSilvaPT" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-white transition-colors" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a href="https://www.linkedin.com/in/francisco-silva-59747619b/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 transition-colors" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)'}} onMouseEnter={e=>{e.currentTarget.style.color='#60a5fa';e.currentTarget.style.background='rgba(10,102,194,0.08)';e.currentTarget.style.borderColor='rgba(10,102,194,0.25)'}} onMouseLeave={e=>{e.currentTarget.style.color='';e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
        </div>
      </footer>

    </main>
  )
}
