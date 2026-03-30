import Link from 'next/link'
import SiteNav from '@/app/components/SiteNav'

export const metadata = {
  title: 'Blog — Ad Creative Tips & Image Optimization',
  description: 'Guides on image sizing, metadata, and ad creative optimization for Meta, Google, TikTok, and more.',
  alternates: { canonical: 'https://metaclean.pro/blog' },
}

const posts = [
  {
    slug: 'why-meta-rejects-ads',
    title: 'Why Meta Rejects Ad Images (And How to Fix It)',
    description: 'The most common reasons Facebook and Instagram reject your creatives — image size, text overlay, metadata, policy violations — and exactly how to fix each one.',
    date: 'March 30, 2025',
    readTime: '8 min read',
    tag: 'Troubleshooting',
    tagColor: '#f87171',
    tagBg: 'rgba(248,113,113,0.1)',
    tagBorder: 'rgba(248,113,113,0.2)',
  },
  {
    slug: 'meta-ads-image-size',
    title: 'Meta Ads Image Sizes: The Complete 2025 Guide',
    description: 'Every image size and format you need for Facebook and Instagram ads — Feed, Stories, Reels, and more. Plus how to resize in seconds.',
    date: 'March 30, 2025',
    readTime: '6 min read',
    tag: 'Meta Ads',
    tagColor: '#818cf8',
    tagBg: 'rgba(99,102,241,0.1)',
    tagBorder: 'rgba(99,102,241,0.2)',
  },
  {
    slug: 'tiktok-ads-image-size',
    title: 'TikTok Ads Image & Video Sizes: The Complete 2025 Guide',
    description: 'Every TikTok ad image and video size, aspect ratio, and file limit — In-Feed, TopView, Spark Ads, and more. The 500KB limit explained.',
    date: 'March 30, 2025',
    readTime: '5 min read',
    tag: 'TikTok Ads',
    tagColor: '#f472b6',
    tagBg: 'rgba(244,114,182,0.1)',
    tagBorder: 'rgba(244,114,182,0.2)',
  },
  {
    slug: 'google-ads-image-size',
    title: 'Google Ads Image Sizes: Complete Guide for 2025',
    description: 'Every Google Ads image size for Display, Performance Max, Discovery, and Responsive ads. Aspect ratios, file limits, and best practices.',
    date: 'March 30, 2025',
    readTime: '7 min read',
    tag: 'Google Ads',
    tagColor: '#34d399',
    tagBg: 'rgba(52,211,153,0.1)',
    tagBorder: 'rgba(52,211,153,0.2)',
  },
  {
    slug: 'pinterest-ads-image-size',
    title: 'Pinterest Ads Image Sizes: Complete Guide for 2025',
    description: 'Every Pinterest ad image size — Standard Pins, Shopping Ads, Carousel, and Collections. Why 2:3 dominates and how to design for the Pinterest feed.',
    date: 'March 30, 2025',
    readTime: '5 min read',
    tag: 'Pinterest Ads',
    tagColor: '#f87171',
    tagBg: 'rgba(248,113,113,0.1)',
    tagBorder: 'rgba(248,113,113,0.2)',
  },
  {
    slug: 'remove-exif-metadata-images',
    title: 'How to Remove EXIF Metadata from Images (2025 Guide)',
    description: 'What EXIF metadata is, why it matters for ad platforms, and the fastest ways to strip it — online, on Mac, on Windows, and in bulk automatically.',
    date: 'March 30, 2025',
    readTime: '6 min read',
    tag: 'Privacy & Tech',
    tagColor: '#818cf8',
    tagBg: 'rgba(99,102,241,0.1)',
    tagBorder: 'rgba(99,102,241,0.2)',
  },
]

export default function BlogIndex() {
  return (
    <div style={{ minHeight: '100vh', background: '#060609', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif' }}>
      <SiteNav />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.8px', marginBottom: 8 }}>Blog</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', marginBottom: 48 }}>Ad creative tips, image optimization guides, and platform updates.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <div className="blog-card" style={{
                background: '#0d0d14',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14,
                padding: '24px 28px',
                transition: 'border-color 0.2s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: post.tagColor || '#818cf8', background: post.tagBg || 'rgba(99,102,241,0.1)', border: `1px solid ${post.tagBorder || 'rgba(99,102,241,0.2)'}`, borderRadius: 6, padding: '2px 8px', letterSpacing: '0.3px' }}>{post.tag}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{post.date}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>·</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{post.readTime}</span>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.4px', color: 'white', marginBottom: 8 }}>{post.title}</h2>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>{post.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
