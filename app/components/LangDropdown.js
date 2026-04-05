'use client'
import { useState, useEffect, useRef } from 'react'

const flags = {
  en: 'https://flagcdn.com/w20/gb.png',
  pt: 'https://flagcdn.com/w20/pt.png',
  es: 'https://flagcdn.com/w20/es.png',
}

export default function LangDropdown({ lang, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] text-gray-400 hover:text-gray-200 transition-colors"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <img src={flags[lang]} alt={lang} style={{ width: 16, height: 11, objectFit: 'cover', borderRadius: 2 }} />
        <span className="uppercase font-medium tracking-wider hidden sm:inline">{lang}</span>
        <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1.5 w-32 rounded-xl overflow-hidden z-30"
          style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', animation: 'ld-pop 0.15s cubic-bezier(0.16,1,0.3,1) both' }}
        >
          <style>{`@keyframes ld-pop { from { opacity:0; transform:scale(0.96) translateY(-4px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>
          {['en', 'pt', 'es'].map((l) => (
            <button
              key={l}
              onClick={() => { onChange(l); setOpen(false) }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] hover:bg-white/5 transition-colors"
            >
              <img src={flags[l]} alt={l} style={{ width: 16, height: 11, objectFit: 'cover', borderRadius: 2 }} />
              <span className={`uppercase font-medium tracking-wider ${lang === l ? 'text-indigo-400' : 'text-gray-400'}`}>{l}</span>
              {lang === l && (
                <svg className="w-3 h-3 text-indigo-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
