import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

// POST /api/session — register this device as the active session
export async function POST(request) {
  try {
    const { userId, sessionId } = await request.json()
    if (!userId || !sessionId) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

    const supabase = getSupabaseAdmin()
    await supabase.from('profiles').update({ active_session_id: sessionId }).eq('id', userId)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET /api/session?userId=...&sessionId=... — check if this session is still active
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const sessionId = searchParams.get('sessionId')
    if (!userId || !sessionId) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

    const supabase = getSupabaseAdmin()
    const { data } = await supabase.from('profiles').select('active_session_id').eq('id', userId).single()

    return NextResponse.json({ valid: data?.active_session_id === sessionId })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
