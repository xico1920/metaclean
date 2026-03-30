import Link from 'next/link'
import SiteNav from '@/app/components/SiteNav'

export const metadata = {
  title: 'TikTok Ads Image & Video Sizes: The Complete 2025 Guide',
  description: 'Every TikTok ad image and video size, aspect ratio, and file limit — In-Feed, TopView, Spark Ads, and more. Updated for 2025.',
  alternates: { canonical: 'https://metaclean.pro/blog/tiktok-ads-image-size' },
  openGraph: {
    title: 'TikTok Ads Image & Video Sizes: The Complete 2025 Guide',
    description: 'Every TikTok ad image and video size, aspect ratio, and file limit — In-Feed, TopView, Spark Ads, and more.',
    url: 'https://metaclean.pro/blog/tiktok-ads-image-size',
    type: 'article',
    publishedTime: '2025-03-30',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'TikTok Ads Image & Video Sizes: The Complete 2025 Guide',
  description: 'Every TikTok ad image and video size, aspect ratio, and file limit.',
  datePublished: '2025-03-30',
  author: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  publisher: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://metaclean.pro/blog/tiktok-ads-image-size' },
}

const pStyle = { fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: '0 0 16px' }
const h2Style = { fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', color: 'white', marginBottom: 16, marginTop: 0 }
const tableWrap = { background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: 13 }
const thStyle = { textAlign: 'left', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }
const tdStyle = { padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', verticalAlign: 'top' }
const highlightTd = { ...tdStyle, color: '#a5b4fc', fontWeight: 600 }
const calloutStyle = { background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }
const warnStyle = { background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }

export default function TikTokAdsSizes() {
  return (
    <div style={{ minHeight: '100vh', background: '#060609', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          <Link href="/blog" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Blog</Link>
          <span>›</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>TikTok Ads Image Sizes</span>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#f472b6', background: 'rgba(244,114,182,0.1)', border: '1px solid rgba(244,114,182,0.2)', borderRadius: 6, padding: '2px 8px' }}>TikTok Ads</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>March 30, 2025</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>·</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>5 min read</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 16, color: 'white' }}>
            TikTok Ads Image & Video Sizes: The Complete 2025 Guide
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>
            TikTok is unforgiving with creative specs. Wrong size, wrong file weight — and your ad won't deliver. Here's everything you need.
          </p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <p style={pStyle}>TikTok ads are almost exclusively vertical. The platform was built for 9:16 full-screen content and everything else gets cropped, letterboxed, or simply rejected. If you're coming from Facebook advertising, the most important shift is: <strong style={{ color: 'rgba(255,255,255,0.85)' }}>think vertical first.</strong></p>
          <p style={pStyle}>TikTok also has strict file size limits — images must be under 500KB. This is much tighter than Meta's 30MB limit and means you need to compress images properly before uploading.</p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>Quick Reference: All TikTok Ad Sizes</h2>
          <div style={tableWrap}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Ad Type</th>
                  <th style={thStyle}>Resolution</th>
                  <th style={thStyle}>Ratio</th>
                  <th style={thStyle}>Max File Size</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={highlightTd}>In-Feed Image</td><td style={tdStyle}>1080 × 1920 px</td><td style={tdStyle}>9:16</td><td style={tdStyle}>500 KB</td></tr>
                <tr><td style={highlightTd}>In-Feed Square</td><td style={tdStyle}>1080 × 1080 px</td><td style={tdStyle}>1:1</td><td style={tdStyle}>500 KB</td></tr>
                <tr><td style={highlightTd}>In-Feed Landscape</td><td style={tdStyle}>1920 × 1080 px</td><td style={tdStyle}>16:9</td><td style={tdStyle}>500 KB</td></tr>
                <tr><td style={highlightTd}>TopView</td><td style={tdStyle}>1080 × 1920 px</td><td style={tdStyle}>9:16</td><td style={tdStyle}>500 KB</td></tr>
                <tr><td style={highlightTd}>Spark Ads</td><td style={tdStyle}>Match original post</td><td style={tdStyle}>Any</td><td style={tdStyle}>—</td></tr>
                <tr><td style={highlightTd}>Brand Takeover</td><td style={tdStyle}>1080 × 1920 px</td><td style={tdStyle}>9:16</td><td style={tdStyle}>500 KB</td></tr>
              </tbody>
            </table>
          </div>

          <div style={warnStyle}>
            <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              <strong style={{ color: '#fbbf24' }}>500KB limit:</strong> TikTok's image file size limit is much stricter than other platforms. A standard 1080×1920 JPG from a camera or Photoshop will typically be 2–5MB — you must compress it before uploading. MetaClean handles this automatically.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>TikTok In-Feed Ads</h2>
          <p style={pStyle}>In-Feed ads appear between organic content as users scroll. They blend into the For You page experience and are the most common format for performance advertisers.</p>
          <div style={tableWrap}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Spec</th>
                  <th style={thStyle}>Requirement</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={highlightTd}>Recommended size</td><td style={tdStyle}>1080 × 1920 px (9:16)</td></tr>
                <tr><td style={highlightTd}>Min resolution</td><td style={tdStyle}>540 × 960 px</td></tr>
                <tr><td style={highlightTd}>File format</td><td style={tdStyle}>JPG, PNG</td></tr>
                <tr><td style={highlightTd}>File size</td><td style={tdStyle}>≤ 500 KB</td></tr>
                <tr><td style={highlightTd}>Safe zone</td><td style={tdStyle}>Keep content away from bottom 130px (CTA area)</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>Safe Zone: What Gets Covered by TikTok's UI</h2>
          <p style={pStyle}>TikTok overlays its UI on top of your creative. If you put important content (text, faces, products) in these areas, they'll be covered:</p>
          <div style={tableWrap}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Area</th>
                  <th style={thStyle}>Coverage</th>
                  <th style={thStyle}>What covers it</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={highlightTd}>Bottom</td><td style={tdStyle}>Bottom 130px</td><td style={tdStyle}>CTA button, ad label, description</td></tr>
                <tr><td style={highlightTd}>Right side</td><td style={tdStyle}>Right 80px</td><td style={tdStyle}>Like, comment, share buttons</td></tr>
                <tr><td style={highlightTd}>Top</td><td style={tdStyle}>Top 60px</td><td style={tdStyle}>Profile name, ad label</td></tr>
              </tbody>
            </table>
          </div>
          <p style={pStyle}>Keep your product, face, and any text within the safe zone: roughly <strong style={{ color: 'rgba(255,255,255,0.85)' }}>center 900×1640px</strong> of the 1080×1920 frame.</p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>Why TikTok Compresses Your Images</h2>
          <p style={pStyle}>TikTok recompresses every image you upload. If you upload at exactly 500KB, TikTok will compress it further for delivery — so you want to start with the highest quality possible within the limit.</p>
          <p style={pStyle}>The best approach: export your creative at high quality, then use a tool to reduce to under 500KB while maintaining visual quality. MetaClean does this automatically — it compresses to the platform limit without visible quality loss.</p>

          <div style={calloutStyle}>
            <p style={{ margin: '0 0 12px', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              <strong style={{ color: '#a5b4fc' }}>MetaClean auto-compresses to 500KB</strong> when you select TikTok as the platform — no manual compression needed.
            </p>
            <Link href="/dashboard" style={{ display: 'inline-block', padding: '9px 18px', background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'white', textDecoration: 'none' }}>
              Try it free →
            </Link>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>Frequently Asked Questions</h2>
          {[
            { q: 'What is the best image size for TikTok ads?', a: '1080×1920px (9:16 vertical) is the recommended size for all TikTok ad placements. It fills the full screen and delivers the best visual impact. Always design for vertical mobile viewing first.' },
            { q: 'What file size limit does TikTok have for images?', a: 'TikTok limits image ads to 500KB. This is significantly stricter than Meta (30MB) or Google (5MB). You must compress your images before uploading — a standard camera JPG at 1080×1920 will be 3-5MB and will be rejected.' },
            { q: 'Can I use a square image for TikTok ads?', a: 'Yes — TikTok supports 1:1 (1080×1080px) and 16:9 (1920×1080px) for In-Feed ads, but 9:16 vertical performs significantly better. Vertical content feels native to the platform; square and landscape formats feel like imported ads.' },
            { q: 'What is a Spark Ad on TikTok?', a: 'Spark Ads let you boost existing organic TikTok posts as ads. Since you\'re using an existing post, the size is whatever the original content was. This format often outperforms standard In-Feed ads because it looks completely native.' },
            { q: 'Do TikTok ads need metadata removed?', a: 'Yes — as with all ad platforms, stripping EXIF metadata from images before uploading is best practice. It reduces file size slightly (helping with the 500KB limit) and removes location/device data that could trigger content filters.' },
          ].map((item, idx) => (
            <div key={idx} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: idx < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 8, marginTop: 0, letterSpacing: '-0.3px' }}>{item.q}</h3>
              <p style={{ ...pStyle, margin: 0 }}>{item.a}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: '32px 36px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 10, marginTop: 0 }}>Resize & compress for TikTok in seconds.</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 24, lineHeight: 1.6 }}>Upload once, get 1080×1920 at under 500KB — metadata stripped, ready to upload.</p>
          <Link href="/dashboard" style={{ display: 'inline-block', padding: '13px 28px', background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)', borderRadius: 10, fontSize: 15, fontWeight: 600, color: 'white', textDecoration: 'none' }}>
            Try MetaClean free →
          </Link>
        </div>

      </article>
    </div>
  )
}
