import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import * as Sentry from '@sentry/nextjs'

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  // Idempotency: skip already-processed events
  const { data: processed } = await supabase
    .from('stripe_events')
    .select('id')
    .eq('event_id', event.id)
    .single()
  if (processed) return NextResponse.json({ received: true })

  await supabase.from('stripe_events').insert({ event_id: event.id })

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata?.supabase_user_id
    if (userId) {
      await supabase
        .from('profiles')
        .update({ plan: 'pro', stripe_subscription_id: session.subscription })
        .eq('id', userId)

      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single()
      if (profile?.email) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://metaclean.pro'
        fetch(`${appUrl}/api/email/upgrade`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: profile.email }),
        }).catch((err) => {
          Sentry.captureException(err, { extra: { context: 'upgrade_email', userId } })
          console.error('upgrade email failed:', err.message)
        })
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_subscription_id', subscription.id)
      .single()
    if (profile) {
      await supabase
        .from('profiles')
        .update({ plan: 'free', stripe_subscription_id: null })
        .eq('id', profile.id)
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object
    if (subscription.status === 'active') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_subscription_id', subscription.id)
        .single()
      if (profile) {
        await supabase.from('profiles').update({ plan: 'pro' }).eq('id', profile.id)
      }
    }
  }

  return NextResponse.json({ received: true })
}
