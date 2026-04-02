import { NextResponse } from 'next/server'

// ── Sliding-window rate limiter (Edge Runtime — in-memory per edge node) ──────
//
// Limits per IP:
//   /api/process        → 20 requests / 60s
//   /api/process-zip    → 10 requests / 60s
//   /api/clean          → 20 requests / 60s
//
// Note: Edge middleware state is shared within a single edge node instance.
// This is sufficient protection against casual abuse and script-kiddies.
// For multi-region production hardening, back this with Upstash Redis.

const WINDOW_MS = 60_000 // 1 minute

const LIMITS = {
  '/api/process':     60,
  '/api/process-zip': 10,
  '/api/clean':       60,
}

// Map<key, { count, windowStart }>
const store = new Map()

function getRateLimit(ip, path) {
  const limit = LIMITS[path]
  if (!limit) return null

  const key = `${ip}:${path}`
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    store.set(key, { count: 1, windowStart: now })
    return { allowed: true, remaining: limit - 1, limit }
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - entry.windowStart)) / 1000)
    return { allowed: false, remaining: 0, limit, retryAfter }
  }

  entry.count++
  return { allowed: true, remaining: limit - entry.count, limit }
}

// Periodically prune stale entries to avoid unbounded memory growth
let lastPrune = Date.now()
function maybePrune() {
  const now = Date.now()
  if (now - lastPrune < 120_000) return
  lastPrune = now
  for (const [key, entry] of store) {
    if (now - entry.windowStart > WINDOW_MS * 2) store.delete(key)
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl

  const limitedPath = Object.keys(LIMITS).find(p => pathname.startsWith(p))
  if (!limitedPath) return NextResponse.next()

  maybePrune()

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  const result = getRateLimit(ip, limitedPath)
  if (!result) return NextResponse.next()

  if (!result.allowed) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests. Please slow down and try again shortly.',
        retryAfter: result.retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': '0',
          'Retry-After': String(result.retryAfter),
        },
      }
    )
  }

  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', String(result.limit))
  response.headers.set('X-RateLimit-Remaining', String(result.remaining))
  return response
}

export const config = {
  matcher: ['/api/process', '/api/process/:path*', '/api/clean'],
}
