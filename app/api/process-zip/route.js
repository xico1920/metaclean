import { NextResponse } from 'next/server'
import sharp from 'sharp'
import JSZip from 'jszip'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

const PLATFORMS = {
  meta:      { quality: 90, maxSizeKB: 1024 },
  google:    { quality: 85, maxSizeKB: 150  },
  tiktok:    { quality: 80, maxSizeKB: 500  },
  snapchat:  { quality: 85, maxSizeKB: 5120 },
  pinterest: { quality: 90, maxSizeKB: null },
  linkedin:  { quality: 85, maxSizeKB: 5120 },
}

const FORMAT_SPECS = {
  meta: [
    { label: 'meta_1x1',    width: 1080, height: 1080 },
    { label: 'meta_4x5',    width: 1080, height: 1350 },
    { label: 'meta_9x16',   width: 1080, height: 1920 },
    { label: 'meta_1.91x1', width: 1200, height: 628  },
  ],
  google: [
    { label: 'google_1.91x1', width: 1200, height: 628  },
    { label: 'google_1x1',    width: 1200, height: 1200 },
    { label: 'google_4x5',    width: 1200, height: 1500 },
  ],
  tiktok: [
    { label: 'tiktok_9x16', width: 1080, height: 1920 },
    { label: 'tiktok_1x1',  width: 1080, height: 1080 },
  ],
  snapchat: [
    { label: 'snapchat_9x16', width: 1080, height: 1920 },
  ],
  pinterest: [
    { label: 'pinterest_2x3', width: 1000, height: 1500 },
    { label: 'pinterest_1x1', width: 1000, height: 1000 },
  ],
  linkedin: [
    { label: 'linkedin_1.91x1', width: 1200, height: 628  },
    { label: 'linkedin_1x1',    width: 1200, height: 1200 },
  ],
}

const ZIP_LIMIT_FREE = 5
const ZIP_LIMIT_PRO  = 50
const FREE_DAILY_LIMIT = 10
const IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp'])

async function processFormat(inputBuffer, width, height, quality, maxSizeKB) {
  const make = async (q) => {
    const { data, info } = await sharp(inputBuffer)
      .resize(width, height, { fit: 'cover', position: 'centre' })
      .raw()
      .toBuffer({ resolveWithObject: true })
    return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
      .jpeg({ quality: q })
      .toBuffer()
  }

  if (!maxSizeKB) return make(quality)

  let q = quality
  let result
  do {
    result = await make(q)
    if (result.length <= maxSizeKB * 1024) break
    q -= 5
  } while (q >= 40)

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

    // ── Profile ───────────────────────────────────────────────────────────────
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const isAdmin = user.email === process.env.ADMIN_EMAIL
    const isPro   = isAdmin || profile.plan === 'pro'

    // ── Parse request ─────────────────────────────────────────────────────────
    const formData      = await request.formData()
    const zipFile       = formData.get('zip')
    const platform      = formData.get('platform') || 'meta'
    const formatsParam  = formData.get('formats')
    const selectedFmts  = formatsParam ? JSON.parse(formatsParam) : null

    if (!zipFile) return NextResponse.json({ error: 'No ZIP file provided' }, { status: 400 })

    // ── Extract ZIP ───────────────────────────────────────────────────────────
    const zipBuffer = Buffer.from(await zipFile.arrayBuffer())
    const inputZip  = await JSZip.loadAsync(zipBuffer)

    const imageEntries = []
    inputZip.forEach((path, file) => {
      if (!file.dir) {
        const ext = path.split('.').pop()?.toLowerCase()
        if (IMAGE_EXTS.has(ext)) imageEntries.push({ path, file })
      }
    })

    if (imageEntries.length === 0) {
      return NextResponse.json({ error: 'No images found in ZIP' }, { status: 400 })
    }

    // ── ZIP size limit ────────────────────────────────────────────────────────
    const zipLimit = isPro ? ZIP_LIMIT_PRO : ZIP_LIMIT_FREE
    if (!isAdmin && imageEntries.length > zipLimit) {
      return NextResponse.json({
        error: `ZIP contains ${imageEntries.length} images — limit is ${zipLimit} for your plan`,
        limitReached: true,
        limit: zipLimit,
        found: imageEntries.length,
      }, { status: 403 })
    }

    // ── Daily limit ───────────────────────────────────────────────────────────
    const today = new Date().toISOString().split('T')[0]
    let imagesUsed = profile.images_used_today
    if (profile.last_reset_date !== today) {
      imagesUsed = 0
      await supabase.from('profiles').update({ images_used_today: 0, last_reset_date: today }).eq('id', user.id)
    }

    if (!isAdmin && !isPro && imagesUsed >= FREE_DAILY_LIMIT) {
      return NextResponse.json({ error: 'Daily limit reached', limitReached: true }, { status: 403 })
    }

    const remaining  = isPro || isAdmin ? Infinity : Math.max(0, FREE_DAILY_LIMIT - imagesUsed)
    const toProcess  = Math.min(imageEntries.length, remaining)

    // ── Process images ────────────────────────────────────────────────────────
    const cfg        = PLATFORMS[platform] || PLATFORMS.meta
    const formats    = (FORMAT_SPECS[platform] || FORMAT_SPECS.meta).filter(
      f => !selectedFmts || selectedFmts.some(sf => sf.startsWith(f.label))
    )
    const outputZip  = new JSZip()
    let   processed  = 0

    for (let i = 0; i < toProcess; i++) {
      const { path: imgPath, file: imgFile } = imageEntries[i]
      const inputBuffer = Buffer.from(await imgFile.async('arraybuffer'))
      const baseName    = imgPath.split('/').pop().replace(/\.[^.]+$/, '')

      for (const fmt of formats) {
        try {
          const buffer = await processFormat(inputBuffer, fmt.width, fmt.height, cfg.quality, cfg.maxSizeKB)
          outputZip.file(`${platform}/${fmt.label}/${baseName}.jpg`, buffer)
        } catch {
          // skip unprocessable images silently
        }
      }
      processed++
    }

    // ── Update usage + log ────────────────────────────────────────────────────
    await supabase.from('profiles')
      .update({ images_used_today: imagesUsed + processed, last_reset_date: today })
      .eq('id', user.id)

    await supabase.from('conversion_history').insert({
      user_id:  user.id,
      filename: `${zipFile.name || 'batch.zip'} (${processed} imgs)`,
      platform,
      formats:  formats.map(f => f.label),
    })

    // ── Build and return output ZIP ───────────────────────────────────────────
    const outBuffer = await outputZip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })

    return new NextResponse(outBuffer, {
      headers: {
        'Content-Type':        'application/zip',
        'Content-Disposition': `attachment; filename="metaclean_${platform}_batch.zip"`,
        'X-MC-Processed':      String(processed),
      },
    })
  } catch (error) {
    console.error('process-zip error:', error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
