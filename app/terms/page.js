'use client'
import { useState, useEffect } from 'react'
import SiteNav from '@/app/components/SiteNav'
import Footer from '@/app/components/Footer'
import Reveal from '@/app/components/Reveal'

const sections = [
  { title: '1. Acceptance of terms', body: 'By using MetaClean, you agree to these terms. If you do not agree, do not use the service. These terms apply to all users including free and paid subscribers.' },
  { title: '2. Description of service', body: 'MetaClean provides image processing tools including metadata removal and format resizing for use in digital advertising. The service is provided as-is and features may change over time.' },
  { title: '3. Account responsibilities', body: 'You are responsible for maintaining the security of your account credentials. You must not share your account with others or use the service for any purpose that violates applicable laws.' },
  { title: '4. Acceptable use', body: 'You may only use MetaClean to process images that you own or have the right to process. You may not use the service to process images that are illegal, infringe third-party rights, or violate any platform policies.' },
  { title: '5. Free plan limitations', body: 'The free plan allows up to 10 image processing operations per day. We reserve the right to adjust this limit. Abuse of the free plan may result in account suspension.' },
  { title: '6. Payments and refunds', body: 'Pro subscriptions are billed monthly. Payments are processed by Stripe. We offer a 7-day refund for new Pro subscriptions if the service does not meet your expectations. Contact us within 7 days of purchase.' },
  { title: '7. Intellectual property', body: 'MetaClean and its branding are owned by us. You retain full ownership of the images you upload and process. We claim no rights over your content.' },
  { title: '8. Limitation of liability', body: 'MetaClean is not liable for any indirect, incidental, or consequential damages arising from use of the service. Our liability is limited to the amount you paid us in the 30 days prior to the claim.' },
  { title: '9. Changes to terms', body: 'We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms. We will notify active users of significant changes by email.' },
  { title: '10. Contact', body: 'For any questions about these terms, contact us at legal@metaclean.pro.' },
]

export default function Terms() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 30); return () => clearTimeout(t) }, [])

  const en = (d = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'none' : 'translateY(-10px)',
    transition: `opacity 0.45s ease ${d}ms, transform 0.45s ease ${d}ms`,
  })

  return (
    <main className="min-h-screen bg-[#060609] text-white" style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]" style={{background: 'radial-gradient(ellipse at top, rgba(59,130,246,0.05) 0%, transparent 65%)'}} />
      </div>

      <SiteNav />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-24 sm:pb-32">

        <div className="mb-10 sm:mb-12" style={en(60)}>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-3 font-medium">Legal</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
          <p className="text-gray-500 text-sm">Last updated: January 2025</p>
        </div>

        <div className="space-y-8 sm:space-y-10">
          {sections.map((s, idx) => (
            <Reveal key={idx} delay={idx * 40} y={14}>
              <div
                className="group"
                onMouseEnter={(e) => { const b = e.currentTarget.querySelector('.section-body'); if (b) b.style.color = 'rgba(156,163,175,1)' }}
                onMouseLeave={(e) => { const b = e.currentTarget.querySelector('.section-body'); if (b) b.style.color = '' }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0" style={{background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)'}}>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  </div>
                  <h2 className="text-white font-semibold text-[14px] sm:text-[15px] leading-snug">{s.title}</h2>
                </div>
                <p className="section-body text-gray-500 text-[13px] sm:text-[14px] leading-relaxed pl-8 transition-colors duration-300">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
