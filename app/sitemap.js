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
    { url: `${base}/blog`,                              lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/blog/meta-ads-image-size`,          lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/tiktok-ads-image-size`,        lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/google-ads-image-size`,        lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/why-meta-rejects-ads`,         lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/blog/remove-exif-metadata-images`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog/pinterest-ads-image-size`,     lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
