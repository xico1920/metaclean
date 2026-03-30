import "./globals.css"

const BASE_URL = 'https://metaclean.pro'

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'MetaClean — Strip Image Metadata & Resize for Ad Platforms',
    template: '%s | MetaClean',
  },
  description: 'Automatically strip EXIF/GPS metadata, compress, and resize images to every ad format for Meta, Google, TikTok, Pinterest, Snapchat and LinkedIn — in seconds.',
  keywords: [
    'strip image metadata', 'remove EXIF data', 'ad image resizer', 'metadata remover',
    'Meta ads image size', 'Google ads image requirements', 'TikTok ads creative size',
    'image cleaner for ads', 'ad creative tool', 'bulk image resize', 'metaclean',
  ],
  authors: [{ name: 'MetaClean', url: BASE_URL }],
  creator: 'MetaClean',
  publisher: 'MetaClean',
  category: 'technology',
  applicationName: 'MetaClean',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'MetaClean',
    title: 'MetaClean — Strip Image Metadata & Resize for Ad Platforms',
    description: 'Strip EXIF/GPS metadata, compress, and resize images to every ad format. Works with Meta, Google, TikTok, Pinterest, Snapchat and LinkedIn.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'MetaClean — Ad-ready images' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@metaclean',
    title: 'MetaClean — Strip Image Metadata & Resize for Ad Platforms',
    description: 'Strip EXIF/GPS metadata, compress, and resize images to every ad format in seconds.',
    images: ['/og-image.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'MetaClean',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/icon.svg`,
        width: 56,
        height: 56,
      },
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'MetaClean',
      publisher: { '@id': `${BASE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${BASE_URL}/#app`,
      name: 'MetaClean',
      url: BASE_URL,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      offers: [
        { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Pro', price: '9', priceCurrency: 'USD', billingIncrement: 'month' },
      ],
      description: 'Strip image metadata, resize to every ad format, and compress creatives for Meta, Google, TikTok, Pinterest, Snapchat, and LinkedIn.',
      screenshot: `${BASE_URL}/og-image.png`,
      publisher: { '@id': `${BASE_URL}/#organization` },
    },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-L6DEMJFHF2" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-L6DEMJFHF2');
        `}} />
      </head>
      <body>{children}</body>
    </html>
  )
}
