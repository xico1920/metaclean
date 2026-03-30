'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BlogPost from '@/app/components/BlogPost'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Google Ads Image Sizes: Complete Guide for 2025',
  description: 'Every Google Ads image size for Display, Performance Max, Discovery, and Responsive ads.',
  datePublished: '2025-03-30',
  author: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  publisher: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://metaclean.pro/blog/google-ads-image-size' },
}

const content = {
  en: {
    tag: 'Google Ads',
    readTime: '7 min read',
    h1: 'Google Ads Image Sizes: Complete Guide for 2025',
    subtitle: 'Google Display Network reaches 90% of internet users. Getting your image specs right means more placements, better quality scores, and lower CPMs.',
    intro1: "Google Ads serves images across the Display Network, YouTube, Gmail, and Discover — each with different size requirements. Unlike Meta which focuses on a handful of aspect ratios, Google has historically required specific pixel dimensions for Display ads.",
    intro2: "With Performance Max and Responsive Display Ads, Google now accepts just a few core ratios and generates variants automatically. But you still need to provide images at the right sizes to unlock all placements.",
    s1_h2: 'Quick Reference: Google Ads Image Sizes',
    th_format: 'Format',
    th_resolution: 'Resolution',
    th_ratio: 'Ratio',
    th_maxfile: 'Max File Size',
    row_landscape: 'Landscape',
    row_square: 'Square',
    row_portrait: 'Portrait',
    row_logo_sq: 'Logo (square)',
    row_logo_ls: 'Logo (landscape)',
    s1_warn_label: 'Important:',
    s1_warn: "For Responsive Display Ads and Performance Max, Google requires at least one landscape (1.91:1) and one square (1:1) image. Without both, some placements won't be eligible.",
    s1_warn_strong: 'at least one landscape (1.91:1) and one square (1:1)',
    s2_h2: 'Responsive Display Ads (RDA)',
    s2_p1: "Responsive Display Ads are Google's standard format. You provide images, headlines, and descriptions — Google assembles them into ads that fit any available placement. You can upload up to 15 images per ad.",
    th_spec: 'Spec',
    th_requirement: 'Requirement',
    spec_landscape: 'Landscape image',
    spec_square: 'Square image',
    spec_portrait: 'Portrait image',
    spec_format: 'File format',
    spec_filesize: 'File size',
    spec_minres: 'Min resolution',
    portrait_note: '960 × 1200 px minimum (4:5) — optional but recommended',
    s2_note_strong: 'text to under 20% of the image area',
    s2_note: "Google recommends keeping text to under 20% of the image area. Heavy text in images is one of the most common reasons Google gives images a low quality score.",
    s3_h2: 'Performance Max Campaigns',
    s3_p1: "Performance Max (PMax) replaced Smart Shopping and runs across all Google channels: Search, Display, YouTube, Gmail, Maps, and Discover. It's the most important campaign type to get right in 2025.",
    th_assettype: 'Asset Type',
    th_recommended: 'Recommended Size',
    th_notes: 'Notes',
    pmax_landscape: 'Landscape image',
    pmax_square: 'Square image',
    pmax_portrait: 'Portrait image',
    pmax_logo_sq: 'Square logo',
    pmax_logo_ls: 'Landscape logo',
    pmax_note_landscape: 'Required — unlocks Display & Discover',
    pmax_note_square: 'Required — unlocks most placements',
    pmax_note_portrait: 'Recommended — mobile placements',
    pmax_note_logo_sq: 'Required for native ad formats',
    pmax_note_logo_ls: 'Optional but improves native formats',
    s3_note_strong: 'all 3 image ratios',
    s3_note: "For PMax, provide all 3 image ratios plus both logo formats. More asset variety = more placement options = better campaign performance. Google's machine learning optimises which combinations perform best over time.",
    s4_h2: 'Standard Display Ad Sizes (Fixed)',
    s4_p1: "If you're running traditional Display ads (not Responsive), these are the sizes that reach the most inventory on the Google Display Network:",
    th_name: 'Name',
    th_size: 'Size',
    th_coverage: 'Coverage',
    disp_medrect: 'Medium Rectangle',
    disp_largerect: 'Large Rectangle',
    disp_leader: 'Leaderboard',
    disp_half: 'Half Page',
    disp_mobile: 'Large Mobile Banner',
    disp_bill: 'Billboard',
    cov_medrect: 'Highest reach — works on most sites',
    cov_largerect: 'High reach',
    cov_leader: 'Desktop header placement',
    cov_half: 'High impact, premium placement',
    cov_mobile: 'Mobile only',
    cov_bill: 'Desktop premium',
    s4_note_strong: 'Responsive Display Ads are the better choice',
    s4_note: "For most advertisers today, Responsive Display Ads are the better choice — they reach more placements with less production effort. Only use fixed-size display ads if you have specific design requirements that Google's assembly can't achieve.",
    s5_h2: "Google's 150KB Recommended File Size",
    s5_p1: "While Google allows up to 5MB, they recommend keeping images under 150KB for faster loading. Page speed affects Quality Score, which affects CPC.",
    s5_p2: "A 1200×1200 JPG at 90% quality typically comes out at 300-500KB. To hit 150KB you need to compress to around 70-75% quality — which is usually still visually clean for advertising purposes.",
    s5_cta_label: "MetaClean compresses to Google's recommended limits",
    s5_cta: "automatically when you select the Google platform — landscape, square, and portrait formats in one download.",
    s5_ctaBtn: 'Try it free →',
    faq_h2: 'Frequently Asked Questions',
    faqs: [
      { q: 'What is the most important Google Ads image size?', a: '1200×628px (1.91:1 landscape) is required for most placements and should be your first priority. Pair it with 1200×1200px (1:1 square) to unlock the full Display Network and Performance Max placements.' },
      { q: 'What file format should I use for Google Display ads?', a: 'JPG for photos and complex images (smaller file size). PNG for graphics, logos, or images with text (lossless, supports transparency). Avoid GIF unless you specifically need animation.' },
      { q: 'How many images should I upload to Performance Max?', a: "Upload the maximum allowed: up to 20 images across all ratios. More assets give Google's machine learning more combinations to test, which typically improves performance over time. Always include at least landscape, square, and portrait." },
      { q: 'Why does Google reject my Display ad images?', a: "Common rejection reasons: images with more than 20% text overlay, blurry or low-resolution images, images with borders that take up more than 20% of the image area, and images that don't meet minimum size requirements." },
      { q: 'Does image metadata affect Google Ads?', a: "Metadata doesn't directly affect Google's ad approval, but it does affect file size. Stripping EXIF data can reduce a JPG by 10-50KB — meaningful when targeting the 150KB recommended limit. It also protects location privacy." },
    ],
  },
  pt: {
    tag: 'Google Ads',
    readTime: '7 min de leitura',
    h1: 'Tamanhos de Imagem para Google Ads: Guia Completo 2025',
    subtitle: 'A Rede de Display do Google alcança 90% dos utilizadores da internet. Ter as especificações de imagem corretas significa mais posicionamentos, melhores pontuações de qualidade e CPMs mais baixos.',
    intro1: 'O Google Ads serve imagens na Rede de Display, YouTube, Gmail e Discover — cada um com requisitos de tamanho diferentes. Ao contrário do Meta que se foca num conjunto limitado de proporções, o Google historicamente exigiu dimensões de pixel específicas para anúncios Display.',
    intro2: 'Com o Performance Max e os Anúncios Display Responsivos, o Google agora aceita apenas algumas proporções principais e gera variantes automaticamente. Mas ainda precisa de fornecer imagens nos tamanhos certos para desbloquear todos os posicionamentos.',
    s1_h2: 'Referência Rápida: Tamanhos de Imagem para Google Ads',
    th_format: 'Formato',
    th_resolution: 'Resolução',
    th_ratio: 'Proporção',
    th_maxfile: 'Tamanho Máx.',
    row_landscape: 'Paisagem',
    row_square: 'Quadrado',
    row_portrait: 'Retrato',
    row_logo_sq: 'Logótipo (quadrado)',
    row_logo_ls: 'Logótipo (paisagem)',
    s1_warn_label: 'Importante:',
    s1_warn: 'Para Anúncios Display Responsivos e Performance Max, o Google exige pelo menos uma imagem paisagem (1.91:1) e uma quadrada (1:1). Sem ambas, alguns posicionamentos não serão elegíveis.',
    s1_warn_strong: 'pelo menos uma imagem paisagem (1.91:1) e uma quadrada (1:1)',
    s2_h2: 'Anúncios Display Responsivos (RDA)',
    s2_p1: 'Os Anúncios Display Responsivos são o formato padrão do Google. Fornece imagens, títulos e descrições — o Google monta-os em anúncios que se adaptam a qualquer posicionamento disponível. Pode carregar até 15 imagens por anúncio.',
    th_spec: 'Especificação',
    th_requirement: 'Requisito',
    spec_landscape: 'Imagem paisagem',
    spec_square: 'Imagem quadrada',
    spec_portrait: 'Imagem retrato',
    spec_format: 'Formato de ficheiro',
    spec_filesize: 'Tamanho do ficheiro',
    spec_minres: 'Resolução mínima',
    portrait_note: '960 × 1200 px mínimo (4:5) — opcional mas recomendado',
    s2_note_strong: 'texto abaixo de 20% da área da imagem',
    s2_note: 'O Google recomenda manter o texto abaixo de 20% da área da imagem. Texto excessivo nas imagens é uma das razões mais comuns pelas quais o Google atribui uma pontuação de qualidade baixa às imagens.',
    s3_h2: 'Campanhas Performance Max',
    s3_p1: 'O Performance Max (PMax) substituiu o Smart Shopping e funciona em todos os canais do Google: Search, Display, YouTube, Gmail, Maps e Discover. É o tipo de campanha mais importante para acertar em 2025.',
    th_assettype: 'Tipo de Recurso',
    th_recommended: 'Tamanho Recomendado',
    th_notes: 'Notas',
    pmax_landscape: 'Imagem paisagem',
    pmax_square: 'Imagem quadrada',
    pmax_portrait: 'Imagem retrato',
    pmax_logo_sq: 'Logótipo quadrado',
    pmax_logo_ls: 'Logótipo paisagem',
    pmax_note_landscape: 'Obrigatório — desbloqueia Display e Discover',
    pmax_note_square: 'Obrigatório — desbloqueia a maioria dos posicionamentos',
    pmax_note_portrait: 'Recomendado — posicionamentos mobile',
    pmax_note_logo_sq: 'Obrigatório para formatos de anúncios nativos',
    pmax_note_logo_ls: 'Opcional mas melhora os formatos nativos',
    s3_note_strong: 'todas as 3 proporções de imagem',
    s3_note: 'Para o PMax, forneça todas as 3 proporções de imagem mais os dois formatos de logótipo. Mais variedade de recursos = mais opções de posicionamento = melhor desempenho da campanha. A aprendizagem automática do Google otimiza quais as combinações com melhor desempenho ao longo do tempo.',
    s4_h2: 'Tamanhos de Anúncios Display Padrão (Fixos)',
    s4_p1: 'Se estiver a executar anúncios Display tradicionais (não Responsivos), estes são os tamanhos que alcançam mais inventário na Rede de Display do Google:',
    th_name: 'Nome',
    th_size: 'Tamanho',
    th_coverage: 'Cobertura',
    disp_medrect: 'Retângulo Médio',
    disp_largerect: 'Retângulo Grande',
    disp_leader: 'Leaderboard',
    disp_half: 'Meia Página',
    disp_mobile: 'Banner Mobile Grande',
    disp_bill: 'Billboard',
    cov_medrect: 'Maior alcance — funciona na maioria dos sites',
    cov_largerect: 'Alto alcance',
    cov_leader: 'Posicionamento de cabeçalho desktop',
    cov_half: 'Alto impacto, posicionamento premium',
    cov_mobile: 'Apenas mobile',
    cov_bill: 'Premium desktop',
    s4_note_strong: 'os Anúncios Display Responsivos são a melhor escolha',
    s4_note: 'Para a maioria dos anunciantes hoje, os Anúncios Display Responsivos são a melhor escolha — alcançam mais posicionamentos com menos esforço de produção. Use anúncios display de tamanho fixo apenas se tiver requisitos de design específicos que a montagem do Google não consegue alcançar.',
    s5_h2: 'O Tamanho de Ficheiro Recomendado de 150KB do Google',
    s5_p1: 'Embora o Google permita até 5MB, recomendam manter as imagens abaixo de 150KB para carregamento mais rápido. A velocidade da página afeta o Índice de Qualidade, que afeta o CPC.',
    s5_p2: 'Um JPG de 1200×1200 com 90% de qualidade tipicamente fica entre 300-500KB. Para atingir 150KB precisa de comprimir para cerca de 70-75% de qualidade — o que geralmente ainda é visualmente limpo para fins publicitários.',
    s5_cta_label: 'O MetaClean comprime para os limites recomendados do Google',
    s5_cta: 'automaticamente quando seleciona a plataforma Google — formatos paisagem, quadrado e retrato numa única transferência.',
    s5_ctaBtn: 'Experimente gratuitamente →',
    faq_h2: 'Perguntas Frequentes',
    faqs: [
      { q: 'Qual é o tamanho de imagem mais importante para Google Ads?', a: '1200×628px (paisagem 1.91:1) é obrigatório para a maioria dos posicionamentos e deve ser a sua primeira prioridade. Combine com 1200×1200px (quadrado 1:1) para desbloquear a Rede de Display completa e os posicionamentos Performance Max.' },
      { q: 'Que formato de ficheiro devo usar para anúncios Display do Google?', a: 'JPG para fotografias e imagens complexas (menor tamanho de ficheiro). PNG para gráficos, logótipos ou imagens com texto (sem perdas, suporta transparência). Evite GIF a não ser que precise especificamente de animação.' },
      { q: 'Quantas imagens devo carregar para o Performance Max?', a: 'Carregue o máximo permitido: até 20 imagens em todas as proporções. Mais recursos dão à aprendizagem automática do Google mais combinações para testar, o que tipicamente melhora o desempenho ao longo do tempo. Inclua sempre pelo menos paisagem, quadrado e retrato.' },
      { q: 'Por que razão o Google rejeita as minhas imagens Display?', a: 'Razões comuns de rejeição: imagens com mais de 20% de sobreposição de texto, imagens desfocadas ou de baixa resolução, imagens com bordas que ocupam mais de 20% da área da imagem, e imagens que não cumprem os requisitos mínimos de tamanho.' },
      { q: 'Os metadados da imagem afetam o Google Ads?', a: 'Os metadados não afetam diretamente a aprovação de anúncios do Google, mas afetam o tamanho do ficheiro. Remover os dados EXIF pode reduzir um JPG em 10-50KB — relevante quando se tenta atingir o limite recomendado de 150KB. Também protege a privacidade de localização.' },
    ],
  },
  es: {
    tag: 'Google Ads',
    readTime: '7 min de lectura',
    h1: 'Tamaños de Imagen para Google Ads: Guía Completa 2025',
    subtitle: 'La Red de Display de Google alcanza al 90% de los usuarios de internet. Tener las especificaciones de imagen correctas significa más posicionamientos, mejores puntuaciones de calidad y CPMs más bajos.',
    intro1: 'Google Ads sirve imágenes en la Red de Display, YouTube, Gmail y Discover — cada uno con diferentes requisitos de tamaño. A diferencia de Meta que se enfoca en un conjunto reducido de proporciones, Google históricamente ha requerido dimensiones de píxel específicas para los anuncios Display.',
    intro2: 'Con Performance Max y los Anuncios Display Responsivos, Google ahora acepta solo algunas proporciones principales y genera variantes automáticamente. Pero aún necesitas proporcionar imágenes en los tamaños correctos para desbloquear todos los posicionamientos.',
    s1_h2: 'Referencia Rápida: Tamaños de Imagen para Google Ads',
    th_format: 'Formato',
    th_resolution: 'Resolución',
    th_ratio: 'Proporción',
    th_maxfile: 'Tamaño Máx.',
    row_landscape: 'Horizontal',
    row_square: 'Cuadrado',
    row_portrait: 'Vertical',
    row_logo_sq: 'Logo (cuadrado)',
    row_logo_ls: 'Logo (horizontal)',
    s1_warn_label: 'Importante:',
    s1_warn: 'Para los Anuncios Display Responsivos y Performance Max, Google requiere al menos una imagen horizontal (1.91:1) y una cuadrada (1:1). Sin ambas, algunos posicionamientos no serán elegibles.',
    s1_warn_strong: 'al menos una imagen horizontal (1.91:1) y una cuadrada (1:1)',
    s2_h2: 'Anuncios Display Responsivos (RDA)',
    s2_p1: 'Los Anuncios Display Responsivos son el formato estándar de Google. Proporcionas imágenes, títulos y descripciones — Google los ensambla en anuncios que se adaptan a cualquier posicionamiento disponible. Puedes subir hasta 15 imágenes por anuncio.',
    th_spec: 'Especificación',
    th_requirement: 'Requisito',
    spec_landscape: 'Imagen horizontal',
    spec_square: 'Imagen cuadrada',
    spec_portrait: 'Imagen vertical',
    spec_format: 'Formato de archivo',
    spec_filesize: 'Tamaño del archivo',
    spec_minres: 'Resolución mínima',
    portrait_note: '960 × 1200 px mínimo (4:5) — opcional pero recomendado',
    s2_note_strong: 'texto por debajo del 20% del área de la imagen',
    s2_note: 'Google recomienda mantener el texto por debajo del 20% del área de la imagen. El texto excesivo en las imágenes es una de las razones más comunes por las que Google asigna una puntuación de calidad baja a las imágenes.',
    s3_h2: 'Campañas Performance Max',
    s3_p1: 'Performance Max (PMax) reemplazó a Smart Shopping y funciona en todos los canales de Google: Búsqueda, Display, YouTube, Gmail, Maps y Discover. Es el tipo de campaña más importante para configurar correctamente en 2025.',
    th_assettype: 'Tipo de Recurso',
    th_recommended: 'Tamaño Recomendado',
    th_notes: 'Notas',
    pmax_landscape: 'Imagen horizontal',
    pmax_square: 'Imagen cuadrada',
    pmax_portrait: 'Imagen vertical',
    pmax_logo_sq: 'Logo cuadrado',
    pmax_logo_ls: 'Logo horizontal',
    pmax_note_landscape: 'Obligatorio — desbloquea Display y Discover',
    pmax_note_square: 'Obligatorio — desbloquea la mayoría de posicionamientos',
    pmax_note_portrait: 'Recomendado — posicionamientos móviles',
    pmax_note_logo_sq: 'Obligatorio para formatos de anuncios nativos',
    pmax_note_logo_ls: 'Opcional pero mejora los formatos nativos',
    s3_note_strong: 'las 3 proporciones de imagen',
    s3_note: 'Para PMax, proporciona las 3 proporciones de imagen más los dos formatos de logo. Más variedad de recursos = más opciones de posicionamiento = mejor rendimiento de la campaña. El machine learning de Google optimiza qué combinaciones funcionan mejor con el tiempo.',
    s4_h2: 'Tamaños de Anuncios Display Estándar (Fijos)',
    s4_p1: 'Si estás ejecutando anuncios Display tradicionales (no Responsivos), estos son los tamaños que alcanzan más inventario en la Red de Display de Google:',
    th_name: 'Nombre',
    th_size: 'Tamaño',
    th_coverage: 'Cobertura',
    disp_medrect: 'Rectángulo Mediano',
    disp_largerect: 'Rectángulo Grande',
    disp_leader: 'Leaderboard',
    disp_half: 'Media Página',
    disp_mobile: 'Banner Móvil Grande',
    disp_bill: 'Billboard',
    cov_medrect: 'Mayor alcance — funciona en la mayoría de sitios',
    cov_largerect: 'Alto alcance',
    cov_leader: 'Posicionamiento de cabecera desktop',
    cov_half: 'Alto impacto, posicionamiento premium',
    cov_mobile: 'Solo móvil',
    cov_bill: 'Premium desktop',
    s4_note_strong: 'los Anuncios Display Responsivos son la mejor opción',
    s4_note: 'Para la mayoría de anunciantes hoy en día, los Anuncios Display Responsivos son la mejor opción — alcanzan más posicionamientos con menos esfuerzo de producción. Usa anuncios display de tamaño fijo solo si tienes requisitos de diseño específicos que el ensamblado de Google no puede lograr.',
    s5_h2: 'El Tamaño de Archivo Recomendado de 150KB de Google',
    s5_p1: 'Aunque Google permite hasta 5MB, recomiendan mantener las imágenes por debajo de 150KB para una carga más rápida. La velocidad de página afecta el Nivel de Calidad, que afecta el CPC.',
    s5_p2: 'Un JPG de 1200×1200 al 90% de calidad típicamente sale entre 300-500KB. Para alcanzar 150KB necesitas comprimir a alrededor del 70-75% de calidad — lo que generalmente sigue siendo visualmente limpio para fines publicitarios.',
    s5_cta_label: 'MetaClean comprime a los límites recomendados de Google',
    s5_cta: 'automáticamente cuando seleccionas la plataforma Google — formatos horizontal, cuadrado y vertical en una sola descarga.',
    s5_ctaBtn: 'Pruébalo gratis →',
    faq_h2: 'Preguntas Frecuentes',
    faqs: [
      { q: '¿Cuál es el tamaño de imagen más importante para Google Ads?', a: '1200×628px (horizontal 1.91:1) es necesario para la mayoría de los posicionamientos y debe ser tu primera prioridad. Combínalo con 1200×1200px (cuadrado 1:1) para desbloquear la Red de Display completa y los posicionamientos Performance Max.' },
      { q: '¿Qué formato de archivo debo usar para los anuncios Display de Google?', a: 'JPG para fotos e imágenes complejas (menor tamaño de archivo). PNG para gráficos, logos o imágenes con texto (sin pérdidas, admite transparencia). Evita GIF a menos que necesites específicamente animación.' },
      { q: '¿Cuántas imágenes debo subir a Performance Max?', a: 'Sube el máximo permitido: hasta 20 imágenes en todas las proporciones. Más recursos dan al machine learning de Google más combinaciones que probar, lo que típicamente mejora el rendimiento con el tiempo. Incluye siempre al menos horizontal, cuadrado y vertical.' },
      { q: '¿Por qué Google rechaza mis imágenes Display?', a: 'Razones comunes de rechazo: imágenes con más del 20% de superposición de texto, imágenes borrosas o de baja resolución, imágenes con bordes que ocupan más del 20% del área de la imagen, e imágenes que no cumplen los requisitos mínimos de tamaño.' },
      { q: '¿Los metadatos de la imagen afectan a Google Ads?', a: 'Los metadatos no afectan directamente la aprobación de anuncios de Google, pero sí afectan el tamaño del archivo. Eliminar los datos EXIF puede reducir un JPG en 10-50KB — relevante cuando se intenta alcanzar el límite recomendado de 150KB. También protege la privacidad de ubicación.' },
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

export default function GoogleAdsSizes() {
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
          <span style={{ fontSize: 11, fontWeight: 600, color: '#34d399', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 6, padding: '2px 8px' }}>{c.tag}</span>
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
                <th style={thStyle}>{c.th_format}</th>
                <th style={thStyle}>{c.th_resolution}</th>
                <th style={thStyle}>{c.th_ratio}</th>
                <th style={thStyle}>{c.th_maxfile}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>{c.row_landscape}</td><td style={tdStyle}>1200 × 628 px</td><td style={tdStyle}>1.91:1</td><td style={tdStyle}>5 MB</td></tr>
              <tr><td style={highlightTd}>{c.row_square}</td><td style={tdStyle}>1200 × 1200 px</td><td style={tdStyle}>1:1</td><td style={tdStyle}>5 MB</td></tr>
              <tr><td style={highlightTd}>{c.row_portrait}</td><td style={tdStyle}>960 × 1200 px</td><td style={tdStyle}>4:5</td><td style={tdStyle}>5 MB</td></tr>
              <tr><td style={highlightTd}>{c.row_logo_sq}</td><td style={tdStyle}>1200 × 1200 px</td><td style={tdStyle}>1:1</td><td style={tdStyle}>5 MB</td></tr>
              <tr><td style={highlightTd}>{c.row_logo_ls}</td><td style={tdStyle}>1200 × 300 px</td><td style={tdStyle}>4:1</td><td style={tdStyle}>5 MB</td></tr>
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
              <tr><td style={highlightTd}>{c.spec_landscape}</td><td style={tdStyle}>1200 × 628 px minimum (1.91:1)</td></tr>
              <tr><td style={highlightTd}>{c.spec_square}</td><td style={tdStyle}>1200 × 1200 px minimum (1:1)</td></tr>
              <tr><td style={highlightTd}>{c.spec_portrait}</td><td style={tdStyle}>{c.portrait_note}</td></tr>
              <tr><td style={highlightTd}>{c.spec_format}</td><td style={tdStyle}>JPG, PNG, GIF (static), SVG</td></tr>
              <tr><td style={highlightTd}>{c.spec_filesize}</td><td style={tdStyle}>≤ 5 MB</td></tr>
              <tr><td style={highlightTd}>{c.spec_minres}</td><td style={tdStyle}>600 × 314 px (landscape), 300 × 300 px (square)</td></tr>
            </tbody>
          </table>
        </div>
        <p style={pStyle}>{c.s2_note}</p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.s3_h2}</h2>
        <p style={pStyle}>{c.s3_p1}</p>
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>{c.th_assettype}</th>
                <th style={thStyle}>{c.th_recommended}</th>
                <th style={thStyle}>{c.th_notes}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>{c.pmax_landscape}</td><td style={tdStyle}>1200 × 628 px</td><td style={tdStyle}>{c.pmax_note_landscape}</td></tr>
              <tr><td style={highlightTd}>{c.pmax_square}</td><td style={tdStyle}>1200 × 1200 px</td><td style={tdStyle}>{c.pmax_note_square}</td></tr>
              <tr><td style={highlightTd}>{c.pmax_portrait}</td><td style={tdStyle}>960 × 1200 px</td><td style={tdStyle}>{c.pmax_note_portrait}</td></tr>
              <tr><td style={highlightTd}>{c.pmax_logo_sq}</td><td style={tdStyle}>1200 × 1200 px</td><td style={tdStyle}>{c.pmax_note_logo_sq}</td></tr>
              <tr><td style={highlightTd}>{c.pmax_logo_ls}</td><td style={tdStyle}>1200 × 300 px</td><td style={tdStyle}>{c.pmax_note_logo_ls}</td></tr>
            </tbody>
          </table>
        </div>
        <p style={pStyle}>{c.s3_note}</p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.s4_h2}</h2>
        <p style={pStyle}>{c.s4_p1}</p>
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>{c.th_name}</th>
                <th style={thStyle}>{c.th_size}</th>
                <th style={thStyle}>{c.th_coverage}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>{c.disp_medrect}</td><td style={tdStyle}>300 × 250 px</td><td style={tdStyle}>{c.cov_medrect}</td></tr>
              <tr><td style={highlightTd}>{c.disp_largerect}</td><td style={tdStyle}>336 × 280 px</td><td style={tdStyle}>{c.cov_largerect}</td></tr>
              <tr><td style={highlightTd}>{c.disp_leader}</td><td style={tdStyle}>728 × 90 px</td><td style={tdStyle}>{c.cov_leader}</td></tr>
              <tr><td style={highlightTd}>{c.disp_half}</td><td style={tdStyle}>300 × 600 px</td><td style={tdStyle}>{c.cov_half}</td></tr>
              <tr><td style={highlightTd}>{c.disp_mobile}</td><td style={tdStyle}>320 × 100 px</td><td style={tdStyle}>{c.cov_mobile}</td></tr>
              <tr><td style={highlightTd}>{c.disp_bill}</td><td style={tdStyle}>970 × 250 px</td><td style={tdStyle}>{c.cov_bill}</td></tr>
            </tbody>
          </table>
        </div>
        <p style={pStyle}>{c.s4_note}</p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.s5_h2}</h2>
        <p style={pStyle}>{c.s5_p1}</p>
        <p style={pStyle}>{c.s5_p2}</p>
        <div style={calloutStyle}>
          <p style={{ margin: '0 0 12px', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            <strong style={{ color: '#a5b4fc' }}>{c.s5_cta_label}</strong> {c.s5_cta}
          </p>
          <Link href="/dashboard" style={{ display: 'inline-block', padding: '9px 18px', background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'white', textDecoration: 'none' }}>
            {c.s5_ctaBtn}
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
