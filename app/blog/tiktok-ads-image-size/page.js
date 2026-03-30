'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BlogPost from '@/app/components/BlogPost'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'TikTok Ads Image & Video Sizes: The Complete 2025 Guide',
  description: 'Every TikTok ad image and video size, aspect ratio, and file limit.',
  datePublished: '2025-03-30',
  author: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  publisher: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://metaclean.pro/blog/tiktok-ads-image-size' },
}

const content = {
  en: {
    tag: 'TikTok Ads',
    readTime: '5 min read',
    h1: 'TikTok Ads Image & Video Sizes: The Complete 2025 Guide',
    subtitle: "TikTok is unforgiving with creative specs. Wrong size, wrong file weight — and your ad won't deliver. Here's everything you need.",
    intro1: "TikTok ads are almost exclusively vertical. The platform was built for 9:16 full-screen content and everything else gets cropped, letterboxed, or simply rejected. If you're coming from Facebook advertising, the most important shift is: think vertical first.",
    intro1_strong: 'think vertical first.',
    intro2: "TikTok also has strict file size limits — images must be under 500KB. This is much tighter than Meta's 30MB limit and means you need to compress images properly before uploading.",
    s1_h2: 'Quick Reference: All TikTok Ad Sizes',
    th_adtype: 'Ad Type',
    th_resolution: 'Resolution',
    th_ratio: 'Ratio',
    th_maxfile: 'Max File Size',
    row_infeed: 'In-Feed Image',
    row_infeed_sq: 'In-Feed Square',
    row_infeed_ls: 'In-Feed Landscape',
    row_topview: 'TopView',
    row_spark: 'Spark Ads',
    row_brand: 'Brand Takeover',
    spark_size: 'Match original post',
    spark_ratio: 'Any',
    spark_size_limit: '—',
    s1_warn_label: '500KB limit:',
    s1_warn: "TikTok's image file size limit is much stricter than other platforms. A standard 1080×1920 JPG from a camera or Photoshop will typically be 2–5MB — you must compress it before uploading. MetaClean handles this automatically.",
    s2_h2: 'TikTok In-Feed Ads',
    s2_p1: 'In-Feed ads appear between organic content as users scroll. They blend into the For You page experience and are the most common format for performance advertisers.',
    th_spec: 'Spec',
    th_requirement: 'Requirement',
    spec_recsize: 'Recommended size',
    spec_minres: 'Min resolution',
    spec_format: 'File format',
    spec_filesize: 'File size',
    spec_safezone: 'Safe zone',
    safe_zone_note: 'Keep content away from bottom 130px (CTA area)',
    s3_h2: "Safe Zone: What Gets Covered by TikTok's UI",
    s3_p1: "TikTok overlays its UI on top of your creative. If you put important content (text, faces, products) in these areas, they'll be covered:",
    th_area: 'Area',
    th_coverage: 'Coverage',
    th_whatcovers: 'What covers it',
    area_bottom: 'Bottom',
    area_right: 'Right side',
    area_top: 'Top',
    covers_bottom: 'CTA button, ad label, description',
    covers_right: 'Like, comment, share buttons',
    covers_top: 'Profile name, ad label',
    s3_p2: 'Keep your product, face, and any text within the safe zone: roughly center 900×1640px of the 1080×1920 frame.',
    s3_p2_strong: 'center 900×1640px',
    s4_h2: 'Why TikTok Compresses Your Images',
    s4_p1: "TikTok recompresses every image you upload. If you upload at exactly 500KB, TikTok will compress it further for delivery — so you want to start with the highest quality possible within the limit.",
    s4_p2: "The best approach: export your creative at high quality, then use a tool to reduce to under 500KB while maintaining visual quality. MetaClean does this automatically — it compresses to the platform limit without visible quality loss.",
    s4_cta_label: 'MetaClean auto-compresses to 500KB',
    s4_cta: 'when you select TikTok as the platform — no manual compression needed.',
    s4_ctaBtn: 'Try it free →',
    faq_h2: 'Frequently Asked Questions',
    faqs: [
      { q: 'What is the best image size for TikTok ads?', a: '1080×1920px (9:16 vertical) is the recommended size for all TikTok ad placements. It fills the full screen and delivers the best visual impact. Always design for vertical mobile viewing first.' },
      { q: 'What file size limit does TikTok have for images?', a: 'TikTok limits image ads to 500KB. This is significantly stricter than Meta (30MB) or Google (5MB). You must compress your images before uploading — a standard camera JPG at 1080×1920 will be 3-5MB and will be rejected.' },
      { q: 'Can I use a square image for TikTok ads?', a: 'Yes — TikTok supports 1:1 (1080×1080px) and 16:9 (1920×1080px) for In-Feed ads, but 9:16 vertical performs significantly better. Vertical content feels native to the platform; square and landscape formats feel like imported ads.' },
      { q: 'What is a Spark Ad on TikTok?', a: "Spark Ads let you boost existing organic TikTok posts as ads. Since you're using an existing post, the size is whatever the original content was. This format often outperforms standard In-Feed ads because it looks completely native." },
      { q: 'Do TikTok ads need metadata removed?', a: 'Yes — as with all ad platforms, stripping EXIF metadata from images before uploading is best practice. It reduces file size slightly (helping with the 500KB limit) and removes location/device data that could trigger content filters.' },
    ],
  },
  pt: {
    tag: 'TikTok Ads',
    readTime: '5 min de leitura',
    h1: 'Tamanhos de Imagem e Vídeo para TikTok Ads: O Guia Completo 2025',
    subtitle: 'O TikTok é implacável com as especificações criativas. Tamanho errado, peso de ficheiro errado — e o seu anúncio não é entregue. Aqui está tudo o que precisa.',
    intro1: 'Os anúncios do TikTok são quase exclusivamente verticais. A plataforma foi construída para conteúdo de ecrã completo 9:16 e tudo o resto é cortado, letterboxed ou simplesmente rejeitado. Se vem do advertising no Facebook, a mudança mais importante é: pensar vertical primeiro.',
    intro1_strong: 'pensar vertical primeiro.',
    intro2: 'O TikTok também tem limites de tamanho de ficheiro rigorosos — as imagens devem ter menos de 500KB. Isto é muito mais restritivo do que o limite de 30MB do Meta e significa que precisa de comprimir as imagens corretamente antes de as carregar.',
    s1_h2: 'Referência Rápida: Todos os Tamanhos de Anúncios TikTok',
    th_adtype: 'Tipo de Anúncio',
    th_resolution: 'Resolução',
    th_ratio: 'Proporção',
    th_maxfile: 'Tamanho Máx.',
    row_infeed: 'In-Feed (Imagem)',
    row_infeed_sq: 'In-Feed (Quadrado)',
    row_infeed_ls: 'In-Feed (Paisagem)',
    row_topview: 'TopView',
    row_spark: 'Spark Ads',
    row_brand: 'Brand Takeover',
    spark_size: 'Igual ao post original',
    spark_ratio: 'Qualquer',
    spark_size_limit: '—',
    s1_warn_label: 'Limite de 500KB:',
    s1_warn: 'O limite de tamanho de ficheiro de imagem do TikTok é muito mais rigoroso do que outras plataformas. Um JPG padrão de 1080×1920 de uma câmara ou Photoshop terá tipicamente 2 a 5MB — tem de o comprimir antes de carregar. O MetaClean trata disto automaticamente.',
    s2_h2: 'Anúncios In-Feed do TikTok',
    s2_p1: 'Os anúncios In-Feed aparecem entre o conteúdo orgânico enquanto os utilizadores fazem scroll. Integram-se na experiência da página For You e são o formato mais comum para anunciantes focados em performance.',
    th_spec: 'Especificação',
    th_requirement: 'Requisito',
    spec_recsize: 'Tamanho recomendado',
    spec_minres: 'Resolução mínima',
    spec_format: 'Formato de ficheiro',
    spec_filesize: 'Tamanho do ficheiro',
    spec_safezone: 'Zona segura',
    safe_zone_note: 'Manter conteúdo afastado dos 130px inferiores (área CTA)',
    s3_h2: 'Zona Segura: O Que é Coberto pela Interface do TikTok',
    s3_p1: 'O TikTok sobrepõe a sua interface ao seu criativo. Se colocar conteúdo importante (texto, rostos, produtos) nestas áreas, ficarão cobertos:',
    th_area: 'Área',
    th_coverage: 'Cobertura',
    th_whatcovers: 'O que cobre',
    area_bottom: 'Inferior',
    area_right: 'Lado direito',
    area_top: 'Superior',
    covers_bottom: 'Botão CTA, etiqueta de anúncio, descrição',
    covers_right: 'Botões de gosto, comentário, partilha',
    covers_top: 'Nome do perfil, etiqueta de anúncio',
    s3_p2: 'Mantenha o produto, rosto e qualquer texto dentro da zona segura: aproximadamente o centro de 900×1640px da moldura de 1080×1920.',
    s3_p2_strong: 'centro de 900×1640px',
    s4_h2: 'Por Que o TikTok Comprime as Suas Imagens',
    s4_p1: 'O TikTok recomprime cada imagem que carrega. Se carregar com exatamente 500KB, o TikTok irá comprimi-la ainda mais para entrega — por isso, deve começar com a maior qualidade possível dentro do limite.',
    s4_p2: 'A melhor abordagem: exporte o seu criativo em alta qualidade e depois use uma ferramenta para reduzir para menos de 500KB mantendo a qualidade visual. O MetaClean faz isto automaticamente — comprime até ao limite da plataforma sem perda de qualidade visível.',
    s4_cta_label: 'O MetaClean comprime automaticamente para 500KB',
    s4_cta: 'quando seleciona o TikTok como plataforma — sem necessidade de compressão manual.',
    s4_ctaBtn: 'Experimente gratuitamente →',
    faq_h2: 'Perguntas Frequentes',
    faqs: [
      { q: 'Qual é o melhor tamanho de imagem para anúncios TikTok?', a: '1080×1920px (vertical 9:16) é o tamanho recomendado para todos os posicionamentos de anúncios TikTok. Preenche o ecrã completo e proporciona o melhor impacto visual. Projete sempre para visualização mobile vertical em primeiro lugar.' },
      { q: 'Qual é o limite de tamanho de ficheiro do TikTok para imagens?', a: 'O TikTok limita os anúncios de imagem a 500KB. Isto é significativamente mais restritivo do que o Meta (30MB) ou o Google (5MB). Tem de comprimir as imagens antes de carregar — um JPG de câmara padrão em 1080×1920 terá 3-5MB e será rejeitado.' },
      { q: 'Posso usar uma imagem quadrada para anúncios TikTok?', a: 'Sim — o TikTok suporta 1:1 (1080×1080px) e 16:9 (1920×1080px) para anúncios In-Feed, mas o 9:16 vertical tem um desempenho significativamente melhor. O conteúdo vertical parece nativo da plataforma; os formatos quadrados e paisagem parecem anúncios importados.' },
      { q: 'O que é um Spark Ad no TikTok?', a: 'Os Spark Ads permitem impulsionar posts orgânicos existentes do TikTok como anúncios. Como está a usar um post existente, o tamanho é o do conteúdo original. Este formato frequentemente supera os anúncios In-Feed padrão porque parece completamente nativo.' },
      { q: 'Os anúncios TikTok precisam de ter os metadados removidos?', a: 'Sim — como em todas as plataformas de anúncios, remover os metadados EXIF das imagens antes de carregar é uma boa prática. Reduz ligeiramente o tamanho do ficheiro (ajudando com o limite de 500KB) e remove dados de localização/dispositivo que poderiam acionar filtros de conteúdo.' },
    ],
  },
  es: {
    tag: 'TikTok Ads',
    readTime: '5 min de lectura',
    h1: 'Tamaños de Imagen y Vídeo para TikTok Ads: Guía Completa 2025',
    subtitle: 'TikTok es inflexible con las especificaciones creativas. Tamaño incorrecto, peso de archivo incorrecto — y tu anuncio no se entregará. Aquí tienes todo lo que necesitas.',
    intro1: 'Los anuncios de TikTok son casi exclusivamente verticales. La plataforma fue construida para contenido de pantalla completa 9:16 y todo lo demás se recorta, se letterboxea o simplemente se rechaza. Si vienes de la publicidad en Facebook, el cambio más importante es: pensar en vertical primero.',
    intro1_strong: 'pensar en vertical primero.',
    intro2: 'TikTok también tiene límites de tamaño de archivo estrictos — las imágenes deben ser menores de 500KB. Esto es mucho más restrictivo que el límite de 30MB de Meta y significa que debes comprimir las imágenes correctamente antes de subirlas.',
    s1_h2: 'Referencia Rápida: Todos los Tamaños de Anuncios TikTok',
    th_adtype: 'Tipo de Anuncio',
    th_resolution: 'Resolución',
    th_ratio: 'Proporción',
    th_maxfile: 'Tamaño Máx.',
    row_infeed: 'In-Feed (Imagen)',
    row_infeed_sq: 'In-Feed (Cuadrado)',
    row_infeed_ls: 'In-Feed (Horizontal)',
    row_topview: 'TopView',
    row_spark: 'Spark Ads',
    row_brand: 'Brand Takeover',
    spark_size: 'Igual al post original',
    spark_ratio: 'Cualquiera',
    spark_size_limit: '—',
    s1_warn_label: 'Límite de 500KB:',
    s1_warn: 'El límite de tamaño de archivo de imagen de TikTok es mucho más estricto que otras plataformas. Un JPG estándar de 1080×1920 de una cámara o Photoshop típicamente pesará 2–5MB — debes comprimirlo antes de subir. MetaClean lo gestiona automáticamente.',
    s2_h2: 'Anuncios In-Feed de TikTok',
    s2_p1: 'Los anuncios In-Feed aparecen entre el contenido orgánico mientras los usuarios hacen scroll. Se integran en la experiencia de la página For You y son el formato más común para anunciantes enfocados en rendimiento.',
    th_spec: 'Especificación',
    th_requirement: 'Requisito',
    spec_recsize: 'Tamaño recomendado',
    spec_minres: 'Resolución mínima',
    spec_format: 'Formato de archivo',
    spec_filesize: 'Tamaño del archivo',
    spec_safezone: 'Zona segura',
    safe_zone_note: 'Mantener contenido alejado de los 130px inferiores (área CTA)',
    s3_h2: 'Zona Segura: Qué Cubre la Interfaz de TikTok',
    s3_p1: 'TikTok superpone su interfaz sobre tu creativo. Si colocas contenido importante (texto, rostros, productos) en estas áreas, quedarán cubiertos:',
    th_area: 'Área',
    th_coverage: 'Cobertura',
    th_whatcovers: 'Qué lo cubre',
    area_bottom: 'Inferior',
    area_right: 'Lado derecho',
    area_top: 'Superior',
    covers_bottom: 'Botón CTA, etiqueta de anuncio, descripción',
    covers_right: 'Botones de me gusta, comentario, compartir',
    covers_top: 'Nombre del perfil, etiqueta de anuncio',
    s3_p2: 'Mantén tu producto, rostro y cualquier texto dentro de la zona segura: aproximadamente el centro de 900×1640px del marco de 1080×1920.',
    s3_p2_strong: 'centro de 900×1640px',
    s4_h2: 'Por Qué TikTok Comprime Tus Imágenes',
    s4_p1: 'TikTok recomprime cada imagen que subes. Si subes exactamente a 500KB, TikTok lo comprimirá aún más para la entrega — por lo que debes empezar con la mayor calidad posible dentro del límite.',
    s4_p2: 'El mejor enfoque: exporta tu creativo en alta calidad y luego usa una herramienta para reducirlo a menos de 500KB manteniendo la calidad visual. MetaClean lo hace automáticamente — comprime hasta el límite de la plataforma sin pérdida de calidad visible.',
    s4_cta_label: 'MetaClean comprime automáticamente a 500KB',
    s4_cta: 'cuando seleccionas TikTok como plataforma — sin necesidad de compresión manual.',
    s4_ctaBtn: 'Pruébalo gratis →',
    faq_h2: 'Preguntas Frecuentes',
    faqs: [
      { q: '¿Cuál es el mejor tamaño de imagen para anuncios de TikTok?', a: '1080×1920px (vertical 9:16) es el tamaño recomendado para todos los posicionamientos de anuncios de TikTok. Llena la pantalla completa y ofrece el mejor impacto visual. Diseña siempre para visualización móvil vertical en primer lugar.' },
      { q: '¿Cuál es el límite de tamaño de archivo de TikTok para imágenes?', a: 'TikTok limita los anuncios de imagen a 500KB. Esto es significativamente más estricto que Meta (30MB) o Google (5MB). Debes comprimir tus imágenes antes de subirlas — un JPG de cámara estándar en 1080×1920 pesará 3-5MB y será rechazado.' },
      { q: '¿Puedo usar una imagen cuadrada para anuncios de TikTok?', a: 'Sí — TikTok admite 1:1 (1080×1080px) y 16:9 (1920×1080px) para anuncios In-Feed, pero el vertical 9:16 rinde significativamente mejor. El contenido vertical se siente nativo de la plataforma; los formatos cuadrados y horizontales parecen anuncios importados.' },
      { q: '¿Qué es un Spark Ad en TikTok?', a: 'Los Spark Ads te permiten impulsar posts orgánicos existentes de TikTok como anuncios. Como usas un post existente, el tamaño es el del contenido original. Este formato a menudo supera a los anuncios In-Feed estándar porque parece completamente nativo.' },
      { q: '¿Los anuncios de TikTok necesitan que se eliminen los metadatos?', a: 'Sí — como con todas las plataformas de anuncios, eliminar los metadatos EXIF de las imágenes antes de subir es una buena práctica. Reduce ligeramente el tamaño del archivo (ayudando con el límite de 500KB) y elimina datos de ubicación/dispositivo que podrían activar filtros de contenido.' },
    ],
  },
}

const pStyle = { fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: '0 0 16px' }
const h2Style = { fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', color: 'white', marginBottom: 16, marginTop: 0 }
const tableWrap = { background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: 13 }
const thStyle = { textAlign: 'left', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }
const tdStyle = { padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', verticalAlign: 'top' }
const highlightTd = { ...tdStyle, color: '#a5b4fc', fontWeight: 600 }
const calloutStyle = { background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }
const warnStyle = { background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }

export default function TikTokAdsSizes() {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('metaclean_lang')
    if (saved && ['en', 'pt', 'es'].includes(saved)) setLang(saved)
    const onLang = (e) => setLang(e.detail)
    window.addEventListener('metaclean:lang', onLang)
    return () => window.removeEventListener('metaclean:lang', onLang)
  }, [])

  const c = content[lang]

  return (
    <BlogPost>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#f472b6', background: 'rgba(244,114,182,0.1)', border: '1px solid rgba(244,114,182,0.2)', borderRadius: 6, padding: '2px 8px' }}>{c.tag}</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>March 30, 2025</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>·</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{c.readTime}</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 16, color: 'white' }}>
          {c.h1}
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>
          {c.subtitle}
        </p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <p style={pStyle}>{c.intro1}</p>
        <p style={pStyle}>{c.intro2}</p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.s1_h2}</h2>
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>{c.th_adtype}</th>
                <th style={thStyle}>{c.th_resolution}</th>
                <th style={thStyle}>{c.th_ratio}</th>
                <th style={thStyle}>{c.th_maxfile}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>{c.row_infeed}</td><td style={tdStyle}>1080 × 1920 px</td><td style={tdStyle}>9:16</td><td style={tdStyle}>500 KB</td></tr>
              <tr><td style={highlightTd}>{c.row_infeed_sq}</td><td style={tdStyle}>1080 × 1080 px</td><td style={tdStyle}>1:1</td><td style={tdStyle}>500 KB</td></tr>
              <tr><td style={highlightTd}>{c.row_infeed_ls}</td><td style={tdStyle}>1920 × 1080 px</td><td style={tdStyle}>16:9</td><td style={tdStyle}>500 KB</td></tr>
              <tr><td style={highlightTd}>{c.row_topview}</td><td style={tdStyle}>1080 × 1920 px</td><td style={tdStyle}>9:16</td><td style={tdStyle}>500 KB</td></tr>
              <tr><td style={highlightTd}>{c.row_spark}</td><td style={tdStyle}>{c.spark_size}</td><td style={tdStyle}>{c.spark_ratio}</td><td style={tdStyle}>{c.spark_size_limit}</td></tr>
              <tr><td style={highlightTd}>{c.row_brand}</td><td style={tdStyle}>1080 × 1920 px</td><td style={tdStyle}>9:16</td><td style={tdStyle}>500 KB</td></tr>
            </tbody>
          </table>
        </div>

        <div style={warnStyle}>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            <strong style={{ color: '#fbbf24' }}>{c.s1_warn_label}</strong> {c.s1_warn}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.s2_h2}</h2>
        <p style={pStyle}>{c.s2_p1}</p>
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>{c.th_spec}</th>
                <th style={thStyle}>{c.th_requirement}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>{c.spec_recsize}</td><td style={tdStyle}>1080 × 1920 px (9:16)</td></tr>
              <tr><td style={highlightTd}>{c.spec_minres}</td><td style={tdStyle}>540 × 960 px</td></tr>
              <tr><td style={highlightTd}>{c.spec_format}</td><td style={tdStyle}>JPG, PNG</td></tr>
              <tr><td style={highlightTd}>{c.spec_filesize}</td><td style={tdStyle}>≤ 500 KB</td></tr>
              <tr><td style={highlightTd}>{c.spec_safezone}</td><td style={tdStyle}>{c.safe_zone_note}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.s3_h2}</h2>
        <p style={pStyle}>{c.s3_p1}</p>
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>{c.th_area}</th>
                <th style={thStyle}>{c.th_coverage}</th>
                <th style={thStyle}>{c.th_whatcovers}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>{c.area_bottom}</td><td style={tdStyle}>Bottom 130px</td><td style={tdStyle}>{c.covers_bottom}</td></tr>
              <tr><td style={highlightTd}>{c.area_right}</td><td style={tdStyle}>Right 80px</td><td style={tdStyle}>{c.covers_right}</td></tr>
              <tr><td style={highlightTd}>{c.area_top}</td><td style={tdStyle}>Top 60px</td><td style={tdStyle}>{c.covers_top}</td></tr>
            </tbody>
          </table>
        </div>
        <p style={pStyle}>{c.s3_p2}</p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.s4_h2}</h2>
        <p style={pStyle}>{c.s4_p1}</p>
        <p style={pStyle}>{c.s4_p2}</p>

        <div style={calloutStyle}>
          <p style={{ margin: '0 0 12px', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            <strong style={{ color: '#a5b4fc' }}>{c.s4_cta_label}</strong> {c.s4_cta}
          </p>
          <Link href="/dashboard" style={{ display: 'inline-block', padding: '9px 18px', background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'white', textDecoration: 'none' }}>
            {c.s4_ctaBtn}
          </Link>
        </div>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.faq_h2}</h2>
        {c.faqs.map((item, idx) => (
          <div key={idx} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: idx < c.faqs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 8, marginTop: 0, letterSpacing: '-0.3px' }}>{item.q}</h3>
            <p style={{ ...pStyle, margin: 0 }}>{item.a}</p>
          </div>
        ))}
      </div>
    </BlogPost>
  )
}
