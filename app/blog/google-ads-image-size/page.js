'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BlogPost from '@/app/components/BlogPost'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Google Ads Image Sizes: Complete Guide for 2025',
  description: 'Every Google Ads image size for Display, Performance Max, Discovery, and Responsive ads.',
  datePublished: '2025-03-30',
  author: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  publisher: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://metaclean.pro/blog/google-ads-image-size' },
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

export default function GoogleAdsSizes() {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('metaclean_lang')
    if (saved && ['en', 'pt', 'es'].includes(saved)) setLang(saved)
    const onLang = (e) => setLang(e.detail)
    window.addEventListener('metaclean:lang', onLang)
    return () => window.removeEventListener('metaclean:lang', onLang)
  }, [])

  return (
    <BlogPost>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#34d399', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 6, padding: '2px 8px' }}>Google Ads</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>March 30, 2025</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>·</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>7 min read</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 16, color: 'white' }}>
          Google Ads Image Sizes: Complete Guide for 2025
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>
          Google Display Network reaches 90% of internet users. Getting your image specs right means more placements, better quality scores, and lower CPMs.
        </p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <p style={pStyle}>Google Ads serves images across the Display Network, YouTube, Gmail, and Discover — each with different size requirements. Unlike Meta which focuses on a handful of aspect ratios, Google has historically required specific pixel dimensions for Display ads.</p>
        <p style={pStyle}>With Performance Max and Responsive Display Ads, Google now accepts just a few core ratios and generates variants automatically. But you still need to provide images at the right sizes to unlock all placements.</p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>Quick Reference: Google Ads Image Sizes</h2>
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Format</th>
                <th style={thStyle}>Resolution</th>
                <th style={thStyle}>Ratio</th>
                <th style={thStyle}>Max File Size</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>Landscape</td><td style={tdStyle}>1200 × 628 px</td><td style={tdStyle}>1.91:1</td><td style={tdStyle}>5 MB</td></tr>
              <tr><td style={highlightTd}>Square</td><td style={tdStyle}>1200 × 1200 px</td><td style={tdStyle}>1:1</td><td style={tdStyle}>5 MB</td></tr>
              <tr><td style={highlightTd}>Portrait</td><td style={tdStyle}>960 × 1200 px</td><td style={tdStyle}>4:5</td><td style={tdStyle}>5 MB</td></tr>
              <tr><td style={highlightTd}>Logo (square)</td><td style={tdStyle}>1200 × 1200 px</td><td style={tdStyle}>1:1</td><td style={tdStyle}>5 MB</td></tr>
              <tr><td style={highlightTd}>Logo (landscape)</td><td style={tdStyle}>1200 × 300 px</td><td style={tdStyle}>4:1</td><td style={tdStyle}>5 MB</td></tr>
            </tbody>
          </table>
        </div>

        <div style={warnStyle}>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            <strong style={{ color: '#fbbf24' }}>Important:</strong> For Responsive Display Ads and Performance Max, Google requires <strong style={{ color: 'white' }}>at least one landscape (1.91:1) and one square (1:1)</strong> image. Without both, some placements won't be eligible.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>Responsive Display Ads (RDA)</h2>
        <p style={pStyle}>Responsive Display Ads are Google's standard format. You provide images, headlines, and descriptions — Google assembles them into ads that fit any available placement. You can upload up to 15 images per ad.</p>
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Spec</th>
                <th style={thStyle}>Requirement</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>Landscape image</td><td style={tdStyle}>1200 × 628 px minimum (1.91:1)</td></tr>
              <tr><td style={highlightTd}>Square image</td><td style={tdStyle}>1200 × 1200 px minimum (1:1)</td></tr>
              <tr><td style={highlightTd}>Portrait image</td><td style={tdStyle}>960 × 1200 px minimum (4:5) — optional but recommended</td></tr>
              <tr><td style={highlightTd}>File format</td><td style={tdStyle}>JPG, PNG, GIF (static), SVG</td></tr>
              <tr><td style={highlightTd}>File size</td><td style={tdStyle}>≤ 5 MB</td></tr>
              <tr><td style={highlightTd}>Min resolution</td><td style={tdStyle}>600 × 314 px (landscape), 300 × 300 px (square)</td></tr>
            </tbody>
          </table>
        </div>
        <p style={pStyle}>Google recommends keeping <strong style={{ color: 'rgba(255,255,255,0.85)' }}>text to under 20% of the image area</strong>. Heavy text in images is one of the most common reasons Google gives images a low quality score.</p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>Performance Max Campaigns</h2>
        <p style={pStyle}>Performance Max (PMax) replaced Smart Shopping and runs across all Google channels: Search, Display, YouTube, Gmail, Maps, and Discover. It's the most important campaign type to get right in 2025.</p>
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Asset Type</th>
                <th style={thStyle}>Recommended Size</th>
                <th style={thStyle}>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>Landscape image</td><td style={tdStyle}>1200 × 628 px</td><td style={tdStyle}>Required — unlocks Display & Discover</td></tr>
              <tr><td style={highlightTd}>Square image</td><td style={tdStyle}>1200 × 1200 px</td><td style={tdStyle}>Required — unlocks most placements</td></tr>
              <tr><td style={highlightTd}>Portrait image</td><td style={tdStyle}>960 × 1200 px</td><td style={tdStyle}>Recommended — mobile placements</td></tr>
              <tr><td style={highlightTd}>Square logo</td><td style={tdStyle}>1200 × 1200 px</td><td style={tdStyle}>Required for native ad formats</td></tr>
              <tr><td style={highlightTd}>Landscape logo</td><td style={tdStyle}>1200 × 300 px</td><td style={tdStyle}>Optional but improves native formats</td></tr>
            </tbody>
          </table>
        </div>
        <p style={pStyle}>For PMax, provide <strong style={{ color: 'rgba(255,255,255,0.85)' }}>all 3 image ratios</strong> plus both logo formats. More asset variety = more placement options = better campaign performance. Google's machine learning optimises which combinations perform best over time.</p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>Standard Display Ad Sizes (Fixed)</h2>
        <p style={pStyle}>If you're running traditional Display ads (not Responsive), these are the sizes that reach the most inventory on the Google Display Network:</p>
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Size</th>
                <th style={thStyle}>Coverage</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>Medium Rectangle</td><td style={tdStyle}>300 × 250 px</td><td style={tdStyle}>Highest reach — works on most sites</td></tr>
              <tr><td style={highlightTd}>Large Rectangle</td><td style={tdStyle}>336 × 280 px</td><td style={tdStyle}>High reach</td></tr>
              <tr><td style={highlightTd}>Leaderboard</td><td style={tdStyle}>728 × 90 px</td><td style={tdStyle}>Desktop header placement</td></tr>
              <tr><td style={highlightTd}>Half Page</td><td style={tdStyle}>300 × 600 px</td><td style={tdStyle}>High impact, premium placement</td></tr>
              <tr><td style={highlightTd}>Large Mobile Banner</td><td style={tdStyle}>320 × 100 px</td><td style={tdStyle}>Mobile only</td></tr>
              <tr><td style={highlightTd}>Billboard</td><td style={tdStyle}>970 × 250 px</td><td style={tdStyle}>Desktop premium</td></tr>
            </tbody>
          </table>
        </div>
        <p style={pStyle}>For most advertisers today, <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Responsive Display Ads are the better choice</strong> — they reach more placements with less production effort. Only use fixed-size display ads if you have specific design requirements that Google's assembly can't achieve.</p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>Google's 150KB Recommended File Size</h2>
        <p style={pStyle}>While Google allows up to 5MB, they recommend keeping images under 150KB for faster loading. Page speed affects Quality Score, which affects CPC.</p>
        <p style={pStyle}>A 1200×1200 JPG at 90% quality typically comes out at 300-500KB. To hit 150KB you need to compress to around 70-75% quality — which is usually still visually clean for advertising purposes.</p>
        <div style={calloutStyle}>
          <p style={{ margin: '0 0 12px', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            <strong style={{ color: '#a5b4fc' }}>MetaClean compresses to Google's recommended limits</strong> automatically when you select the Google platform — landscape, square, and portrait formats in one download.
          </p>
          <Link href="/dashboard" style={{ display: 'inline-block', padding: '9px 18px', background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'white', textDecoration: 'none' }}>
            Try it free →
          </Link>
        </div>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>Frequently Asked Questions</h2>
        {[
          { q: 'What is the most important Google Ads image size?', a: '1200×628px (1.91:1 landscape) is required for most placements and should be your first priority. Pair it with 1200×1200px (1:1 square) to unlock the full Display Network and Performance Max placements.' },
          { q: 'What file format should I use for Google Display ads?', a: 'JPG for photos and complex images (smaller file size). PNG for graphics, logos, or images with text (lossless, supports transparency). Avoid GIF unless you specifically need animation.' },
          { q: 'How many images should I upload to Performance Max?', a: 'Upload the maximum allowed: up to 20 images across all ratios. More assets give Google\'s machine learning more combinations to test, which typically improves performance over time. Always include at least landscape, square, and portrait.' },
          { q: 'Why does Google reject my Display ad images?', a: 'Common rejection reasons: images with more than 20% text overlay, blurry or low-resolution images, images with borders that take up more than 20% of the image area, and images that don\'t meet minimum size requirements.' },
          { q: 'Does image metadata affect Google Ads?', a: 'Metadata doesn\'t directly affect Google\'s ad approval, but it does affect file size. Stripping EXIF data can reduce a JPG by 10-50KB — meaningful when targeting the 150KB recommended limit. It also protects location privacy.' },
        ].map((item, idx) => (
          <div key={idx} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: idx < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 8, marginTop: 0, letterSpacing: '-0.3px' }}>{item.q}</h3>
            <p style={{ ...pStyle, margin: 0 }}>{item.a}</p>
          </div>
        ))}
      </div>
    </BlogPost>
  )
}
