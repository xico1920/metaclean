import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // Capture 10% of sessions for performance tracing in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Only send errors in production — silence noise in dev
  enabled: process.env.NODE_ENV === 'production',

  // Don't send errors from browser extensions or non-app origins
  allowUrls: [/metaclean\.pro/],

  beforeSend(event) {
    // Strip any PII that may slip into error messages
    if (event.user) {
      delete event.user.ip_address
    }
    return event
  },
})
