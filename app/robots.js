export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/api/'],
      },
    ],
    sitemap: 'https://metaclean.pro/sitemap.xml',
    host: 'https://metaclean.pro',
  }
}
