'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Footer from '@/app/components/Footer'
import Logo from '@/app/components/Logo'
import { glowStyle, glowHandlers } from '@/lib/glow'

const benefits = [
  {
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    title: 'Metadata stripped',
    desc: 'EXIF, GPS, timestamps — all gone before upload.',
    color: '#3b82f6',
  },
  {
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>,
    title: 'Every ad format',
    desc: 'Auto-resized for Meta, Google, TikTok and more.',
    color: '#8b5cf6',
  },
  {
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
    title: 'AI Autocrop',
    desc: 'Subject-aware cropping — nothing important gets cut.',
    color: '#6366f1',
  },
  {
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" /></svg>,
    title: 'Bulk processing',
    desc: 'Up to 50 images at once, downloaded in one zip.',
    color: '#10b981',
  },
]

const flags = { en: 'https://flagcdn.com/w20/gb.png', pt: 'https://flagcdn.com/w20/pt.png', es: 'https://flagcdn.com/w20/es.png' }

const t = {
  en: {
    badge: 'Free to start',
    headline1: 'Clean images.',
    headline2: 'Win more auctions.',
    sub: 'Strip metadata and resize for every ad platform. One click, no guesswork.',
    social: '50,000+ images processed this month',
    login_tab: 'Log in', signup_tab: 'Sign up',
    welcome: 'Welcome back', welcome_sub: 'Log in to your MetaClean account',
    create: 'Create your account', create_sub: 'Start cleaning images for free',
    email_label: 'Email', pwd_label: 'Password',
    submit_login: 'Log in', submit_signup: 'Create account', submitting: 'Please wait…',
    google: 'Continue with Google',
    switch_signup: 'No account? Sign up', switch_login: 'Have an account? Log in',
    terms_pre: 'By signing up you agree to our', terms: 'Terms', and: 'and', privacy: 'Privacy Policy',
    pwd_weak: 'Weak', pwd_fair: 'Fair', pwd_good: 'Good', pwd_strong: 'Strong',
    pwd_rule_len: 'At least 8 characters', pwd_rule_upper: 'Uppercase letter', pwd_rule_lower: 'Lowercase letter', pwd_rule_num: 'Number',
    err_fields: 'Please fill in all fields.',
    err_cancel: 'Sign in was cancelled.',
    err_duplicate: 'An account with this email already exists. Please log in instead.',
  },
  pt: {
    badge: 'Grátis para começar',
    headline1: 'Imagens limpas.',
    headline2: 'Mais conversões.',
    sub: 'Remove metadados e redimensiona para cada plataforma de anúncios. Um clique, sem complicações.',
    social: '50.000+ imagens processadas este mês',
    login_tab: 'Entrar', signup_tab: 'Registar',
    welcome: 'Bem-vindo de volta', welcome_sub: 'Entra na tua conta MetaClean',
    create: 'Cria a tua conta', create_sub: 'Começa a limpar imagens gratuitamente',
    email_label: 'Email', pwd_label: 'Password',
    submit_login: 'Entrar', submit_signup: 'Criar conta', submitting: 'Aguarda…',
    google: 'Continuar com Google',
    switch_signup: 'Sem conta? Regista-te', switch_login: 'Já tens conta? Entra',
    terms_pre: 'Ao registares-te, concordas com os nossos', terms: 'Termos', and: 'e', privacy: 'Política de Privacidade',
    pwd_weak: 'Fraca', pwd_fair: 'Razoável', pwd_good: 'Boa', pwd_strong: 'Forte',
    pwd_rule_len: 'Pelo menos 8 caracteres', pwd_rule_upper: 'Maiúscula', pwd_rule_lower: 'Minúscula', pwd_rule_num: 'Número',
    err_fields: 'Por favor preenche todos os campos.',
    err_cancel: 'O login foi cancelado.',
    err_duplicate: 'Já existe uma conta com este email. Faz login.',
  },
  es: {
    badge: 'Gratis para empezar',
    headline1: 'Imágenes limpias.',
    headline2: 'Más conversiones.',
    sub: 'Elimina metadatos y redimensiona para cada plataforma de anuncios. Un clic, sin complicaciones.',
    social: '50.000+ imágenes procesadas este mes',
    login_tab: 'Entrar', signup_tab: 'Registrarse',
    welcome: 'Bienvenido de nuevo', welcome_sub: 'Entra en tu cuenta MetaClean',
    create: 'Crea tu cuenta', create_sub: 'Empieza a limpiar imágenes gratis',
    email_label: 'Email', pwd_label: 'Contraseña',
    submit_login: 'Entrar', submit_signup: 'Crear cuenta', submitting: 'Espera…',
    google: 'Continuar con Google',
    switch_signup: '¿Sin cuenta? Regístrate', switch_login: '¿Ya tienes cuenta? Entra',
    terms_pre: 'Al registrarte aceptas nuestros', terms: 'Términos', and: 'y', privacy: 'Política de Privacidad',
    pwd_weak: 'Débil', pwd_fair: 'Regular', pwd_good: 'Buena', pwd_strong: 'Fuerte',
    pwd_rule_len: 'Al menos 8 caracteres', pwd_rule_upper: 'Mayúscula', pwd_rule_lower: 'Minúscula', pwd_rule_num: 'Número',
    err_fields: 'Por favor rellena todos los campos.',
    err_cancel: 'El inicio de sesión fue cancelado.',
    err_duplicate: 'Ya existe una cuenta con este email. Inicia sesión.',
  },
}

const pwdRules = (tr) => [
  { label: tr.pwd_rule_len,   test: p => p.length >= 8 },
  { label: tr.pwd_rule_upper, test: p => /[A-Z]/.test(p) },
  { label: tr.pwd_rule_lower, test: p => /[a-z]/.test(p) },
  { label: tr.pwd_rule_num,   test: p => /[0-9]/.test(p) },
]

function getPwdStrength(p, rules) {
  return rules.filter(r => r.test(p)).length
}

export default function Login() {
  const router = useRouter()
  const [mode, setMode] = useState('login')         // the "real" mode — drives form logic
  const [displayMode, setDisplayMode] = useState('login') // lags behind mode — only updates after fade-out
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [lang, setLang] = useState('en')
  const [langOpen, setLangOpen] = useState(false)
  const [langTransitioning, setLangTransitioning] = useState(false)

  const i = t[lang]
  const rules = pwdRules(i)

  const setLangAndSave = (l) => {
    if (l === lang || langTransitioning) return
    setLangTransitioning(true)
    setTimeout(() => {
      setLang(l)
      localStorage.setItem('metaclean_lang', l)
      setLangOpen(false)
    }, 140)
    setTimeout(() => setLangTransitioning(false), 155)
  }

  const switchMode = (newMode) => {
    if (newMode === mode || transitioning) return
    setTransitioning(true)
    // After fade-out completes, swap both mode and displayMode together
    setTimeout(() => {
      setMode(newMode)
      setDisplayMode(newMode)
      setError('')
      setPassword('')
    }, 160)
    setTimeout(() => setTransitioning(false), 170)
  }

  useEffect(() => {
    // Read mode from URL + clean OAuth error params
    const params = new URLSearchParams(window.location.search)
    if (params.get('mode') === 'signup') setMode('signup')
    if (params.get('error')) {
      setError(t[localStorage.getItem('metaclean_lang') || 'en']?.err_cancel || 'Sign in was cancelled.')
      window.history.replaceState({}, '', window.location.pathname)
    }

    const saved = localStorage.getItem('metaclean_lang')
    if (saved && ['en', 'pt', 'es'].includes(saved)) setLang(saved)

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
    if (!email || !password) { setError(i.err_fields); return }
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
      } else {
        const unmet = rules.filter(r => !r.test(password))
        if (unmet.length > 0) { setError(`Password must include: ${unmet.map(r => r.label.toLowerCase()).join(', ')}.`); setLoading(false); return }
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
        if (signUpError) throw signUpError
        // Supabase returns a fake user instead of an error for duplicate emails
        if (data.user && data.user.identities?.length === 0) {
          throw new Error(i.err_duplicate)
        }
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email,
            plan: 'free',
            images_used_today: 0,
            last_reset_date: new Date().toISOString().split('T')[0],
          })
          fetch('/api/email/welcome', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          }).catch(() => {})
        }
      }
      router.push('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-[#060609] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </main>
    )
  }

  const fadeIn = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'none' : 'translateY(16px)',
    transition: `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  })

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '10px',
    padding: '11px 14px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  return (
    <main
      className="min-h-screen bg-[#060609] text-white flex flex-col overflow-hidden"
      style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}
      onMouseMove={e => {
        const g = document.getElementById('login-cursor-glow')
        if (g) { g.style.left = e.clientX - 350 + 'px'; g.style.top = e.clientY - 350 + 'px' }
      }}
    >
      {/* Cursor-follow glow */}
      <div id="login-cursor-glow" className="fixed w-[700px] h-[700px] pointer-events-none" style={{background: 'radial-gradient(circle, rgba(99,102,241,0.045) 0%, transparent 65%)', borderRadius: '50%', zIndex: 0, transition: 'none'}} />

      {/* Top gradient line */}
      <div className="fixed top-0 left-0 right-0 z-30" style={{height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6) 40%, rgba(139,92,246,0.6) 60%, transparent)'}}>
        <div className="h-full w-full" style={{boxShadow: '0 0 20px 1px rgba(99,102,241,0.2)'}} />
      </div>

      {/* Fixed background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.02]" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '44px 44px'}} />
        <div className="absolute top-0 left-0 w-[600px] h-[500px]" style={{background: 'radial-gradient(ellipse at 0% 0%, rgba(37,99,235,0.07) 0%, transparent 60%)'}} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px]" style={{background: 'radial-gradient(ellipse at 100% 100%, rgba(139,92,246,0.06) 0%, transparent 60%)'}} />
      </div>

      {/* ── Panels row ── */}
      <div className="flex flex-1 relative z-10">

      {/* ── Left panel (desktop only) ── */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] xl:w-[480px] shrink-0 px-10 xl:px-14 py-10 relative overflow-hidden h-screen sticky top-0"
        style={{borderRight: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(160deg, rgba(13,13,24,0.8) 0%, rgba(6,6,9,1) 100%)'}}>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />

        {/* Top glow accent */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)', boxShadow: '0 0 12px rgba(99,102,241,0.2)'}} />

        <div style={fadeIn(0)}>
          <Logo clipId="loginDesktopLogo" />
        </div>

        <div className="relative" style={{...fadeIn(80), opacity: !mounted ? 0 : langTransitioning ? 0 : 1, filter: langTransitioning ? 'blur(4px)' : 'blur(0px)', transform: !mounted ? 'translateY(16px)' : langTransitioning ? 'translateY(4px)' : 'none', transition: langTransitioning ? 'opacity 0.14s ease, filter 0.14s ease, transform 0.14s ease' : 'opacity 0.55s cubic-bezier(0.16,1,0.3,1) 80ms, filter 0.28s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1) 80ms'}}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-[11px] font-semibold uppercase tracking-widest"
            style={{background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc'}}>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block" />
            {i.badge}
          </div>
          <h2 className="text-[24px] xl:text-[28px] font-bold tracking-tight leading-tight mb-2" style={{letterSpacing: '-0.03em'}}>
            {i.headline1}<br/>
            <span style={{background: 'linear-gradient(135deg, #93c5fd, #a5b4fc, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
              {i.headline2}
            </span>
          </h2>
          <p className="text-gray-500 text-[13px] leading-relaxed mb-7">{i.sub}</p>

          <div className="space-y-1.5">
            {benefits.map(({ icon, title, desc, color }, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-2.5 py-2 rounded-xl transition-all duration-200 cursor-default"
                style={{...fadeIn(120 + idx * 60), border: '1px solid transparent'}}
                onMouseEnter={e => { e.currentTarget.style.background = `${color}08`; e.currentTarget.style.borderColor = `${color}20`; e.currentTarget.style.transform = 'translateX(4px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateX(0)' }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{background: `${color}15`, color, border: `1px solid ${color}25`}}>
                  {icon}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white leading-none mb-0.5">{title}</p>
                  <p className="text-[11px] text-gray-500 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-3" style={fadeIn(400)}>
          <div className="flex -space-x-2">
            {['#4338ca','#7c3aed','#2563eb','#0891b2'].map((c, idx) => (
              <div key={idx} className="w-7 h-7 rounded-full border-2 border-[#060609] hover-scale transition-transform" style={{background: `linear-gradient(135deg, ${c}, ${c}88)`}} />
            ))}
          </div>
          <p className="text-[12px] text-gray-600">{i.social}</p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col">

        {/* Mobile nav */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4" style={{borderBottom: '1px solid rgba(255,255,255,0.05)', ...fadeIn(0)}}>
          <Logo clipId="loginMobileLogo" />
          <div className="relative">
            <button onClick={() => setLangOpen(o => !o)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] text-gray-400 hover:text-gray-200 transition-colors" style={{border: '1px solid rgba(255,255,255,0.07)'}}>
              <img src={flags[lang]} alt={lang} style={{width:'16px', height:'11px', objectFit:'cover', borderRadius:'2px'}} />
              <span className="uppercase font-medium tracking-wider">{lang}</span>
              <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1.5 w-32 rounded-xl overflow-hidden z-30 anim-pop" style={{background: '#0d0d14', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
                {['en','pt','es'].map((l) => (
                  <button key={l} onClick={() => setLangAndSave(l)} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] hover:bg-white/5 transition-colors">
                    <img src={flags[l]} alt={l} style={{width:'16px', height:'11px', objectFit:'cover', borderRadius:'2px'}} />
                    <span className={`uppercase font-medium tracking-wider ${lang === l ? 'text-blue-400' : 'text-gray-400'}`}>{l}</span>
                    {lang === l && <svg className="w-3 h-3 text-blue-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" /></svg>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop lang selector */}
        <div className="hidden lg:flex justify-end px-8 pt-5 relative z-10" style={fadeIn(0)}>
          <div className="relative">
            <button onClick={() => setLangOpen(o => !o)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] text-gray-400 hover:text-gray-200 transition-colors" style={{border: '1px solid rgba(255,255,255,0.07)'}}>
              <img src={flags[lang]} alt={lang} style={{width:'16px', height:'11px', objectFit:'cover', borderRadius:'2px'}} />
              <span className="uppercase font-medium tracking-wider">{lang}</span>
              <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-1.5 w-32 rounded-xl overflow-hidden z-30 anim-pop" style={{background: '#0d0d14', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
                {['en','pt','es'].map((l) => (
                  <button key={l} onClick={() => setLangAndSave(l)} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] hover:bg-white/5 transition-colors">
                    <img src={flags[l]} alt={l} style={{width:'16px', height:'11px', objectFit:'cover', borderRadius:'2px'}} />
                    <span className={`uppercase font-medium tracking-wider ${lang === l ? 'text-blue-400' : 'text-gray-400'}`}>{l}</span>
                    {lang === l && <svg className="w-3 h-3 text-blue-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" /></svg>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
          <div className="w-full max-w-[360px]">

            {/* Heading */}
            <div className="mb-7" style={{
              opacity: !mounted ? 0 : (transitioning || langTransitioning) ? 0 : 1,
              filter: (transitioning || langTransitioning) ? 'blur(4px)' : 'blur(0px)',
              transform: !mounted ? 'translateY(16px)' : (transitioning || langTransitioning) ? 'translateY(5px)' : 'none',
              transition: !mounted
                ? 'opacity 0.55s cubic-bezier(0.16,1,0.3,1) 60ms, transform 0.55s cubic-bezier(0.16,1,0.3,1) 60ms'
                : (transitioning || langTransitioning)
                  ? 'opacity 0.14s ease, filter 0.14s ease, transform 0.14s ease'
                  : 'opacity 0.28s cubic-bezier(0.16,1,0.3,1), filter 0.28s cubic-bezier(0.16,1,0.3,1), transform 0.28s cubic-bezier(0.16,1,0.3,1)',
            }}>
              <h1 className="text-2xl font-bold tracking-tight mb-1.5" style={{letterSpacing: '-0.03em'}}>
                {displayMode === 'login' ? i.welcome : i.create}
              </h1>
              <p className="text-gray-500 text-[13px]">
                {displayMode === 'login' ? i.welcome_sub : i.create_sub}
              </p>
            </div>

            {/* Card */}
            <div style={fadeIn(100)}>

              {/* Tab switcher */}
              <div className="flex rounded-xl p-1 mb-6" style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)'}}>
                <button
                  onClick={() => switchMode('login')}
                  className="flex-1 py-2 rounded-lg text-[13px] font-medium transition-all duration-200"
                  style={{
                    background: mode === 'login' ? 'rgba(255,255,255,0.09)' : 'transparent',
                    color: mode === 'login' ? 'white' : 'rgba(255,255,255,0.35)',
                    boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)' : 'none',
                    transform: mode !== 'login' ? 'scale(0.97)' : 'scale(1)',
                  }}
                >
                  {i.login_tab}
                </button>
                <button
                  onClick={() => switchMode('signup')}
                  className="flex-1 py-2 rounded-lg text-[13px] font-medium transition-all duration-200"
                  style={{
                    background: mode === 'signup' ? 'rgba(255,255,255,0.09)' : 'transparent',
                    color: mode === 'signup' ? 'white' : 'rgba(255,255,255,0.35)',
                    boxShadow: mode === 'signup' ? '0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)' : 'none',
                    transform: mode !== 'signup' ? 'scale(0.97)' : 'scale(1)',
                  }}
                >
                  {i.signup_tab}
                </button>
              </div>

              {/* Transition wrapper — fades/blurs on mode switch or lang switch */}
              <div style={{
                opacity: (transitioning || langTransitioning) ? 0 : 1,
                filter: (transitioning || langTransitioning) ? 'blur(6px)' : 'blur(0px)',
                transform: (transitioning || langTransitioning) ? 'translateY(8px) scale(0.983)' : 'translateY(0) scale(1)',
                transition: (transitioning || langTransitioning)
                  ? 'opacity 0.14s ease, filter 0.14s ease, transform 0.14s ease'
                  : 'opacity 0.28s cubic-bezier(0.16,1,0.3,1), filter 0.28s cubic-bezier(0.16,1,0.3,1), transform 0.28s cubic-bezier(0.16,1,0.3,1)',
              }}>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-3.5 mb-5">
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1.5 font-semibold uppercase tracking-wider">{i.email_label}</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.background = 'rgba(99,102,241,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)' }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1.5 font-semibold uppercase tracking-wider">{i.pwd_label}</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      autoComplete={displayMode === 'login' ? 'current-password' : 'new-password'}
                      onChange={(e) => setPassword(e.target.value)}
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.6)'; e.target.style.background = 'rgba(99,102,241,0.04)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)' }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.boxShadow = 'none' }}
                    />
                    {displayMode === 'signup' && password.length > 0 && (() => {
                      const strength = getPwdStrength(password, rules)
                      const labels = ['', i.pwd_weak, i.pwd_fair, i.pwd_good, i.pwd_strong]
                      const colors = ['', '#ef4444', '#f59e0b', '#22c55e', '#10b981']
                      return (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1.5">
                            {[1,2,3,4].map(n => (
                              <div key={n} className="h-1 flex-1 rounded-full transition-all duration-300"
                                style={{background: n <= strength ? colors[strength] : 'rgba(255,255,255,0.08)', boxShadow: n <= strength ? `0 0 6px ${colors[strength]}55` : 'none'}} />
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-medium" style={{color: colors[strength]}}>{labels[strength]}</p>
                            <div className="flex gap-2">
                              {rules.map((r, n) => (
                                <span key={n} className="text-[10px] transition-colors duration-200" style={{color: r.test(password) ? '#6ee7b7' : 'rgba(255,255,255,0.2)'}}>
                                  {r.test(password) ? '✓' : '·'} {n === 0 ? '8+' : n === 1 ? 'A' : n === 2 ? 'a' : '0-9'}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>

                {error && (
                  <div className="mb-4 px-3.5 py-2.5 rounded-xl text-[12px] text-red-300 flex items-start gap-2.5 anim-pop" style={{background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)'}}>
                    <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  {...glowHandlers}
                  className="w-full py-3 rounded-xl text-[13px] font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2"
                  style={glowStyle}
                >
                  {loading ? (
                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> {i.submitting}</>
                  ) : displayMode === 'login' ? i.submit_login : i.submit_signup}
                </button>
              </form>

              {displayMode === 'signup' && (
                <p className="text-center text-[11px] text-gray-600 mt-4 leading-relaxed">
                  {i.terms_pre}{' '}
                  <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">{i.terms}</Link>
                  {' '}{i.and}{' '}
                  <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">{i.privacy}</Link>
                </p>
              )}

              {/* Google login */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px" style={{background: 'rgba(255,255,255,0.06)'}} />
                <span className="text-[11px] text-gray-700">or</span>
                <div className="flex-1 h-px" style={{background: 'rgba(255,255,255,0.06)'}} />
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full py-2.5 rounded-xl text-[13px] text-gray-300 flex items-center justify-center gap-2.5 hover-scale"
                style={{border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.04)', transition: 'background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s cubic-bezier(0.16,1,0.3,1)'}}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = ''; e.currentTarget.style.boxShadow = 'none' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {i.google}
              </button>

              <div className="flex items-center gap-3 mt-4">
                <div className="flex-1 h-px" style={{background: 'rgba(255,255,255,0.06)'}} />
                <button
                  onClick={() => switchMode(displayMode === 'login' ? 'signup' : 'login')}
                  className="text-[12px] text-gray-500 hover:text-gray-300 transition-colors whitespace-nowrap"
                >
                  {displayMode === 'login' ? i.switch_signup : i.switch_login}
                </button>
                <div className="flex-1 h-px" style={{background: 'rgba(255,255,255,0.06)'}} />
              </div>

              </div>{/* end transition wrapper */}

            </div>
          </div>
        </div>
      </div>
      </div>{/* end panels row */}

      <Footer />
    </main>
  )
}
