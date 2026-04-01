'use client'
import { useState, useEffect } from 'react'
import SiteNav from '@/app/components/SiteNav'
import Footer from '@/app/components/Footer'
import { glowStyle, glowHandlers } from '@/lib/glow'
import Reveal from '@/app/components/Reveal'



// ── Feature section ───────────────────────────────────────────────────────────
function Section({ id, icon, title, badge, badgeColor, intro, items, note }) {
  return (
    <div id={id} className="mb-20 sm:mb-28 scroll-mt-24">

      {/* Header */}
      <Reveal className="flex items-start gap-4 mb-6">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5" style={{background: `${badgeColor}15`, color: badgeColor}}>
          {icon}
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-2" style={{background: `${badgeColor}15`, color: badgeColor}}>
            {badge}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{title}</h2>
        </div>
      </Reveal>

      {/* Intro */}
      <Reveal delay={60} className="mb-7 sm:ml-16">
        <p className="text-gray-400 text-[14px] sm:text-[15px] leading-relaxed">{intro}</p>
      </Reveal>

      {/* Items */}
      <div className="sm:ml-16 grid gap-2.5">
        {items.map((item, idx) => (
          <Reveal key={idx} delay={80 + idx * 55}>
            <div
              className="rounded-xl p-4 sm:p-5 transition-all duration-300 group cursor-default"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `radial-gradient(circle at 20% 50%, ${badgeColor}10 0%, rgba(255,255,255,0.025) 70%)`
                e.currentTarget.style.borderColor = `${badgeColor}30`
                e.currentTarget.style.transform = 'translateX(3px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.transform = 'none'
              }}
              style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.25s ease'}}
            >
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full mt-[7px] shrink-0 transition-all" style={{background: badgeColor}} />
                <div>
                  <p className="text-white font-semibold text-[13px] sm:text-[14px] mb-1">{item.title}</p>
                  <p className="text-gray-500 text-[12px] sm:text-[13px] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {note && (
        <Reveal delay={100 + items.length * 55} className="sm:ml-16 mt-4">
          <div className="px-4 py-3 rounded-xl text-[12px] text-gray-500 flex items-start gap-2.5" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)'}}>
            <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{color: badgeColor}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {note}
          </div>
        </Reveal>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Features() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30)
    return () => clearTimeout(t)
  }, [])

  const entranceStyle = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'none' : 'translateY(-12px)',
    transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  })

  return (
    <main className="min-h-screen bg-[#060609] text-white overflow-x-hidden" style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}>

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px]" style={{background: 'radial-gradient(ellipse at top, rgba(59,130,246,0.06) 0%, transparent 65%)'}} />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px]" style={{background: 'radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 70%)'}} />
      </div>

      <SiteNav />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-24 sm:pb-32">

        {/* Page header */}
        <div className="mb-10 sm:mb-16" style={entranceStyle(60)}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-widest mb-5" style={{background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', color: '#a5b4fc'}}>
            Documentation
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Features</h1>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">Everything MetaClean does to make your images ready for any ad platform.</p>
        </div>

        {/* Jump links */}
        <Reveal y={10} className="mb-12 sm:mb-16">
          <div className="flex gap-2 flex-wrap p-3.5 sm:p-4 rounded-2xl" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)'}}>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest w-full mb-2 font-medium">Jump to</p>
            {[['#metadata', 'Metadata removal', '#3b82f6'], ['#formats', 'Ad formats', '#8b5cf6'], ['#bulk', 'Bulk processing', '#6366f1'], ['#metadata-clean', 'Metadata only', '#6366f1'], ['#ai-autocrop', 'AI Autocrop', '#6366f1'], ['#ai-outpainting', 'AI Outpainting ✦', '#8b5cf6'], ['#ai-copy', 'Auto Ad Copy ✦', '#6366f1']].map(([href, label, color]) => (
              <a
                key={href}
                href={href}
                className="px-3 py-1.5 rounded-lg text-[12px] text-gray-400 hover:text-white transition-all duration-200"
                onMouseEnter={(e) => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.color = 'white' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '' }}
                style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s ease'}}
              >
                {label}
              </a>
            ))}
          </div>
        </Reveal>

        <Section
          id="metadata"
          badgeColor="#3b82f6"
          badge="Feature 01"
          icon={<svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>}
          title="Metadata removal"
          intro="Ad platforms like Meta and Google scan image metadata before approving creatives. Hidden data points can trigger automated rejections. MetaClean strips all of them before your image ever reaches a platform."
          items={[
            { title: 'EXIF data', desc: 'Camera model, lens info, shooting settings, software used — all removed.' },
            { title: 'GPS coordinates', desc: 'Location data embedded by phones and cameras is wiped completely.' },
            { title: 'Timestamps', desc: 'Creation and modification dates that can flag recycled creatives are removed.' },
            { title: 'Device information', desc: 'OS, app version, and device identifiers embedded in the file are stripped.' },
            { title: 'ICC colour profiles', desc: 'Embedded colour profiles that can cause rendering inconsistencies are normalised.' },
            { title: 'Thumbnail previews', desc: 'Embedded thumbnail images that sometimes differ from the actual content are removed.' },
          ]}
          note="All processing happens server-side and files are never stored. Your images are processed in memory and returned immediately."
        />

        <Reveal><div className="h-px mb-20 sm:mb-28" style={{background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)'}} /></Reveal>

        <Section
          id="formats"
          badgeColor="#8b5cf6"
          badge="Feature 02"
          icon={<svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>}
          title="Ad format resizing"
          intro="Every platform has its own required dimensions. MetaClean automatically resizes your images to every supported format — no manual cropping, no distortion, no guesswork."
          items={[
            { title: '1:1 Square (1080×1080px)', desc: 'Standard format for Meta Feed, Google Display, and most social platforms.' },
            { title: '4:5 Portrait (1080×1350px)', desc: 'Best performing format on Meta Feed — more screen real estate, higher engagement.' },
            { title: '9:16 Vertical (1080×1920px)', desc: 'Full screen format for Stories, Reels, TikTok, and YouTube Shorts.' },
            { title: '1.91:1 Landscape (1200×628px)', desc: 'Standard for Meta link ads, Google Display banners, and LinkedIn.' },
            { title: '16:9 Widescreen (1920×1080px)', desc: 'YouTube ads, Google Display campaigns, and video thumbnails.' },
          ]}
          note="Resizing uses smart cropping — the most important area of the image is preserved automatically using content-aware detection."
        />

        <Reveal><div className="h-px mb-20 sm:mb-28" style={{background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)'}} /></Reveal>

        <Section
          id="bulk"
          badgeColor="#6366f1"
          badge="Feature 03"
          icon={<svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
          title="Bulk processing"
          intro="Stop processing images one by one. Drop your entire creative batch and get everything back clean in one go."
          items={[
            { title: 'Up to 50MB per file', desc: 'Works with large, high-resolution images without compression loss.' },
            { title: 'Multiple files simultaneously', desc: 'Upload your entire batch — all files are processed in parallel.' },
            { title: 'Batch download', desc: 'All processed images download automatically as soon as they are ready.' },
            { title: 'Format preservation', desc: 'Input format is preserved — JPG stays JPG, PNG stays PNG, WEBP stays WEBP.' },
            { title: 'Filename handling', desc: 'Output files are prefixed with metaclean_ so you can identify them instantly.' },
          ]}
          note="Free plan: up to 10 images per day. Pro plan: unlimited."
        />

        <Reveal><div className="h-px mb-20 sm:mb-28" style={{background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)'}} /></Reveal>

        <Section
          id="metadata-clean"
          badgeColor="#6366f1"
          badge="Feature 03.5"
          icon={<svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
          title="Metadata only mode"
          intro="Not every file needs resizing. The Metadata only mode strips hidden data from any file type — images, PDFs, or anything else — and returns the clean version instantly, with no changes to dimensions or content."
          items={[
            { title: 'Any file type', desc: 'Images (JPG, PNG, WEBP), PDFs, and other file formats are all supported. Non-image files are returned unchanged except for metadata.' },
            { title: 'PDF metadata removal', desc: 'Title, Author, Subject, Keywords, Producer, and Creator fields in PDF documents are cleared completely.' },
            { title: 'No resizing or cropping', desc: 'Your file comes back at exactly the same dimensions and quality. Only the hidden metadata layer is touched.' },
            { title: 'Batch support', desc: 'Drop multiple files of different types at once. All are cleaned and returned as a single zip archive.' },
            { title: 'Same usage quota', desc: 'Metadata-only processing counts toward the same daily quota as ad format processing. Free plan: 10 files/day.' },
          ]}
          note="Metadata only mode is available via the mode toggle in the dashboard and on the homepage upload tool."
        />

        <Reveal><div className="h-px mb-20 sm:mb-28" style={{background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)'}} /></Reveal>

        <Section
          id="ai-autocrop"
          badgeColor="#6366f1"
          badge="Feature 04"
          icon={<svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>}
          title="AI Autocrop"
          intro="When resizing to a different aspect ratio, MetaClean uses Sharp's content-aware attention strategy to detect the most visually important area of the image and keep it centred. No subject gets cut off without your input."
          items={[
            { title: 'Content-aware detection', desc: 'The attention model analyses the full image and scores regions by visual saliency — faces, products, and high-contrast areas score highest.' },
            { title: 'Zero manual input required', desc: 'Just toggle autocrop on and process. No drag, no coordinates — the algorithm places the crop box automatically.' },
            { title: 'Manual override available', desc: 'If you want to fine-tune, switch to manual crop mode and drag the box to exactly where you want it.' },
            { title: 'Per-format control', desc: 'Autocrop is set independently per format. You can use it on 9:16 but override manually for 1:1 on the same image.' },
            { title: 'Approximate preview', desc: 'The dashboard shows a dashed preview of the autocrop region so you can verify before processing.' },
          ]}
          note="AI Autocrop is available on all plans including Free."
        />

        <Reveal><div className="h-px mb-20 sm:mb-28" style={{background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)'}} /></Reveal>

        {/* AI coming soon banner */}
        <Reveal>
          <div className="flex items-center gap-3 mb-10 px-5 py-3.5 rounded-2xl" style={{background: 'linear-gradient(135deg, rgba(99,102,241,0.07), rgba(139,92,246,0.07))', border: '1px solid rgba(139,92,246,0.2)'}}>
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shrink-0" />
            <p className="text-[13px] text-gray-300 font-medium">AI features below are <span style={{color: '#c084fc'}}>coming soon</span> — available in the upcoming AI Studio tier.</p>
            <a href="mailto:hello@metaclean.pro?subject=AI%20Waitlist" className="ml-auto shrink-0 text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors" style={{background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#c084fc'}}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(139,92,246,0.15)'}
            >Join waitlist →</a>
          </div>
        </Reveal>

        <Section
          id="ai-outpainting"
          badgeColor="#8b5cf6"
          badge="Coming soon · AI Studio"
          icon={<svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>}
          title="AI Outpainting"
          intro="Instead of cropping your image when resizing to a different ad format, AI expands the background to fill the frame. Your product, face, or focal point stays intact — no content is ever lost."
          items={[
            { title: 'Zero cropping', desc: 'Switching from 4:5 to 9:16 no longer cuts off your product. AI fills what is missing.' },
            { title: 'Background generation', desc: 'The expanded area is generated to match the style, colour, and texture of the original background.' },
            { title: 'Works across all formats', desc: 'Outpainting runs automatically for each selected ad format when the crop would otherwise clip the subject.' },
            { title: 'Subject detection', desc: 'AI identifies the key subject and protects it — the generated area never touches the main content.' },
            { title: 'Natural-looking results', desc: 'Outputs are indistinguishable from natively composed images for the vast majority of ad creatives.' },
          ]}
          note="AI Outpainting will be available exclusively in the AI Studio plan. Join the waitlist for early access and founding pricing."
        />

        <Reveal><div className="h-px mb-20 sm:mb-28" style={{background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)'}} /></Reveal>

        <Section
          id="ai-copy"
          badgeColor="#6366f1"
          badge="Coming soon · AI Studio"
          icon={<svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>}
          title="Automatic Ad Copy"
          intro="Upload your image and receive ready-to-use ad copy for every platform you target. The AI reads the visual content and generates headlines, descriptions, and CTAs tailored to each platform's tone and character limits."
          items={[
            { title: 'Image-aware generation', desc: 'The AI analyses your creative — product type, style, and context — before writing a single word.' },
            { title: 'Platform-specific tone', desc: "Meta copy is punchy and direct. Google copy is keyword-rich. TikTok copy is casual. Each platform gets what it needs." },
            { title: 'Character limit compliance', desc: 'Every output respects the exact character limits for headlines, descriptions, and CTAs on each platform.' },
            { title: 'Multi-platform in one click', desc: 'One image upload generates ready-to-paste copy for Meta, Google, TikTok, and Snapchat simultaneously.' },
            { title: 'Editable outputs', desc: 'All generated copy is editable inline before you copy it — tweak tone, swap words, adjust CTA.' },
          ]}
          note="Automatic Ad Copy will be available exclusively in the AI Studio plan. Join the waitlist for early access and founding pricing."
        />

      </div>

      <Footer />

    </main>
  )
}
