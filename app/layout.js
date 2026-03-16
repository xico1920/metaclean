import "./globals.css"

export const metadata = {
  title: 'AdTools — Ad-ready images for Meta',
  description: 'Strip metadata, resize to every Meta format, and optimize your creatives automatically.',
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
