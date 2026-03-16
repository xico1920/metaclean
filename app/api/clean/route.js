import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { PDFDocument } from 'pdf-lib'

const FREE_LIMIT = 10

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
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const today = new Date().toISOString().split('T')[0]
    let imagesUsed = profile.images_used_today
    if (profile.last_reset_date !== today) {
      imagesUsed = 0
      await supabase.from('profiles').update({ images_used_today: 0, last_reset_date: today }).eq('id', user.id)
    }

    if (profile.plan === 'free' && imagesUsed >= FREE_LIMIT) {
      return NextResponse.json({ error: 'Daily limit reached', limitReached: true }, { status: 403 })
    }

    // ── Process ───────────────────────────────────────────────────────────────
    const formData = await request.formData()
    const file = formData.get('file')
    const originalName = formData.get('name') || file?.name || 'file'
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const inputBuffer = Buffer.from(await file.arrayBuffer())
    const mimeType = file.type || ''
    const ext = originalName.split('.').pop()?.toLowerCase() || 'bin'
    const baseName = originalName.replace(/\.[^.]+$/, '')

    let outputBuffer, contentType, outputName

    if (mimeType.startsWith('image/')) {
      // Image: strip all metadata, keep original dimensions
      let pipeline = sharp(inputBuffer).withMetadata(false)
      if (mimeType === 'image/png' || ext === 'png') {
        outputBuffer = await pipeline.png().toBuffer()
        contentType = 'image/png'
        outputName = `metaclean_${baseName}_clean.png`
      } else if (mimeType === 'image/webp' || ext === 'webp') {
        outputBuffer = await pipeline.webp({ quality: 92 }).toBuffer()
        contentType = 'image/webp'
        outputName = `metaclean_${baseName}_clean.webp`
      } else {
        outputBuffer = await pipeline.jpeg({ quality: 92 }).toBuffer()
        contentType = 'image/jpeg'
        outputName = `metaclean_${baseName}_clean.jpg`
      }
    } else if (mimeType === 'application/pdf' || ext === 'pdf') {
      // PDF: strip XMP metadata and document info via pdf-lib
      const pdfDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true })
      pdfDoc.setTitle('')
      pdfDoc.setAuthor('')
      pdfDoc.setSubject('')
      pdfDoc.setKeywords([])
      pdfDoc.setProducer('MetaClean')
      pdfDoc.setCreator('MetaClean')
      outputBuffer = Buffer.from(await pdfDoc.save())
      contentType = 'application/pdf'
      outputName = `metaclean_${baseName}_clean.pdf`
    } else {
      // Other file types: return unchanged
      outputBuffer = inputBuffer
      contentType = mimeType || 'application/octet-stream'
      outputName = `metaclean_${baseName}_clean.${ext}`
    }

    // ── Update usage + log ────────────────────────────────────────────────────
    await supabase.from('profiles')
      .update({ images_used_today: imagesUsed + 1, last_reset_date: today })
      .eq('id', user.id)

    await supabase.from('conversion_history').insert({
      user_id: user.id,
      filename: originalName,
      platform: 'clean',
      formats: ['metadata_only'],
    })

    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${outputName}"`,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
