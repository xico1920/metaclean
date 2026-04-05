'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Logo from '@/app/components/Logo'
import Footer from '@/app/components/Footer'
import { glowStyle, glowHandlers } from '@/lib/glow'
import LangDropdown from '@/app/components/LangDropdown'

const FREE_LIMIT = 10

const t = {
  en: {
    title: 'Account settings',
    back: 'Back to dashboard',
    section_profile: 'Profile',
    section_plan: 'Plan & billing',
    section_danger: 'Danger zone',
    email_label: 'Email address',
    plan_label: 'Current plan',
    plan_free: 'Free',
    plan_pro: 'Pro',
    usage_label: 'Usage today',
    usage_free: (used) => `${used} / ${FREE_LIMIT} images`,
    usage_pro: 'Unlimited',
    upgrade_cta: 'Upgrade to Pro · €9/mo',
    manage_sub: 'Manage subscription',
    manage_sub_desc: 'Update payment method, download invoices or cancel your subscription.',
    signout: 'Sign out',
    delete_title: 'Delete account',
    delete_desc: 'Permanently delete your account and all associated data. This action cannot be undone.',
    delete_cta: 'Delete my account',
    delete_confirm_title: 'Confirm account deletion',
    delete_confirm_desc: () => `Type the email address associated with your account to confirm you want to permanently delete it.`,
    delete_confirm_placeholder: 'Type your email to confirm',
    delete_confirm_cta: 'Permanently delete account',
    delete_confirm_cancel: 'Cancel',
    delete_mismatch: 'Email does not match.',
    deleting: 'Deleting…',
  },
  pt: {
    title: 'Definições da conta',
    back: 'Voltar ao dashboard',
    section_profile: 'Perfil',
    section_plan: 'Plano e faturação',
    section_danger: 'Zona de perigo',
    email_label: 'Endereço de email',
    plan_label: 'Plano atual',
    plan_free: 'Grátis',
    plan_pro: 'Pro',
    usage_label: 'Uso hoje',
    usage_free: (used) => `${used} / ${FREE_LIMIT} imagens`,
    usage_pro: 'Ilimitado',
    upgrade_cta: 'Upgrade para Pro · €9/mês',
    manage_sub: 'Gerir subscrição',
    manage_sub_desc: 'Atualiza o método de pagamento, descarrega faturas ou cancela a subscrição.',
    signout: 'Terminar sessão',
    delete_title: 'Eliminar conta',
    delete_desc: 'Elimina permanentemente a tua conta e todos os dados associados. Esta ação não pode ser desfeita.',
    delete_cta: 'Eliminar a minha conta',
    delete_confirm_title: 'Confirmar eliminação da conta',
    delete_confirm_desc: () => `Escreve o endereço de email associado à tua conta para confirmar que queres eliminá-la permanentemente.`,
    delete_confirm_placeholder: 'Escreve o teu email para confirmar',
    delete_confirm_cta: 'Eliminar conta permanentemente',
    delete_confirm_cancel: 'Cancelar',
    delete_mismatch: 'O email não corresponde.',
    deleting: 'A eliminar…',
  },
  es: {
    title: 'Configuración de cuenta',
    back: 'Volver al dashboard',
    section_profile: 'Perfil',
    section_plan: 'Plan y facturación',
    section_danger: 'Zona de peligro',
    email_label: 'Dirección de email',
    plan_label: 'Plan actual',
    plan_free: 'Gratis',
    plan_pro: 'Pro',
    usage_label: 'Uso hoy',
    usage_free: (used) => `${used} / ${FREE_LIMIT} imágenes`,
    usage_pro: 'Ilimitado',
    upgrade_cta: 'Actualizar a Pro · €9/mes',
    manage_sub: 'Gestionar suscripción',
    manage_sub_desc: 'Actualiza tu método de pago, descarga facturas o cancela tu suscripción.',
    signout: 'Cerrar sesión',
    delete_title: 'Eliminar cuenta',
    delete_desc: 'Elimina permanentemente tu cuenta y todos los datos asociados. Esta acción no se puede deshacer.',
    delete_cta: 'Eliminar mi cuenta',
    delete_confirm_title: 'Confirmar eliminación de cuenta',
    delete_confirm_desc: () => `Escribe la dirección de email asociada a tu cuenta para confirmar que quieres eliminarla permanentemente.`,
    delete_confirm_placeholder: 'Escribe tu email para confirmar',
    delete_confirm_cta: 'Eliminar cuenta permanentemente',
    delete_confirm_cancel: 'Cancelar',
    delete_mismatch: 'El email no coincide.',
    deleting: 'Eliminando…',
  },
}

const flags = { en: 'https://flagcdn.com/w20/gb.png', pt: 'https://flagcdn.com/w20/pt.png', es: 'https://flagcdn.com/w20/es.png' }

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState('en')
  const [mounted, setMounted] = useState(false)

  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)

  const i = t[lang] || t.en

  useEffect(() => {
    const saved = localStorage.getItem('metaclean_lang')
    if (saved && t[saved]) setLang(saved)

    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.replace('/login'); return }
      setUser(data.session.user)

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single()
      setProfile(prof)
      setLoading(false)
      setTimeout(() => setMounted(true), 40)
    })
  }, [router])

  const handleUpgrade = async () => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    const json = await res.json()
    if (json.url) window.location.href = json.url
  }

  const handleManageSub = async () => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    const res = await fetch('/api/stripe/portal', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    const json = await res.json()
    if (json.url) window.location.href = json.url
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleDeleteAccount = async () => {
    if (deleteInput !== user?.email) {
      setDeleteError(i.delete_mismatch)
      return
    }
    setDeleteError('')
    setDeleting(true)
    try {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      const res = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed')
      await supabase.auth.signOut()
      router.push('/?deleted=1')
    } catch {
      setDeleteError('Something went wrong. Please try again.')
      setDeleteInput('')
      setDeleting(false)
    }
  }

  const isPro = profile?.plan === 'pro' || profile?.is_admin === true
  const usagePct = Math.min(100, ((profile?.images_used_today || 0) / FREE_LIMIT) * 100)

  const fadeIn = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'none' : 'translateY(14px)',
    transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  })

  if (loading) {
    return (
      <main className="min-h-screen bg-[#060609] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </main>
    )
  }

  const sectionStyle = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: '24px',
    marginBottom: 16,
  }

  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.3)',
    marginBottom: 6,
  }

  const valueStyle = {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  }

  return (
    <main
      className="min-h-screen bg-[#060609] text-white flex flex-col"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
      onMouseMove={e => {
        const g = document.getElementById('account-cursor-glow')
        if (g) { g.style.left = e.clientX - 300 + 'px'; g.style.top = e.clientY - 300 + 'px' }
      }}
    >
      {/* Cursor glow */}
      <div id="account-cursor-glow" className="fixed w-[600px] h-[600px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 65%)', borderRadius: '50%', zIndex: 0, transition: 'none' }} />

      {/* Top line */}
      <div className="fixed top-0 left-0 right-0 z-30" style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5) 40%, rgba(139,92,246,0.5) 60%, transparent)' }}>
        <div className="h-full w-full" style={{ boxShadow: '0 0 16px 1px rgba(99,102,241,0.18)' }} />
      </div>

      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.018]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '44px 44px', zIndex: 0 }} />

      {/* Nav */}
      <nav className="sticky top-0 z-20 flex items-center justify-between px-5 sm:px-8 h-14" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(6,6,9,0.9)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-4">
          <Logo clipId="accountLogo" />
          <span className="text-gray-700 hidden sm:block">·</span>
          <span className="text-[13px] text-gray-500 hidden sm:block">{i.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <LangDropdown lang={lang} onChange={(l) => { setLang(l); localStorage.setItem('metaclean_lang', l) }} />
          <Link href="/dashboard" className="text-[12px] text-gray-500 hover:text-gray-300 transition-colors">
            ← {i.back}
          </Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14 flex-1">
        <h1 className="text-[22px] font-bold tracking-tight mb-8" style={{ ...fadeIn(0), letterSpacing: '-0.03em' }}>
          {i.title}
        </h1>

        {/* ── Profile ─────────────────────────────────────────────────────── */}
        <div style={{ ...sectionStyle, ...fadeIn(60) }}>
          <p className="text-[12px] font-semibold uppercase tracking-widest text-gray-600 mb-4">{i.section_profile}</p>

          <div className="space-y-4">
            <div>
              <p style={labelStyle}>{i.email_label}</p>
              <p style={valueStyle}>{user?.email}</p>
            </div>
            <div>
              <p style={labelStyle}>{i.plan_label}</p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-semibold"
                  style={{
                    background: isPro ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.05)',
                    border: isPro ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.1)',
                    color: isPro ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
                  }}>
                  {isPro && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />}
                  {isPro ? i.plan_pro : i.plan_free}
                </span>
              </div>
            </div>
            <div>
              <p style={labelStyle}>{i.usage_label}</p>
              {isPro ? (
                <p style={{ ...valueStyle, color: '#a5b4fc' }}>{i.usage_pro}</p>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${usagePct}%`, background: usagePct >= 90 ? '#f87171' : '#6366f1' }} />
                  </div>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                    {i.usage_free(profile?.images_used_today || 0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Plan & billing ───────────────────────────────────────────────── */}
        <div style={{ ...sectionStyle, ...fadeIn(120) }}>
          <p className="text-[12px] font-semibold uppercase tracking-widest text-gray-600 mb-4">{i.section_plan}</p>

          {isPro ? (
            <div>
              <p className="text-[13px] text-gray-500 mb-4">{i.manage_sub_desc}</p>
              <button
                onClick={handleManageSub}
                className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all hover:bg-white/[0.07]"
                style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
              >
                {i.manage_sub} →
              </button>
            </div>
          ) : (
            <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.07), rgba(99,102,241,0.09))', border: '1px solid rgba(99,102,241,0.18)' }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-[14px] font-semibold text-white mb-1">Upgrade to Pro</p>
                  <p className="text-[12px] text-gray-500">Unlimited images · all platforms · batch ZIP</p>
                </div>
                <button onClick={handleUpgrade} {...glowHandlers} className="shrink-0 px-4 py-2 rounded-xl text-[12px] font-semibold text-white whitespace-nowrap" style={glowStyle}>
                  {i.upgrade_cta}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Sign out ─────────────────────────────────────────────────────── */}
        <div style={{ ...sectionStyle, ...fadeIn(180) }}>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2.5 text-[13px] text-gray-500 hover:text-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            {i.signout}
          </button>
        </div>

        {/* ── Danger zone ──────────────────────────────────────────────────── */}
        <div style={{ ...fadeIn(240), background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 16, padding: '24px', marginBottom: 16 }}>
          <p className="text-[12px] font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(239,68,68,0.6)' }}>{i.section_danger}</p>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[14px] font-semibold text-white mb-1">{i.delete_title}</p>
              <p className="text-[12px] text-gray-600 max-w-xs">{i.delete_desc}</p>
            </div>
            <button
              onClick={() => { setShowDeleteModal(true); setDeleteInput(''); setDeleteError('') }}
              className="shrink-0 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all"
              style={{ border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', background: 'rgba(239,68,68,0.05)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.05)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)' }}
            >
              {i.delete_cta}
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {/* ── Delete confirmation modal ─────────────────────────────────────── */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(6,6,9,0.88)', backdropFilter: 'blur(20px)' }}
          onClick={e => { if (e.target === e.currentTarget && !deleting) setShowDeleteModal(false) }}
        >
          <div
            className="w-full max-w-[420px] rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, rgba(13,13,24,0.99) 0%, rgba(6,6,9,1) 100%)',
              border: '1px solid rgba(239,68,68,0.2)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(239,68,68,0.08)',
              animation: 'fadeInUp 0.3s cubic-bezier(0.16,1,0.3,1) both',
            }}
          >
            {/* Red top line */}
            <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #ef4444 30%, #f87171 70%, transparent)', boxShadow: '0 0 16px 2px rgba(239,68,68,0.3)' }} />

            <div className="p-7">
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <svg className="w-5 h-5" fill="none" stroke="#f87171" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>

              <h2 className="text-[18px] font-bold tracking-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
                {i.delete_confirm_title}
              </h2>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-5">
                {i.delete_confirm_desc()}
              </p>

              <input
                type="email"
                autoComplete="off"
                placeholder={i.delete_confirm_placeholder}
                value={deleteInput}
                onChange={e => { setDeleteInput(e.target.value); setDeleteError('') }}
                disabled={deleting}
                style={{
                  width: '100%',
                  background: 'rgba(239,68,68,0.04)',
                  border: deleteError ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 10,
                  padding: '11px 14px',
                  color: 'white',
                  fontSize: 13,
                  outline: 'none',
                  marginBottom: deleteError ? 8 : 16,
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(239,68,68,0.5)' }}
                onBlur={e => { e.target.style.borderColor = deleteError ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.2)' }}
              />

              {deleteError && (
                <p className="text-[12px] text-red-400 mb-4">{deleteError}</p>
              )}

              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteInput !== user?.email}
                className="w-full py-3 rounded-xl text-[13px] font-semibold mb-3 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: deleteInput === user?.email && !deleting
                    ? 'linear-gradient(135deg, #dc2626, #ef4444)'
                    : 'rgba(239,68,68,0.15)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239,68,68,0.3)',
                }}
              >
                {deleting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {i.deleting}
                  </>
                ) : i.delete_confirm_cta}
              </button>

              <button
                onClick={() => { if (!deleting) setShowDeleteModal(false) }}
                disabled={deleting}
                className="w-full py-2 text-[12px] text-gray-600 hover:text-gray-400 transition-colors disabled:opacity-40"
              >
                {i.delete_confirm_cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
