import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

// GET /api/admin/user/[id] — full profile + conversion history for one user
export async function GET(request, { params }) {
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

    const { id } = await params

    // ── Fetch in parallel ─────────────────────────────────────────────────────
    const [
      { data: { user: targetUser } = {} },
      { data: profile },
      { data: conversions },
      { count: totalCount },
    ] = await Promise.all([
      supabase.auth.admin.getUserById(id),
      supabase.from('profiles').select('*').eq('id', id).single(),
      supabase
        .from('conversion_history')
        .select('id, filename, platform, formats, created_at')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('conversion_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', id),
    ])

    // ── Platform breakdown ────────────────────────────────────────────────────
    const platformBreakdown = {}
    for (const c of (conversions || [])) {
      platformBreakdown[c.platform] = (platformBreakdown[c.platform] || 0) + 1
    }

    return NextResponse.json({
      user: targetUser ? {
        id:              targetUser.id,
        email:           targetUser.email,
        created_at:      targetUser.created_at,
        last_sign_in_at: targetUser.last_sign_in_at,
        provider:        targetUser.app_metadata?.provider || 'email',
        confirmed_at:    targetUser.confirmed_at,
      } : null,
      profile: profile || null,
      conversions:         conversions || [],
      total_conversions:   totalCount  || 0,
      platform_breakdown:  platformBreakdown,
    })
  } catch (error) {
    console.error('admin/user error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST /api/admin/user/[id] — admin actions (reset usage, change plan)
export async function POST(request, { params }) {
  try {
    const supabase = getSupabaseAdmin()

    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.slice(7)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user || user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const { action, plan } = await request.json()

    if (action === 'reset_usage') {
      const today = new Date().toISOString().split('T')[0]
      await supabase.from('profiles')
        .update({ images_used_today: 0, last_reset_date: today })
        .eq('id', id)
      return NextResponse.json({ ok: true, action: 'reset_usage' })
    }

    if (action === 'set_plan' && (plan === 'free' || plan === 'pro')) {
      await supabase.from('profiles').update({ plan }).eq('id', id)
      return NextResponse.json({ ok: true, action: 'set_plan', plan })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('admin/user POST error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
