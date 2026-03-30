import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

    await resend.emails.send({
      from: 'MetaClean <hello@metaclean.pro>',
      to: email,
      subject: 'Welcome to MetaClean',
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#060609;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060609;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#0d0d14;border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

        <!-- Header -->
        <tr><td style="padding:36px 40px 28px;border-bottom:1px solid rgba(255,255,255,0.06);">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:10px;">
                <div style="width:36px;height:36px;background:#4338ca;border-radius:9px;"></div>
              </td>
              <td>
                <span style="font-size:18px;letter-spacing:-0.5px;">
                  <span style="font-weight:800;color:#ffffff;">meta</span><span style="font-weight:200;color:rgba(255,255,255,0.4);">clean</span>
                </span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:36px 40px;">
          <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Your images are ready to convert.</h1>
          <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.55);">
            Welcome to MetaClean. You're on the free plan — process up to 10 images per day, strip metadata, and resize to every ad format automatically.
          </p>

          <!-- Features -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr>
              <td style="padding:12px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;margin-bottom:8px;">
                <span style="font-size:13px;color:rgba(255,255,255,0.4);">✓</span>
                <span style="font-size:14px;color:rgba(255,255,255,0.75);margin-left:8px;">Strip EXIF & GPS metadata</span>
              </td>
            </tr>
            <tr><td style="height:6px;"></td></tr>
            <tr>
              <td style="padding:12px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;">
                <span style="font-size:13px;color:rgba(255,255,255,0.4);">✓</span>
                <span style="font-size:14px;color:rgba(255,255,255,0.75);margin-left:8px;">Resize for Meta, Google, TikTok, Pinterest & more</span>
              </td>
            </tr>
            <tr><td style="height:6px;"></td></tr>
            <tr>
              <td style="padding:12px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;">
                <span style="font-size:13px;color:rgba(255,255,255,0.4);">✓</span>
                <span style="font-size:14px;color:rgba(255,255,255,0.75);margin-left:8px;">No files stored — processed in memory</span>
              </td>
            </tr>
          </table>

          <!-- CTA -->
          <a href="https://metaclean.pro/dashboard" style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#2563eb,#4f46e5,#8b5cf6);border-radius:9px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.2px;">
            Go to Dashboard →
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);">
            You're receiving this because you signed up at metaclean.pro.
            <a href="https://metaclean.pro" style="color:rgba(255,255,255,0.35);">metaclean.pro</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Welcome email error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
