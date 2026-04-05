'use client'
import { useState, useEffect, useRef } from 'react'

const CSS = `
@keyframes wl-fade-in  { from { opacity:0 } to { opacity:1 } }
@keyframes wl-scale-in { from { opacity:0; transform:scale(0.94) translateY(12px) } to { opacity:1; transform:scale(1) translateY(0) } }
@keyframes wl-check    { from { stroke-dashoffset:40 } to { stroke-dashoffset:0 } }
.wl-overlay { animation: wl-fade-in  0.25s ease both }
.wl-modal   { animation: wl-scale-in 0.3s  cubic-bezier(0.16,1,0.3,1) both }
.wl-check   { stroke-dasharray:40; animation: wl-check 0.45s cubic-bezier(0.16,1,0.3,1) 0.1s both }
`

export default function WaitlistModal({ open, onClose, lang = 'en' }) {
  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState('idle') // idle | loading | success | error
  const [errMsg,  setErrMsg]  = useState('')
  const inputRef = useRef(null)

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setEmail(''); setStatus('idle'); setErrMsg('')
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open, onClose])

  if (!open) return null

  const copy = {
    en: {
      title:       'Join the AI Studio waitlist',
      sub:         'Be the first to access AI Outpainting and Auto Ad Copy. Founding members lock in early pricing.',
      placeholder: 'your@email.com',
      cta:         'Join waitlist',
      loading:     'Joining…',
      success_t:   'You\'re on the list!',
      success_s:   'We\'ll email you the moment AI Studio launches.',
      error:       'Something went wrong. Try again.',
      perks: ['Early access before public launch', 'Founding price locked in forever', 'Direct input on features'],
    },
    pt: {
      title:       'Entrar na lista de espera do AI Studio',
      sub:         'Sê o primeiro a aceder ao AI Outpainting e ao Copy Automático. Membros fundadores garantem preço de lançamento.',
      placeholder: 'o.teu@email.com',
      cta:         'Entrar na lista',
      loading:     'A entrar…',
      success_t:   'Estás na lista!',
      success_s:   'Enviamos-te um email assim que o AI Studio lançar.',
      error:       'Algo correu mal. Tenta de novo.',
      perks: ['Acesso antecipado antes do lançamento público', 'Preço fundador garantido para sempre', 'Influência direta nas funcionalidades'],
    },
    es: {
      title:       'Unirse a la lista de espera de AI Studio',
      sub:         'Sé el primero en acceder a AI Outpainting y Auto Ad Copy. Los miembros fundadores bloquean el precio de lanzamiento.',
      placeholder: 'tu@email.com',
      cta:         'Unirse a la lista',
      loading:     'Uniéndose…',
      success_t:   '¡Estás en la lista!',
      success_s:   'Te enviaremos un email en el momento en que AI Studio lance.',
      error:       'Algo salió mal. Inténtalo de nuevo.',
      perks: ['Acceso anticipado antes del lanzamiento público', 'Precio fundador bloqueado para siempre', 'Influencia directa en las funcionalidades'],
    },
  }[lang] || {}

  const submit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) return
    setStatus('loading')
    try {
      const res  = await fetch('/api/waitlist', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      const json = await res.json()
      if (json.ok) setStatus('success')
      else { setErrMsg(copy.error); setStatus('error') }
    } catch {
      setErrMsg(copy.error); setStatus('error')
    }
  }

  return (
    <>
      <style>{CSS}</style>

      {/* Backdrop */}
      <div
        className="wl-overlay"
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 80,
          background: 'rgba(4,4,8,0.85)', backdropFilter: 'blur(18px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}
      >
        {/* Modal */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label={copy.title}
          className="wl-modal"
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 440,
            borderRadius: 22,
            border: '1px solid rgba(139,92,246,0.25)',
            background: '#09090f',
            overflow: 'hidden',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(99,102,241,0.08)',
          }}
        >
          {/* Top purple gradient line */}
          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#8b5cf6,#6366f1,transparent)' }} />

          <div style={{ padding: '28px 28px 24px' }}>

            {status === 'success' ? (
              /* ── Success state ── */
              <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
                {/* Animated checkmark */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path className="wl-check" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{copy.success_t}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, marginBottom: 22 }}>{copy.success_s}</div>
                <button
                  onClick={onClose}
                  style={{ padding: '10px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  Close
                </button>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                {/* Close button */}
                <button
                  onClick={onClose}
                  style={{ position: 'absolute', top: 18, right: 20, background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 4, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
                >✕</button>

                {/* Badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 99, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', marginBottom: 14 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 6px #a78bfa' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c4b5fd' }}>AI Studio · Coming soon</span>
                </div>

                <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: 8 }}>{copy.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', lineHeight: 1.55, marginBottom: 20 }}>{copy.sub}</div>

                {/* Perks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 22 }}>
                  {copy.perks?.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{p}</span>
                    </div>
                  ))}
                </div>

                {/* Form */}
                <form onSubmit={submit} style={{ display: 'flex', gap: 8 }}>
                  <input
                    ref={inputRef}
                    type="email"
                    required
                    placeholder={copy.placeholder}
                    value={email}
                    onChange={e => { setEmail(e.target.value); setStatus('idle'); setErrMsg('') }}
                    style={{
                      flex: 1, padding: '11px 14px', borderRadius: 12,
                      border: `1px solid ${status === 'error' ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.1)'}`,
                      background: 'rgba(255,255,255,0.04)', color: '#fff',
                      fontSize: 13, outline: 'none', transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                    onBlur={e => e.target.style.borderColor = status === 'error' ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.1)'}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                      padding: '11px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: '#fff', border: 'none', cursor: status === 'loading' ? 'default' : 'pointer',
                      opacity: status === 'loading' ? 0.7 : 1,
                      transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => { if (status !== 'loading') { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.4)' } }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    {status === 'loading' ? copy.loading : copy.cta}
                  </button>
                </form>

                {errMsg && (
                  <div style={{ marginTop: 8, fontSize: 12, color: '#fca5a5' }}>{errMsg}</div>
                )}

                <div style={{ marginTop: 12, fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
                  No spam. Unsubscribe anytime.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
