'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

function Logo() {
  return (
    <Link href="/" style={{display:'flex', alignItems:'center', gap:'10px', textDecoration:'none'}}>
      <svg width="32" height="32" viewBox="0 0 56 56" fill="none">
        <defs><clipPath id="iconClip5"><rect width="56" height="56" rx="13"/></clipPath></defs>
        <rect width="56" height="56" rx="13" fill="#4338ca"/>
        <g clipPath="url(#iconClip5)">
          <circle cx="14" cy="18" r="5" fill="rgba(255,255,255,0.9)"/>
          <polygon points="6,52 22,26 38,52" fill="rgba(255,255,255,0.9)"/>
          <polygon points="24,52 36,34 50,52" fill="rgba(255,255,255,0.7)"/>
          <polygon points="34,0 56,0 56,24" fill="#060609"/>
          <line x1="34" y1="0" x2="56" y2="24" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round"/>
        </g>
      </svg>
      <span style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif', fontSize:'20px', letterSpacing:'-0.8px', lineHeight:1}}>
        <span style={{fontWeight:800, color:'white'}}>meta</span>
        <span style={{fontWeight:200, color:'rgba(255,255,255,0.45)'}}>clean</span>
      </span>
    </Link>
  )
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
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1)
    e.currentTarget.style.backgroundPosition = `${x}% 50%`
  },
}

export default function Login() {
  const router = useRouter()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/dashboard')
      else {
        setCheckingSession(false)
        setTimeout(() => setMounted(true), 40)
      }
    })
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
        if (signUpError) throw signUpError
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email,
            plan: 'free',
            images_used_today: 0,
            last_reset_date: new Date().toISOString().split('T')[0],
          })
        }
      }
      router.push('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-[#060609] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </main>
    )
  }

  const cardStyle = {
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'none' : 'translateY(20px) scale(0.98)',
    transition: 'opacity 0.55s cubic-bezier(0.16,1,0.3,1) 80ms, transform 0.55s cubic-bezier(0.16,1,0.3,1) 80ms',
  }
  const headerStyle = {
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'none' : 'translateY(-10px)',
    transition: 'opacity 0.45s ease 30ms, transform 0.45s ease 30ms',
  }

  return (
    <main className="min-h-screen bg-[#060609] text-white flex flex-col" style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]" style={{background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.08) 0%, transparent 65%)'}} />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px]" style={{background: 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, transparent 70%)'}} />
      </div>

      <nav className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5" style={{borderBottom: '1px solid rgba(255,255,255,0.05)', ...headerStyle}}>
        <Logo />
      </nav>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
        <div className="w-full max-w-sm">

          <div className="text-center mb-7" style={headerStyle}>
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-gray-500 text-[13px]">
              {mode === 'login' ? 'Sign in to your MetaClean account' : 'Start cleaning images for free'}
            </p>
          </div>

          <div className="rounded-2xl p-6 sm:p-8" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', ...cardStyle}}>

            <div className="flex rounded-xl p-1 mb-6" style={{background: 'rgba(255,255,255,0.04)'}}>
              <button
                onClick={() => { setMode('login'); setError('') }}
                className="flex-1 py-2 rounded-lg text-[13px] font-medium transition-all"
                style={{
                  background: mode === 'login' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: mode === 'login' ? 'white' : 'rgba(255,255,255,0.4)',
                }}
              >
                Sign in
              </button>
              <button
                onClick={() => { setMode('signup'); setError('') }}
                className="flex-1 py-2 rounded-lg text-[13px] font-medium transition-all"
                style={{
                  background: mode === 'signup' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: mode === 'signup' ? 'white' : 'rgba(255,255,255,0.4)',
                }}
              >
                Sign up
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-3 mb-6">
                <div>
                  <label className="block text-[12px] text-gray-400 mb-1.5 font-medium">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-gray-400 mb-1.5 font-medium">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 px-3.5 py-2.5 rounded-xl text-[12px] text-red-300" style={{background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)'}}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                {...glowHandlers}
                className="w-full py-3 rounded-xl text-[13px] font-semibold text-white disabled:opacity-50"
                style={glowStyle}
              >
                {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            {mode === 'signup' && (
              <p className="text-center text-[11px] text-gray-600 mt-4 leading-relaxed">
                By creating an account you agree to our{' '}
                <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">Terms</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
              </p>
            )}
          </div>

        </div>
      </div>

    </main>
  )
}
