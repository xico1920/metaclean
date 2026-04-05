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

    const today = new Date().toISOString().split('T')[0]

    // Last 7 days labels
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return d.toISOString().split('T')[0]
    })
    const sevenDaysAgo = last7[0] + 'T00:00:00.000Z'

    // ── Fetch everything in parallel ─────────────────────────────────────────
    const [
      authListResult,
      profilesResult,
      todayConvResult,
      totalCountResult,
      allConvsResult,
    ] = await Promise.all([
      supabase.auth.admin.listUsers({ perPage: 1000, page: 1 }),
      supabase.from('profiles').select('*'),
      supabase
        .from('conversion_history')
        .select('user_id, filename, platform, formats, created_at')
        .gte('created_at', `${today}T00:00:00.000Z`)
        .order('created_at', { ascending: false })
        .limit(500),
      supabase.from('conversion_history').select('*', { count: 'exact', head: true }),
      // Full history for trend + platform breakdown (only what we need)
      supabase
        .from('conversion_history')
        .select('user_id, platform, created_at'),
    ])

    const authUsers  = authListResult.data?.users || []
    const profiles   = profilesResult.data        || []
    const todayConvs = todayConvResult.data        || []
    const totalConversions = totalCountResult.count || 0
    const allConvs   = allConvsResult.data          || []

    // ── Build lookup maps ─────────────────────────────────────────────────────
    const profileMap = Object.fromEntries(profiles.map(p => [p.id, p]))
    const emailMap   = Object.fromEntries(authUsers.map(u => [u.id, u.email]))

    // Per-user conversion count
    const convCountMap = {}
    // All-time platform breakdown
    const platformAlltime = {}
    // Last-7-days daily conversions
    const dailyConvMap = Object.fromEntries(last7.map(d => [d, 0]))

    for (const c of allConvs) {
      convCountMap[c.user_id] = (convCountMap[c.user_id] || 0) + 1
      platformAlltime[c.platform] = (platformAlltime[c.platform] || 0) + 1
      const day = c.created_at?.split('T')[0]
      if (day && dailyConvMap.hasOwnProperty(day)) dailyConvMap[day]++
    }

    // Last-7-days daily signups
    const dailySignupMap = Object.fromEntries(last7.map(d => [d, 0]))
    for (const u of authUsers) {
      const day = u.created_at?.split('T')[0]
      if (day && dailySignupMap.hasOwnProperty(day)) dailySignupMap[day]++
    }

    // ── Merge users ───────────────────────────────────────────────────────────
    const users = authUsers.map(u => ({
      id:                u.id,
      email:             u.email,
      created_at:        u.created_at,
      last_sign_in_at:   u.last_sign_in_at,
      provider:          u.app_metadata?.provider || 'email',
      plan:              profileMap[u.id]?.plan              || 'free',
      images_used_today: profileMap[u.id]?.images_used_today || 0,
      last_reset_date:   profileMap[u.id]?.last_reset_date   || null,
      session_last_seen: profileMap[u.id]?.session_last_seen || null,
      stripe_customer_id: profileMap[u.id]?.stripe_customer_id || null,
      total_conversions: convCountMap[u.id] || 0,
    }))

    // ── Aggregate stats ───────────────────────────────────────────────────────
    const proUsers    = users.filter(u => u.plan === 'pro')
    const freeUsers   = users.filter(u => u.plan === 'free')
    const activeToday = users.filter(u => u.last_reset_date === today && u.images_used_today > 0)

    const thisWeekStart = last7[0]
    const newThisWeek   = users.filter(u => u.created_at?.split('T')[0] >= thisWeekStart).length
    const newToday      = users.filter(u => u.created_at?.split('T')[0] === today).length

    // Average conversions (non-zero users only)
    const activeUsers  = users.filter(u => u.total_conversions > 0)
    const avgConvPerUser = activeUsers.length
      ? Math.round(activeUsers.reduce((s, u) => s + u.total_conversions, 0) / activeUsers.length)
      : 0

    // Top 5 users by total conversions
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
        total_users:       users.length,
        pro_users:         proUsers.length,
        free_users:        freeUsers.length,
        active_today:      activeToday.length,
        conversions_today: todayConvs.length,
        total_conversions: totalConversions,
        mrr_estimate:      proUsers.length * 9,
        new_today:         newToday,
        new_this_week:     newThisWeek,
        avg_conv_per_user: avgConvPerUser,
        conversion_rate:   users.length > 0
          ? Math.round((activeUsers.length / users.length) * 100)
          : 0,
      },
      trends: {
        labels:       last7,
        signups:      last7.map(d => dailySignupMap[d]  || 0),
        conversions:  last7.map(d => dailyConvMap[d]    || 0),
      },
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
