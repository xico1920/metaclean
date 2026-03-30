'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BlogPost from '@/app/components/BlogPost'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Meta Ads Image Sizes: The Complete 2025 Guide',
  description: 'Every Facebook and Instagram ad image size in one place — Feed, Stories, Reels, Carousel, and Collection.',
  datePublished: '2025-03-30',
  author: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  publisher: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://metaclean.pro/blog/meta-ads-image-size' },
}

const sectionStyle = {
  marginBottom: 48,
}

const h2Style = {
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: '-0.5px',
  color: 'white',
  marginBottom: 16,
  marginTop: 0,
}

const pStyle = {
  fontSize: 15,
  color: 'rgba(255,255,255,0.6)',
  lineHeight: 1.75,
  margin: '0 0 16px',
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
  marginBottom: 8,
}

const thStyle = {
  textAlign: 'left',
  padding: '10px 14px',
  background: 'rgba(255,255,255,0.03)',
  borderBottom: '1px solid rgba(255,255,255,0.07)',
  color: 'rgba(255,255,255,0.4)',
  fontWeight: 600,
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const tdStyle = {
  padding: '10px 14px',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  color: 'rgba(255,255,255,0.7)',
  verticalAlign: 'top',
}

const highlightTd = {
  ...tdStyle,
  color: '#a5b4fc',
  fontWeight: 600,
}

const tableWrap = {
  background: '#0d0d14',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 12,
  overflow: 'hidden',
  marginBottom: 32,
}

const calloutStyle = {
  background: 'rgba(99,102,241,0.08)',
  border: '1px solid rgba(99,102,241,0.2)',
  borderRadius: 12,
  padding: '16px 20px',
  marginBottom: 32,
}

export default function MetaAdsSizes() {
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

      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#818cf8', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 6, padding: '2px 8px' }}>Meta Ads</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>March 30, 2025</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>·</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>6 min read</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 16, color: 'white' }}>
          Meta Ads Image Sizes: The Complete 2025 Guide
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>
          Every Facebook and Instagram ad image size in one place — Feed, Stories, Reels, Carousel, and Collection. Updated for 2025.
        </p>
      </div>

      {/* Intro */}
      <div style={sectionStyle}>
        <p style={pStyle}>
          Getting your image sizes wrong is one of the most common reasons Meta rejects ad creatives. Too small and Meta won't serve them. Wrong aspect ratio and they get cropped badly. Over the file size limit and your upload fails silently.
        </p>
        <p style={pStyle}>
          This guide covers every required size, aspect ratio, and file limit for Meta ads in 2025 — across Facebook Feed, Instagram Feed, Stories, Reels, and Carousel formats.
        </p>
      </div>

      {/* Quick reference */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Quick Reference: All Meta Ad Image Sizes</h2>
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Format</th>
                <th style={thStyle}>Resolution</th>
                <th style={thStyle}>Aspect Ratio</th>
                <th style={thStyle}>Max File Size</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>Feed (Square)</td><td style={tdStyle}>1080 × 1080 px</td><td style={tdStyle}>1:1</td><td style={tdStyle}>30 MB</td></tr>
              <tr><td style={highlightTd}>Feed (Portrait)</td><td style={tdStyle}>1080 × 1350 px</td><td style={tdStyle}>4:5</td><td style={tdStyle}>30 MB</td></tr>
              <tr><td style={highlightTd}>Feed (Landscape)</td><td style={tdStyle}>1200 × 628 px</td><td style={tdStyle}>1.91:1</td><td style={tdStyle}>30 MB</td></tr>
              <tr><td style={highlightTd}>Stories & Reels</td><td style={tdStyle}>1080 × 1920 px</td><td style={tdStyle}>9:16</td><td style={tdStyle}>30 MB</td></tr>
              <tr><td style={highlightTd}>Carousel</td><td style={tdStyle}>1080 × 1080 px</td><td style={tdStyle}>1:1</td><td style={tdStyle}>30 MB</td></tr>
              <tr><td style={highlightTd}>Collection Cover</td><td style={tdStyle}>1200 × 628 px</td><td style={tdStyle}>1.91:1</td><td style={tdStyle}>30 MB</td></tr>
              <tr><td style={highlightTd}>Right Column</td><td style={tdStyle}>1200 × 1200 px</td><td style={tdStyle}>1:1</td><td style={tdStyle}>30 MB</td></tr>
            </tbody>
          </table>
        </div>

        <div style={calloutStyle}>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            <strong style={{ color: '#a5b4fc' }}>Tip:</strong> Meta recommends the <strong style={{ color: 'white' }}>4:5 portrait format (1080×1350)</strong> for Feed placements — it takes up the most screen real estate and typically gets more attention than square or landscape.
          </p>
        </div>
      </div>

      {/* Why sizes matter */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Why Image Size Affects Ad Performance</h2>
        <p style={pStyle}>
          Meta's algorithm doesn't just check if your image is technically valid — it also affects delivery. Images that perfectly match the placement ratio get more surface area on screen, which directly impacts CTR.
        </p>
        <p style={pStyle}>
          If you upload a 1920×1080 landscape image to a Feed placement, Meta will crop it to fit. You lose control of what shows, and subjects often get cut out. The fix is to resize before you upload, not after.
        </p>
      </div>

      {/* Facebook Feed */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Facebook Feed Image Sizes</h2>
        <p style={pStyle}>
          Facebook Feed supports three aspect ratios. Meta will automatically crop any image that falls outside the 1.91:1 to 4:5 range — so anything taller than 4:5 gets cropped to 4:5.
        </p>
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Recommended Size</th>
                <th style={thStyle}>Min Size</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>Square</td><td style={tdStyle}>1080 × 1080 px</td><td style={tdStyle}>600 × 600 px</td></tr>
              <tr><td style={highlightTd}>Portrait</td><td style={tdStyle}>1080 × 1350 px</td><td style={tdStyle}>600 × 750 px</td></tr>
              <tr><td style={highlightTd}>Landscape</td><td style={tdStyle}>1200 × 628 px</td><td style={tdStyle}>600 × 314 px</td></tr>
            </tbody>
          </table>
        </div>
        <p style={pStyle}>
          <strong style={{ color: 'rgba(255,255,255,0.85)' }}>File type:</strong> JPG or PNG. JPG is preferred for photos (smaller file size, same visual quality). PNG for graphics with text or transparency.
        </p>
      </div>

      {/* Instagram */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Instagram Feed & Stories Image Sizes</h2>
        <p style={pStyle}>
          Instagram Feed follows the same sizes as Facebook Feed. Stories and Reels use the full vertical screen — 9:16.
        </p>
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Placement</th>
                <th style={thStyle}>Size</th>
                <th style={thStyle}>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>Feed Square</td><td style={tdStyle}>1080 × 1080 px</td><td style={tdStyle}>Most versatile</td></tr>
              <tr><td style={highlightTd}>Feed Portrait</td><td style={tdStyle}>1080 × 1350 px</td><td style={tdStyle}>Best for mobile CTR</td></tr>
              <tr><td style={highlightTd}>Stories</td><td style={tdStyle}>1080 × 1920 px</td><td style={tdStyle}>Keep safe zone: top/bottom 250px</td></tr>
              <tr><td style={highlightTd}>Reels</td><td style={tdStyle}>1080 × 1920 px</td><td style={tdStyle}>Same as Stories</td></tr>
              <tr><td style={highlightTd}>Explore</td><td style={tdStyle}>1080 × 1080 px</td><td style={tdStyle}>Square only</td></tr>
            </tbody>
          </table>
        </div>

        <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }}>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            <strong style={{ color: '#fbbf24' }}>Stories safe zone:</strong> Keep important content (text, faces, CTAs) within the middle 1080×1420px. The top 250px and bottom 250px are covered by the UI (profile icon, CTA button).
          </p>
        </div>
      </div>

      {/* Metadata section */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Why Meta Rejects Images: The Metadata Problem</h2>
        <p style={pStyle}>
          Even perfectly sized images can get flagged. One of the less obvious reasons is <strong style={{ color: 'rgba(255,255,255,0.85)' }}>EXIF metadata</strong> — hidden data embedded in your image file that can include GPS coordinates, camera model, software used, and timestamps.
        </p>
        <p style={pStyle}>
          Some ad platforms scan this data. Images from certain cameras or editing software get flagged algorithmically, especially if the metadata suggests the image was previously used or was taken in a specific location that triggers policy filters.
        </p>
        <p style={pStyle}>
          The fix is simple: strip the metadata before uploading. Tools like MetaClean do this automatically alongside resizing — you upload once and get clean, correctly-sized creatives for every placement.
        </p>
      </div>

      {/* How to resize */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>How to Resize Images for Meta Ads (The Fast Way)</h2>
        <p style={pStyle}>
          Manually resizing every creative to 7 different sizes in Photoshop takes 20–30 minutes per image. For agencies and media buyers running multiple clients or SKUs, this adds up fast.
        </p>
        <p style={pStyle}>The automated workflow:</p>
        <ol style={{ paddingLeft: 20, margin: '0 0 16px' }}>
          <li style={{ ...pStyle, margin: '0 0 8px' }}>Upload your original high-resolution image (ideally 2000px+ on the short side)</li>
          <li style={{ ...pStyle, margin: '0 0 8px' }}>Select the Meta platform in MetaClean</li>
          <li style={{ ...pStyle, margin: '0 0 8px' }}>Choose which formats you need (or select all)</li>
          <li style={{ ...pStyle, margin: '0 0 8px' }}>Adjust crop position for each format if needed (or use AI autocrop)</li>
          <li style={{ ...pStyle, margin: '0 0 8px' }}>Download — all formats in a single ZIP, metadata stripped, ready to upload</li>
        </ol>

        <div style={calloutStyle}>
          <p style={{ margin: '0 0 12px', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            <strong style={{ color: '#a5b4fc' }}>MetaClean handles this automatically.</strong> Upload your image, pick Meta, and get all 4 formats (1:1, 4:5, 9:16, 1.91:1) in one download — with EXIF stripped.
          </p>
          <Link href="/dashboard" style={{
            display: 'inline-block',
            padding: '9px 18px',
            background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            color: 'white',
            textDecoration: 'none',
            letterSpacing: '-0.2px',
          }}>
            Try it free — no account needed →
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Frequently Asked Questions</h2>

        {[
          {
            q: 'What is the best image size for Meta ads in 2025?',
            a: 'The 4:5 portrait format (1080×1350px) performs best on mobile Feed placements because it occupies more screen space. For multi-placement campaigns, use 1:1 (1080×1080px) as it works across Feed, Stories (with cropping), and Carousel.'
          },
          {
            q: 'What file size limit does Meta have for ad images?',
            a: 'Meta allows up to 30MB for image ads. In practice, keep JPGs under 1MB for faster loading and better delivery. Large files slow down ad loading, which hurts performance on slower connections.'
          },
          {
            q: 'Can I use the same image for Facebook and Instagram ads?',
            a: 'Yes — if you use 1:1 or 4:5 formats. These work across both platforms. Just ensure your creative was designed to work vertically for mobile placements.'
          },
          {
            q: 'Why does Meta crop my images automatically?',
            a: 'Meta crops images that fall outside the supported aspect ratio range (1.91:1 to 4:5). If your image is wider or taller than these limits, Meta will center-crop it. Always resize to the exact target format to maintain control over composition.'
          },
          {
            q: 'Do I need to remove EXIF data from my ad images?',
            a: 'It\'s best practice. EXIF metadata can reveal GPS location, camera model, and editing software. Some platforms use this data in content review. Stripping it before upload reduces the chance of unnecessary flags and protects privacy.'
          },
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
