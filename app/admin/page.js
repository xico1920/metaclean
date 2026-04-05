'use client'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Logo from '@/app/components/Logo'

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@keyframes fadeUp   { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
@keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
@keyframes scaleIn  { from { opacity:0; transform:scale(0.96) } to { opacity:1; transform:scale(1) } }
@keyframes slideRight { from { width:0 } to { width:var(--bar-w) } }
@keyframes growBar  { from { height:0 } to { height:var(--bar-h) } }
.anim-up   { animation: fadeUp   0.45s cubic-bezier(0.16,1,0.3,1) both }
.anim-in   { animation: fadeIn   0.35s ease both }
.anim-scale{ animation: scaleIn  0.3s  cubic-bezier(0.16,1,0.3,1) both }
.bar-anim  { animation: slideRight 0.8s cubic-bezier(0.16,1,0.3,1) both }
.col-anim  { animation: growBar  0.6s  cubic-bezier(0.16,1,0.3,1) both }
`

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(d) {
  if (!d) return '–'
  const s = Math.floor((Date.now() - new Date(d)) / 1000)
  if (s < 5)  return 'Just now'
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function fmtDate(d) {
  if (!d) return '–'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function useCountUp(target, delay = 0) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!target) return
    const timer = setTimeout(() => {
      const dur   = Math.min(900, 400 + target * 0.5)
      const start = Date.now()
      const tick  = () => {
        const p = Math.min((Date.now() - start) / dur, 1)
        const e = 1 - Math.pow(1 - p, 3)
        setVal(Math.round(e * target))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay)
    return () => clearTimeout(timer)
  }, [target, delay])
  return val
}

const PLATFORM_COLORS = {
  meta:      { bg:'rgba(59,130,246,0.12)',  text:'#93c5fd', border:'rgba(59,130,246,0.22)',  bar:'#3b82f6' },
  google:    { bg:'rgba(239,68,68,0.12)',   text:'#fca5a5', border:'rgba(239,68,68,0.22)',   bar:'#ef4444' },
  tiktok:    { bg:'rgba(236,72,153,0.12)',  text:'#f9a8d4', border:'rgba(236,72,153,0.22)',  bar:'#ec4899' },
  snapchat:  { bg:'rgba(234,179,8,0.12)',   text:'#fde047', border:'rgba(234,179,8,0.22)',   bar:'#eab308' },
  pinterest: { bg:'rgba(244,63,94,0.12)',   text:'#fda4af', border:'rgba(244,63,94,0.22)',   bar:'#f43f5e' },
  linkedin:  { bg:'rgba(14,165,233,0.12)',  text:'#7dd3fc', border:'rgba(14,165,233,0.22)',  bar:'#0ea5e9' },
  clean:     { bg:'rgba(16,185,129,0.12)',  text:'#6ee7b7', border:'rgba(16,185,129,0.22)',  bar:'#10b981' },
}
const DP = { bg:'rgba(255,255,255,0.05)', text:'rgba(255,255,255,0.4)', border:'rgba(255,255,255,0.1)', bar:'#6366f1' }
const gp  = p => PLATFORM_COLORS[p] || DP

const AV_COLORS = ['#6366f1','#3b82f6','#8b5cf6','#10b981','#ec4899','#f59e0b','#ef4444','#0ea5e9']
const avColor   = e => AV_COLORS[(e?.charCodeAt(0) || 0) % AV_COLORS.length]

function deltaColor(n) {
  if (n === null || n === undefined) return 'rgba(255,255,255,0.25)'
  return n >= 0 ? '#34d399' : '#f87171'
}
function deltaLabel(n) {
  if (n === null || n === undefined) return '–'
  return `${n >= 0 ? '+' : ''}${n}%`
}

// ─── Components ───────────────────────────────────────────────────────────────

function Avatar({ email, size = 'sm' }) {
  const sz = size === 'lg' ? 40 : 28
  return (
    <div style={{
      width: sz, height: sz, borderRadius: '50%', flexShrink: 0,
      background: avColor(email), display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: size === 'lg' ? 15 : 11,
      fontWeight: 700, color: '#fff',
    }}>
      {(email?.[0] || '?').toUpperCase()}
    </div>
  )
}

function PlatformBadge({ platform }) {
  const c = gp(platform)
  return (
    <span style={{
      fontSize: 10, padding: '2px 6px', borderRadius: 5, fontWeight: 600,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      {platform}
    </span>
  )
}

// Animated number
function Num({ value, prefix = '', suffix = '', delay = 0 }) {
  const v = useCountUp(typeof value === 'number' ? value : 0, delay)
  if (value === null || value === undefined) return <span>–</span>
  if (typeof value !== 'number') return <span>{value}</span>
  return <span>{prefix}{v.toLocaleString()}{suffix}</span>
}

// Stat card with glow + count-up + entrance animation
function StatCard({ label, value, sub, delta, accent = '#6366f1', delay = 0, children, big }) {
  const ref  = useRef(null)
  const move = e => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div ref={ref} onMouseMove={move} className="anim-up" style={{
      '--mx': '50%', '--my': '50%',
      animationDelay: `${delay}ms`,
      position: 'relative', overflow: 'hidden', borderRadius: 18,
      border: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(255,255,255,0.025)',
      padding: big ? '24px 28px' : '20px 22px',
    }}>
      {/* top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 24, right: 24, height: 1, background: `linear-gradient(90deg,transparent,${accent}66,transparent)` }} />
      {/* mouse glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(260px circle at var(--mx) var(--my), rgba(99,102,241,0.07), transparent 70%)',
        opacity: 0, transition: 'opacity 0.4s',
      }} className="group-hover-glow" />

      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', marginBottom: 8 }}>
          {label}
        </div>
        <div style={{ fontSize: big ? 40 : 30, fontWeight: 800, color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          <Num value={value} delay={delay + 100} />
        </div>
        {sub && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', marginTop: 6 }}>{sub}</div>}
        {delta !== undefined && (
          <div style={{ fontSize: 11, color: deltaColor(delta), marginTop: 4, fontWeight: 600 }}>
            {deltaLabel(delta)} vs last month
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

// 30-day bar chart (SVG)
function BarChart({ data = [], labels = [], color = '#6366f1', height = 56 }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 300); return () => clearTimeout(t) }, [])
  const max = Math.max(...data, 1)
  const w   = 100 / data.length
  return (
    <svg width="100%" height={height} style={{ display: 'block', marginTop: 12, overflow: 'visible' }}>
      {data.map((v, i) => {
        const barH = mounted ? Math.max((v / max) * (height - 16), v > 0 ? 4 : 2) : 2
        const x    = i * w + w * 0.15
        const bw   = w * 0.7
        const isToday = i === data.length - 1
        return (
          <g key={i}>
            <rect
              x={`${x}%`} y={height - 16 - barH} width={`${bw}%`} height={barH}
              rx={2}
              fill={isToday ? color : color + '55'}
              style={{ transition: 'height 0.7s cubic-bezier(0.16,1,0.3,1), y 0.7s cubic-bezier(0.16,1,0.3,1)' }}
            />
            {(i % 7 === 0 || isToday) && (
              <text
                x={`${x + bw / 2}%`} y={height - 2}
                textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.2)"
              >
                {labels[i] ? new Date(labels[i] + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// 6-month bar chart
function MonthlyChart({ data = [], color = '#6366f1', height = 48 }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 500); return () => clearTimeout(t) }, [])
  const max = Math.max(...data.map(d => d.value), 1)
  const w   = 100 / data.length
  return (
    <svg width="100%" height={height + 16} style={{ display: 'block', marginTop: 8, overflow: 'visible' }}>
      {data.map((d, i) => {
        const barH = mounted ? Math.max((d.value / max) * height, d.value > 0 ? 4 : 2) : 2
        const x    = i * w + w * 0.1
        const bw   = w * 0.8
        const isLast = i === data.length - 1
        return (
          <g key={i}>
            <rect
              x={`${x}%`} y={height - barH} width={`${bw}%`} height={barH}
              rx={3}
              fill={isLast ? color : color + '66'}
              style={{ transition: 'height 0.7s cubic-bezier(0.16,1,0.3,1), y 0.7s cubic-bezier(0.16,1,0.3,1)' }}
            />
            <text x={`${x + bw / 2}%`} y={height + 14} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.28)">
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// Animated horizontal bar
function PlatformRow({ platform, count, maxCount, delay = 0 }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), delay + 200); return () => clearTimeout(t) }, [delay])
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0
  const c   = gp(platform)
  return (
    <div className="anim-up" style={{ animationDelay: `${delay}ms`, display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'capitalize', width: 60, flexShrink: 0, color: c.text }}>
        {platform}
      </span>
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 99, height: 5, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 99, background: c.bar,
          width: mounted ? `${pct}%` : '0%',
          transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', width: 28, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
        {count}
      </span>
    </div>
  )
}

// Sort table header
function SortTh({ label, col, sort, dir, onClick }) {
  const active = sort === col
  return (
    <th onClick={onClick} style={{
      textAlign: 'left', padding: '12px 16px', cursor: 'pointer', userSelect: 'none',
      whiteSpace: 'nowrap', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: active ? '#a5b4fc' : 'rgba(255,255,255,0.28)',
      transition: 'color 0.2s',
    }}>
      {label} {active && <span style={{ opacity: 0.5 }}>{dir === 'desc' ? '↓' : '↑'}</span>}
    </th>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router     = useRouter()
  const sessRef    = useRef(null)

  const [session,        setSession]        = useState(null)
  const [data,           setData]           = useState(null)
  const [loading,        setLoading]        = useState(true)
  const [filter,         setFilter]         = useState('all')
  const [search,         setSearch]         = useState('')
  const [sort,           setSort]           = useState('joined')
  const [sortDir,        setSortDir]        = useState('desc')
  const [countdown,      setCountdown]      = useState(20)
  const [paused,         setPaused]         = useState(false)
  const [lastFetched,    setLastFetched]    = useState(null)
  const [showActivity,   setShowActivity]   = useState(false)
  const [selectedUser,   setSelectedUser]   = useState(null)
  const [userDetail,     setUserDetail]     = useState(null)
  const [loadingDetail,  setLoadingDetail]  = useState(false)
  const [actionMsg,      setActionMsg]      = useState(null)
  const [chartMode,      setChartMode]      = useState('conversions') // conversions|signups

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
      if (!s) { router.push('/login'); return }
      sessRef.current = s; setSession(s)
    })
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!s) { router.push('/login'); return }
      sessRef.current = s; setSession(s)
    })
    return () => subscription.unsubscribe()
  }, [router])

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    const s = sessRef.current
    if (!s) return
    try {
      const res = await fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${s.access_token}` } })
      if (res.status === 403) { router.push('/dashboard'); return }
      if (!res.ok) return
      setData(await res.json())
      setLastFetched(new Date())
      setCountdown(20)
    } catch {}
    finally { setLoading(false) }
  }, [router])

  useEffect(() => { if (session) fetchData() }, [session]) // eslint-disable-line

  // ── Auto-refresh ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session) return
    const id = setInterval(() => {
      if (paused) return
      setCountdown(p => { if (p <= 1) { fetchData(); return 20 } return p - 1 })
    }, 1000)
    return () => clearInterval(id)
  }, [paused, session, fetchData])

  // ── User modal ────────────────────────────────────────────────────────────
  const openUser = useCallback(async (user) => {
    setSelectedUser(user); setUserDetail(null); setActionMsg(null); setLoadingDetail(true)
    try {
      const res = await fetch(`/api/admin/user/${user.id}`, {
        headers: { Authorization: `Bearer ${sessRef.current?.access_token}` },
      })
      setUserDetail(await res.json())
    } catch {}
    finally { setLoadingDetail(false) }
  }, [])

  const adminAction = async (userId, body) => {
    setActionMsg(null)
    try {
      const res  = await fetch(`/api/admin/user/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessRef.current?.access_token}` },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (json.ok) {
        setActionMsg({ type: 'ok', text: body.action === 'reset_usage' ? 'Usage reset.' : `Plan → ${json.plan}` })
        setData(prev => prev ? {
          ...prev,
          users: prev.users.map(u => u.id !== userId ? u : {
            ...u, ...(body.action === 'reset_usage' ? { images_used_today: 0 } : { plan: body.plan }),
          }),
        } : prev)
        openUser({ ...selectedUser, ...(body.action === 'set_plan' ? { plan: body.plan } : { images_used_today: 0 }) })
      } else {
        setActionMsg({ type: 'err', text: json.error || 'Failed.' })
      }
    } catch { setActionMsg({ type: 'err', text: 'Network error.' }) }
  }

  const today = new Date().toISOString().split('T')[0]

  const filteredUsers = useMemo(() => {
    if (!data?.users) return []
    let u = [...data.users]
    if (filter === 'free')   u = u.filter(x => x.plan === 'free')
    if (filter === 'pro')    u = u.filter(x => x.plan === 'pro')
    if (filter === 'active') u = u.filter(x => x.last_reset_date === today && x.images_used_today > 0)
    if (search.trim()) { const q = search.trim().toLowerCase(); u = u.filter(x => x.email?.toLowerCase().includes(q)) }
    u.sort((a, b) => {
      let d = 0
      if (sort === 'joined')      d = new Date(b.created_at||0)     - new Date(a.created_at||0)
      if (sort === 'last_active') d = new Date(b.last_sign_in_at||0)- new Date(a.last_sign_in_at||0)
      if (sort === 'usage')       d = (b.images_used_today||0)      - (a.images_used_today||0)
      if (sort === 'conversions') d = (b.total_conversions||0)      - (a.total_conversions||0)
      return sortDir === 'desc' ? d : -d
    })
    return u
  }, [data, filter, search, sort, sortDir, today])

  const toggleSort = c => { if (sort === c) setSortDir(d => d==='desc'?'asc':'desc'); else { setSort(c); setSortDir('desc') } }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (!session || loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#060609', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  const { stats = {}, monthly_stats: ms = {}, trends = {}, monthly_history = [], platform_today = {}, platform_alltime = {}, top_users = [], today_activity = [] } = data || {}

  const maxPlatAlltime = Math.max(...Object.values(platform_alltime), 1)

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#060609', color: '#fff', backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.028) 1px, transparent 0)', backgroundSize: '28px 28px' }}>
      <style>{CSS}</style>

      {/* Indigo top line */}
      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent 0%,#6366f1 30%,#8b5cf6 65%,transparent 100%)' }} />

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(6,6,9,0.92)', backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Logo />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 99, background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.22)' }}>
              Admin
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            {lastFetched && <span style={{ display: 'none' }} className="sm-show">{timeAgo(lastFetched)}</span>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: paused ? '#fbbf24' : '#34d399', boxShadow: paused ? 'none' : '0 0 8px #34d399', animation: paused ? 'none' : 'pulse 2s ease infinite' }} />
              <span>{paused ? 'Paused' : `${countdown}s`}</span>
            </div>
            <button onClick={() => setPaused(p => !p)} style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', fontSize: 11, transition: 'all 0.2s' }}>
              {paused ? '▶ Resume' : '⏸'}
            </button>
            <button onClick={fetchData} style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.35)', background: 'transparent', color: '#a5b4fc', cursor: 'pointer', fontSize: 11, transition: 'all 0.2s' }}>
              ↻ Refresh
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Monthly hero ─────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>

          {/* MRR — biggest card */}
          <div className="anim-up" style={{ animationDelay: '0ms', position: 'relative', overflow: 'hidden', borderRadius: 20, border: '1px solid rgba(139,92,246,0.25)', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.06) 100%)', padding: '24px 26px' }}>
            <div style={{ position: 'absolute', top: 0, left: 24, right: 24, height: 1, background: 'linear-gradient(90deg,transparent,#8b5cf6,transparent)' }} />
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a78bfa', marginBottom: 6 }}>
              Monthly recurring revenue
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              €<Num value={stats.mrr_estimate} delay={100} />
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
              <Num value={stats.pro_users} delay={200} /> pro user{stats.pro_users !== 1 ? 's' : ''} × €9/mo
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 6 }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{
                  flex: 1, borderRadius: 4,
                  height: 3,
                  background: i <= Math.min(Math.ceil((stats.pro_users || 0) / 2), 6) ? '#8b5cf6' : 'rgba(255,255,255,0.08)',
                  transition: 'background 0.5s',
                }} />
              ))}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>
              +<Num value={ms.this_month_pro_added} delay={300} /> new pro this month
            </div>
          </div>

          {/* Conversions this month */}
          <StatCard
            label="Conversions this month"
            value={ms.this_month_convs}
            sub={`Last month: ${ms.last_month_convs ?? 0}`}
            delta={ms.conv_delta_pct}
            accent="#6366f1"
            delay={60}
          >
            <MonthlyChart
              data={(monthly_history || []).map(m => ({ label: m.label, value: m.conversions }))}
              color="#6366f1"
              height={42}
            />
          </StatCard>

          {/* Signups this month */}
          <StatCard
            label="New signups this month"
            value={ms.this_month_signups}
            sub={`Last month: ${ms.last_month_signups ?? 0}`}
            delta={ms.signup_delta_pct}
            accent="#3b82f6"
            delay={120}
          >
            <MonthlyChart
              data={(monthly_history || []).map(m => ({ label: m.label, value: m.signups }))}
              color="#3b82f6"
              height={42}
            />
          </StatCard>

          {/* Monthly ARR projection */}
          <StatCard
            label="ARR projection"
            value={stats.mrr_estimate ? stats.mrr_estimate * 12 : 0}
            sub={`€${stats.mrr_estimate ?? 0}/mo × 12`}
            accent="#10b981"
            delay={180}
          />

        </div>

        {/* ── 6 metric cards ───────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
          {[
            { label: 'Total users',    value: stats.total_users,         sub: `+${stats.new_this_week ?? 0} this week`, accent: '#3b82f6' },
            { label: 'Pro users',      value: stats.pro_users,           sub: `${stats.conversion_rate ?? 0}% of total`, accent: '#8b5cf6' },
            { label: 'Free users',     value: stats.free_users,          sub: null,                                     accent: '#6366f1' },
            { label: 'Active today',   value: stats.active_today,        sub: `of ${stats.total_users} users`,          accent: '#10b981' },
            { label: 'Conv. today',    value: stats.conversions_today,   sub: 'files processed',                        accent: '#f59e0b' },
            { label: 'All-time conv.', value: stats.total_conversions,   sub: `avg ${stats.avg_conv_per_user}/user`,    accent: '#6366f1' },
          ].map((c, i) => (
            <StatCard key={c.label} {...c} delay={i * 40} />
          ))}
        </div>

        {/* ── 30-day chart ──────────────────────────────────────────────────── */}
        <div className="anim-up" style={{ animationDelay: '200ms', borderRadius: 18, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
              Last 30 days
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {[['conversions', '#6366f1'], ['signups', '#3b82f6']].map(([mode, color]) => (
                <button key={mode} onClick={() => setChartMode(mode)} style={{
                  padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                  border: chartMode === mode ? `1px solid ${color}66` : '1px solid rgba(255,255,255,0.08)',
                  background: chartMode === mode ? `${color}18` : 'transparent',
                  color: chartMode === mode ? color : 'rgba(255,255,255,0.3)',
                  textTransform: 'capitalize',
                }}>
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
            <Num value={(trends[chartMode] || []).reduce((a, b) => a + b, 0)} />
          </div>
          <BarChart
            data={trends[chartMode] || []}
            labels={trends.labels || []}
            color={chartMode === 'signups' ? '#3b82f6' : '#6366f1'}
            height={64}
          />
        </div>

        {/* ── Platform breakdown + Top users ───────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>

          <div className="anim-up" style={{ animationDelay: '240ms', borderRadius: 18, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Platform breakdown</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>all time</div>
            </div>
            {Object.keys(platform_alltime).length === 0
              ? <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>No data yet.</div>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.entries(platform_alltime).sort(([,a],[,b])=>b-a).map(([p, n], i) => (
                    <PlatformRow key={p} platform={p} count={n} maxCount={maxPlatAlltime} delay={i * 50} />
                  ))}
                </div>
            }
          </div>

          <div className="anim-up" style={{ animationDelay: '280ms', borderRadius: 18, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Top users</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>by conversions</div>
            </div>
            {top_users.length === 0
              ? <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>No data yet.</div>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {top_users.map((u, i) => (
                    <div key={u.id} onClick={() => openUser(u)} className="anim-up" style={{
                      animationDelay: `${280 + i * 50}ms`,
                      display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                      padding: '6px 8px', borderRadius: 10, transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', width: 14, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{i + 1}</span>
                      <Avatar email={u.email} size="sm" />
                      <span style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</span>
                      <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 99, border: '1px solid', fontWeight: 700, flexShrink: 0, ...(u.plan === 'pro' ? { background: 'rgba(139,92,246,0.12)', color: '#c4b5fd', borderColor: 'rgba(139,92,246,0.25)' } : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.25)', borderColor: 'rgba(255,255,255,0.08)' }) }}>
                        {u.plan}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.55)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{u.total_conversions.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>

        {/* ── Today's activity feed ─────────────────────────────────────────── */}
        <div className="anim-up" style={{ animationDelay: '320ms', borderRadius: 18, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}>
          <button onClick={() => setShowActivity(v => !v)} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 22px', background: 'transparent', border: 'none', color: '#fff',
            cursor: 'pointer', textAlign: 'left',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', transition: 'transform 0.2s', display: 'inline-block', transform: showActivity ? 'rotate(90deg)' : 'none' }}>▶</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Today's activity</span>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {Object.entries(platform_today).sort(([,a],[,b])=>b-a).slice(0,4).map(([p,n]) => {
                  const c = gp(p)
                  return (
                    <span key={p} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 5, background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontWeight: 600 }}>
                      {p} ×{n}
                    </span>
                  )
                })}
              </div>
            </div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>{today_activity.length} conversions</span>
          </button>

          {showActivity && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="anim-in">
              <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                {today_activity.length === 0
                  ? <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>No activity yet today.</div>
                  : <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                      <thead style={{ position: 'sticky', top: 0, background: '#07070e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <tr style={{ color: 'rgba(255,255,255,0.22)' }}>
                          {['Time','User','File','Platform','Formats'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '10px 18px', fontWeight: 600, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {today_activity.map((a, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.015)'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            <td style={{ padding: '8px 18px', color: 'rgba(255,255,255,0.28)', whiteSpace: 'nowrap' }}>{timeAgo(a.created_at)}</td>
                            <td style={{ padding: '8px 18px', color: 'rgba(255,255,255,0.5)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.user_email}</td>
                            <td style={{ padding: '8px 18px', color: 'rgba(255,255,255,0.35)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.filename}</td>
                            <td style={{ padding: '8px 18px' }}><PlatformBadge platform={a.platform} /></td>
                            <td style={{ padding: '8px 18px', color: 'rgba(255,255,255,0.22)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(a.formats||[]).join(', ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                }
              </div>
            </div>
          )}
        </div>

        {/* ── Filters + Search ─────────────────────────────────────────────── */}
        <div className="anim-up" style={{ animationDelay: '360ms', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          {[['all','All',data?.users?.length??0],['free','Free',stats.free_users??0],['pro','Pro',stats.pro_users??0],['active','Active today',stats.active_today??0]].map(([val,label,count]) => (
            <button key={val} onClick={() => setFilter(val)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              border: filter === val ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.08)',
              background: filter === val ? 'rgba(99,102,241,0.1)' : 'transparent',
              color: filter === val ? '#a5b4fc' : 'rgba(255,255,255,0.35)',
            }}>
              {label}
              <span style={{ padding: '1px 5px', borderRadius: 6, fontSize: 10, background: filter===val?'rgba(99,102,241,0.2)':'rgba(255,255,255,0.05)', color: filter===val?'#a5b4fc':'rgba(255,255,255,0.25)' }}>
                {count}
              </span>
            </button>
          ))}
          <input
            type="text" placeholder="Search by email…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: 12, outline: 'none', minWidth: 180, maxWidth: 280, transition: 'border-color 0.2s' }}
            onFocus={e=>e.target.style.borderColor='rgba(99,102,241,0.4)'}
            onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.08)'}
          />
          {search && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>{filteredUsers.length} result{filteredUsers.length!==1?'s':''}</span>}
        </div>

        {/* ── Users table ──────────────────────────────────────────────────── */}
        <div className="anim-up" style={{ animationDelay: '400ms', borderRadius: 18, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead style={{ background: '#070710', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>User</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>Plan</th>
                  <SortTh label="Usage today"    col="usage"       sort={sort} dir={sortDir} onClick={()=>toggleSort('usage')} />
                  <SortTh label="All-time conv." col="conversions" sort={sort} dir={sortDir} onClick={()=>toggleSort('conversions')} />
                  <SortTh label="Joined"         col="joined"      sort={sort} dir={sortDir} onClick={()=>toggleSort('joined')} />
                  <SortTh label="Last login"     col="last_active" sort={sort} dir={sortDir} onClick={()=>toggleSort('last_active')} />
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>Auth</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '48px 16px', color: 'rgba(255,255,255,0.18)', fontSize: 13 }}>No users found.</td></tr>
                ) : filteredUsers.map((u) => (
                  <tr key={u.id} onClick={() => openUser(u)} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; e.currentTarget.style.borderLeft = '2px solid #6366f1' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeft = 'none' }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar email={u.email} />
                        <span style={{ color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{u.email}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: 10, padding: '2px 7px', borderRadius: 99, fontWeight: 700, border: '1px solid',
                        ...(u.plan==='pro' ? { background:'rgba(139,92,246,0.12)', color:'#c4b5fd', borderColor:'rgba(139,92,246,0.25)' } : { background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.25)', borderColor:'rgba(255,255,255,0.08)' })
                      }}>{u.plan==='pro'?'Pro':'Free'}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontVariantNumeric: 'tabular-nums' }}>
                      {u.last_reset_date===today && u.images_used_today>0
                        ? <span style={{ color: '#34d399', fontWeight: 700 }}>{u.images_used_today}</span>
                        : <span style={{ color: 'rgba(255,255,255,0.2)' }}>0</span>}
                      {u.plan==='free' && <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11 }}>/10</span>}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.55)', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{u.total_conversions.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.25)', fontSize: 11, whiteSpace: 'nowrap' }}>{timeAgo(u.created_at)}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.25)', fontSize: 11, whiteSpace: 'nowrap' }}>{timeAgo(u.last_sign_in_at)}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.2)', fontSize: 11, textTransform: 'capitalize' }}>{u.provider}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: 10, color: 'rgba(255,255,255,0.14)', textAlign: 'center' }}>
            {filteredUsers.length} user{filteredUsers.length!==1?'s':''} · MetaClean Admin
          </div>
        </div>

      </div>

      {/* ── User detail modal ─────────────────────────────────────────────── */}
      {selectedUser && (
        <div className="anim-in" onClick={() => setSelectedUser(null)} style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'rgba(4,4,8,0.88)', backdropFilter: 'blur(24px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div className="anim-scale" onClick={e=>e.stopPropagation()} style={{
            width: '100%', maxWidth: 520, maxHeight: '90vh',
            borderRadius: 22, border: '1px solid rgba(255,255,255,0.09)',
            background: '#09090f', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          }}>
            {/* indigo line */}
            <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#6366f1,#8b5cf6,transparent)', flexShrink: 0 }} />

            {/* Header */}
            <div style={{ padding: '20px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'flex-start', gap: 12, flexShrink: 0 }}>
              <Avatar email={selectedUser.email} size="lg" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedUser.email}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, fontWeight: 700, border: '1px solid', ...(selectedUser.plan==='pro' ? { background:'rgba(139,92,246,0.12)', color:'#c4b5fd', borderColor:'rgba(139,92,246,0.25)' } : { background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.3)', borderColor:'rgba(255,255,255,0.08)' }) }}>
                    {selectedUser.plan==='pro'?'Pro':'Free'}
                  </span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Joined {fmtDate(selectedUser.created_at)}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>·</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{timeAgo(selectedUser.last_sign_in_at)}</span>
                </div>
              </div>
              <button onClick={()=>setSelectedUser(null)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.25)', cursor:'pointer', fontSize:18, lineHeight:1, padding:4, flexShrink:0, transition:'color 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.6)'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.25)'}>✕</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Quick stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {[
                  { l: 'All-time conv.',  v: selectedUser.total_conversions?.toLocaleString() },
                  { l: 'Used today',      v: selectedUser.last_reset_date===today ? selectedUser.images_used_today : 0 },
                  { l: 'Provider',        v: selectedUser.provider, cap: true },
                ].map(({ l, v, cap }) => (
                  <div key={l} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', textTransform: cap?'capitalize':'none', fontVariantNumeric: 'tabular-nums' }}>{v??'–'}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Platform breakdown */}
              {!loadingDetail && userDetail?.platform_breakdown && Object.keys(userDetail.platform_breakdown).length > 0 && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 10 }}>Breakdown</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {Object.entries(userDetail.platform_breakdown).sort(([,a],[,b])=>b-a).map(([p,n]) => (
                      <PlatformRow key={p} platform={p} count={n} maxCount={Math.max(...Object.values(userDetail.platform_breakdown),1)} />
                    ))}
                  </div>
                </div>
              )}

              {/* Admin actions */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 10 }}>Admin actions</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {[
                    { label: '↺ Reset usage', action: () => adminAction(selectedUser.id, { action: 'reset_usage' }), style: { border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.45)' } },
                    selectedUser.plan==='free'
                      ? { label: '↑ Set Pro',   action: () => adminAction(selectedUser.id, { action:'set_plan', plan:'pro' }),  style: { border:'1px solid rgba(139,92,246,0.35)', color:'#c4b5fd' } }
                      : { label: '↓ Set Free',  action: () => adminAction(selectedUser.id, { action:'set_plan', plan:'free' }), style: { border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.4)' } },
                    { label: '⎘ Copy email', action: () => { navigator.clipboard.writeText(selectedUser.email); setActionMsg({type:'ok',text:'Copied.'}) }, style: { border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.45)' } },
                  ].map(btn => (
                    <button key={btn.label} onClick={btn.action} style={{ padding:'7px 13px', borderRadius:10, background:'transparent', fontSize:12, fontWeight:600, cursor:'pointer', transition:'all 0.2s', ...btn.style }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      {btn.label}
                    </button>
                  ))}
                </div>
                {actionMsg && (
                  <div className="anim-up" style={{ marginTop: 8, fontSize: 12, padding: '7px 12px', borderRadius: 9, border: '1px solid', ...(actionMsg.type==='ok' ? { background:'rgba(52,211,153,0.07)', borderColor:'rgba(52,211,153,0.25)', color:'#6ee7b7' } : { background:'rgba(248,113,113,0.07)', borderColor:'rgba(248,113,113,0.25)', color:'#fca5a5' }) }}>
                    {actionMsg.text}
                  </div>
                )}
              </div>

              {/* History */}
              <div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)' }}>Conversion history</div>
                  {userDetail && <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)' }}>{userDetail.total_conversions?.toLocaleString()} total · last {Math.min(userDetail.conversions?.length||0,100)}</div>}
                </div>
                {loadingDetail
                  ? <div style={{ display:'flex', justifyContent:'center', padding:'24px 0' }}><div style={{ width:20, height:20, border:'2px solid #6366f1', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} /></div>
                  : <div style={{ borderRadius:12, border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden' }}>
                      <div style={{ maxHeight:240, overflowY:'auto' }}>
                        {!userDetail?.conversions?.length
                          ? <div style={{ padding:20, textAlign:'center', color:'rgba(255,255,255,0.2)', fontSize:13 }}>No conversions yet.</div>
                          : <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11 }}>
                              <thead style={{ position:'sticky', top:0, background:'#060609', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                                <tr style={{ color:'rgba(255,255,255,0.22)' }}>
                                  {['Time','File','Platform','Formats'].map(h=>(
                                    <th key={h} style={{ textAlign:'left', padding:'8px 12px', fontWeight:600, fontSize:10, letterSpacing:'0.06em', textTransform:'uppercase' }}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {userDetail.conversions.map((c,i)=>(
                                  <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}
                                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.015)'}
                                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                                    <td style={{ padding:'8px 12px', color:'rgba(255,255,255,0.28)', whiteSpace:'nowrap' }}>{timeAgo(c.created_at)}</td>
                                    <td style={{ padding:'8px 12px', color:'rgba(255,255,255,0.5)', maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.filename}</td>
                                    <td style={{ padding:'8px 12px' }}><PlatformBadge platform={c.platform} /></td>
                                    <td style={{ padding:'8px 12px', color:'rgba(255,255,255,0.2)', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{(c.formats||[]).join(', ')}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                        }
                      </div>
                    </div>
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
