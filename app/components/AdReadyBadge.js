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

const SvgIcon = ({ children }) => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
    {children}
  </svg>
)
const IconOk   = () => <SvgIcon><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5"/></SvgIcon>
const IconWarn = () => <SvgIcon><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></SvgIcon>
const IconFail = () => <SvgIcon><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></SvgIcon>

export default function AdReadyBadge({ platform, stats }) {
  const [expanded, setExpanded] = useState(false)

  if (!stats || stats.length === 0) return null

  const limit  = PLATFORM_LIMITS_BYTES[platform] ?? null
  const minRes = PLATFORM_MIN_RES[platform] ?? { w: 500, h: 500 }

  // Aggregate across all formats/files
  const sizeOk  = stats.every(f => limit ? f.size <= limit : true)
  const resOk   = stats.every(f => f.w >= minRes.w && f.h >= minRes.h)
  const allGood = sizeOk && resOk

  const worstSize = stats.reduce((a, b) => b.size > a.size ? b : a, stats[0])
  const avgQuality = Math.round(stats.reduce((s, f) => s + f.quality, 0) / stats.length)

  const rows = [
    { label: 'Metadata removed', ok: true,   detail: 'EXIF · GPS stripped',          icon: <IconOk /> },
    { label: 'File size',        ok: sizeOk,  detail: limit ? `max ${formatBytes(limit)}` : 'no limit', icon: sizeOk ? <IconOk /> : <IconFail /> },
    { label: 'Resolution',       ok: resOk,   detail: `min ${minRes.w}×${minRes.h}`,  icon: resOk ? <IconOk /> : <IconFail /> },
    { label: 'Format accepted',  ok: true,    detail: 'JPEG',                          icon: <IconOk /> },
    { label: 'Text detection',   ok: null,    detail: 'beta',                          icon: <IconWarn /> },
  ]

  return (
    <div style={{ display: 'inline-block', position: 'relative', textAlign: 'left' }}>

      {/* Badge button */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 8, cursor: 'pointer',
          background: allGood ? 'rgba(34,197,94,0.08)' : 'rgba(251,191,36,0.08)',
          border: `1px solid ${allGood ? 'rgba(34,197,94,0.18)' : 'rgba(251,191,36,0.18)'}`,
          color: allGood ? '#86efac' : '#fde68a',
          fontSize: 12, fontWeight: 500,
        }}
      >
        {allGood ? <IconOk /> : <IconWarn />}
        {allGood ? 'Ad Ready ✓' : 'Review results'}
        <span style={{ opacity: 0.5, fontSize: 11 }}>{stats.length} format{stats.length !== 1 ? 's' : ''}</span>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s', flexShrink: 0, opacity: 0.6 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
        </svg>
      </button>

      {/* Dropdown card */}
      {expanded && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: 0,
          zIndex: 50, width: 230,
          background: '#0d0d14', border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 10, overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
        }}>
          {/* Header */}
          <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {stats.length} format{stats.length !== 1 ? 's' : ''} · Q{avgQuality}
            </span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)' }}>{platform}</span>
          </div>

          {/* Check rows */}
          <div style={{ padding: '6px 12px 10px' }}>
            {rows.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{
                    width: 15, height: 15, borderRadius: '50%', flexShrink: 0,
                    background: r.ok === null ? 'rgba(251,191,36,0.1)' : r.ok ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.1)',
                    border: `1px solid ${r.ok === null ? 'rgba(251,191,36,0.25)' : r.ok ? 'rgba(34,197,94,0.25)' : 'rgba(248,113,113,0.25)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{r.icon}</span>
                  <span style={{ fontSize: 11, color: r.ok === null ? 'rgba(251,191,36,0.6)' : r.ok ? 'rgba(255,255,255,0.55)' : '#f87171' }}>
                    {r.label}
                  </span>
                </div>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)' }}>{r.detail}</span>
              </div>
            ))}
          </div>

          {/* Footer: worst case file size */}
          {limit && (
            <div style={{ padding: '6px 12px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 10, color: 'rgba(255,255,255,0.18)' }}>
              Largest file: {formatBytes(worstSize.size)} · limit {formatBytes(limit)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
