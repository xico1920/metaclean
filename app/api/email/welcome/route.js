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
      subject: 'Welcome to MetaClean — your ad creatives are ready',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title>Welcome to MetaClean</title>
</head>
<body style="margin:0;padding:0;background:#060609;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#060609;min-height:100vh;">
    <tr><td align="center" style="padding:48px 16px;">

      <!-- Card -->
      <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#0d0d14;border:1px solid rgba(255,255,255,0.07);border-radius:20px;overflow:hidden;">

        <!-- Top accent bar -->
        <tr>
          <td style="height:3px;background:linear-gradient(90deg,#2563eb,#6366f1,#8b5cf6);font-size:0;line-height:0;">&nbsp;</td>
        </tr>

        <!-- Header -->
        <tr>
          <td style="padding:32px 40px 24px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding-right:11px;vertical-align:middle;">
                  <!-- Logo icon: indigo square with photo-frame + cut corner -->
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="width:38px;height:38px;background:linear-gradient(135deg,#4338ca,#6366f1);border-radius:10px;text-align:center;vertical-align:middle;">
                        <span style="font-size:18px;line-height:38px;">✦</span>
                      </td>
                    </tr>
                  </table>
                </td>
                <td style="vertical-align:middle;">
                  <span style="font-size:19px;letter-spacing:-0.5px;font-weight:800;color:#ffffff;">meta</span><span style="font-size:19px;letter-spacing:-0.5px;font-weight:200;color:rgba(255,255,255,0.35);">clean</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Hero section -->
        <tr>
          <td style="padding:0 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,rgba(99,102,241,0.08) 0%,rgba(37,99,235,0.04) 100%);border:1px solid rgba(99,102,241,0.15);border-radius:14px;overflow:hidden;">
              <tr>
                <td style="padding:32px 32px 28px;">
                  <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(99,102,241,0.8);">Free plan · 10 images/day</p>
                  <h1 style="margin:0 0 14px;font-size:26px;font-weight:800;line-height:1.2;letter-spacing:-0.8px;color:#ffffff;">Your ad creatives,<br>always platform-ready.</h1>
                  <p style="margin:0;font-size:14px;line-height:1.7;color:rgba(255,255,255,0.5);">
                    MetaClean strips hidden metadata, resizes to every ad format, and compresses automatically — so your images never get flagged or rejected.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- What you get -->
        <tr>
          <td style="padding:0 40px 28px;">
            <p style="margin:0 0 14px;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.3);">What's included</p>

            <!-- Feature 1 -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
              <tr>
                <td style="padding:14px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding-right:12px;vertical-align:top;padding-top:1px;">
                        <div style="width:20px;height:20px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.25);border-radius:6px;text-align:center;line-height:20px;font-size:11px;color:#818cf8;">✓</div>
                      </td>
                      <td>
                        <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:rgba(255,255,255,0.85);">Strip EXIF & GPS metadata</p>
                        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35);line-height:1.5;">Removes hidden data that causes ad rejections on Meta and Google.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Feature 2 -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
              <tr>
                <td style="padding:14px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding-right:12px;vertical-align:top;padding-top:1px;">
                        <div style="width:20px;height:20px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.25);border-radius:6px;text-align:center;line-height:20px;font-size:11px;color:#818cf8;">✓</div>
                      </td>
                      <td>
                        <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:rgba(255,255,255,0.85);">Resize for every ad platform</p>
                        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35);line-height:1.5;">Meta, Google, TikTok, Pinterest, Snapchat, LinkedIn — all formats in one click.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Feature 3 -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding:14px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding-right:12px;vertical-align:top;padding-top:1px;">
                        <div style="width:20px;height:20px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.25);border-radius:6px;text-align:center;line-height:20px;font-size:11px;color:#818cf8;">✓</div>
                      </td>
                      <td>
                        <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:rgba(255,255,255,0.85);">Zero storage — processed in memory</p>
                        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35);line-height:1.5;">Your images are never saved. Processed and delivered instantly.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:0 40px 40px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background:linear-gradient(135deg,#2563eb,#4f46e5,#8b5cf6);border-radius:10px;">
                  <a href="https://metaclean.pro/dashboard" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:-0.2px;">
                    Go to Dashboard &rarr;
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:14px 0 0;font-size:12px;color:rgba(255,255,255,0.25);">Takes less than 30 seconds to process your first image.</p>
          </td>
        </tr>

        <!-- Upgrade nudge -->
        <tr>
          <td style="padding:0 40px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:10px;">
              <tr>
                <td style="padding:16px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td>
                        <p style="margin:0 0 2px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.6);">Need unlimited images?</p>
                        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3);">Upgrade to Pro for €9/month — unlimited processing, presets, and priority support.</p>
                      </td>
                      <td style="text-align:right;white-space:nowrap;padding-left:16px;">
                        <a href="https://metaclean.pro/pricing" style="display:inline-block;padding:8px 16px;background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.25);border-radius:7px;font-size:12px;font-weight:600;color:#818cf8;text-decoration:none;">See Pro →</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.05);">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);line-height:1.6;">
                    You're receiving this because you signed up at <a href="https://metaclean.pro" style="color:rgba(255,255,255,0.3);text-decoration:none;">metaclean.pro</a>.<br>
                    Questions? Reply to this email or contact <a href="mailto:hello@metaclean.pro" style="color:rgba(255,255,255,0.3);text-decoration:none;">hello@metaclean.pro</a>
                  </p>
                </td>
                <td style="text-align:right;vertical-align:top;">
                  <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.15);">MetaClean · metaclean.pro</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

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
