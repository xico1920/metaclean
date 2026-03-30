import Link from 'next/link'
import SiteNav from '@/app/components/SiteNav'

export const metadata = {
  title: 'Why Meta Rejects Ad Images (And How to Fix It)',
  description: 'The most common reasons Facebook and Instagram reject your ad creatives — image size, text overlay, metadata, policy violations — and exactly how to fix each one.',
  alternates: { canonical: 'https://metaclean.pro/blog/why-meta-rejects-ads' },
  openGraph: {
    title: 'Why Meta Rejects Ad Images (And How to Fix It)',
    description: 'The most common reasons Facebook and Instagram reject your ad creatives and exactly how to fix each one.',
    url: 'https://metaclean.pro/blog/why-meta-rejects-ads',
    type: 'article',
    publishedTime: '2025-03-30',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Why Meta Rejects Ad Images (And How to Fix It)',
  description: 'The most common reasons Facebook and Instagram reject your ad creatives and exactly how to fix each one.',
  datePublished: '2025-03-30',
  author: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  publisher: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://metaclean.pro/blog/why-meta-rejects-ads' },
}

const pStyle = { fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: '0 0 16px' }
const h2Style = { fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', color: 'white', marginBottom: 16, marginTop: 0 }
const h3Style = { fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 10, marginTop: 0, letterSpacing: '-0.3px' }
const calloutStyle = { background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }
const errorStyle = { background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 16 }
const fixStyle = { background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }

export default function WhyMetaRejectsAds() {
  return (
    <div style={{ minHeight: '100vh', background: '#060609', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          <Link href="/blog" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Blog</Link>
          <span>›</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Why Meta Rejects Ads</span>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#f87171', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 6, padding: '2px 8px' }}>Troubleshooting</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>March 30, 2025</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>·</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>8 min read</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 16, color: 'white' }}>
            Why Meta Rejects Ad Images (And How to Fix It)
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>
            Meta's automated review system rejects millions of ads every day. Most rejections are fixable in under 5 minutes — if you know what to look for.
          </p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <p style={pStyle}>Ad rejections cost you time, budget, and momentum. Meta's review system is largely automated — an algorithm scans your creative against hundreds of signals in seconds. When it triggers, you get a generic rejection message that often doesn't tell you the real reason.</p>
          <p style={pStyle}>This guide covers the most common causes — from obvious (wrong image size) to subtle (EXIF metadata, previously rejected creatives, reused image hashes). Fix the right thing and your ad will pass review.</p>
        </div>

        {/* Reason 1 */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>1. Image Dimensions Don't Match the Placement</h2>
          <p style={pStyle}>Meta has strict minimum resolution requirements and supported aspect ratios. Images outside these ranges either get rejected or auto-cropped — often badly.</p>

          <div style={errorStyle}>
            <p style={{ margin: 0, fontSize: 14, color: '#fca5a5', lineHeight: 1.6 }}>
              <strong>Problem:</strong> Image is too small (under 600px on shortest side), or aspect ratio falls outside the 1.91:1 to 4:5 range.
            </p>
          </div>
          <div style={fixStyle}>
            <p style={{ margin: 0, fontSize: 14, color: '#6ee7b7', lineHeight: 1.6 }}>
              <strong>Fix:</strong> Resize to 1080×1080px (1:1), 1080×1350px (4:5), or 1200×628px (1.91:1) for Feed. Use 1080×1920px for Stories and Reels. MetaClean exports all four formats in one ZIP.
            </p>
          </div>
        </div>

        {/* Reason 2 */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>2. Too Much Text in the Image</h2>
          <p style={pStyle}>Meta's old "20% text rule" no longer results in hard rejection — but it still affects delivery. Ads with heavy text overlays get limited distribution and higher CPMs.</p>
          <p style={pStyle}>The algorithm detects text as a percentage of the image area. Large headlines, prices, and URLs covering more than 20% of the image will trigger the filter.</p>

          <div style={errorStyle}>
            <p style={{ margin: 0, fontSize: 14, color: '#fca5a5', lineHeight: 1.6 }}>
              <strong>Problem:</strong> Text (including logos, prices, URLs) covers more than 20% of the image area.
            </p>
          </div>
          <div style={fixStyle}>
            <p style={{ margin: 0, fontSize: 14, color: '#6ee7b7', lineHeight: 1.6 }}>
              <strong>Fix:</strong> Move text to the ad copy (headline, description fields) instead of the image. Use the image purely for visual impact — product, lifestyle, emotion. Keep any image text minimal and in one corner.
            </p>
          </div>
        </div>

        {/* Reason 3 */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>3. Image Metadata Triggering Policy Filters</h2>
          <p style={pStyle}>This is one of the least known rejection causes. EXIF metadata — hidden data embedded in your image file — can include GPS coordinates, camera model, editing software, and copyright information.</p>
          <p style={pStyle}>Meta's systems scan this data. Images tagged with GPS coordinates in certain regions, images previously rejected (identified by image hash), or images with software metadata that conflicts with your account's business type can all trigger false positives in the review system.</p>
          <p style={pStyle}>Stock images downloaded from certain sites carry embedded license metadata. Edited images retain the editing software signature. Screenshots carry device model data. None of this is visible to you — but Meta sees it.</p>

          <div style={errorStyle}>
            <p style={{ margin: 0, fontSize: 14, color: '#fca5a5', lineHeight: 1.6 }}>
              <strong>Problem:</strong> Image contains EXIF data (GPS, camera model, software, copyright) that triggers content filters.
            </p>
          </div>
          <div style={fixStyle}>
            <p style={{ margin: 0, fontSize: 14, color: '#6ee7b7', lineHeight: 1.6 }}>
              <strong>Fix:</strong> Strip all metadata before uploading. MetaClean removes EXIF, GPS, IPTC, and XMP data automatically during processing. A clean image with no metadata gives the algorithm less to flag.
            </p>
          </div>
        </div>

        {/* Reason 4 */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>4. Previously Rejected Image Hash</h2>
          <p style={pStyle}>Meta stores a hash (digital fingerprint) of every image that has ever been rejected for policy violations. If you re-upload the exact same image — or a nearly identical version — it gets flagged automatically, even if the original rejection was a false positive.</p>
          <p style={pStyle}>This is why simply re-uploading a rejected ad never works. The system matches the image hash in milliseconds.</p>

          <div style={errorStyle}>
            <p style={{ margin: 0, fontSize: 14, color: '#fca5a5', lineHeight: 1.6 }}>
              <strong>Problem:</strong> Re-uploading a previously rejected image hits the hash blocklist instantly.
            </p>
          </div>
          <div style={fixStyle}>
            <p style={{ margin: 0, fontSize: 14, color: '#6ee7b7', lineHeight: 1.6 }}>
              <strong>Fix:</strong> Process the image through MetaClean before re-uploading. Stripping metadata and recompressing changes the image's binary data — which changes its hash. This is often enough to get a clean review on an image that was rejected for a non-obvious reason.
            </p>
          </div>
        </div>

        {/* Reason 5 */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>5. Before/After and Body Image Claims</h2>
          <p style={pStyle}>Meta explicitly prohibits before/after images for health, weight loss, and cosmetic products. This includes side-by-side comparisons, images implying physical transformation, and images that might make users feel bad about their bodies.</p>
          <p style={pStyle}>The detection is visual — the algorithm identifies composition patterns typical of before/after shots, not just the content.</p>

          <div style={errorStyle}>
            <p style={{ margin: 0, fontSize: 14, color: '#fca5a5', lineHeight: 1.6 }}>
              <strong>Problem:</strong> Image shows transformation, comparison, or body focus that violates personal health policies.
            </p>
          </div>
          <div style={fixStyle}>
            <p style={{ margin: 0, fontSize: 14, color: '#6ee7b7', lineHeight: 1.6 }}>
              <strong>Fix:</strong> Use lifestyle imagery instead of transformation imagery. Focus on the activity, not the result. Show the product in use rather than the effect on the body.
            </p>
          </div>
        </div>

        {/* Reason 6 */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>6. Sensational or Clickbait Visual Style</h2>
          <p style={pStyle}>Images designed to shock, disturb, or provoke excessive curiosity — red circles, dramatic arrows, extreme close-ups of body parts, exaggerated facial expressions — trigger Meta's sensationalism filters.</p>
          <p style={pStyle}>This was a major ecommerce trend in 2018-2022 (the "weird product" ad style). Meta has since trained its models specifically to detect these patterns.</p>

          <div style={errorStyle}>
            <p style={{ margin: 0, fontSize: 14, color: '#fca5a5', lineHeight: 1.6 }}>
              <strong>Problem:</strong> Image uses visual tricks (circles, arrows, shock imagery) designed to force attention.
            </p>
          </div>
          <div style={fixStyle}>
            <p style={{ margin: 0, fontSize: 14, color: '#6ee7b7', lineHeight: 1.6 }}>
              <strong>Fix:</strong> Use clean, professional product photography or lifestyle imagery. The creative should earn attention through quality, not manipulation.
            </p>
          </div>
        </div>

        {/* Checklist */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>Pre-Upload Checklist</h2>
          <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 24px' }}>
            {[
              'Image is 1080×1080, 1080×1350, 1200×628, or 1080×1920px',
              'File size is under 30MB (under 1MB recommended)',
              'File format is JPG or PNG',
              'Text covers less than 20% of image area',
              'No before/after or body transformation imagery',
              'No shock, sensationalism, or exaggerated expressions',
              'EXIF/GPS metadata has been stripped',
              'Image has not been previously rejected',
              'No prohibited product categories (weapons, drugs, misleading health claims)',
              'Image matches the landing page content',
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: idx < 9 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={calloutStyle}>
          <p style={{ margin: '0 0 12px', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            <strong style={{ color: '#a5b4fc' }}>MetaClean handles the technical items automatically</strong> — correct sizing, compression, and metadata removal. The policy items (text %, content type) you control in your creative design.
          </p>
          <Link href="/dashboard" style={{ display: 'inline-block', padding: '9px 18px', background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'white', textDecoration: 'none' }}>
            Clean your creatives →
          </Link>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>Frequently Asked Questions</h2>
          {[
            { q: 'How long does Meta ad review take?', a: 'Most ads are reviewed within 24 hours. Ads submitted on weekends or holidays can take up to 48 hours. If your ad is still "In Review" after 48 hours, duplicate the ad set and resubmit — sometimes the review queue gets stuck.' },
            { q: 'Can I appeal a rejected Meta ad?', a: 'Yes — in Ads Manager, find the rejected ad, click "See Details", then "Request Review". Human reviewers handle appeals. If you believe the rejection was a false positive, always appeal rather than just creating a new ad with the same content.' },
            { q: 'Why does Meta keep rejecting my ad with no clear reason?', a: 'Meta\'s automated system gives generic rejection messages. The actual trigger could be metadata, image hash, or a subtle policy flag. Try: strip metadata, resize to exact specs, change the image slightly (crop, brightness, saturation), and resubmit.' },
            { q: 'Does removing metadata really help with ad rejections?', a: 'Yes, for a specific category of false positives. Images with GPS data from certain locations, or images carrying metadata from software flagged in previous policy violations, can trigger automated review filters. Stripping metadata removes this risk.' },
            { q: 'What happens to my ad account if I keep getting rejections?', a: 'Repeated rejections increase your "policy violation history" which raises your risk score. Too many violations can lead to ad account restrictions or bans. Fix rejections quickly, appeal false positives, and keep your rejection rate low.' },
          ].map((item, idx) => (
            <div key={idx} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: idx < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 8, marginTop: 0, letterSpacing: '-0.3px' }}>{item.q}</h3>
              <p style={{ ...pStyle, margin: 0 }}>{item.a}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: '32px 36px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 10, marginTop: 0 }}>Stop getting rejected for technical reasons.</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 24, lineHeight: 1.6 }}>MetaClean strips metadata, fixes dimensions, and compresses to spec — automatically. Free to try, no account needed.</p>
          <Link href="/dashboard" style={{ display: 'inline-block', padding: '13px 28px', background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)', borderRadius: 10, fontSize: 15, fontWeight: 600, color: 'white', textDecoration: 'none' }}>
            Try MetaClean free →
          </Link>
        </div>

      </article>
    </div>
  )
}
