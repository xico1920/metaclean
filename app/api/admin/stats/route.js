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

    // ── Fetch everything in parallel ─────────────────────────────────────────
    const [
      authListResult,
      profilesResult,
      todayConvResult,
      totalCountResult,
      allConvUserIdsResult,
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
      supabase.from('conversion_history').select('user_id'),
    ])

    const authUsers  = authListResult.data?.users  || []
    const profiles   = profilesResult.data         || []
    const todayConvs = todayConvResult.data         || []
    const totalConversions = totalCountResult.count || 0
    const allConvUserIds   = allConvUserIdsResult.data || []

    // ── Build lookup maps ─────────────────────────────────────────────────────
    const profileMap = Object.fromEntries(profiles.map(p => [p.id, p]))

    const convCountMap = {}
    for (const c of allConvUserIds) {
      convCountMap[c.user_id] = (convCountMap[c.user_id] || 0) + 1
    }

    // Email map for activity feed
    const emailMap = Object.fromEntries(authUsers.map(u => [u.id, u.email]))

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

    // ── Stats ─────────────────────────────────────────────────────────────────
    const proUsers    = users.filter(u => u.plan === 'pro')
    const freeUsers   = users.filter(u => u.plan === 'free')
    const activeToday = users.filter(u => u.last_reset_date === today && u.images_used_today > 0)

    // Platform breakdown for today
    const platformBreakdown = {}
    for (const c of todayConvs) {
      platformBreakdown[c.platform] = (platformBreakdown[c.platform] || 0) + 1
    }

    return NextResponse.json({
      stats: {
        total_users:        users.length,
        pro_users:          proUsers.length,
        free_users:         freeUsers.length,
        active_today:       activeToday.length,
        conversions_today:  todayConvs.length,
        total_conversions:  totalConversions,
        mrr_estimate:       proUsers.length * 9,
        platform_breakdown: platformBreakdown,
      },
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
