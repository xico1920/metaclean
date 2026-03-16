'use client'
import Link from 'next/link'

function Logo() {
  return (
    <Link href="/" style={{display:'flex', alignItems:'center', gap:'10px', textDecoration:'none'}}>
      <svg width="32" height="32" viewBox="0 0 56 56" fill="none">
        <defs>
          <clipPath id="iconClip">
            <rect width="56" height="56" rx="13"/>
          </clipPath>
        </defs>
        <rect width="56" height="56" rx="13" fill="#4338ca"/>
        <g clipPath="url(#iconClip)">
          <circle cx="14" cy="18" r="5" fill="rgba(255,255,255,0.9)"/>
          <polygon points="6,52 22,26 38,52" fill="rgba(255,255,255,0.9)"/>
          <polygon points="24,52 36,34 50,52" fill="rgba(255,255,255,0.7)"/>
          <polygon points="34,0 56,0 56,24" fill="#060609"/>
          <line x1="34" y1="0" x2="56" y2="24" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round"/>
        </g>
      </svg>
      <span style={{fontFamily:'-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif', fontSize:'20px', letterSpacing:'-0.8px', lineHeight:1}}>
        <span style={{fontWeight:800, color:'white'}}>meta</span>
        <span style={{fontWeight:200, color:'rgba(255,255,255,0.45)'}}>clean</span>
      </span>
    </Link>
  )
}

function Section({ id, icon, title, badge, badgeColor, intro, items, note }) {
  return (
    <div id={id} className="mb-20 scroll-mt-24">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-1" style={{background: `${badgeColor}15`, color: badgeColor}}>
          {icon}
        </div>
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-widest mb-2" style={{background: `${badgeColor}15`, color: badgeColor}}>
            {badge}
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
        </div>
      </div>

      <p className="text-gray-400 text-[15px] leading-relaxed mb-8 ml-16">{intro}</p>

      <div className="ml-16 grid gap-3">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-xl p-5" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)'}}>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{background: badgeColor}}></div>
              <div>
                <p className="text-white font-medium text-[14px] mb-1">{item.title}</p>
                <p className="text-gray-500 text-[13px] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {note && (
        <div className="ml-16 mt-4 px-4 py-3 rounded-xl text-[12px] text-gray-500" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)'}}>
          {note}
        </div>
      )}
    </div>
  )
}

export default function Features() {
  return (
    <main className="min-h-screen bg-[#060609] text-white" style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]" style={{background: 'radial-gradient(ellipse at top, rgba(59,130,246,0.06) 0%, transparent 65%)'}} />
      </div>

      <nav className="relative z-20 flex items-center justify-between px-8 py-5" style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
        <Logo />
        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-[13px] text-gray-400 hover:text-gray-200 transition-colors">Pricing</Link>
          <Link href="/login" className="text-[13px] text-gray-400 hover:text-gray-200 transition-colors">Login</Link>
          <Link href="/" className="px-5 py-2 rounded-lg text-[13px] font-medium text-white transition-all hover:opacity-90" style={{background: 'linear-gradient(135deg, #2563eb, #4f46e5)'}}>
            Get started
          </Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-20 pb-32">

        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-widest mb-6" style={{background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', color: '#a5b4fc'}}>
            Documentation
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Features</h1>
          <p className="text-gray-400 text-lg leading-relaxed">Everything MetaClean does to make your images ready for any ad platform.</p>
        </div>

        <div className="flex gap-2 flex-wrap mb-16 p-4 rounded-2xl" style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)'}}>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest w-full mb-2">Jump to</p>
          {['#metadata', '#formats', '#bulk'].map((href, idx) => (
            <a key={idx} href={href} className="px-3 py-1.5 rounded-lg text-[12px] text-gray-400 hover:text-white transition-colors" style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)'}}>
              {['Metadata removal', 'Ad formats', 'Bulk processing'][idx]}
            </a>
          ))}
        </div>

        <Section
          id="metadata"
          badgeColor="#3b82f6"
          badge="Feature 01"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>}
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

        <div className="h-px mb-20" style={{background: 'rgba(255,255,255,0.05)'}}></div>

        <Section
          id="formats"
          badgeColor="#8b5cf6"
          badge="Feature 02"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>}
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

        <div className="h-px mb-20" style={{background: 'rgba(255,255,255,0.05)'}}></div>

        <Section
          id="bulk"
          badgeColor="#6366f1"
          badge="Feature 03"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
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

      </div>

      <footer className="relative z-10 border-t border-white/5 px-8 py-6 flex items-center justify-between max-w-3xl mx-auto">
        <Logo />
        <div className="flex items-center gap-6 text-[12px] text-gray-500">
          <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
          <span>© 2025 MetaClean</span>
        </div>
      </footer>

    </main>
  )
}