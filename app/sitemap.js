export default function sitemap() {
  const base = 'https://metaclean.pro'
  const now = new Date().toISOString()

  return [
    { url: base,                   lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/features`,     lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/pricing`,      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/login`,        lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${base}/privacy`,      lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms`,        lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]
}
