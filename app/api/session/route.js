import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

const SESSION_TIMEOUT_MS = 60 * 1000 // 1 minute — session considered dead after this

// POST /api/session — register or heartbeat
// body: { userId, sessionId, action: 'register' | 'heartbeat' }
export async function POST(request) {
  try {
    const { userId, sessionId, action } = await request.json()
    if (!userId || !sessionId) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

    const supabase = getSupabaseAdmin()

    if (action === 'heartbeat') {
      // Only update last_seen if this session is still the active one
      const { data } = await supabase.from('profiles').select('active_session_id').eq('id', userId).single()
      if (data?.active_session_id !== sessionId) {
        return NextResponse.json({ kicked: true })
      }
      await supabase.from('profiles').update({ session_last_seen: new Date().toISOString() }).eq('id', userId)
      return NextResponse.json({ ok: true })
    }

    // action === 'register' — check if there's an alive session first
    const { data } = await supabase
      .from('profiles')
      .select('active_session_id, session_last_seen')
      .eq('id', userId)
      .single()

    const lastSeen = data?.session_last_seen ? new Date(data.session_last_seen).getTime() : 0
    const sessionAlive = data?.active_session_id && (Date.now() - lastSeen < SESSION_TIMEOUT_MS)

    if (sessionAlive && data.active_session_id !== sessionId) {
      // Another session is alive — block this new one
      return NextResponse.json({ blocked: true })
    }

    // No alive session or same session — claim it
    await supabase.from('profiles').update({
      active_session_id: sessionId,
      session_last_seen: new Date().toISOString(),
    }).eq('id', userId)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
