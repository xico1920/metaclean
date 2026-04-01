import Link from 'next/link'

export default function Logo({ size = 30, clipId = 'logoClip' }) {
  return (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
      <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
        <defs><clipPath id={clipId}><rect width="56" height="56" rx="13" /></clipPath></defs>
        <rect width="56" height="56" rx="13" fill="#4338ca" />
        <g clipPath={`url(#${clipId})`}>
          <circle cx="14" cy="18" r="5" fill="rgba(255,255,255,0.9)" />
          <polygon points="6,52 22,26 38,52" fill="rgba(255,255,255,0.9)" />
          <polygon points="24,52 36,34 50,52" fill="rgba(255,255,255,0.7)" />
          <polygon points="34,0 56,0 56,24" fill="#060609" />
          <line x1="34" y1="0" x2="56" y2="24" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
      <span style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif', fontSize: `${Math.round(size * 0.633)}px`, letterSpacing: '-0.7px', lineHeight: 1 }}>
        <span style={{ fontWeight: 800, color: 'white' }}>meta</span>
        <span style={{ fontWeight: 200, color: 'rgba(255,255,255,0.4)' }}>clean</span>
      </span>
    </Link>
  )
}
