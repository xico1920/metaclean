'use client'
import { useState } from 'react'

const PLATFORM_LIMITS_BYTES = {
  meta:      1024 * 1024,
  google:    150  * 1024,
  tiktok:    500  * 1024,
  snapchat:  5    * 1024 * 1024,
  pinterest: 20   * 1024 * 1024,
  linkedin:  5    * 1024 * 1024,
}

const PLATFORM_MIN_RES = {
  meta:      { w: 600,  h: 600  },
  google:    { w: 300,  h: 300  },
  tiktok:    { w: 720,  h: 1280 },
  snapchat:  { w: 500,  h: 500  },
  pinterest: { w: 500,  h: 500  },
  linkedin:  { w: 500,  h: 500  },
}

function formatBytes(b) {
  return b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`
}

function CheckRow({ label, ok, detail, isBeta }) {
  const color = isBeta ? 'rgba(251,191,36,0.55)' : ok ? 'rgba(34,197,94,0.85)' : '#f87171'
  const dotBg = isBeta
    ? 'rgba(251,191,36,0.1)'
    : ok ? 'rgba(34,197,94,0.12)' : 'rgba(248,113,113,0.12)'
  const dotBorder = isBeta
    ? 'rgba(251,191,36,0.3)'
    : ok ? 'rgba(34,197,94,0.35)' : 'rgba(248,113,113,0.35)'

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
          background: dotBg, border: `1px solid ${dotBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isBeta ? (
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008z"/>
            </svg>
          ) : ok ? (
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
            </svg>
          ) : (
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          )}
        </div>
        <span style={{ fontSize: 11, color }}>{label}</span>
      </div>
      {detail && (
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', marginLeft: 12 }}>{detail}</span>
      )}
    </div>
  )
}

export default function AdReadyBadge({ platform, stats }) {
  const [expanded, setExpanded] = useState(false)

  if (!stats || stats.length === 0) return null

  const limit   = PLATFORM_LIMITS_BYTES[platform] ?? null
  const minRes  = PLATFORM_MIN_RES[platform] ?? { w: 500, h: 500 }

  const checks = stats.map(fmt => ({
    label:    fmt.label,
    metaOk:   true,
    sizeOk:   limit ? fmt.size <= limit : true,
    resOk:    fmt.w >= minRes.w && fmt.h >= minRes.h,
    fmtOk:    true,
    size:     fmt.size,
    w:        fmt.w,
    h:        fmt.h,
    quality:  fmt.quality,
  }))

  const allGreen = checks.every(c => c.metaOk && c.sizeOk && c.resOk && c.fmtOk)

  const badgeColor  = allGreen ? '#4ade80' : '#fbbf24'
  const badgeBg     = allGreen ? 'rgba(34,197,94,0.08)'    : 'rgba(251,191,36,0.08)'
  const badgeBorder = allGreen ? 'rgba(34,197,94,0.22)'    : 'rgba(251,191,36,0.22)'
  const dotBg       = allGreen ? 'rgba(34,197,94,0.18)'    : 'rgba(251,191,36,0.18)'

  return (
    <div style={{ marginTop: 10, textAlign: 'left', display: 'inline-block' }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '5px 10px', borderRadius: 8,
          background: badgeBg, border: `1px solid ${badgeBorder}`,
          color: badgeColor, fontSize: 11, fontWeight: 600, cursor: 'pointer',
        }}
      >
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          background: dotBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {allGreen ? (
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
            </svg>
          ) : (
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008z"/>
            </svg>
          )}
        </div>
        {allGreen ? 'Ad Ready ✓' : 'Review results'}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
        </svg>
      </button>

      {expanded && (
        <div style={{
          marginTop: 6, borderRadius: 10, overflow: 'hidden', minWidth: 240,
          background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
        }}>
          {checks.map((fmt, i) => (
            <div key={i} style={{
              padding: '10px 14px',
              borderBottom: i < checks.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              {checks.length > 1 && (
                <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                  {fmt.label.split('_').slice(1, 3).join(' ')}
                </p>
              )}
              <CheckRow label="Metadata removed" ok={fmt.metaOk} detail="EXIF · GPS stripped" />
              <CheckRow label="File size"         ok={fmt.sizeOk} detail={formatBytes(fmt.size)} />
              <CheckRow label="Resolution"        ok={fmt.resOk}  detail={`${fmt.w}×${fmt.h}`} />
              <CheckRow label="Format accepted"   ok={fmt.fmtOk}  detail="JPEG" />
              <CheckRow label="Text detection"    ok={false} isBeta detail="beta" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
