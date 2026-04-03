import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Silent during builds unless there's an error
  silent: true,

  // Upload source maps to Sentry so stack traces show real code
  widenClientFileUpload: true,

  // Automatically instrument server components and API routes
  autoInstrumentServerFunctions: true,

  // Hide Sentry's own requests from performance traces
  hideSourceMaps: true,
  disableLogger: true,
})
