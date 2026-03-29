const BASE_URL = 'https://metaclean.pro'

export const metadata = {
  title: 'Features — Smart Compression, Ad Badge & Batch ZIP',
  description: 'Explore MetaClean features: smart per-platform compression, Ad-Ready badge validation, batch ZIP upload, campaign presets, and metadata stripping for every major ad platform.',
  alternates: { canonical: `${BASE_URL}/features` },
  openGraph: {
    title: 'MetaClean Features — Ad Image Processing Made Simple',
    description: 'Smart compression, Ad-Ready checks, batch ZIP processing and campaign presets for Meta, Google, TikTok, Pinterest, Snapchat and LinkedIn.',
    url: `${BASE_URL}/features`,
  },
}

export default function FeaturesLayout({ children }) {
  return children
}
