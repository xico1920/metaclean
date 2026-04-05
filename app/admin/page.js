'use client'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Logo from '@/app/components/Logo'

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  if (!dateStr) return '–'
  const diff = Date.now() - new Date(dateStr).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 5)  return 'Just now'
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function fmtDate(dateStr) {
  if (!dateStr) return '–'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function shortDay(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00Z')
  return d.toLocaleDateString('en-GB', { weekday: 'short' }).slice(0, 1)
}

const PLATFORM_COLORS = {
  meta:      { bg: 'bg-blue-500/15',    text: 'text-blue-300',    border: 'border-blue-500/25',    bar: '#3b82f6' },
  google:    { bg: 'bg-red-500/15',     text: 'text-red-300',     border: 'border-red-500/25',     bar: '#ef4444' },
  tiktok:    { bg: 'bg-pink-500/15',    text: 'text-pink-300',    border: 'border-pink-500/25',    bar: '#ec4899' },
  snapchat:  { bg: 'bg-yellow-500/15',  text: 'text-yellow-300',  border: 'border-yellow-500/25',  bar: '#eab308' },
  pinterest: { bg: 'bg-rose-500/15',    text: 'text-rose-300',    border: 'border-rose-500/25',    bar: '#f43f5e' },
  linkedin:  { bg: 'bg-sky-500/15',     text: 'text-sky-300',     border: 'border-sky-500/25',     bar: '#0ea5e9' },
  clean:     { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/25', bar: '#10b981' },
}
const DEFAULT_PLATFORM = { bg: 'bg-white/5', text: 'text-white/40', border: 'border-white/10', bar: '#6366f1' }

function getPlatform(p) { return PLATFORM_COLORS[p] || DEFAULT_PLATFORM }

const AVATAR_COLORS = ['#6366f1','#3b82f6','#8b5cf6','#10b981','#ec4899','#f59e0b','#ef4444','#0ea5e9']
function avatarColor(email) { return AVATAR_COLORS[(email?.charCodeAt(0) || 0) % AVATAR_COLORS.length] }

// ── Sub-components ────────────────────────────────────────────────────────────

// Stat card with mouse-follow glow
function StatCard({ label, value, sub, accent = '#6366f1', children }) {
  const ref = useRef(null)
  const onMouseMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 group"
      style={{ '--mx': '50%', '--my': '50%' }}
    >
      {/* glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(250px circle at var(--mx) var(--my), rgba(99,102,241,0.07), transparent 70%)' }}
      />
      {/* accent top line */}
      <div className="absolute top-0 left-6 right-6 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}55, transparent)` }} />

      <div className="relative">
        <div className="text-[11px] font-semibold text-white/35 uppercase tracking-widest mb-2">{label}</div>
        <div className="text-3xl font-bold text-white tabular-nums leading-none">{value ?? '–'}</div>
        {sub  && <div className="text-xs text-white/35 mt-1.5">{sub}</div>}
        {children}
      </div>
    </div>
  )
}

// Spark bar chart (7 bars)
function SparkBars({ data = [], color = '#6366f1', labels = [] }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-1 h-10 mt-3">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group/bar">
          <div
            className="w-full rounded-t-sm transition-all duration-300"
            style={{
              height: `${Math.max((v / max) * 100, v > 0 ? 8 : 2)}%`,
              background: color,
              opacity: i === data.length - 1 ? 1 : 0.3 + (i / data.length) * 0.5,
            }}
          />
          {labels[i] && (
            <div className="text-[9px] text-white/20 leading-none">{shortDay(labels[i])}</div>
          )}
        </div>
      ))}
    </div>
  )
}

// Horizontal bar for platform breakdown
function PlatformRow({ platform, count, maxCount }) {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0
  const c = getPlatform(platform)
  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs font-medium capitalize w-16 flex-shrink-0 ${c.text}`}>{platform}</span>
      <div className="flex-1 bg-white/[0.04] rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: c.bar }}
        />
      </div>
      <span className="text-xs text-white/35 w-8 text-right tabular-nums">{count}</span>
    </div>
  )
}

// Sort table header
function SortTh({ label, col, sort, dir, onClick, className = '' }) {
  const active = sort === col
  return (
    <th
      className={`text-left px-4 py-3 cursor-pointer select-none whitespace-nowrap transition-colors ${className} ${active ? 'text-indigo-400' : 'text-white/30 hover:text-white/55'}`}
      onClick={onClick}
    >
      <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      {active && <span className="ml-1 text-white/40">{dir === 'desc' ? '↓' : '↑'}</span>}
    </th>
  )
}

// User avatar (initials)
function Avatar({ email, size = 'sm' }) {
  const sz = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ background: avatarColor(email) }}
    >
      {(email?.[0] || '?').toUpperCase()}
    </div>
  )
}

// Platform badge
function PlatformBadge({ platform }) {
  const c = getPlatform(platform)
  return (
    <span className={`inline-flex text-[10px] px-1.5 py-0.5 rounded border font-semibold ${c.bg} ${c.text} ${c.border}`}>
      {platform}
    </span>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router     = useRouter()
  const sessionRef = useRef(null)

  const [session,       setSession]       = useState(null)
  const [data,          setData]          = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [filter,        setFilter]        = useState('all')
  const [search,        setSearch]        = useState('')
  const [sort,          setSort]          = useState('joined')
  const [sortDir,       setSortDir]       = useState('desc')
  const [countdown,     setCountdown]     = useState(20)
  const [paused,        setPaused]        = useState(false)
  const [lastFetched,   setLastFetched]   = useState(null)
  const [showActivity,  setShowActivity]  = useState(false)
  const [selectedUser,  setSelectedUser]  = useState(null)
  const [userDetail,    setUserDetail]    = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [actionMsg,     setActionMsg]     = useState(null)

  // ── Auth ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
      if (!s) { router.push('/login'); return }
      sessionRef.current = s
      setSession(s)
    })
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!s) { router.push('/login'); return }
      sessionRef.current = s
      setSession(s)
    })
    return () => subscription.unsubscribe()
  }, [router])

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    const sess = sessionRef.current
    if (!sess) return
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${sess.access_token}` },
      })
      if (res.status === 403) { router.push('/dashboard'); return }
      if (!res.ok) return
      setData(await res.json())
      setLastFetched(new Date())
      setCountdown(20)
    } catch {}
    finally { setLoading(false) }
  }, [router])

  useEffect(() => { if (session) fetchData() }, [session]) // eslint-disable-line

  // ── Auto-refresh ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!session) return
    const id = setInterval(() => {
      if (paused) return
      setCountdown(prev => { if (prev <= 1) { fetchData(); return 20 } return prev - 1 })
    }, 1000)
    return () => clearInterval(id)
  }, [paused, session, fetchData])

  // ── User detail modal ────────────────────────────────────────────────────────
  const openUser = useCallback(async (user) => {
    setSelectedUser(user)
    setUserDetail(null)
    setActionMsg(null)
    setLoadingDetail(true)
    try {
      const res = await fetch(`/api/admin/user/${user.id}`, {
        headers: { Authorization: `Bearer ${sessionRef.current?.access_token}` },
      })
      setUserDetail(await res.json())
    } catch {}
    finally { setLoadingDetail(false) }
  }, [])

  const adminAction = async (userId, body) => {
    setActionMsg(null)
    try {
      const res = await fetch(`/api/admin/user/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionRef.current?.access_token}` },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (json.ok) {
        setActionMsg({ type: 'ok', text: body.action === 'reset_usage' ? 'Usage reset.' : `Plan → ${json.plan}.` })
        setData(prev => prev ? {
          ...prev,
          users: prev.users.map(u => u.id !== userId ? u : {
            ...u,
            ...(body.action === 'reset_usage' ? { images_used_today: 0 } : { plan: body.plan }),
          }),
        } : prev)
        openUser({ ...selectedUser, ...(body.action === 'set_plan' ? { plan: body.plan } : { images_used_today: 0 }) })
      } else {
        setActionMsg({ type: 'err', text: json.error || 'Failed.' })
      }
    } catch {
      setActionMsg({ type: 'err', text: 'Network error.' })
    }
  }

  // ── Filtered users ──────────────────────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0]

  const filteredUsers = useMemo(() => {
    if (!data?.users) return []
    let users = [...data.users]
    if (filter === 'free')   users = users.filter(u => u.plan === 'free')
    if (filter === 'pro')    users = users.filter(u => u.plan === 'pro')
    if (filter === 'active') users = users.filter(u => u.last_reset_date === today && u.images_used_today > 0)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      users = users.filter(u => u.email?.toLowerCase().includes(q))
    }
    users.sort((a, b) => {
      let diff = 0
      if (sort === 'joined')      diff = new Date(b.created_at || 0)      - new Date(a.created_at || 0)
      if (sort === 'last_active') diff = new Date(b.last_sign_in_at || 0) - new Date(a.last_sign_in_at || 0)
      if (sort === 'usage')       diff = (b.images_used_today || 0)       - (a.images_used_today || 0)
      if (sort === 'conversions') diff = (b.total_conversions || 0)       - (a.total_conversions || 0)
      return sortDir === 'desc' ? diff : -diff
    })
    return users
  }, [data, filter, search, sort, sortDir, today])

  const toggleSort = (col) => {
    if (sort === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSort(col); setSortDir('desc') }
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (!session || loading) {
    return (
      <div className="min-h-screen bg-[#060609] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const { stats = {}, trends = {}, platform_today = {}, platform_alltime = {}, top_users = [], today_activity = [] } = data || {}

  const maxPlatformAlltime = Math.max(...Object.values(platform_alltime), 1)
  const maxPlatformToday   = Math.max(...Object.values(platform_today),   1)

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#060609] text-white" style={{
      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
      backgroundSize: '28px 28px',
    }}>

      {/* ── Top indigo line ─────────────────────────────────────────────── */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent 0%, #6366f1 30%, #8b5cf6 60%, transparent 100%)' }} />

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#060609]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', borderColor: 'rgba(239,68,68,0.25)' }}>
              Admin
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-white/35">
            {lastFetched && <span className="hidden md:block">{timeAgo(lastFetched)}</span>}
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${paused ? 'bg-yellow-400' : 'bg-emerald-400 animate-pulse'}`} />
              <span>{paused ? 'Paused' : `${countdown}s`}</span>
            </div>
            <button onClick={() => setPaused(p => !p)}
              className="px-2.5 py-1 rounded-lg border border-white/[0.08] hover:border-white/15 hover:bg-white/[0.03] transition-all">
              {paused ? '▶' : '⏸'}
            </button>
            <button onClick={fetchData}
              className="px-2.5 py-1 rounded-lg border border-indigo-500/30 text-indigo-400/80 hover:bg-indigo-500/[0.08] transition-all">
              ↻
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-8 space-y-6">

        {/* ── Stat cards ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          <StatCard label="Total users"    value={stats.total_users}  sub={`+${stats.new_this_week || 0} this week`} accent="#3b82f6" />
          <StatCard label="Pro"            value={stats.pro_users}    sub={`€${stats.mrr_estimate || 0}/mo MRR`}     accent="#8b5cf6" />
          <StatCard label="Free"           value={stats.free_users}   sub={`${stats.conversion_rate || 0}% conv. rate`} accent="#6366f1" />
          <StatCard label="Active today"   value={stats.active_today} sub={`of ${stats.total_users} users`}         accent="#10b981" />
          <StatCard label="Conv. today"    value={stats.conversions_today} sub="files processed"                    accent="#f59e0b" />
          <StatCard label="All-time conv." value={stats.total_conversions?.toLocaleString()} sub={`avg ${stats.avg_conv_per_user}/user`} accent="#6366f1" />
        </div>

        {/* ── Trend charts ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-semibold text-white/35 uppercase tracking-widest">New signups</div>
              <div className="text-xs text-white/25">last 7 days</div>
            </div>
            <div className="text-2xl font-bold text-white tabular-nums">{stats.new_this_week || 0}</div>
            <SparkBars data={trends.signups || []} labels={trends.labels || []} color="#6366f1" />
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-semibold text-white/35 uppercase tracking-widest">Conversions</div>
              <div className="text-xs text-white/25">last 7 days</div>
            </div>
            <div className="text-2xl font-bold text-white tabular-nums">
              {(trends.conversions || []).reduce((a, b) => a + b, 0)}
            </div>
            <SparkBars data={trends.conversions || []} labels={trends.labels || []} color="#8b5cf6" />
          </div>
        </div>

        {/* ── Platform + Top users ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* All-time platform breakdown */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-semibold text-white/35 uppercase tracking-widest">Platform breakdown</div>
              <div className="text-xs text-white/25">all time</div>
            </div>
            {Object.keys(platform_alltime).length === 0 ? (
              <div className="text-white/20 text-sm">No data yet.</div>
            ) : (
              <div className="space-y-3">
                {Object.entries(platform_alltime)
                  .sort(([, a], [, b]) => b - a)
                  .map(([p, count]) => (
                    <PlatformRow key={p} platform={p} count={count} maxCount={maxPlatformAlltime} />
                  ))}
              </div>
            )}
          </div>

          {/* Top users */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-semibold text-white/35 uppercase tracking-widest">Top users</div>
              <div className="text-xs text-white/25">by conversions</div>
            </div>
            {top_users.length === 0 ? (
              <div className="text-white/20 text-sm">No data yet.</div>
            ) : (
              <div className="space-y-3">
                {top_users.map((u, i) => (
                  <div key={u.id} className="flex items-center gap-3 cursor-pointer group/top"
                    onClick={() => openUser(u)}>
                    <div className="text-xs text-white/20 w-4 text-right tabular-nums">{i + 1}</div>
                    <Avatar email={u.email} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white/70 truncate group-hover/top:text-white transition-colors">{u.email}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${
                        u.plan === 'pro'
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/25'
                          : 'bg-white/[0.04] text-white/25 border-white/[0.08]'
                      }`}>{u.plan}</span>
                      <span className="text-sm font-semibold text-white/60 tabular-nums">{u.total_conversions.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Today's activity feed ────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
          <button
            onClick={() => setShowActivity(v => !v)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.015] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className={`text-xs text-white/30 transition-transform duration-200 ${showActivity ? 'rotate-90' : ''}`}>▶</span>
              <span className="text-sm font-medium text-white/60">Today's activity</span>
              {Object.keys(platform_today).length > 0 && (
                <div className="flex gap-1.5">
                  {Object.entries(platform_today).sort(([,a],[,b]) => b-a).slice(0,4).map(([p, n]) => {
                    const c = getPlatform(p)
                    return (
                      <span key={p} className={`text-[10px] px-1.5 py-0.5 rounded border ${c.bg} ${c.text} ${c.border}`}>
                        {p} ×{n}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
            <span className="text-xs text-white/25">{today_activity.length} conversions</span>
          </button>

          {showActivity && (
            <div className="border-t border-white/[0.06]">
              <div className="max-h-64 overflow-y-auto">
                {today_activity.length === 0 ? (
                  <div className="p-6 text-center text-white/25 text-sm">No activity yet today.</div>
                ) : (
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 border-b border-white/[0.06]" style={{ background: '#070710' }}>
                      <tr className="text-white/25">
                        <th className="text-left px-5 py-2.5 font-medium">Time</th>
                        <th className="text-left px-5 py-2.5 font-medium">User</th>
                        <th className="text-left px-5 py-2.5 font-medium">File</th>
                        <th className="text-left px-5 py-2.5 font-medium">Platform</th>
                        <th className="text-left px-5 py-2.5 font-medium hidden sm:table-cell">Formats</th>
                      </tr>
                    </thead>
                    <tbody>
                      {today_activity.map((a, i) => (
                        <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.015]">
                          <td className="px-5 py-2 text-white/30 whitespace-nowrap">{timeAgo(a.created_at)}</td>
                          <td className="px-5 py-2 text-white/50 max-w-[160px] truncate">{a.user_email}</td>
                          <td className="px-5 py-2 text-white/35 max-w-[140px] truncate">{a.filename}</td>
                          <td className="px-5 py-2"><PlatformBadge platform={a.platform} /></td>
                          <td className="px-5 py-2 text-white/25 hidden sm:table-cell max-w-[160px] truncate">{(a.formats || []).join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Filters + Search ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            ['all',    `All`,             data?.users?.length ?? 0],
            ['free',   `Free`,            stats.free_users  ?? 0],
            ['pro',    `Pro`,             stats.pro_users   ?? 0],
            ['active', `Active today`,    stats.active_today ?? 0],
          ].map(([val, label, count]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                filter === val
                  ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                  : 'text-white/35 border-white/[0.07] hover:border-white/15 hover:text-white/55'
              }`}>
              {label}
              <span className={`px-1 py-0.5 rounded text-[10px] ${filter === val ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/[0.04] text-white/25'}`}>
                {count}
              </span>
            </button>
          ))}

          <div className="flex-1 min-w-[180px] max-w-sm ml-auto">
            <input
              type="text"
              placeholder="Search by email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-3.5 py-1.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40 transition-colors"
            />
          </div>
          {search && (
            <span className="text-xs text-white/25">{filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {/* ── Users table ──────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/[0.06]" style={{ background: '#070710' }}>
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-white/25 uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-white/25 uppercase tracking-wider">Plan</th>
                  <SortTh label="Usage today"    col="usage"       sort={sort} dir={sortDir} onClick={() => toggleSort('usage')} />
                  <SortTh label="All-time conv." col="conversions" sort={sort} dir={sortDir} onClick={() => toggleSort('conversions')} />
                  <SortTh label="Joined"         col="joined"      sort={sort} dir={sortDir} onClick={() => toggleSort('joined')} />
                  <SortTh label="Last login"     col="last_active" sort={sort} dir={sortDir} onClick={() => toggleSort('last_active')} />
                  <th className="text-left px-4 py-3 text-xs font-semibold text-white/25 uppercase tracking-wider hidden sm:table-cell">Provider</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-white/20 text-sm">No users found.</td></tr>
                ) : filteredUsers.map(u => (
                  <tr key={u.id} onClick={() => openUser(u)}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] cursor-pointer transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar email={u.email} size="sm" />
                        <span className="text-white/70 group-hover:text-white transition-colors truncate max-w-[180px] sm:max-w-xs text-sm">
                          {u.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${
                        u.plan === 'pro'
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/25'
                          : 'bg-white/[0.04] text-white/25 border-white/[0.08]'
                      }`}>
                        {u.plan === 'pro' ? 'Pro' : 'Free'}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {u.last_reset_date === today && u.images_used_today > 0
                        ? <span className="text-emerald-400 font-semibold">{u.images_used_today}</span>
                        : <span className="text-white/20">0</span>}
                      {u.plan === 'free' && <span className="text-white/15 text-xs"> /10</span>}
                    </td>
                    <td className="px-4 py-3 text-white/50 tabular-nums font-medium">{u.total_conversions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-white/25 text-xs whitespace-nowrap">{timeAgo(u.created_at)}</td>
                    <td className="px-4 py-3 text-white/25 text-xs whitespace-nowrap">{timeAgo(u.last_sign_in_at)}</td>
                    <td className="px-4 py-3 text-white/20 text-xs capitalize hidden sm:table-cell">{u.provider}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center text-xs text-white/15 pb-4">
          {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} shown · MetaClean Admin
        </div>
      </div>

      {/* ── User detail modal ─────────────────────────────────────────────── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(4,4,8,0.92)', backdropFilter: 'blur(20px)' }}
          onClick={() => setSelectedUser(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] overflow-hidden flex flex-col max-h-[88vh] shadow-2xl"
            style={{ background: '#09090f' }}
            onClick={e => e.stopPropagation()}>

            {/* Indigo accent line */}
            <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #6366f1, #8b5cf6, transparent)' }} />

            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar email={selectedUser.email} size="lg" />
                <div className="min-w-0">
                  <div className="font-semibold text-white truncate">{selectedUser.email}</div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${
                      selectedUser.plan === 'pro'
                        ? 'bg-purple-500/15 text-purple-300 border-purple-500/25'
                        : 'bg-white/[0.04] text-white/30 border-white/[0.08]'
                    }`}>{selectedUser.plan === 'pro' ? 'Pro' : 'Free'}</span>
                    <span className="text-xs text-white/25">Joined {fmtDate(selectedUser.created_at)}</span>
                    <span className="text-xs text-white/15">·</span>
                    <span className="text-xs text-white/25">{timeAgo(selectedUser.last_sign_in_at)}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)}
                className="text-white/25 hover:text-white/60 transition-colors ml-3 text-lg flex-shrink-0">✕</button>
            </div>

            <div className="overflow-y-auto flex-1 p-5 space-y-5">

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { label: 'All-time conv.', value: selectedUser.total_conversions?.toLocaleString() },
                  { label: 'Used today',     value: selectedUser.last_reset_date === today ? selectedUser.images_used_today : 0 },
                  { label: 'Provider',       value: selectedUser.provider, capitalize: true },
                ].map(({ label, value, capitalize }) => (
                  <div key={label} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 text-center">
                    <div className={`text-xl font-bold text-white ${capitalize ? 'capitalize' : 'tabular-nums'}`}>{value ?? '–'}</div>
                    <div className="text-[10px] text-white/30 mt-1 uppercase tracking-wider">{label}</div>
                  </div>
                ))}
              </div>

              {/* Platform breakdown */}
              {!loadingDetail && userDetail?.platform_breakdown && Object.keys(userDetail.platform_breakdown).length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-white/25 uppercase tracking-widest mb-3">Platform breakdown</div>
                  <div className="space-y-2.5">
                    {Object.entries(userDetail.platform_breakdown)
                      .sort(([,a],[,b]) => b-a)
                      .map(([p, n]) => (
                        <PlatformRow key={p} platform={p} count={n}
                          maxCount={Math.max(...Object.values(userDetail.platform_breakdown), 1)} />
                      ))}
                  </div>
                </div>
              )}

              {/* Admin actions */}
              <div>
                <div className="text-[11px] font-semibold text-white/25 uppercase tracking-widest mb-2.5">Admin actions</div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => adminAction(selectedUser.id, { action: 'reset_usage' })}
                    className="px-3 py-1.5 rounded-xl border border-white/[0.08] text-white/40 text-xs hover:border-white/15 hover:text-white/60 transition-all">
                    ↺ Reset usage
                  </button>
                  {selectedUser.plan === 'free' ? (
                    <button onClick={() => adminAction(selectedUser.id, { action: 'set_plan', plan: 'pro' })}
                      className="px-3 py-1.5 rounded-xl border border-purple-500/30 text-purple-300 text-xs hover:bg-purple-500/[0.08] transition-all">
                      ↑ Set Pro
                    </button>
                  ) : (
                    <button onClick={() => adminAction(selectedUser.id, { action: 'set_plan', plan: 'free' })}
                      className="px-3 py-1.5 rounded-xl border border-white/[0.08] text-white/35 text-xs hover:border-white/15 transition-all">
                      ↓ Set Free
                    </button>
                  )}
                  <button onClick={() => { navigator.clipboard.writeText(selectedUser.email); setActionMsg({ type: 'ok', text: 'Copied.' }) }}
                    className="px-3 py-1.5 rounded-xl border border-white/[0.08] text-white/40 text-xs hover:border-white/15 hover:text-white/60 transition-all">
                    ⎘ Copy email
                  </button>
                </div>
                {actionMsg && (
                  <div className={`mt-2 text-xs px-3 py-1.5 rounded-lg border ${
                    actionMsg.type === 'ok'
                      ? 'bg-emerald-500/[0.08] border-emerald-500/25 text-emerald-400'
                      : 'bg-red-500/[0.08] border-red-500/25 text-red-400'
                  }`}>{actionMsg.text}</div>
                )}
              </div>

              {/* Conversion history */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="text-[11px] font-semibold text-white/25 uppercase tracking-widest">Conversion history</div>
                  {userDetail && (
                    <div className="text-[10px] text-white/20">
                      {userDetail.total_conversions?.toLocaleString()} total · showing {Math.min(userDetail.conversions?.length || 0, 100)}
                    </div>
                  )}
                </div>

                {loadingDetail ? (
                  <div className="flex justify-center py-8">
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/[0.06] overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      {!userDetail?.conversions?.length ? (
                        <div className="p-5 text-center text-white/20 text-sm">No conversions yet.</div>
                      ) : (
                        <table className="w-full text-xs">
                          <thead className="sticky top-0 border-b border-white/[0.06]" style={{ background: '#060609' }}>
                            <tr className="text-white/20">
                              <th className="text-left px-3.5 py-2 font-medium">Time</th>
                              <th className="text-left px-3.5 py-2 font-medium">File</th>
                              <th className="text-left px-3.5 py-2 font-medium">Platform</th>
                              <th className="text-left px-3.5 py-2 font-medium hidden sm:table-cell">Formats</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userDetail.conversions.map((c, i) => (
                              <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.015]">
                                <td className="px-3.5 py-2 text-white/25 whitespace-nowrap">{timeAgo(c.created_at)}</td>
                                <td className="px-3.5 py-2 text-white/50 max-w-[140px] truncate">{c.filename}</td>
                                <td className="px-3.5 py-2"><PlatformBadge platform={c.platform} /></td>
                                <td className="px-3.5 py-2 text-white/20 max-w-[160px] truncate hidden sm:table-cell">{(c.formats || []).join(', ')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
