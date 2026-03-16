import { createClient } from '@supabase/supabase-js'

// Fallbacks prevent build-time errors — real values must be set in .env
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'
)
