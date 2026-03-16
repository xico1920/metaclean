import { NextResponse } from 'next/server'
import sharp from 'sharp'
import JSZip from 'jszip'

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
      { label: 'google_1x1_1080x1080',   width: 1080, height: 1080 },
      { label: 'google_1.91x1_1200x628', width: 1200, height: 628  },
      { label: 'google_4x5_1080x1350',   width: 1080, height: 1350 },
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
      { label: 'linkedin_1.91x1_1200x627', width: 1200, height: 627  },
      { label: 'linkedin_1x1_1080x1080',   width: 1080, height: 1080 },
    ],
  },
}

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
  } while (q >= 25)

  return result
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image')
    const platform = formData.get('platform') || 'meta'
    const originalName = formData.get('name') || 'image'

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const config = PLATFORMS[platform] || PLATFORMS.meta
    const inputBuffer = Buffer.from(await file.arrayBuffer())
    const baseName = originalName.replace(/\.[^.]+$/, '')

    const zip = new JSZip()

    for (const fmt of config.formats) {
      const processed = await processFormat(
        inputBuffer,
        fmt.width,
        fmt.height,
        config.quality,
        config.maxSizeKB
      )
      zip.file(`metaclean_${baseName}_${fmt.label}.jpg`, processed)
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })

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
