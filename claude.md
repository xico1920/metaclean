# MetaClean — Project Overview for Claude

## What is this project?
MetaClean (metaclean.pro) is a SaaS web app that processes images for digital advertising.
It strips metadata, resizes to ad platform formats, and cleans creatives automatically.
Target audience: anyone running paid ads — dropshippers, media buyers, marketing agencies, freelancers.

## Tech stack
- Framework: Next.js 16 (App Router, no TypeScript)
- Styling: Tailwind CSS
- Image processing: Sharp (Node.js)
- Payments: Stripe (not yet integrated, coming next)
- Auth: Supabase (not yet integrated, coming next)
- Hosting: Vercel (planned)
- Domain: metaclean.pro

## Project structure
```
adtools2/
├── app/
│   ├── page.js              # Homepage — main landing + upload tool
│   ├── layout.js            # Root layout + metadata
│   ├── globals.css          # Global styles
│   ├── api/
│   │   └── process/
│   │       └── route.js     # API route — image processing with Sharp
│   ├── features/
│   │   └── page.js          # Features documentation page
│   ├── pricing/
│   │   └── page.js          # Pricing page with FAQ
│   ├── privacy/
│   │   └── page.js          # Privacy Policy
│   ├── terms/
│   │   └── page.js          # Terms of Service
│   └── login/
│       └── page.js          # Login + Sign up page
└── public/
    ├── logo.svg             # Full logo (icon + wordmark)
    └── favicon.svg          # Icon only
```

## Brand & Design
- Name: MetaClean
- Domain: metaclean.pro
- Colors: deep dark bg (#060609), indigo accent (#6366f1), blue (#2563eb), purple (#8b5cf6)
- Logo: custom SVG — photo frame icon with a diagonal cut (removed corner = metadata removed)
- Wordmark: "meta" bold 800 weight + "clean" ultralight 200 weight + indigo underline under "clean"
- Style: dark, premium, minimal — inspired by Linear/Vercel aesthetic
- Buttons: animated gradient glow on hover (blue → indigo → purple)
- Cards: radial gradient follows mouse cursor on hover

## Current features (built)
- Image upload (drag & drop or file picker)
- Metadata removal via Sharp (.withMetadata(false))
- Batch processing (multiple files)
- Auto-download of processed files
- Multi-language support (EN, PT, ES) with flag images from flagcdn.com
- Responsive landing page with hero, features, pricing sections
- Platform badges (Meta, Google, TikTok, Pinterest, Snapchat)

## What's NOT built yet (coming next)
- Stripe payment integration
- Supabase auth (login/signup functional)
- Image resizing to ad formats (Sharp can do this, just needs implementing)
- User dashboard
- Usage limits (free: 10/day, pro: unlimited)
- Deploy to Vercel

## Important decisions made
- No TypeScript — plain JavaScript only
- No separate backend — Next.js API routes handle everything
- Processing is stateless — no files stored, everything in memory
- Pricing: Free (10 images/day) and Pro (€9/mo, unlimited)
- Languages: English (default), Portuguese, Spanish

## Developer context
- Solo founder, university student, learning as he builds
- Budget: under €100 to start
- Goal: €2-3K MRR lifestyle business
- Background: dropshipping + Meta Ads — knows the pain point personally