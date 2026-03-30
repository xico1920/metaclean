import Link from 'next/link'
import SiteNav from '@/app/components/SiteNav'

export const metadata = {
  title: 'Pinterest Ads Image Sizes: Complete Guide for 2025',
  description: 'Every Pinterest ad image size — Standard Pins, Video Pins, Shopping Ads, Idea Ads, and Carousel. Aspect ratios, file limits, and best practices for Pinterest advertising.',
  alternates: { canonical: 'https://metaclean.pro/blog/pinterest-ads-image-size' },
  openGraph: {
    title: 'Pinterest Ads Image Sizes: Complete Guide for 2025',
    description: 'Every Pinterest ad image size — Standard Pins, Video Pins, Shopping Ads, Idea Ads, and Carousel.',
    url: 'https://metaclean.pro/blog/pinterest-ads-image-size',
    type: 'article',
    publishedTime: '2025-03-30',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Pinterest Ads Image Sizes: Complete Guide for 2025',
  description: 'Every Pinterest ad image size — Standard Pins, Video Pins, Shopping Ads, Idea Ads, and Carousel.',
  datePublished: '2025-03-30',
  author: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  publisher: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://metaclean.pro/blog/pinterest-ads-image-size' },
}

const pStyle = { fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: '0 0 16px' }
const h2Style = { fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', color: 'white', marginBottom: 16, marginTop: 0 }
const tableWrap = { background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: 13 }
const thStyle = { textAlign: 'left', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }
const tdStyle = { padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', verticalAlign: 'top' }
const highlightTd = { ...tdStyle, color: '#a5b4fc', fontWeight: 600 }
const calloutStyle = { background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }
const tipStyle = { background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }

export default function PinterestAdsSizes() {
  return (
    <div style={{ minHeight: '100vh', background: '#060609', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          <Link href="/blog" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Blog</Link>
          <span>›</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Pinterest Ads Image Sizes</span>
        </div>

        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#f87171', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 6, padding: '2px 8px' }}>Pinterest Ads</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>March 30, 2025</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>·</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>5 min read</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 16, color: 'white' }}>
            Pinterest Ads Image Sizes: Complete Guide for 2025
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>
            Pinterest is a visual search engine with 500M+ monthly users in high purchase-intent mode. Getting your creative specs right is the first step to standing out in the feed.
          </p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <p style={pStyle}>Pinterest is fundamentally different from other ad platforms. Users come to Pinterest to discover and plan purchases — not to scroll mindlessly. The intent is higher, the creative standards are higher, and the sizes are vertical by default.</p>
          <p style={pStyle}>Pinterest's feed is a masonry grid. Taller images take up more space and get more visual attention. That's why the 2:3 ratio (1000×1500px) is the dominant format — it gives you maximum feed real estate.</p>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>Quick Reference: Pinterest Ad Image Sizes</h2>
          <div style={tableWrap}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Ad Format</th>
                  <th style={thStyle}>Recommended Size</th>
                  <th style={thStyle}>Aspect Ratio</th>
                  <th style={thStyle}>Max File Size</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={highlightTd}>Standard Pin</td><td style={tdStyle}>1000 × 1500 px</td><td style={tdStyle}>2:3</td><td style={tdStyle}>20 MB</td></tr>
                <tr><td style={highlightTd}>Square Pin</td><td style={tdStyle}>1000 × 1000 px</td><td style={tdStyle}>1:1</td><td style={tdStyle}>20 MB</td></tr>
                <tr><td style={highlightTd}>Long Pin</td><td style={tdStyle}>1000 × 2100 px</td><td style={tdStyle}>1:2.1</td><td style={tdStyle}>20 MB</td></tr>
                <tr><td style={highlightTd}>Shopping Ad</td><td style={tdStyle}>1000 × 1500 px</td><td style={tdStyle}>2:3</td><td style={tdStyle}>20 MB</td></tr>
                <tr><td style={highlightTd}>Carousel (per image)</td><td style={tdStyle}>1000 × 1500 px</td><td style={tdStyle}>1:1 or 2:3</td><td style={tdStyle}>20 MB</td></tr>
                <tr><td style={highlightTd}>Collections</td><td style={tdStyle}>1000 × 1500 px (hero)</td><td style={tdStyle}>2:3</td><td style={tdStyle}>20 MB</td></tr>
              </tbody>
            </table>
          </div>

          <div style={tipStyle}>
            <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              <strong style={{ color: '#fbbf24' }}>Pinterest tip:</strong> Pinterest crops images taller than 1:2.1 in the feed. If you create an image taller than 2100px at 1000px wide, the bottom will be cut off in search results. The sweet spot is 1000×1500px (2:3).
            </p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>Standard Pin Ads</h2>
          <p style={pStyle}>Standard Pin ads look like regular organic Pins. They appear in the home feed, search results, and the "More like this" section. The format blends with organic content and typically has lower CPMs than disruptive formats on other platforms.</p>
          <div style={tableWrap}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Spec</th>
                  <th style={thStyle}>Requirement</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={highlightTd}>Recommended size</td><td style={tdStyle}>1000 × 1500 px</td></tr>
                <tr><td style={highlightTd}>Minimum size</td><td style={tdStyle}>600 × 900 px</td></tr>
                <tr><td style={highlightTd}>Maximum ratio</td><td style={tdStyle}>1:2.1 (taller gets cropped)</td></tr>
                <tr><td style={highlightTd}>File format</td><td style={tdStyle}>JPG, PNG</td></tr>
                <tr><td style={highlightTd}>File size</td><td style={tdStyle}>≤ 20 MB</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>Shopping Ads</h2>
          <p style={pStyle}>Shopping Ads pull from your product catalog and show product name, price, and availability automatically. They're the highest-intent format on Pinterest — users clicking them are actively looking to buy.</p>
          <p style={pStyle}>Shopping Ads use the same image specs as Standard Pins (2:3, 1000×1500px) but require a connected product catalog. The product title and price are automatically overlaid below your image in the feed.</p>
          <div style={tipStyle}>
            <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              <strong style={{ color: '#fbbf24' }}>Shopping Ads tip:</strong> Use clean product photography on a white or light background. The product should fill 70-80% of the frame. Avoid lifestyle shots for Shopping Ads — users want to see exactly what they're buying.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>Carousel Ads</h2>
          <p style={pStyle}>Carousel Ads let you show 2-5 images in a single ad unit. Each card can link to a different URL — useful for showcasing product variants, steps in a process, or a collection.</p>
          <div style={tableWrap}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Spec</th>
                  <th style={thStyle}>Requirement</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={highlightTd}>Images per carousel</td><td style={tdStyle}>2–5 images</td></tr>
                <tr><td style={highlightTd}>Recommended size</td><td style={tdStyle}>1000 × 1500 px (2:3) or 1000 × 1000 px (1:1)</td></tr>
                <tr><td style={highlightTd}>All images must match</td><td style={tdStyle}>Same aspect ratio across all cards</td></tr>
                <tr><td style={highlightTd}>File format</td><td style={tdStyle}>JPG, PNG</td></tr>
                <tr><td style={highlightTd}>File size per image</td><td style={tdStyle}>≤ 20 MB</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>Creative Best Practices for Pinterest Ads</h2>
          <p style={pStyle}>Pinterest has its own creative culture. What works on Facebook often underperforms on Pinterest, and vice versa.</p>

          {[
            { title: 'Vertical is non-negotiable', body: '85% of Pinterest users are on mobile. Vertical 2:3 images fill the screen and outperform square or landscape. Always design vertical-first for Pinterest.' },
            { title: 'High-quality imagery wins', body: 'Pinterest users have high visual standards. Blurry, low-resolution, or poorly lit images perform significantly worse than clean, bright photography. Minimum 1000px wide, ideally 2000px+.' },
            { title: 'Add text overlay strategically', body: 'Unlike Meta, Pinterest users expect some text on Pins. A clear headline (recipe name, product name, how-to title) helps your Pin stand out in search results. Keep it readable at thumbnail size.' },
            { title: 'Use lifestyle context', body: 'Pinterest is aspirational. Show products in use — in a home, worn by a person, in a setting that matches the buyer\'s aspiration. Pure product shots work for Shopping Ads; lifestyle works better for everything else.' },
            { title: 'Brand in the corner', body: 'Add your logo or website URL in a corner of the Pin image. Pinterest content gets repinned and shared — branded Pins continue working for you long after the paid campaign ends.' },
          ].map((item, idx) => (
            <div key={idx} style={{ marginBottom: 20, padding: '16px 20px', background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 6, marginTop: 0 }}>{idx + 1}. {item.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6 }}>{item.body}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 48 }}>
          <h2 style={h2Style}>Frequently Asked Questions</h2>
          {[
            { q: 'What is the best image size for Pinterest ads?', a: '1000×1500px (2:3 aspect ratio) is the recommended size for all standard Pinterest ad formats. It fills the maximum feed space without being cropped, and performs best on mobile where 85%+ of Pinterest traffic comes from.' },
            { q: 'Can I use landscape images for Pinterest ads?', a: 'Technically yes, but it\'s strongly discouraged. Landscape images appear much smaller in the masonry feed compared to vertical Pins, reducing visual impact and click-through rates significantly. Always go vertical for Pinterest.' },
            { q: 'What file format should I use for Pinterest ads?', a: 'JPG for photos and complex images. PNG for graphics, text-heavy Pins, or images with transparency. Pinterest allows both formats up to 20MB — much more generous than TikTok\'s 500KB limit.' },
            { q: 'How many images can I use in a Pinterest Carousel?', a: '2 to 5 images per carousel. All images must use the same aspect ratio (either 1:1 or 2:3 — you can\'t mix ratios within one carousel). Each card can link to a different URL.' },
            { q: 'Do Pinterest ads need EXIF metadata removed?', a: 'Best practice yes, as with all ad platforms. Pinterest\'s content moderation system scans image metadata. Stripping it also reduces file size, which improves upload speed and can affect how quickly your ads pass review.' },
          ].map((item, idx) => (
            <div key={idx} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: idx < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 8, marginTop: 0, letterSpacing: '-0.3px' }}>{item.q}</h3>
              <p style={{ ...pStyle, margin: 0 }}>{item.a}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: '32px 36px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 10, marginTop: 0 }}>Resize to Pinterest formats automatically.</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 24, lineHeight: 1.6 }}>Upload once — get 2:3 and 1:1 formats with metadata stripped and ready to upload. Free, no account needed.</p>
          <Link href="/dashboard" style={{ display: 'inline-block', padding: '13px 28px', background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)', borderRadius: 10, fontSize: 15, fontWeight: 600, color: 'white', textDecoration: 'none' }}>
            Try MetaClean free →
          </Link>
        </div>

      </article>
    </div>
  )
}
