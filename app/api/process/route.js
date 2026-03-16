import { NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image')

    if (!file) {
      return NextResponse.json({ error: 'Nenhuma imagem enviada' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Remove metadata e converte para JPEG limpo
    const processed = await sharp(buffer)
      .withMetadata(false)
      .jpeg({ quality: 90 })
      .toBuffer()

    return new NextResponse(processed, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="adtools_${Date.now()}.jpg"`,
      },
    })

  } catch (error) {
    return NextResponse.json({ error: 'Erro ao processar imagem' }, { status: 500 })
  }
}
