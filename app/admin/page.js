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
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function fmtDate(dateStr) {
  if (!dateStr) return '–'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const PLATFORM_COLORS = {
  meta:      'bg-blue-500/20 text-blue-300 border-blue-500/30',
  google:    'bg-red-500/20 text-red-300 border-red-500/30',
  tiktok:    'bg-pink-500/20 text-pink-300 border-pink-500/30',
  snapchat:  'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  pinterest: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  linkedin:  'bg-sky-500/20 text-sky-300 border-sky-500/30',
  clean:     'bg-green-500/20 text-green-300 border-green-500/30',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }) {
  const palette = {
    blue:    'from-blue-500/10 to-transparent    border-blue-500/20    text-blue-400',
    purple:  'from-purple-500/10 to-transparent  border-purple-500/20  text-purple-400',
    indigo:  'from-indigo-500/10 to-transparent  border-indigo-500/20  text-indigo-400',
    green:   'from-green-500/10 to-transparent   border-green-500/20   text-green-400',
    yellow:  'from-yellow-500/10 to-transparent  border-yellow-500/20  text-yellow-400',
    emerald: 'from-emerald-500/10 to-transparent border-emerald-500/20 text-emerald-400',
  }
  return (
    <div className={`rounded-xl border bg-gradient-to-br p-4 ${palette[color] || palette.indigo}`}>
      <div className="text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-bold text-white tabular-nums">{value ?? '–'}</div>
      {sub && <div className="text-xs text-white/40 mt-1">{sub}</div>}
    </div>
  )
}

function SortTh({ label, col, sort, dir, onClick }) {
  const active = sort === col
  return (
    <th
      className="text-left px-4 py-3 cursor-pointer select-none hover:text-white/70 transition-colors whitespace-nowrap"
      onClick={onClick}
    >
      <span className={active ? 'text-indigo-400' : 'text-white/40'}>{label}</span>
      {active && <span className="ml-1 text-white/30">{dir === 'desc' ? '↓' : '↑'}</span>}
    </th>
  )
}

function PlatformBadge({ platform }) {
  const cls = PLATFORM_COLORS[platform] || 'bg-white/10 text-white/40 border-white/10'
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${cls}`}>
      {platform}
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter()
  const sessionRef = useRef(null)

  const [session,      setSession]      = useState(null)
  const [data,         setData]         = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [filter,       setFilter]       = useState('all')   // all|free|pro|active
  const [search,       setSearch]       = useState('')
  const [sort,         setSort]         = useState('joined')
  const [sortDir,      setSortDir]      = useState('desc')
  const [countdown,    setCountdown]    = useState(20)
  const [paused,       setPaused]       = useState(false)
  const [lastFetched,  setLastFetched]  = useState(null)
  const [showActivity, setShowActivity] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetail,   setUserDetail]   = useState(null)
  const [loadingDetail,setLoadingDetail]= useState(false)
  const [actionMsg,    setActionMsg]    = useState(null) // { type: 'ok'|'err', text }

  // ── Auth ──────────────────────────────────────────────────────────────────
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

  // ── Fetch data ────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    const sess = sessionRef.current
    if (!sess) return
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${sess.access_token}` },
      })
      if (res.status === 403) { router.push('/dashboard'); return }
      if (!res.ok) return
      const json = await res.json()
      setData(json)
      setLastFetched(new Date())
      setCountdown(20)
    } catch {}
    finally { setLoading(false) }
  }, [router])

  useEffect(() => {
    if (session) fetchData()
  }, [session]) // eslint-disable-line

  // ── Auto-refresh countdown ────────────────────────────────────────────────
  useEffect(() => {
    if (!session) return
    const id = setInterval(() => {
      if (paused) return
      setCountdown(prev => {
        if (prev <= 1) { fetchData(); return 20 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [paused, session, fetchData])

  // ── Open user detail modal ────────────────────────────────────────────────
  const openUser = async (user) => {
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
  }

  // ── Admin actions (reset usage / set plan) ────────────────────────────────
  const adminAction = async (userId, body) => {
    setActionMsg(null)
    try {
      const res = await fetch(`/api/admin/user/${userId}`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          Authorization:   `Bearer ${sessionRef.current?.access_token}`,
        },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (json.ok) {
        setActionMsg({ type: 'ok', text: body.action === 'reset_usage' ? 'Usage reset to 0.' : `Plan set to ${json.plan}.` })
        // Optimistic update in table
        setData(prev => prev ? {
          ...prev,
          users: prev.users.map(u => u.id !== userId ? u : {
            ...u,
            ...(body.action === 'reset_usage' ? { images_used_today: 0 } : { plan: body.plan }),
          }),
        } : prev)
        // Refresh detail
        openUser(selectedUser)
      } else {
        setActionMsg({ type: 'err', text: json.error || 'Action failed.' })
      }
    } catch {
      setActionMsg({ type: 'err', text: 'Network error.' })
    }
  }

  // ── Derived: filtered + sorted user list ─────────────────────────────────
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

  // ── Loading screen ────────────────────────────────────────────────────────
  if (!session || loading) {
    return (
      <div className="min-h-screen bg-[#060609] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const { stats = {}, today_activity = [] } = data || {}

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#060609] text-white">

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#060609]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full uppercase tracking-widest">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-white/40">
            {lastFetched && (
              <span className="hidden sm:block">Updated {timeAgo(lastFetched)}</span>
            )}
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${paused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
              <span>{paused ? 'Paused' : `Refresh in ${countdown}s`}</span>
            </div>
            <button
              onClick={() => setPaused(p => !p)}
              className="px-2.5 py-1 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
            >
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button
              onClick={fetchData}
              className="px-2.5 py-1 rounded-lg border border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10 transition-all"
            >
              ↻ Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── Stat cards ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          <StatCard
            label="Total users"
            value={stats.total_users}
            color="blue"
          />
          <StatCard
            label="Pro users"
            value={stats.pro_users}
            sub={`€${(stats.mrr_estimate || 0).toLocaleString()}/mo MRR`}
            color="purple"
          />
          <StatCard
            label="Free users"
            value={stats.free_users}
            color="indigo"
          />
          <StatCard
            label="Active today"
            value={stats.active_today}
            sub="Used at least 1 image"
            color="green"
          />
          <StatCard
            label="Conv. today"
            value={stats.conversions_today}
            color="yellow"
          />
          <StatCard
            label="All-time conv."
            value={stats.total_conversions?.toLocaleString()}
            color="emerald"
          />
        </div>

        {/* ── Platform breakdown ───────────────────────────────────────────── */}
        {stats.platform_breakdown && Object.keys(stats.platform_breakdown).length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-white/30 uppercase tracking-wider mr-1">Today by platform:</span>
            {Object.entries(stats.platform_breakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([platform, count]) => (
                <span key={platform} className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${PLATFORM_COLORS[platform] || 'bg-white/5 text-white/40 border-white/10'}`}>
                  <span className="font-medium capitalize">{platform}</span>
                  <span className="opacity-60">×{count}</span>
                </span>
              ))
            }
          </div>
        )}

        {/* ── Today's activity feed ────────────────────────────────────────── */}
        <div>
          <button
            onClick={() => setShowActivity(v => !v)}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            <span className={`text-xs transition-transform duration-200 ${showActivity ? 'rotate-90' : ''}`}>▶</span>
            Today's activity feed
            <span className="text-white/30">({today_activity.length} conversions)</span>
          </button>

          {showActivity && (
            <div className="mt-3 rounded-xl border border-white/10 overflow-hidden">
              <div className="max-h-72 overflow-y-auto">
                {today_activity.length === 0 ? (
                  <div className="p-6 text-center text-white/30 text-sm">No activity today yet.</div>
                ) : (
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-[#0c0c12] border-b border-white/10">
                      <tr className="text-white/30">
                        <th className="text-left px-4 py-2.5 font-medium">Time</th>
                        <th className="text-left px-4 py-2.5 font-medium">User</th>
                        <th className="text-left px-4 py-2.5 font-medium">File</th>
                        <th className="text-left px-4 py-2.5 font-medium">Platform</th>
                        <th className="text-left px-4 py-2.5 font-medium">Formats</th>
                      </tr>
                    </thead>
                    <tbody>
                      {today_activity.map((a, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="px-4 py-2 text-white/40 whitespace-nowrap">{timeAgo(a.created_at)}</td>
                          <td className="px-4 py-2 text-white/60 max-w-[180px] truncate">{a.user_email}</td>
                          <td className="px-4 py-2 text-white/40 max-w-[160px] truncate">{a.filename}</td>
                          <td className="px-4 py-2"><PlatformBadge platform={a.platform} /></td>
                          <td className="px-4 py-2 text-white/30">{(a.formats || []).join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Filters + search ────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2.5">
          {[
            ['all',    `All (${data?.users?.length ?? 0})`],
            ['free',   `Free (${stats.free_users ?? 0})`],
            ['pro',    `Pro (${stats.pro_users ?? 0})`],
            ['active', `Active today (${stats.active_today ?? 0})`],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                filter === val
                  ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40'
                  : 'text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
              }`}
            >
              {label}
            </button>
          ))}

          <div className="flex-1 min-w-[180px] max-w-xs">
            <input
              type="text"
              placeholder="Search by email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          {search && (
            <span className="text-xs text-white/30">{filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {/* ── Users table ─────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0c0c12] border-b border-white/10">
                <tr>
                  <th className="text-left px-4 py-3 text-white/40 text-xs font-medium">User</th>
                  <th className="text-left px-4 py-3 text-white/40 text-xs font-medium">Plan</th>
                  <SortTh label="Usage today"   col="usage"       sort={sort} dir={sortDir} onClick={() => toggleSort('usage')} />
                  <SortTh label="All-time conv." col="conversions" sort={sort} dir={sortDir} onClick={() => toggleSort('conversions')} />
                  <SortTh label="Joined"         col="joined"      sort={sort} dir={sortDir} onClick={() => toggleSort('joined')} />
                  <SortTh label="Last login"     col="last_active" sort={sort} dir={sortDir} onClick={() => toggleSort('last_active')} />
                  <th className="text-left px-4 py-3 text-white/40 text-xs font-medium">Provider</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-white/25 text-sm">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => (
                    <tr
                      key={u.id}
                      onClick={() => openUser(u)}
                      className="border-b border-white/5 hover:bg-white/[0.025] cursor-pointer transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-white/85 group-hover:text-white transition-colors truncate block max-w-[200px] sm:max-w-xs">
                          {u.email}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${
                          u.plan === 'pro'
                            ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                            : 'bg-white/5 text-white/30 border-white/10'
                        }`}>
                          {u.plan === 'pro' ? 'Pro' : 'Free'}
                        </span>
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {u.last_reset_date === today
                          ? <span className="text-green-400 font-medium">{u.images_used_today}</span>
                          : <span className="text-white/25">0</span>}
                        {u.plan === 'free' && (
                          <span className="text-white/20 text-xs"> / 10</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-white/60 tabular-nums">{(u.total_conversions).toLocaleString()}</td>
                      <td className="px-4 py-3 text-white/35 text-xs whitespace-nowrap">{timeAgo(u.created_at)}</td>
                      <td className="px-4 py-3 text-white/35 text-xs whitespace-nowrap">{timeAgo(u.last_sign_in_at)}</td>
                      <td className="px-4 py-3 text-white/25 text-xs capitalize">{u.provider}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── User detail modal ─────────────────────────────────────────────── */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(6,6,9,0.88)', backdropFilter: 'blur(16px)' }}
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0c0c12] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between p-6 border-b border-white/10 flex-shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-semibold text-white text-base truncate">{selectedUser.email}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold flex-shrink-0 ${
                    selectedUser.plan === 'pro'
                      ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                      : 'bg-white/5 text-white/40 border-white/10'
                  }`}>
                    {selectedUser.plan === 'pro' ? 'Pro' : 'Free'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5 text-xs text-white/30">
                  <span>Joined {fmtDate(selectedUser.created_at)}</span>
                  <span>·</span>
                  <span>Last login {timeAgo(selectedUser.last_sign_in_at)}</span>
                  <span>·</span>
                  <span className="capitalize">{selectedUser.provider}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-white/30 hover:text-white transition-colors ml-4 flex-shrink-0 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-5">

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3 text-center">
                  <div className="text-2xl font-bold text-white tabular-nums">{selectedUser.total_conversions.toLocaleString()}</div>
                  <div className="text-xs text-white/35 mt-1">All-time conv.</div>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3 text-center">
                  <div className="text-2xl font-bold tabular-nums">
                    <span className={selectedUser.last_reset_date === today && selectedUser.images_used_today > 0 ? 'text-green-400' : 'text-white'}>
                      {selectedUser.last_reset_date === today ? selectedUser.images_used_today : 0}
                    </span>
                  </div>
                  <div className="text-xs text-white/35 mt-1">Used today</div>
                </div>
                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3 text-center">
                  <div className="text-2xl font-bold text-white capitalize">{selectedUser.provider}</div>
                  <div className="text-xs text-white/35 mt-1">Auth provider</div>
                </div>
              </div>

              {/* Platform breakdown (from detail) */}
              {!loadingDetail && userDetail?.platform_breakdown && Object.keys(userDetail.platform_breakdown).length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">Breakdown by platform</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(userDetail.platform_breakdown)
                      .sort(([, a], [, b]) => b - a)
                      .map(([platform, count]) => (
                        <span key={platform} className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${PLATFORM_COLORS[platform] || 'bg-white/5 text-white/40 border-white/10'}`}>
                          <span className="font-medium capitalize">{platform}</span>
                          <span className="opacity-60">×{count}</span>
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Admin actions */}
              <div>
                <div className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">Admin actions</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => adminAction(selectedUser.id, { action: 'reset_usage' })}
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-white/50 text-xs hover:border-white/20 hover:text-white/70 transition-all"
                  >
                    ↺ Reset daily usage
                  </button>
                  {selectedUser.plan === 'free' ? (
                    <button
                      onClick={() => adminAction(selectedUser.id, { action: 'set_plan', plan: 'pro' })}
                      className="px-3 py-1.5 rounded-lg border border-purple-500/40 text-purple-300 text-xs hover:bg-purple-500/10 transition-all"
                    >
                      ↑ Upgrade to Pro
                    </button>
                  ) : (
                    <button
                      onClick={() => adminAction(selectedUser.id, { action: 'set_plan', plan: 'free' })}
                      className="px-3 py-1.5 rounded-lg border border-white/10 text-white/40 text-xs hover:border-white/20 hover:text-white/60 transition-all"
                    >
                      ↓ Downgrade to Free
                    </button>
                  )}
                  <button
                    onClick={() => { navigator.clipboard.writeText(selectedUser.email); setActionMsg({ type: 'ok', text: 'Email copied.' }) }}
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-white/50 text-xs hover:border-white/20 hover:text-white/70 transition-all"
                  >
                    ⎘ Copy email
                  </button>
                </div>
                {actionMsg && (
                  <div className={`mt-2 text-xs px-3 py-1.5 rounded-lg border ${
                    actionMsg.type === 'ok'
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    {actionMsg.text}
                  </div>
                )}
              </div>

              {/* Conversion history */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                    Conversion history
                  </div>
                  {userDetail && (
                    <div className="text-xs text-white/25">
                      {userDetail.total_conversions.toLocaleString()} total — showing last {Math.min(userDetail.conversions?.length || 0, 100)}
                    </div>
                  )}
                </div>

                {loadingDetail ? (
                  <div className="flex justify-center py-8">
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/10 overflow-hidden">
                    <div className="max-h-72 overflow-y-auto">
                      {!userDetail?.conversions?.length ? (
                        <div className="p-6 text-center text-white/25 text-sm">No conversions yet.</div>
                      ) : (
                        <table className="w-full text-xs">
                          <thead className="sticky top-0 bg-[#060609] border-b border-white/10">
                            <tr className="text-white/30">
                              <th className="text-left px-3 py-2 font-medium">Time</th>
                              <th className="text-left px-3 py-2 font-medium">File</th>
                              <th className="text-left px-3 py-2 font-medium">Platform</th>
                              <th className="text-left px-3 py-2 font-medium">Formats</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userDetail.conversions.map((c, i) => (
                              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                                <td className="px-3 py-2 text-white/30 whitespace-nowrap">{timeAgo(c.created_at)}</td>
                                <td className="px-3 py-2 text-white/55 max-w-[160px] truncate">{c.filename}</td>
                                <td className="px-3 py-2"><PlatformBadge platform={c.platform} /></td>
                                <td className="px-3 py-2 text-white/25 max-w-[180px] truncate">{(c.formats || []).join(', ')}</td>
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
