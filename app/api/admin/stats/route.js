import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(request) {
  try {
    const supabase = getSupabaseAdmin()

    // ── Auth + admin guard ────────────────────────────────────────────────────
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.slice(7)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user || user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const now   = new Date()
    const today = now.toISOString().split('T')[0]

    // ── Date ranges ──────────────────────────────────────────────────────────
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
    const lastMonthEnd   = thisMonthStart // exclusive

    // Last 30 days (for charts)
    const last30 = Array.from({ length: 30 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (29 - i))
      return d.toISOString().split('T')[0]
    })

    // Last 7 days (for sparklines)
    const last7 = last30.slice(-7)

    // ── Fetch in parallel ─────────────────────────────────────────────────────
    // Paginate auth users to handle > 1000 accounts
    let authUsers = []
    let page = 1
    while (true) {
      const { data } = await supabase.auth.admin.listUsers({ perPage: 1000, page })
      const batch = data?.users || []
      authUsers = authUsers.concat(batch)
      if (batch.length < 1000) break
      page++
    }

    const [
      profilesResult,
      todayConvResult,
      totalCountResult,
      allConvsResult,
    ] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase
        .from('conversion_history')
        .select('user_id, filename, platform, formats, created_at')
        .gte('created_at', `${today}T00:00:00.000Z`)
        .order('created_at', { ascending: false })
        .limit(500),
      supabase.from('conversion_history').select('*', { count: 'exact', head: true }),
      supabase.from('conversion_history').select('user_id, platform, created_at'),
    ])

    const profiles         = profilesResult.data        || []
    const todayConvs       = todayConvResult.data        || []
    const totalConversions = totalCountResult.count      || 0
    const allConvs         = allConvsResult.data         || []

    // ── Lookup maps ───────────────────────────────────────────────────────────
    const profileMap = Object.fromEntries(profiles.map(p => [p.id, p]))
    const emailMap   = Object.fromEntries(authUsers.map(u => [u.id, u.email]))

    // Per-user conv count
    const convCountMap = {}
    // Platform breakdown (all-time)
    const platformAlltime = {}
    // 30-day daily conv map
    const dailyConvMap30  = Object.fromEntries(last30.map(d => [d, 0]))

    for (const c of allConvs) {
      convCountMap[c.user_id] = (convCountMap[c.user_id] || 0) + 1
      platformAlltime[c.platform] = (platformAlltime[c.platform] || 0) + 1
      const day = c.created_at?.split('T')[0]
      if (day && Object.hasOwn(dailyConvMap30, day)) dailyConvMap30[day]++
    }

    // 30-day daily signup map
    const dailySignupMap30 = Object.fromEntries(last30.map(d => [d, 0]))
    for (const u of authUsers) {
      const day = u.created_at?.split('T')[0]
      if (day && Object.hasOwn(dailySignupMap30, day)) dailySignupMap30[day]++
    }

    // ── Merge users ───────────────────────────────────────────────────────────
    const users = authUsers.map(u => ({
      id:                 u.id,
      email:              u.email,
      created_at:         u.created_at,
      last_sign_in_at:    u.last_sign_in_at,
      provider:           u.app_metadata?.provider || 'email',
      plan:               profileMap[u.id]?.plan               || 'free',
      images_used_today:  profileMap[u.id]?.images_used_today  || 0,
      last_reset_date:    profileMap[u.id]?.last_reset_date    || null,
      stripe_customer_id: profileMap[u.id]?.stripe_customer_id || null,
      total_conversions:  convCountMap[u.id] || 0,
    }))

    // ── Aggregate stats ───────────────────────────────────────────────────────
    const proUsers    = users.filter(u => u.plan === 'pro')
    const freeUsers   = users.filter(u => u.plan === 'free')
    const activeToday = users.filter(u => u.last_reset_date === today && u.images_used_today > 0)
    const activeUsers = users.filter(u => u.total_conversions > 0)

    // ── Monthly stats ─────────────────────────────────────────────────────────
    const thisMonthConvs    = allConvs.filter(c => c.created_at >= thisMonthStart).length
    const lastMonthConvs    = allConvs.filter(c => c.created_at >= lastMonthStart && c.created_at < lastMonthEnd).length
    const thisMonthSignups  = users.filter(u => u.created_at >= thisMonthStart).length
    const lastMonthSignups  = users.filter(u => u.created_at >= lastMonthStart && u.created_at < lastMonthEnd).length
    const thisMonthProAdded = proUsers.filter(u => u.created_at >= thisMonthStart).length

    // Delta helpers (returns signed %, null if no prev data)
    const delta = (cur, prev) => prev === 0 ? null : Math.round(((cur - prev) / prev) * 100)

    // ── Last 6 months monthly revenue/conv summary ────────────────────────────
    // We approximate revenue by counting pro users registered before that month's end
    // (not perfect without billing history, but useful directional data)
    const months6 = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      return {
        label: d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
        start: d.toISOString(),
        end:   new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString(),
      }
    })

    const monthly = months6.map(m => ({
      label:       m.label,
      conversions: allConvs.filter(c => c.created_at >= m.start && c.created_at < m.end).length,
      signups:     users.filter(u => u.created_at >= m.start && u.created_at < m.end).length,
      // Pro users active at end of that month = registered before m.end
      mrr_estimate: proUsers.filter(u => u.created_at < m.end).length * 9,
    }))

    // Top 5 users
    const topUsers = [...users]
      .sort((a, b) => b.total_conversions - a.total_conversions)
      .slice(0, 5)
      .map(({ id, email, plan, total_conversions, last_sign_in_at }) =>
        ({ id, email, plan, total_conversions, last_sign_in_at })
      )

    // Today's platform breakdown
    const platformToday = {}
    for (const c of todayConvs) {
      platformToday[c.platform] = (platformToday[c.platform] || 0) + 1
    }

    return NextResponse.json({
      stats: {
        total_users:         users.length,
        pro_users:           proUsers.length,
        free_users:          freeUsers.length,
        active_today:        activeToday.length,
        conversions_today:   todayConvs.length,
        total_conversions:   totalConversions,
        mrr_estimate:        proUsers.length * 9,
        new_today:           users.filter(u => u.created_at?.split('T')[0] === today).length,
        new_this_week:       users.filter(u => u.created_at >= last7[0] + 'T00:00:00.000Z').length,
        avg_conv_per_user:   activeUsers.length
          ? Math.round(activeUsers.reduce((s, u) => s + u.total_conversions, 0) / activeUsers.length)
          : 0,
        conversion_rate: users.length > 0
          ? Math.round((activeUsers.length / users.length) * 100)
          : 0,
      },
      monthly_stats: {
        this_month_convs:      thisMonthConvs,
        last_month_convs:      lastMonthConvs,
        conv_delta_pct:        delta(thisMonthConvs, lastMonthConvs),
        this_month_signups:    thisMonthSignups,
        last_month_signups:    lastMonthSignups,
        signup_delta_pct:      delta(thisMonthSignups, lastMonthSignups),
        this_month_pro_added:  thisMonthProAdded,
        month_label:           now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      },
      trends: {
        labels:      last30,
        signups:     last30.map(d => dailySignupMap30[d]  || 0),
        conversions: last30.map(d => dailyConvMap30[d]    || 0),
      },
      monthly_history: monthly,
      platform_today:   platformToday,
      platform_alltime: platformAlltime,
      top_users:        topUsers,
      users,
      today_activity: todayConvs.map(c => ({
        ...c,
        user_email: emailMap[c.user_id] || 'Unknown',
      })),
    })
  } catch (error) {
    console.error('admin/stats error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
