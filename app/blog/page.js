'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import SiteNav from '@/app/components/SiteNav'
import Footer from '@/app/components/Footer'

const t = {
  en: {
    label: 'Ad Creative Guides',
    h1a: 'Everything you need',
    h1b: 'to run better ads.',
    sub: 'Practical guides on ad image specs, metadata, creative optimization — for every platform that matters.',
    featured: 'Featured',
    readMore: 'Read more',
    readArticle: 'Read article',
    ctaTitle: 'Ready to put this into practice?',
    ctaSub: 'Strip metadata and resize to every ad format — free, no account needed.',
    ctaBtn: 'Try MetaClean free →',
    posts: [
      { title: 'Why Meta Rejects Ad Images (And How to Fix It)', description: 'The most common reasons Facebook and Instagram reject your creatives — image size, text overlay, metadata, policy violations — and exactly how to fix each one.', tag: 'Troubleshooting', readTime: '8 min read' },
      { title: 'Meta Ads Image Sizes: The Complete 2025 Guide', description: 'Every image size and format you need for Facebook and Instagram ads — Feed, Stories, Reels, and more.', tag: 'Meta Ads', readTime: '6 min read' },
      { title: 'TikTok Ads Image & Video Sizes: The Complete 2025 Guide', description: 'Every TikTok ad image and video size, aspect ratio, and file limit. The 500KB limit explained.', tag: 'TikTok Ads', readTime: '5 min read' },
      { title: 'Google Ads Image Sizes: Complete Guide for 2025', description: 'Every Google Ads image size for Display, Performance Max, Discovery, and Responsive ads.', tag: 'Google Ads', readTime: '7 min read' },
      { title: 'Pinterest Ads Image Sizes: Complete Guide for 2025', description: 'Every Pinterest ad image size — Standard Pins, Shopping Ads, Carousel, and Collections.', tag: 'Pinterest Ads', readTime: '5 min read' },
      { title: 'How to Remove EXIF Metadata from Images (2025 Guide)', description: 'What EXIF metadata is, why it matters for ad platforms, and the fastest ways to strip it.', tag: 'Privacy & Tech', readTime: '6 min read' },
    ],
  },
  pt: {
    label: 'Guias de Criativos',
    h1a: 'Tudo o que precisas',
    h1b: 'para anúncios melhores.',
    sub: 'Guias práticos sobre tamanhos de imagens, metadados e otimização de criativos — para todas as plataformas.',
    featured: 'Destaque',
    readMore: 'Ler mais',
    readArticle: 'Ler artigo',
    ctaTitle: 'Pronto para pôr isto em prática?',
    ctaSub: 'Remove metadados e redimensiona para todos os formatos — grátis, sem conta necessária.',
    ctaBtn: 'Experimenta o MetaClean →',
    posts: [
      { title: 'Por Que o Meta Rejeita Imagens de Anúncios (E Como Corrigir)', description: 'As razões mais comuns pelas quais o Facebook e Instagram rejeitam os teus criativos — tamanho, texto, metadados, violações de política — e como corrigir cada uma.', tag: 'Resolução de Problemas', readTime: '8 min de leitura' },
      { title: 'Tamanhos de Imagens para Anúncios Meta: Guia Completo 2025', description: 'Todos os tamanhos e formatos de imagem para anúncios no Facebook e Instagram — Feed, Stories, Reels e muito mais.', tag: 'Anúncios Meta', readTime: '6 min de leitura' },
      { title: 'Tamanhos de Imagens e Vídeos TikTok Ads: Guia Completo 2025', description: 'Todos os tamanhos de imagem e vídeo, proporções e limites de ficheiro para TikTok Ads. O limite de 500KB explicado.', tag: 'TikTok Ads', readTime: '5 min de leitura' },
      { title: 'Tamanhos de Imagens Google Ads: Guia Completo 2025', description: 'Todos os tamanhos de imagem do Google Ads para Display, Performance Max, Discovery e anúncios responsivos.', tag: 'Google Ads', readTime: '7 min de leitura' },
      { title: 'Tamanhos de Imagens Pinterest Ads: Guia Completo 2025', description: 'Todos os tamanhos de imagem para Pinterest Ads — Pins Padrão, Shopping Ads, Carrossel e Coleções.', tag: 'Pinterest Ads', readTime: '5 min de leitura' },
      { title: 'Como Remover Metadados EXIF de Imagens (Guia 2025)', description: 'O que são metadados EXIF, por que importam nas plataformas de anúncios e as formas mais rápidas de os remover.', tag: 'Privacidade & Tech', readTime: '6 min de leitura' },
    ],
  },
  es: {
    label: 'Guías de Creativos',
    h1a: 'Todo lo que necesitas',
    h1b: 'para mejores anuncios.',
    sub: 'Guías prácticas sobre tamaños de imágenes, metadatos y optimización de creativos — para todas las plataformas.',
    featured: 'Destacado',
    readMore: 'Leer más',
    readArticle: 'Leer artículo',
    ctaTitle: '¿Listo para ponerlo en práctica?',
    ctaSub: 'Elimina metadatos y redimensiona a todos los formatos — gratis, sin cuenta necesaria.',
    ctaBtn: 'Prueba MetaClean gratis →',
    posts: [
      { title: '¿Por Qué Meta Rechaza las Imágenes de Anuncios? (Y Cómo Solucionarlo)', description: 'Las razones más comunes por las que Facebook e Instagram rechazan tus creativos — tamaño, texto, metadatos, infracciones — y cómo solucionar cada una.', tag: 'Solución de Problemas', readTime: '8 min de lectura' },
      { title: 'Tamaños de Imágenes para Anuncios Meta: Guía Completa 2025', description: 'Todos los tamaños y formatos de imagen para anuncios en Facebook e Instagram — Feed, Stories, Reels y más.', tag: 'Anuncios Meta', readTime: '6 min de lectura' },
      { title: 'Tamaños de Imágenes y Vídeos TikTok Ads: Guía Completa 2025', description: 'Todos los tamaños de imagen y vídeo, relaciones de aspecto y límites de archivo para TikTok Ads. El límite de 500KB explicado.', tag: 'TikTok Ads', readTime: '5 min de lectura' },
      { title: 'Tamaños de Imágenes Google Ads: Guía Completa 2025', description: 'Todos los tamaños de imagen de Google Ads para Display, Performance Max, Discovery y anuncios responsivos.', tag: 'Google Ads', readTime: '7 min de lectura' },
      { title: 'Tamaños de Imágenes Pinterest Ads: Guía Completa 2025', description: 'Todos los tamaños de imagen para Pinterest Ads — Pines Estándar, Shopping Ads, Carrusel y Colecciones.', tag: 'Pinterest Ads', readTime: '5 min de lectura' },
      { title: 'Cómo Eliminar Metadatos EXIF de Imágenes (Guía 2025)', description: 'Qué son los metadatos EXIF, por qué importan en las plataformas de anuncios y las formas más rápidas de eliminarlos.', tag: 'Privacidad & Tech', readTime: '6 min de lectura' },
    ],
  },
}

const postsMeta = [
  { slug: 'why-meta-rejects-ads', tagColor: '#f87171', tagBg: 'rgba(248,113,113,0.1)', tagBorder: 'rgba(248,113,113,0.2)', featured: true },
  { slug: 'meta-ads-image-size', tagColor: '#818cf8', tagBg: 'rgba(99,102,241,0.1)', tagBorder: 'rgba(99,102,241,0.2)' },
  { slug: 'tiktok-ads-image-size', tagColor: '#f472b6', tagBg: 'rgba(244,114,182,0.1)', tagBorder: 'rgba(244,114,182,0.2)' },
  { slug: 'google-ads-image-size', tagColor: '#34d399', tagBg: 'rgba(52,211,153,0.1)', tagBorder: 'rgba(52,211,153,0.2)' },
  { slug: 'pinterest-ads-image-size', tagColor: '#f87171', tagBg: 'rgba(248,113,113,0.1)', tagBorder: 'rgba(248,113,113,0.2)' },
  { slug: 'remove-exif-metadata-images', tagColor: '#818cf8', tagBg: 'rgba(99,102,241,0.1)', tagBorder: 'rgba(99,102,241,0.2)' },
]

function useVisible(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

function FeaturedCard({ post, i }) {
  const [ref, visible] = useVisible(0.1)
  const [hovered, setHovered] = useState(false)
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'opacity 0.6s ease, transform 0.6s ease', marginBottom: 24 }}>
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: 'relative',
            background: hovered ? '#10101a' : '#0d0d14',
            border: `1px solid ${hovered ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: 18,
            padding: '36px 40px',
            transition: 'all 0.25s ease',
            overflow: 'hidden',
            boxShadow: hovered ? '0 0 0 1px rgba(99,102,241,0.1), 0 20px 60px rgba(0,0,0,0.4)' : 'none',
          }}
        >
          {/* Glow orb */}
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 260, height: 260,
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
            opacity: hovered ? 1 : 0.4,
            transition: 'opacity 0.4s ease',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase',
              color: '#fbbf24', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)',
              borderRadius: 6, padding: '3px 9px',
            }}>{i.featured}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: post.tagColor, background: post.tagBg, border: `1px solid ${post.tagBorder}`, borderRadius: 6, padding: '3px 9px' }}>{post.tag}</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>·</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{post.readTime}</span>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.7px', lineHeight: 1.25, color: 'white', marginBottom: 14, maxWidth: 540 }}>
            {post.title}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: '0 0 24px', maxWidth: 520 }}>
            {post.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, color: hovered ? '#a5b4fc' : 'rgba(255,255,255,0.35)', transition: 'color 0.2s ease', fontWeight: 500 }}>{i.readArticle}</span>
            <svg width="14" height="14" fill="none" stroke={hovered ? '#a5b4fc' : 'rgba(255,255,255,0.35)'} strokeWidth="2" viewBox="0 0 24 24" style={{ transition: 'all 0.2s ease', transform: hovered ? 'translateX(3px)' : 'none' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  )
}

function PostCard({ post, delay = 0, i }) {
  const [ref, visible] = useVisible(0.1)
  const [hovered, setHovered] = useState(false)
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms` }}>
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            height: '100%',
            background: hovered ? '#10101a' : '#0d0d14',
            border: `1px solid ${hovered ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: 14,
            padding: '24px',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.3)' : 'none',
            transform: hovered ? 'translateY(-2px)' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.4px', color: post.tagColor, background: post.tagBg, border: `1px solid ${post.tagBorder}`, borderRadius: 5, padding: '2px 8px' }}>{post.tag}</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginLeft: 'auto' }}>{post.readTime}</span>
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.35px', lineHeight: 1.35, color: 'white', marginBottom: 10, flex: 1 }}>
            {post.title}
          </h3>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: '0 0 20px' }}>
            {post.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 12, color: hovered ? '#a5b4fc' : 'rgba(255,255,255,0.25)', transition: 'color 0.2s', fontWeight: 500 }}>{i.readMore}</span>
            <svg width="12" height="12" fill="none" stroke={hovered ? '#a5b4fc' : 'rgba(255,255,255,0.25)'} strokeWidth="2" viewBox="0 0 24 24" style={{ transition: 'all 0.2s', transform: hovered ? 'translateX(2px)' : 'none' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function BlogIndex() {
  const [heroVisible, setHeroVisible] = useState(false)
  const [lang, setLang] = useState('en')

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 60)
    const saved = localStorage.getItem('metaclean_lang')
    if (saved && ['en', 'pt', 'es'].includes(saved)) setLang(saved)
    const onLang = (e) => setLang(e.detail)
    window.addEventListener('metaclean:lang', onLang)
    return () => window.removeEventListener('metaclean:lang', onLang)
  }, [])

  const i = t[lang]
  const posts = postsMeta.map((meta, idx) => ({ ...meta, ...i.posts[idx] }))
  const featured = posts.find(p => p.featured)
  const rest = posts.filter(p => !p.featured)

  return (
    <div style={{ minHeight: '100vh', background: '#060609', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif' }}>
      <SiteNav />

      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 400,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 760, margin: '0 auto', padding: '72px 24px 52px' }}>
          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(16px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>

            {/* Label */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 99, padding: '5px 14px', marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 8px rgba(99,102,241,0.8)' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.3px' }}>{i.label}</span>
            </div>

            <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16 }}>
              <span style={{ color: 'white' }}>{i.h1a}</span><br />
              <span style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a5b4fc)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                paddingBottom: '0.1em', display: 'inline-block',
              }}>{i.h1b}</span>
            </h1>

            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, maxWidth: 480, margin: 0 }}>
              {i.sub}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)' }} />
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Featured */}
        {featured && <FeaturedCard post={featured} i={i} />}

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {rest.map((post, idx) => (
            <PostCard key={post.slug} post={post} delay={idx * 60} i={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: 64,
          padding: '36px 40px',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.07), rgba(139,92,246,0.09))',
          border: '1px solid rgba(99,102,241,0.18)',
          borderRadius: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 4, letterSpacing: '-0.3px' }}>{i.ctaTitle}</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{i.ctaSub}</p>
          </div>
          <Link href="/dashboard" style={{
            display: 'inline-block', padding: '11px 24px',
            background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)',
            borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'white',
            textDecoration: 'none', whiteSpace: 'nowrap', letterSpacing: '-0.2px',
          }}>
            {i.ctaBtn}
          </Link>
        </div>
      </div>
      <Footer lang={lang} />
    </div>
  )
}
