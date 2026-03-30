'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BlogPost from '@/app/components/BlogPost'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Remove EXIF Metadata from Images (2025 Guide)',
  description: 'What EXIF metadata is, why you should remove it before uploading to ad platforms, and the fastest ways to strip it.',
  datePublished: '2025-03-30',
  author: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  publisher: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://metaclean.pro/blog/remove-exif-metadata-images' },
}

const pStyle = { fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: '0 0 16px' }
const h2Style = { fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', color: 'white', marginBottom: 16, marginTop: 0 }
const tableWrap = { background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: 13 }
const thStyle = { textAlign: 'left', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }
const tdStyle = { padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', verticalAlign: 'top' }
const highlightTd = { ...tdStyle, color: '#a5b4fc', fontWeight: 600 }
const calloutStyle = { background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }

export default function RemoveExifMetadata() {
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
          <span style={{ fontSize: 11, fontWeight: 600, color: '#818cf8', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 6, padding: '2px 8px' }}>Privacy & Tech</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>March 30, 2025</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>·</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>6 min read</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 16, color: 'white' }}>
          How to Remove EXIF Metadata from Images (2025 Guide)
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>
          Every photo you take contains hidden data — GPS location, camera model, timestamps, and more. Here's what it is, why it matters for advertisers, and how to strip it fast.
        </p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>What Is EXIF Metadata?</h2>
        <p style={pStyle}>EXIF (Exchangeable Image File Format) is data automatically embedded in image files by cameras, smartphones, and editing software. It's invisible when you look at the image — but it's there.</p>
        <p style={pStyle}>When you take a photo on your iPhone, the resulting JPEG contains not just the image — it contains a hidden data block with dozens of fields:</p>

        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Data Type</th>
                <th style={thStyle}>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>GPS Location</td><td style={tdStyle}>Lat: 41.1496° N, Lon: 8.6109° W</td></tr>
              <tr><td style={highlightTd}>Device model</td><td style={tdStyle}>Apple iPhone 15 Pro</td></tr>
              <tr><td style={highlightTd}>Date & time</td><td style={tdStyle}>2025-03-15 14:32:08</td></tr>
              <tr><td style={highlightTd}>Camera settings</td><td style={tdStyle}>f/1.8, 1/500s, ISO 64</td></tr>
              <tr><td style={highlightTd}>Software</td><td style={tdStyle}>Adobe Photoshop 26.0</td></tr>
              <tr><td style={highlightTd}>Copyright</td><td style={tdStyle}>© 2025 Shutterstock Inc.</td></tr>
              <tr><td style={highlightTd}>Color profile</td><td style={tdStyle}>sRGB IEC61966-2.1</td></tr>
              <tr><td style={highlightTd}>Orientation</td><td style={tdStyle}>Rotate 90° CW</td></tr>
            </tbody>
          </table>
        </div>

        <p style={pStyle}>Beyond EXIF, images can also contain <strong style={{ color: 'rgba(255,255,255,0.85)' }}>IPTC</strong> (news/editorial metadata), <strong style={{ color: 'rgba(255,255,255,0.85)' }}>XMP</strong> (Adobe's extended metadata), and <strong style={{ color: 'rgba(255,255,255,0.85)' }}>ICC profiles</strong> (color management data). Together these can add 50-200KB to a file.</p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>Why Advertisers Should Remove Metadata</h2>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 10, marginTop: 0 }}>1. Ad platform policy filters</h3>
          <p style={pStyle}>Meta, TikTok, and Google scan image metadata during ad review. Images with GPS coordinates in certain regions, copyright metadata from stock sites when used without license, or editing software signatures from tools flagged in previous violations — all can trigger automated rejections.</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 10, marginTop: 0 }}>2. Image hash fingerprinting</h3>
          <p style={pStyle}>Ad platforms generate a hash (unique fingerprint) of every image uploaded. When you re-upload a previously rejected image, the hash matches and it gets blocked instantly. Stripping metadata and recompressing changes the binary data — which changes the hash — giving the image a fresh identity.</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 10, marginTop: 0 }}>3. File size reduction</h3>
          <p style={pStyle}>EXIF and IPTC data can add 20-100KB per image. For TikTok ads with a 500KB limit, stripping metadata can mean the difference between passing and failing the file size check without any quality loss.</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 10, marginTop: 0 }}>4. Privacy protection</h3>
          <p style={pStyle}>If you photograph products at your home or studio, your GPS coordinates are embedded in every photo. When you upload to an ad platform, that location data goes with it. Stripping metadata protects your physical location from being exposed.</p>
        </div>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>How to Remove EXIF Metadata</h2>

        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 12, marginTop: 0 }}>Option 1: MetaClean (Fastest — recommended for advertisers)</h3>
          <p style={pStyle}>Upload your image, click process — EXIF, IPTC, GPS, and XMP data are all stripped automatically. Also resizes to ad platform formats simultaneously. Best for media buyers processing multiple images for campaigns.</p>
          <div style={calloutStyle}>
            <p style={{ margin: '0 0 12px', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>Strips all metadata + resizes to every ad format in one step. Free, no account needed.</p>
            <Link href="/dashboard" style={{ display: 'inline-block', padding: '9px 18px', background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'white', textDecoration: 'none' }}>
              Strip metadata free →
            </Link>
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 12, marginTop: 0 }}>Option 2: On Windows (built-in)</h3>
          <p style={pStyle}>Right-click the image → Properties → Details tab → "Remove Properties and Personal Information" → "Remove the following properties from this file" → Select All → OK.</p>
          <p style={pStyle}><strong style={{ color: 'rgba(255,255,255,0.5)' }}>Limitation:</strong> Only removes some EXIF fields. Doesn't remove XMP or IPTC. Doesn't work for batch processing.</p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 12, marginTop: 0 }}>Option 3: On Mac (Preview)</h3>
          <p style={pStyle}>Export the image via File → Export → uncheck "Preserve EXIF data". This removes most metadata but not all — XMP data from Adobe products may persist.</p>
          <p style={pStyle}><strong style={{ color: 'rgba(255,255,255,0.5)' }}>Limitation:</strong> Inconsistent — some metadata survives export. Not reliable for complete removal.</p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 12, marginTop: 0 }}>Option 4: Photoshop (Export As)</h3>
          <p style={pStyle}>File → Export → Export As → uncheck "Metadata". This removes EXIF but may preserve ICC color profiles and some XMP data depending on the version.</p>
        </div>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>What Gets Removed vs What Stays</h2>
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Method</th>
                <th style={thStyle}>EXIF</th>
                <th style={thStyle}>GPS</th>
                <th style={thStyle}>IPTC</th>
                <th style={thStyle}>XMP</th>
                <th style={thStyle}>Batch</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>MetaClean</td><td style={tdStyle}>✓</td><td style={tdStyle}>✓</td><td style={tdStyle}>✓</td><td style={tdStyle}>✓</td><td style={tdStyle}>✓</td></tr>
              <tr><td style={highlightTd}>Windows (built-in)</td><td style={tdStyle}>Partial</td><td style={tdStyle}>✓</td><td style={tdStyle}>✗</td><td style={tdStyle}>✗</td><td style={tdStyle}>✗</td></tr>
              <tr><td style={highlightTd}>Mac Preview</td><td style={tdStyle}>Partial</td><td style={tdStyle}>✓</td><td style={tdStyle}>✗</td><td style={tdStyle}>✗</td><td style={tdStyle}>✗</td></tr>
              <tr><td style={highlightTd}>Photoshop Export As</td><td style={tdStyle}>✓</td><td style={tdStyle}>✓</td><td style={tdStyle}>✓</td><td style={tdStyle}>Partial</td><td style={tdStyle}>✗</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>Frequently Asked Questions</h2>
        {[
          { q: 'Does removing EXIF data affect image quality?', a: 'No. EXIF metadata is stored separately from the image pixel data. Removing it has zero effect on visual quality or resolution. The image looks identical before and after.' },
          { q: 'Does every image have EXIF data?', a: 'Most do — any image taken with a digital camera or smartphone, or edited in Photoshop, Lightroom, or similar software. Screenshots may have device data. PNG files can contain metadata in a different format (tEXt chunks). Even stock images downloaded from Shutterstock or Getty carry license metadata.' },
          { q: 'Is it legal to remove image metadata?', a: 'For images you own or have licensed for use, yes. Don\'t remove copyright metadata from images you don\'t own the rights to — that could constitute copyright infringement (removing copyright management information is illegal in many jurisdictions under DMCA/equivalent laws).' },
          { q: 'How much file size does removing metadata save?', a: 'Typically 20-150KB per image. More for images with extensive IPTC/XMP data (news photos, stock images). Less for simple smartphone photos. For TikTok ads with a 500KB limit, this saving can be significant.' },
          { q: 'Can ad platforms still identify my images after removing metadata?', a: 'Yes — through perceptual hashing (image fingerprinting based on visual content, not file data). This is separate from metadata scanning. If an image was rejected for content reasons (nudity, prohibited products), the visual hash is stored and the image will be identified regardless of metadata.' },
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
