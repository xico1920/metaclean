const BASE_URL = 'https://metaclean.pro'

export const metadata = {
  title: 'Terms of Service',
  description: 'MetaClean Terms of Service — usage rights, acceptable use, and account policies.',
  alternates: { canonical: `${BASE_URL}/terms` },
  robots: { index: true, follow: false },
}

export default function TermsLayout({ children }) {
  return children
}
