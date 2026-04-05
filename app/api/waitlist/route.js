import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    const { error } = await supabase.from('waitlist').insert({ email: email.toLowerCase().trim() })

    if (error) {
      // Duplicate email — treat as success so we don't leak info
      if (error.code === '23505') {
        return NextResponse.json({ ok: true, already: true })
      }
      throw error
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('waitlist error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
