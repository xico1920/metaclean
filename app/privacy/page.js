'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import SiteNav from '@/app/components/SiteNav'

function Reveal({ children, delay = 0, y = 16, className = '' }) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect() } },
      { threshold: 0.04, rootMargin: '0px 0px -16px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={className} style={{
      opacity: v ? 1 : 0,
      transform: v ? 'none' : `translateY(${y}px)`,
      transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

function Logo() {
  return (
    <Link href="/" style={{display:'flex', alignItems:'center', gap:'10px', textDecoration:'none'}}>
      <svg width="30" height="30" viewBox="0 0 56 56" fill="none">
        <defs><clipPath id="prClip"><rect width="56" height="56" rx="13"/></clipPath></defs>
        <rect width="56" height="56" rx="13" fill="#4338ca"/>
        <g clipPath="url(#prClip)">
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

const sections = [
  { title: '1. What we collect', body: 'MetaClean collects only what is necessary to provide the service. When you upload images, they are processed in memory and never written to disk or stored in any database. We do not collect, store, or analyze the content of your images. For account functionality, we collect your email address and payment information (processed by Stripe — we never see your card details).' },
  { title: '2. How we use your data', body: 'Your email is used to manage your account, send receipts, and communicate service updates. Your images are processed solely to perform the cleaning operations you request and are discarded immediately after download. We do not sell, share, or use your data for advertising.' },
  { title: '3. Image processing', body: 'All image processing happens server-side in temporary memory buffers. No image data is written to disk at any point. Files are processed and the result is returned to your browser. Nothing is retained after the response is sent.' },
  { title: '4. Cookies', body: 'We use minimal cookies necessary for authentication and session management. We do not use tracking cookies or third-party advertising cookies.' },
  { title: '5. Third-party services', body: "We use Stripe for payment processing. Stripe's privacy policy governs data shared with them during checkout. We use standard infrastructure providers for hosting. No third parties have access to your image data." },
  { title: '6. Data retention', body: 'Account data is retained for as long as your account is active. If you delete your account, all associated data is permanently deleted within 30 days. Image data is never retained beyond the duration of a single processing request.' },
  { title: '7. Your rights', body: 'You may request access to, correction of, or deletion of your personal data at any time by contacting us. Users in the EU have additional rights under GDPR including the right to data portability and the right to object to processing.' },
  { title: '8. Contact', body: 'For any privacy-related questions or requests, contact us at privacy@metaclean.pro.' },
]

export default function Privacy() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 30); return () => clearTimeout(t) }, [])

  const en = (d = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'none' : 'translateY(-10px)',
    transition: `opacity 0.45s ease ${d}ms, transform 0.45s ease ${d}ms`,
  })

  return (
    <main className="min-h-screen bg-[#060609] text-white" style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]" style={{background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.05) 0%, transparent 65%)'}} />
      </div>

      <SiteNav />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">

        <div className="mb-10 sm:mb-12" style={en(60)}>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-3 font-medium">Legal</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-gray-500 text-sm">Last updated: January 2025</p>
        </div>

        <div className="space-y-8 sm:space-y-10">
          {sections.map((s, idx) => (
            <Reveal key={idx} delay={idx * 45} y={14}>
              <div
                className="group"
                onMouseEnter={(e) => { e.currentTarget.querySelector('.section-body').style.color = 'rgba(156,163,175,1)' }}
                onMouseLeave={(e) => { e.currentTarget.querySelector('.section-body').style.color = '' }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0" style={{background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)'}}>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  </div>
                  <h2 className="text-white font-semibold text-[14px] sm:text-[15px] leading-snug">{s.title}</h2>
                </div>
                <p className="section-body text-gray-500 text-[13px] sm:text-[14px] leading-relaxed pl-8 transition-colors duration-300">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

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
