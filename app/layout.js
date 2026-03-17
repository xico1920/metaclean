import "./globals.css"

export const metadata = {
  title: 'MetaClean — Ad-ready images',
  description: 'Strip metadata, resize to every ad format, and clean your creatives automatically. Works with Meta, Google, TikTok, Pinterest and more.',
  metadataBase: new URL('https://metaclean.pro'),
  openGraph: {
    title: 'MetaClean — Ad-ready images',
    description: 'Strip metadata, resize to every ad format, and clean your creatives automatically. Works with Meta, Google, TikTok, Pinterest and more.',
    url: 'https://metaclean.pro',
    siteName: 'MetaClean',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'MetaClean — Ad-ready images',
    description: 'Strip metadata, resize to every ad format, and clean your creatives automatically.',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
