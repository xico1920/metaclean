import { NextResponse } from 'next/server'
import sharp from 'sharp'
import JSZip from 'jszip'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import * as Sentry from '@sentry/nextjs'

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
    maxSizeKB: 1024,
    formats: [
      { label: 'meta_1x1_1080x1080',     width: 1080, height: 1080 },
      { label: 'meta_4x5_1080x1350',     width: 1080, height: 1350 },
      { label: 'meta_9x16_1080x1920',    width: 1080, height: 1920 },
      { label: 'meta_1.91x1_1200x628',   width: 1200, height: 628  },
    ],
  },
  google: {
    quality: 85,
    maxSizeKB: 150,
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

// cropInfo: { xPct, yPct, autocrop } — optional
// If autocrop: use Sharp attention strategy
// If xPct/yPct provided: extract crop region then resize
// Otherwise: center crop (default)
async function processFormat(inputBuffer, width, height, quality, maxSizeKB, cropInfo) {
  let extractParams = null

  if (cropInfo && !cropInfo.autocrop && cropInfo.xPct !== undefined) {
    const meta = await sharp(inputBuffer).metadata()
    const imgW = meta.width
    const imgH = meta.height
    const fmtRatio = width / height
    const imgRatio = imgW / imgH

    let cropW, cropH
    if (fmtRatio > imgRatio) {
      cropW = imgW
      cropH = Math.round(imgW / fmtRatio)
    } else {
      cropH = imgH
      cropW = Math.round(imgH * fmtRatio)
    }

    const centerX = cropInfo.xPct * imgW
    const centerY = cropInfo.yPct * imgH
    let left = Math.round(centerX - cropW / 2)
    let top = Math.round(centerY - cropH / 2)
    left = Math.max(0, Math.min(left, imgW - cropW))
    top = Math.max(0, Math.min(top, imgH - cropH))
    extractParams = { left, top, width: cropW, height: cropH }
  }

  const make = async (q) => {
    let pipeline = sharp(inputBuffer)
    if (cropInfo?.autocrop) {
      pipeline = pipeline.resize(width, height, { fit: 'cover', position: 'attention' })
    } else if (extractParams) {
      pipeline = pipeline.extract(extractParams).resize(width, height)
    } else {
      pipeline = pipeline.resize(width, height, { fit: 'cover', position: 'centre' })
    }
    // Pixel reconstruction: decode to raw pixels then re-encode — guarantees zero metadata
    const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true })
    return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
      .jpeg({ quality: q })
      .toBuffer()
  }

  if (!maxSizeKB) {
    const buffer = await make(quality)
    return { buffer, quality, size: buffer.length, compressionApplied: false }
  }

  let q = quality
  let result
  do {
    result = await make(q)
    if (result.length <= maxSizeKB * 1024) break
    q -= 5
  } while (q >= 40)

  return { buffer: result, quality: q, size: result.length, compressionApplied: q < quality }
}

export async function POST(request) {
  try {
    const supabase = getSupabaseAdmin()

    // ── Auth ──────────────────────────────────────────────────────────────────
    const authHeader = request.headers.get('Authorization')
    const GUEST_LIMIT = 2
    const today = new Date().toISOString().split('T')[0]

    // Variables set only for authenticated users — used later to log history
    let authedUser = null
    let imagesUsed = 0

    // Guest mode — no token, enforce limit server-side by IP
    if (!authHeader?.startsWith('Bearer ')) {
      const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        request.headers.get('x-real-ip') ||
        'unknown'

      const { data: row } = await supabase
        .from('guest_usage')
        .select('count, reset_date')
        .eq('ip', ip)
        .single()

      const currentCount = (row?.reset_date === today ? row.count : 0)

      if (currentCount >= GUEST_LIMIT) {
        return NextResponse.json({ error: 'Guest limit reached', guestLimitReached: true }, { status: 403 })
      }

      await supabase.from('guest_usage').upsert({
        ip,
        count: currentCount + 1,
        reset_date: today,
      }, { onConflict: 'ip' })

      // Fall through to processing below
    } else {
      // ── Authenticated user ────────────────────────────────────────────────
      const token = authHeader.slice(7)
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      authedUser = user

      // ── Profile + daily reset ───────────────────────────────────────────────
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      }

      imagesUsed = profile.images_used_today

      if (profile.last_reset_date !== today) {
        imagesUsed = 0
        await supabase
          .from('profiles')
          .update({ images_used_today: 0, last_reset_date: today })
          .eq('id', user.id)
      }

      // ── Usage limit check ─────────────────────────────────────────────────
      const isAdmin = user.email === process.env.ADMIN_EMAIL
      if (!isAdmin && profile.plan === 'free' && imagesUsed >= FREE_LIMIT) {
        return NextResponse.json({ error: 'Daily limit reached', limitReached: true }, { status: 403 })
      }
    }

    // ── Process ───────────────────────────────────────────────────────────────
    const formData = await request.formData()
    const file = formData.get('image')
    const platform = formData.get('platform') || 'meta'
    const originalName = formData.get('name') || 'image'
    const formatsParam = formData.get('formats')
    const selectedFormats = formatsParam ? JSON.parse(formatsParam) : null

    // cropData: { [formatLabel]: { xPct, yPct, autocrop } }
    const cropDataParam = formData.get('cropData')
    const cropData = cropDataParam ? JSON.parse(cropDataParam) : {}

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const MAX_SIZE_BYTES = 4 * 1024 * 1024
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'File too large. Maximum size is 4MB.' }, { status: 413 })
    }

    const config = PLATFORMS[platform] || PLATFORMS.meta
    const inputBuffer = Buffer.from(await file.arrayBuffer())
    const baseName = originalName.replace(/\.[^.]+$/, '')

    const processedFiles = []

    for (const fmt of config.formats) {
      if (selectedFormats && !selectedFormats.includes(fmt.label)) continue
      const cropInfo = cropData[fmt.label] || null
      const { buffer, quality: finalQuality, size: finalSize, compressionApplied } = await processFormat(
        inputBuffer, fmt.width, fmt.height, config.quality, config.maxSizeKB, cropInfo
      )
      processedFiles.push({
        label: fmt.label,
        buffer,
        filename: `metaclean_${baseName}_${fmt.label}.jpg`,
        stats: { width: fmt.width, height: fmt.height, size: finalSize, quality: finalQuality, compressionApplied },
      })
    }

    if (processedFiles.length === 0) {
      return NextResponse.json({ error: 'No formats processed' }, { status: 400 })
    }

    const processedFormats = processedFiles.map(f => f.label)

    // ── Update usage + log history (authenticated users only) ─────────────────
    if (authedUser) {
      await supabase
        .from('profiles')
        .update({ images_used_today: imagesUsed + 1, last_reset_date: today })
        .eq('id', authedUser.id)

      await supabase.from('conversion_history').insert({
        user_id: authedUser.id,
        filename: originalName,
        platform,
        formats: processedFormats,
      })
    }

    const statsHeader = JSON.stringify(
      processedFiles.map(f => ({
        label: f.label,
        w: f.stats.width,
        h: f.stats.height,
        size: f.stats.size,
        quality: f.stats.quality,
        compressionApplied: f.stats.compressionApplied,
      }))
    )

    // Single format → return image directly (no zip)
    if (processedFiles.length === 1) {
      return new NextResponse(processedFiles[0].buffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename="${processedFiles[0].filename}"`,
          'X-MC-Stats': statsHeader,
        },
      })
    }

    // Multiple formats → zip
    const zip = new JSZip()
    for (const f of processedFiles) zip.file(f.filename, f.buffer)
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="metaclean_${baseName}_${platform}.zip"`,
        'X-MC-Stats': statsHeader,
      },
    })
  } catch (error) {
    Sentry.captureException(error)
    console.error(error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
