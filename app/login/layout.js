const BASE_URL = 'https://metaclean.pro'

export const metadata = {
  title: 'Sign In or Create Account',
  description: 'Sign in to MetaClean to access your dashboard, process ad images, and manage your campaign presets.',
  alternates: { canonical: `${BASE_URL}/login` },
  robots: { index: false, follow: false },
}

export default function LoginLayout({ children }) {
  return children
}
