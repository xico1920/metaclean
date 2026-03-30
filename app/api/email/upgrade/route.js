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
      subject: 'Welcome to MetaClean Pro',
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#060609;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060609;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#0d0d14;border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

        <!-- Header -->
        <tr><td style="padding:36px 40px 28px;border-bottom:1px solid rgba(99,102,241,0.3);background:linear-gradient(135deg,rgba(37,99,235,0.08),rgba(139,92,246,0.08));">
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
              <td style="padding-left:12px;">
                <span style="background:linear-gradient(135deg,#2563eb,#8b5cf6);border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700;color:#fff;letter-spacing:0.5px;">PRO</span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:36px 40px;">
          <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">You're now on Pro.</h1>
          <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.55);">
            Unlimited image processing, every ad format, no daily limits. Your subscription is active and ready to use.
          </p>

          <!-- Pro features -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr>
              <td style="padding:12px 16px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:10px;">
                <span style="font-size:13px;color:#818cf8;">✓</span>
                <span style="font-size:14px;color:rgba(255,255,255,0.75);margin-left:8px;">Unlimited images per day</span>
              </td>
            </tr>
            <tr><td style="height:6px;"></td></tr>
            <tr>
              <td style="padding:12px 16px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:10px;">
                <span style="font-size:13px;color:#818cf8;">✓</span>
                <span style="font-size:14px;color:rgba(255,255,255,0.75);margin-left:8px;">Bulk ZIP processing — up to 50 images at once</span>
              </td>
            </tr>
            <tr><td style="height:6px;"></td></tr>
            <tr>
              <td style="padding:12px 16px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:10px;">
                <span style="font-size:13px;color:#818cf8;">✓</span>
                <span style="font-size:14px;color:rgba(255,255,255,0.75);margin-left:8px;">Priority processing + conversion history</span>
              </td>
            </tr>
          </table>

          <!-- CTA -->
          <a href="https://metaclean.pro/dashboard" style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#2563eb,#4f46e5,#8b5cf6);border-radius:9px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.2px;">
            Start processing →
          </a>

          <p style="margin:24px 0 0;font-size:13px;color:rgba(255,255,255,0.3);">
            Manage your subscription anytime at <a href="https://metaclean.pro/dashboard" style="color:rgba(255,255,255,0.4);">metaclean.pro/dashboard</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);">
            MetaClean Pro · <a href="https://metaclean.pro" style="color:rgba(255,255,255,0.35);">metaclean.pro</a>
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
    console.error('Upgrade email error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
