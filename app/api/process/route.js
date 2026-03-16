import { NextResponse } from 'next/server'
import sharp from 'sharp'
import JSZip from 'jszip'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

/*
  Required Supabase tables:

  create table profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    email text,
    plan text default 'free',
    images_used_today int default 0,
    last_reset_date date default current_date,
    stripe_customer_id text,
    stripe_subscription_id text
  );

  create table conversion_history (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    filename text,
    platform text,
    formats text[],
    created_at timestamptz default now()
  );
*/

const PLATFORMS = {
  meta: {
    quality: 90,
    maxSizeKB: null,
    formats: [
      { label: 'meta_1x1_1080x1080',     width: 1080, height: 1080 },
      { label: 'meta_4x5_1080x1350',     width: 1080, height: 1350 },
      { label: 'meta_9x16_1080x1920',    width: 1080, height: 1920 },
      { label: 'meta_1.91x1_1200x628',   width: 1200, height: 628  },
    ],
  },
  google: {
    quality: 85,
    maxSizeKB: 5120,
    formats: [
      { label: 'google_1.91x1_1200x628', width: 1200, height: 628  },
      { label: 'google_1x1_1200x1200',   width: 1200, height: 1200 },
      { label: 'google_4x5_1200x1500',   width: 1200, height: 1500 },
    ],
  },
  tiktok: {
    quality: 80,
    maxSizeKB: 500,
    formats: [
      { label: 'tiktok_9x16_1080x1920',  width: 1080, height: 1920 },
      { label: 'tiktok_1x1_1080x1080',   width: 1080, height: 1080 },
    ],
  },
  snapchat: {
    quality: 85,
    maxSizeKB: 5120,
    formats: [
      { label: 'snapchat_9x16_1080x1920', width: 1080, height: 1920 },
    ],
  },
  pinterest: {
    quality: 90,
    maxSizeKB: null,
    formats: [
      { label: 'pinterest_2x3_1000x1500', width: 1000, height: 1500 },
      { label: 'pinterest_1x1_1000x1000', width: 1000, height: 1000 },
    ],
  },
  linkedin: {
    quality: 85,
    maxSizeKB: 5120,
    formats: [
      { label: 'linkedin_1.91x1_1200x628', width: 1200, height: 628  },
      { label: 'linkedin_1x1_1200x1200',   width: 1200, height: 1200 },
    ],
  },
}

const FREE_LIMIT = 10

async function processFormat(inputBuffer, width, height, quality, maxSizeKB) {
  const make = (q) =>
    sharp(inputBuffer)
      .resize(width, height, { fit: 'cover', position: 'centre' })
      .withMetadata(false)
      .jpeg({ quality: q })
      .toBuffer()

  if (!maxSizeKB) return make(quality)

  let q = quality
  let result
  do {
    result = await make(q)
    if (result.length <= maxSizeKB * 1024) break
    q -= 5
  } while (q >= 50)

  return result
}

export async function POST(request) {
  try {
    const supabase = getSupabaseAdmin()

    // ── Auth ──────────────────────────────────────────────────────────────────
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.slice(7)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── Profile + daily reset ─────────────────────────────────────────────────
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const today = new Date().toISOString().split('T')[0]
    let imagesUsed = profile.images_used_today

    if (profile.last_reset_date !== today) {
      imagesUsed = 0
      await supabase
        .from('profiles')
        .update({ images_used_today: 0, last_reset_date: today })
        .eq('id', user.id)
    }

    // ── Usage limit check ─────────────────────────────────────────────────────
    if (profile.plan === 'free' && imagesUsed >= FREE_LIMIT) {
      return NextResponse.json({ error: 'Daily limit reached', limitReached: true }, { status: 403 })
    }

    // ── Process ───────────────────────────────────────────────────────────────
    const formData = await request.formData()
    const file = formData.get('image')
    const platform = formData.get('platform') || 'meta'
    const originalName = formData.get('name') || 'image'
    const formatsParam = formData.get('formats')
    const selectedFormats = formatsParam ? JSON.parse(formatsParam) : null

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const config = PLATFORMS[platform] || PLATFORMS.meta
    const inputBuffer = Buffer.from(await file.arrayBuffer())
    const baseName = originalName.replace(/\.[^.]+$/, '')

    const zip = new JSZip()
    const processedFormats = []

    for (const fmt of config.formats) {
      if (selectedFormats && !selectedFormats.includes(fmt.label)) continue
      const processed = await processFormat(
        inputBuffer, fmt.width, fmt.height, config.quality, config.maxSizeKB
      )
      zip.file(`metaclean_${baseName}_${fmt.label}.jpg`, processed)
      processedFormats.push(fmt.label)
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })

    // ── Update usage + log history ────────────────────────────────────────────
    await supabase
      .from('profiles')
      .update({ images_used_today: imagesUsed + 1, last_reset_date: today })
      .eq('id', user.id)

    await supabase.from('conversion_history').insert({
      user_id: user.id,
      filename: originalName,
      platform,
      formats: processedFormats,
    })

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="metaclean_${baseName}_${platform}.zip"`,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
