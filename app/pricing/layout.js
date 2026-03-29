const BASE_URL = 'https://metaclean.pro'

export const metadata = {
  title: 'Pricing — Free & Pro Plans for Ad Creatives',
  description: 'MetaClean offers a free tier for individuals and a Pro plan for agencies. Strip metadata, resize to every ad format, and compress images — starting at $0.',
  alternates: { canonical: `${BASE_URL}/pricing` },
  openGraph: {
    title: 'MetaClean Pricing — Free & Pro Plans',
    description: 'Start free. Upgrade to Pro for unlimited images, batch ZIP uploads, and campaign presets.',
    url: `${BASE_URL}/pricing`,
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are my images stored after processing?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. All processing happens in memory on our servers. Files are never saved to disk and are deleted immediately after your download starts.' },
    },
    {
      '@type': 'Question',
      name: 'What file types are supported?',
      acceptedAnswer: { '@type': 'Answer', text: 'JPG, PNG, and WEBP. We recommend JPG or PNG for ad creatives as they have the widest platform compatibility.' },
    },
    {
      '@type': 'Question',
      name: 'Can I cancel anytime?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. No contracts, no lock-in. Cancel directly from your account settings and you will not be charged again.' },
    },
    {
      '@type': 'Question',
      name: 'What does "Priority processing" mean?',
      acceptedAnswer: { '@type': 'Answer', text: 'Pro users have their images processed first in the queue. During high traffic periods, free users may experience slight delays.' },
    },
    {
      '@type': 'Question',
      name: 'Is there an API?',
      acceptedAnswer: { '@type': 'Answer', text: 'API access is currently in development and will be available to Pro users first.' },
    },
    {
      '@type': 'Question',
      name: 'What is the AI Studio plan?',
      acceptedAnswer: { '@type': 'Answer', text: 'AI Studio is an upcoming tier that adds AI Outpainting (background expansion) and Automatic Ad Copy (AI-generated headlines and descriptions per platform).' },
    },
  ],
}

export default function PricingLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  )
}
