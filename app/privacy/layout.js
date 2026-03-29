const BASE_URL = 'https://metaclean.pro'

export const metadata = {
  title: 'Privacy Policy',
  description: 'MetaClean Privacy Policy — how we handle your images, data, and account information.',
  alternates: { canonical: `${BASE_URL}/privacy` },
  robots: { index: true, follow: false },
}

export default function PrivacyLayout({ children }) {
  return children
}
