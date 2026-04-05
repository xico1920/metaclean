import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

// POST /api/session/clear — called via sendBeacon on tab close
// Clears active_session_id so the next device can register immediately
export async function POST(request) {
  try {
    const body = await request.text()
    const { userId, sessionId } = JSON.parse(body)
    if (!userId || !sessionId) return NextResponse.json({ ok: true })

    const supabase = getSupabaseAdmin()

    // Only clear if this session is still the active one
    await supabase
      .from('profiles')
      .update({ active_session_id: null, session_last_seen: null })
      .eq('id', userId)
      .eq('active_session_id', sessionId)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
