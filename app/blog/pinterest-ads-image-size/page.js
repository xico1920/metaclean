'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BlogPost from '@/app/components/BlogPost'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Pinterest Ads Image Sizes: Complete Guide for 2025',
  description: 'Every Pinterest ad image size — Standard Pins, Video Pins, Shopping Ads, Idea Ads, and Carousel.',
  datePublished: '2025-03-30',
  author: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  publisher: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://metaclean.pro/blog/pinterest-ads-image-size' },
}

const content = {
  en: {
    tag: 'Pinterest Ads',
    readTime: '5 min read',
    h1: 'Pinterest Ads Image Sizes: Complete Guide for 2025',
    subtitle: 'Pinterest is a visual search engine with 500M+ monthly users in high purchase-intent mode. Getting your creative specs right is the first step to standing out in the feed.',
    intro1: 'Pinterest is fundamentally different from other ad platforms. Users come to Pinterest to discover and plan purchases — not to scroll mindlessly. The intent is higher, the creative standards are higher, and the sizes are vertical by default.',
    intro2: "Pinterest's feed is a masonry grid. Taller images take up more space and get more visual attention. That's why the 2:3 ratio (1000×1500px) is the dominant format — it gives you maximum feed real estate.",
    s1_h2: 'Quick Reference: Pinterest Ad Image Sizes',
    th_format: 'Ad Format',
    th_size: 'Recommended Size',
    th_ratio: 'Aspect Ratio',
    th_maxfile: 'Max File Size',
    row_standard: 'Standard Pin',
    row_square: 'Square Pin',
    row_long: 'Long Pin',
    row_shopping: 'Shopping Ad',
    row_carousel: 'Carousel (per image)',
    row_collections: 'Collections',
    carousel_ratio: '1:1 or 2:3',
    collections_size: '1000 × 1500 px (hero)',
    s1_tip_label: 'Pinterest tip:',
    s1_tip: 'Pinterest crops images taller than 1:2.1 in the feed. If you create an image taller than 2100px at 1000px wide, the bottom will be cut off in search results. The sweet spot is 1000×1500px (2:3).',
    s2_h2: 'Standard Pin Ads',
    s2_p1: 'Standard Pin ads look like regular organic Pins. They appear in the home feed, search results, and the "More like this" section. The format blends with organic content and typically has lower CPMs than disruptive formats on other platforms.',
    th_spec: 'Spec',
    th_requirement: 'Requirement',
    spec_recsize: 'Recommended size',
    spec_minsize: 'Minimum size',
    spec_maxratio: 'Maximum ratio',
    spec_format: 'File format',
    spec_filesize: 'File size',
    max_ratio_note: '1:2.1 (taller gets cropped)',
    s3_h2: 'Shopping Ads',
    s3_p1: "Shopping Ads pull from your product catalog and show product name, price, and availability automatically. They're the highest-intent format on Pinterest — users clicking them are actively looking to buy.",
    s3_p2: 'Shopping Ads use the same image specs as Standard Pins (2:3, 1000×1500px) but require a connected product catalog. The product title and price are automatically overlaid below your image in the feed.',
    s3_tip_label: 'Shopping Ads tip:',
    s3_tip: "Use clean product photography on a white or light background. The product should fill 70-80% of the frame. Avoid lifestyle shots for Shopping Ads — users want to see exactly what they're buying.",
    s4_h2: 'Carousel Ads',
    s4_p1: 'Carousel Ads let you show 2-5 images in a single ad unit. Each card can link to a different URL — useful for showcasing product variants, steps in a process, or a collection.',
    spec_images: 'Images per carousel',
    spec_match: 'All images must match',
    spec_filesize_per: 'File size per image',
    images_range: '2–5 images',
    match_note: 'Same aspect ratio across all cards',
    s5_h2: 'Creative Best Practices for Pinterest Ads',
    s5_p1: "Pinterest has its own creative culture. What works on Facebook often underperforms on Pinterest, and vice versa.",
    best_practices: [
      { title: 'Vertical is non-negotiable', body: '85% of Pinterest users are on mobile. Vertical 2:3 images fill the screen and outperform square or landscape. Always design vertical-first for Pinterest.' },
      { title: 'High-quality imagery wins', body: 'Pinterest users have high visual standards. Blurry, low-resolution, or poorly lit images perform significantly worse than clean, bright photography. Minimum 1000px wide, ideally 2000px+.' },
      { title: 'Add text overlay strategically', body: "Unlike Meta, Pinterest users expect some text on Pins. A clear headline (recipe name, product name, how-to title) helps your Pin stand out in search results. Keep it readable at thumbnail size." },
      { title: 'Use lifestyle context', body: "Pinterest is aspirational. Show products in use — in a home, worn by a person, in a setting that matches the buyer's aspiration. Pure product shots work for Shopping Ads; lifestyle works better for everything else." },
      { title: 'Brand in the corner', body: 'Add your logo or website URL in a corner of the Pin image. Pinterest content gets repinned and shared — branded Pins continue working for you long after the paid campaign ends.' },
    ],
    faq_h2: 'Frequently Asked Questions',
    faqs: [
      { q: 'What is the best image size for Pinterest ads?', a: '1000×1500px (2:3 aspect ratio) is the recommended size for all standard Pinterest ad formats. It fills the maximum feed space without being cropped, and performs best on mobile where 85%+ of Pinterest traffic comes from.' },
      { q: 'Can I use landscape images for Pinterest ads?', a: "Technically yes, but it's strongly discouraged. Landscape images appear much smaller in the masonry feed compared to vertical Pins, reducing visual impact and click-through rates significantly. Always go vertical for Pinterest." },
      { q: 'What file format should I use for Pinterest ads?', a: "JPG for photos and complex images. PNG for graphics, text-heavy Pins, or images with transparency. Pinterest allows both formats up to 20MB — much more generous than TikTok's 500KB limit." },
      { q: 'How many images can I use in a Pinterest Carousel?', a: "2 to 5 images per carousel. All images must use the same aspect ratio (either 1:1 or 2:3 — you can't mix ratios within one carousel). Each card can link to a different URL." },
      { q: 'Do Pinterest ads need EXIF metadata removed?', a: "Best practice yes, as with all ad platforms. Pinterest's content moderation system scans image metadata. Stripping it also reduces file size, which improves upload speed and can affect how quickly your ads pass review." },
    ],
  },
  pt: {
    tag: 'Pinterest Ads',
    readTime: '5 min de leitura',
    h1: 'Tamanhos de Imagens para Pinterest Ads: Guia Completo 2025',
    subtitle: 'O Pinterest é um motor de busca visual com mais de 500M de utilizadores mensais em modo de alta intenção de compra. Acertar nas especificações criativas é o primeiro passo para se destacar no feed.',
    intro1: 'O Pinterest é fundamentalmente diferente de outras plataformas de anúncios. Os utilizadores vêm ao Pinterest para descobrir e planear compras — não para fazer scroll sem pensar. A intenção é maior, os padrões criativos são mais elevados e os tamanhos são verticais por defeito.',
    intro2: 'O feed do Pinterest é uma grelha masonry. Imagens mais altas ocupam mais espaço e recebem mais atenção visual. É por isso que a proporção 2:3 (1000×1500px) é o formato dominante — dá o máximo de espaço no feed.',
    s1_h2: 'Referência Rápida: Tamanhos de Imagens para Anúncios Pinterest',
    th_format: 'Formato de Anúncio',
    th_size: 'Tamanho Recomendado',
    th_ratio: 'Proporção',
    th_maxfile: 'Tamanho Máx.',
    row_standard: 'Pin Padrão',
    row_square: 'Pin Quadrado',
    row_long: 'Pin Longo',
    row_shopping: 'Shopping Ad',
    row_carousel: 'Carrossel (por imagem)',
    row_collections: 'Coleções',
    carousel_ratio: '1:1 ou 2:3',
    collections_size: '1000 × 1500 px (hero)',
    s1_tip_label: 'Dica Pinterest:',
    s1_tip: 'O Pinterest corta imagens mais altas que 1:2.1 no feed. Se criares uma imagem mais alta que 2100px com 1000px de largura, a parte inferior será cortada nos resultados de pesquisa. O ponto ideal é 1000×1500px (2:3).',
    s2_h2: 'Anúncios Pin Padrão',
    s2_p1: 'Os anúncios Pin Padrão parecem Pins orgânicos normais. Aparecem no feed inicial, nos resultados de pesquisa e na secção "Mais como este". O formato mistura-se com o conteúdo orgânico e tipicamente tem CPMs mais baixos do que os formatos disruptivos de outras plataformas.',
    th_spec: 'Especificação',
    th_requirement: 'Requisito',
    spec_recsize: 'Tamanho recomendado',
    spec_minsize: 'Tamanho mínimo',
    spec_maxratio: 'Proporção máxima',
    spec_format: 'Formato de ficheiro',
    spec_filesize: 'Tamanho do ficheiro',
    max_ratio_note: '1:2.1 (imagens mais altas são cortadas)',
    s3_h2: 'Shopping Ads',
    s3_p1: 'Os Shopping Ads retiram do teu catálogo de produtos e mostram o nome do produto, preço e disponibilidade automaticamente. São o formato de maior intenção no Pinterest — os utilizadores que clicam estão ativamente a procurar comprar.',
    s3_p2: 'Os Shopping Ads usam as mesmas especificações de imagem que os Pins Padrão (2:3, 1000×1500px), mas requerem um catálogo de produtos ligado. O título do produto e o preço são automaticamente sobrepostos abaixo da tua imagem no feed.',
    s3_tip_label: 'Dica Shopping Ads:',
    s3_tip: 'Usa fotografia de produto limpa em fundo branco ou claro. O produto deve preencher 70-80% da moldura. Evita fotos de lifestyle para Shopping Ads — os utilizadores querem ver exatamente o que estão a comprar.',
    s4_h2: 'Anúncios Carrossel',
    s4_p1: 'Os Anúncios Carrossel permitem mostrar 2-5 imagens numa única unidade de anúncio. Cada cartão pode ligar a um URL diferente — útil para mostrar variantes de produto, etapas de um processo ou uma coleção.',
    spec_images: 'Imagens por carrossel',
    spec_match: 'Todas as imagens devem corresponder',
    spec_filesize_per: 'Tamanho do ficheiro por imagem',
    images_range: '2–5 imagens',
    match_note: 'Mesma proporção em todos os cartões',
    s5_h2: 'Boas Práticas Criativas para Anúncios Pinterest',
    s5_p1: 'O Pinterest tem a sua própria cultura criativa. O que funciona no Facebook frequentemente tem um desempenho inferior no Pinterest, e vice-versa.',
    best_practices: [
      { title: 'O vertical é inegociável', body: '85% dos utilizadores do Pinterest estão no telemóvel. As imagens verticais 2:3 preenchem o ecrã e superam os formatos quadrado ou paisagem. Projeta sempre para o Pinterest em modo vertical primeiro.' },
      { title: 'A qualidade de imagem vence', body: 'Os utilizadores do Pinterest têm padrões visuais elevados. Imagens desfocadas, de baixa resolução ou mal iluminadas têm um desempenho significativamente pior do que fotografia limpa e luminosa. Mínimo 1000px de largura, idealmente 2000px+.' },
      { title: 'Adiciona texto sobreposto estrategicamente', body: 'Ao contrário do Meta, os utilizadores do Pinterest esperam algum texto nos Pins. Um título claro (nome da receita, nome do produto, título how-to) ajuda o teu Pin a destacar-se nos resultados de pesquisa. Mantém-no legível em tamanho miniatura.' },
      { title: 'Usa contexto de lifestyle', body: "O Pinterest é aspiracional. Mostra produtos em uso — numa casa, vestidos por uma pessoa, num ambiente que corresponde à aspiração do comprador. Fotos puras de produto funcionam para Shopping Ads; o lifestyle funciona melhor para tudo o resto." },
      { title: 'Marca num canto', body: 'Adiciona o teu logótipo ou URL do website num canto da imagem do Pin. O conteúdo do Pinterest é repinado e partilhado — os Pins com marca continuam a trabalhar para ti muito depois de a campanha paga terminar.' },
    ],
    faq_h2: 'Perguntas Frequentes',
    faqs: [
      { q: 'Qual é o melhor tamanho de imagem para anúncios Pinterest?', a: '1000×1500px (proporção 2:3) é o tamanho recomendado para todos os formatos padrão de anúncios Pinterest. Preenche o espaço máximo do feed sem ser cortado e tem o melhor desempenho no telemóvel, de onde vem mais de 85% do tráfego do Pinterest.' },
      { q: 'Posso usar imagens em paisagem para anúncios Pinterest?', a: 'Tecnicamente sim, mas é fortemente desaconselhado. As imagens em paisagem aparecem muito menores na grelha masonry em comparação com os Pins verticais, reduzindo significativamente o impacto visual e as taxas de clique. Opta sempre pelo vertical para o Pinterest.' },
      { q: 'Que formato de ficheiro devo usar para anúncios Pinterest?', a: 'JPG para fotos e imagens complexas. PNG para gráficos, Pins com muito texto ou imagens com transparência. O Pinterest permite ambos os formatos até 20MB — muito mais generoso do que o limite de 500KB do TikTok.' },
      { q: 'Quantas imagens posso usar num Carrossel Pinterest?', a: 'De 2 a 5 imagens por carrossel. Todas as imagens devem usar a mesma proporção (1:1 ou 2:3 — não podes misturar proporções num mesmo carrossel). Cada cartão pode ligar a um URL diferente.' },
      { q: 'Os anúncios Pinterest precisam de ter os metadados EXIF removidos?', a: 'Boa prática sim, como em todas as plataformas de anúncios. O sistema de moderação de conteúdo do Pinterest analisa os metadados das imagens. Removê-los também reduz o tamanho do ficheiro, o que melhora a velocidade de carregamento e pode afetar a rapidez com que os teus anúncios passam na revisão.' },
    ],
  },
  es: {
    tag: 'Pinterest Ads',
    readTime: '5 min de lectura',
    h1: 'Tamaños de Imágenes para Pinterest Ads: Guía Completa 2025',
    subtitle: 'Pinterest es un motor de búsqueda visual con más de 500M de usuarios mensuales en modo de alta intención de compra. Acertar con las especificaciones creativas es el primer paso para destacar en el feed.',
    intro1: 'Pinterest es fundamentalmente diferente de otras plataformas publicitarias. Los usuarios acuden a Pinterest para descubrir y planificar compras — no para hacer scroll sin pensar. La intención es mayor, los estándares creativos son más altos y los tamaños son verticales por defecto.',
    intro2: 'El feed de Pinterest es una cuadrícula masonry. Las imágenes más altas ocupan más espacio y reciben más atención visual. Por eso la proporción 2:3 (1000×1500px) es el formato dominante — te da el máximo espacio en el feed.',
    s1_h2: 'Referencia Rápida: Tamaños de Imágenes para Anuncios de Pinterest',
    th_format: 'Formato de Anuncio',
    th_size: 'Tamaño Recomendado',
    th_ratio: 'Proporción',
    th_maxfile: 'Tamaño Máx.',
    row_standard: 'Pin Estándar',
    row_square: 'Pin Cuadrado',
    row_long: 'Pin Largo',
    row_shopping: 'Shopping Ad',
    row_carousel: 'Carrusel (por imagen)',
    row_collections: 'Colecciones',
    carousel_ratio: '1:1 o 2:3',
    collections_size: '1000 × 1500 px (hero)',
    s1_tip_label: 'Consejo Pinterest:',
    s1_tip: 'Pinterest recorta las imágenes más altas que 1:2.1 en el feed. Si creas una imagen más alta que 2100px con 1000px de ancho, la parte inferior se cortará en los resultados de búsqueda. El punto óptimo es 1000×1500px (2:3).',
    s2_h2: 'Anuncios Pin Estándar',
    s2_p1: 'Los anuncios Pin Estándar parecen Pins orgánicos normales. Aparecen en el feed principal, en los resultados de búsqueda y en la sección "Más como este". El formato se mezcla con el contenido orgánico y típicamente tiene CPMs más bajos que los formatos disruptivos de otras plataformas.',
    th_spec: 'Especificación',
    th_requirement: 'Requisito',
    spec_recsize: 'Tamaño recomendado',
    spec_minsize: 'Tamaño mínimo',
    spec_maxratio: 'Proporción máxima',
    spec_format: 'Formato de archivo',
    spec_filesize: 'Tamaño del archivo',
    max_ratio_note: '1:2.1 (imágenes más altas se recortan)',
    s3_h2: 'Shopping Ads',
    s3_p1: 'Los Shopping Ads se nutren de tu catálogo de productos y muestran el nombre del producto, precio y disponibilidad automáticamente. Son el formato de mayor intención en Pinterest — los usuarios que hacen clic están buscando activamente comprar.',
    s3_p2: 'Los Shopping Ads usan las mismas especificaciones de imagen que los Pines Estándar (2:3, 1000×1500px), pero requieren un catálogo de productos conectado. El título del producto y el precio se superponen automáticamente debajo de tu imagen en el feed.',
    s3_tip_label: 'Consejo Shopping Ads:',
    s3_tip: 'Usa fotografía de producto limpia sobre fondo blanco o claro. El producto debe llenar el 70-80% del encuadre. Evita las fotos de lifestyle para Shopping Ads — los usuarios quieren ver exactamente lo que están comprando.',
    s4_h2: 'Anuncios Carrusel',
    s4_p1: 'Los Anuncios Carrusel te permiten mostrar 2-5 imágenes en una sola unidad de anuncio. Cada tarjeta puede enlazar a una URL diferente — útil para mostrar variantes de producto, pasos de un proceso o una colección.',
    spec_images: 'Imágenes por carrusel',
    spec_match: 'Todas las imágenes deben coincidir',
    spec_filesize_per: 'Tamaño de archivo por imagen',
    images_range: '2–5 imágenes',
    match_note: 'Misma proporción en todas las tarjetas',
    s5_h2: 'Buenas Prácticas Creativas para Anuncios de Pinterest',
    s5_p1: 'Pinterest tiene su propia cultura creativa. Lo que funciona en Facebook a menudo rinde menos en Pinterest, y viceversa.',
    best_practices: [
      { title: 'Lo vertical es innegociable', body: 'El 85% de los usuarios de Pinterest están en móvil. Las imágenes verticales 2:3 llenan la pantalla y superan a los formatos cuadrado o horizontal. Diseña siempre para Pinterest en modo vertical primero.' },
      { title: 'La calidad de imagen gana', body: 'Los usuarios de Pinterest tienen altos estándares visuales. Las imágenes borrosas, de baja resolución o mal iluminadas rinden significativamente peor que la fotografía limpia y luminosa. Mínimo 1000px de ancho, idealmente 2000px+.' },
      { title: 'Añade texto superpuesto estratégicamente', body: 'A diferencia de Meta, los usuarios de Pinterest esperan algo de texto en los Pines. Un titular claro (nombre de receta, nombre de producto, título how-to) ayuda a que tu Pin destaque en los resultados de búsqueda. Mantenlo legible en tamaño miniatura.' },
      { title: 'Usa contexto de lifestyle', body: "Pinterest es aspiracional. Muestra productos en uso — en un hogar, llevados por una persona, en un entorno que coincida con la aspiración del comprador. Las fotos puras de producto funcionan para Shopping Ads; el lifestyle funciona mejor para todo lo demás." },
      { title: 'Marca en la esquina', body: 'Añade tu logotipo o URL del sitio web en una esquina de la imagen del Pin. El contenido de Pinterest se repinea y comparte — los Pines con marca siguen trabajando para ti mucho después de que termine la campaña de pago.' },
    ],
    faq_h2: 'Preguntas Frecuentes',
    faqs: [
      { q: '¿Cuál es el mejor tamaño de imagen para anuncios de Pinterest?', a: '1000×1500px (proporción 2:3) es el tamaño recomendado para todos los formatos estándar de anuncios de Pinterest. Llena el espacio máximo del feed sin ser recortado y rinde mejor en móvil, de donde proviene más del 85% del tráfico de Pinterest.' },
      { q: '¿Puedo usar imágenes horizontales para anuncios de Pinterest?', a: "Técnicamente sí, pero está muy desaconsejado. Las imágenes horizontales aparecen mucho más pequeñas en la cuadrícula masonry en comparación con los Pines verticales, reduciendo significativamente el impacto visual y las tasas de clics. Opta siempre por el vertical para Pinterest." },
      { q: '¿Qué formato de archivo debo usar para anuncios de Pinterest?', a: "JPG para fotos e imágenes complejas. PNG para gráficos, Pines con mucho texto o imágenes con transparencia. Pinterest permite ambos formatos hasta 20MB — mucho más generoso que el límite de 500KB de TikTok." },
      { q: '¿Cuántas imágenes puedo usar en un Carrusel de Pinterest?', a: "De 2 a 5 imágenes por carrusel. Todas las imágenes deben usar la misma proporción (1:1 o 2:3 — no puedes mezclar proporciones en un mismo carrusel). Cada tarjeta puede enlazar a una URL diferente." },
      { q: '¿Los anuncios de Pinterest necesitan que se eliminen los metadatos EXIF?', a: "Buena práctica sí, como con todas las plataformas publicitarias. El sistema de moderación de contenido de Pinterest analiza los metadatos de las imágenes. Eliminarlos también reduce el tamaño del archivo, lo que mejora la velocidad de carga y puede afectar la rapidez con que tus anuncios pasan la revisión." },
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
const tipStyle = { background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }

export default function PinterestAdsSizes() {
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
          <span style={{ fontSize: 11, fontWeight: 600, color: '#f87171', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 6, padding: '2px 8px' }}>{c.tag}</span>
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
                <th style={thStyle}>{c.th_size}</th>
                <th style={thStyle}>{c.th_ratio}</th>
                <th style={thStyle}>{c.th_maxfile}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>{c.row_standard}</td><td style={tdStyle}>1000 × 1500 px</td><td style={tdStyle}>2:3</td><td style={tdStyle}>20 MB</td></tr>
              <tr><td style={highlightTd}>{c.row_square}</td><td style={tdStyle}>1000 × 1000 px</td><td style={tdStyle}>1:1</td><td style={tdStyle}>20 MB</td></tr>
              <tr><td style={highlightTd}>{c.row_long}</td><td style={tdStyle}>1000 × 2100 px</td><td style={tdStyle}>1:2.1</td><td style={tdStyle}>20 MB</td></tr>
              <tr><td style={highlightTd}>{c.row_shopping}</td><td style={tdStyle}>1000 × 1500 px</td><td style={tdStyle}>2:3</td><td style={tdStyle}>20 MB</td></tr>
              <tr><td style={highlightTd}>{c.row_carousel}</td><td style={tdStyle}>1000 × 1500 px</td><td style={tdStyle}>{c.carousel_ratio}</td><td style={tdStyle}>20 MB</td></tr>
              <tr><td style={highlightTd}>{c.row_collections}</td><td style={tdStyle}>{c.collections_size}</td><td style={tdStyle}>2:3</td><td style={tdStyle}>20 MB</td></tr>
            </tbody>
          </table>
        </div>

        <div style={tipStyle}>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            <strong style={{ color: '#fbbf24' }}>{c.s1_tip_label}</strong> {c.s1_tip}
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
              <tr><td style={highlightTd}>{c.spec_recsize}</td><td style={tdStyle}>1000 × 1500 px</td></tr>
              <tr><td style={highlightTd}>{c.spec_minsize}</td><td style={tdStyle}>600 × 900 px</td></tr>
              <tr><td style={highlightTd}>{c.spec_maxratio}</td><td style={tdStyle}>{c.max_ratio_note}</td></tr>
              <tr><td style={highlightTd}>{c.spec_format}</td><td style={tdStyle}>JPG, PNG</td></tr>
              <tr><td style={highlightTd}>{c.spec_filesize}</td><td style={tdStyle}>≤ 20 MB</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.s3_h2}</h2>
        <p style={pStyle}>{c.s3_p1}</p>
        <p style={pStyle}>{c.s3_p2}</p>
        <div style={tipStyle}>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            <strong style={{ color: '#fbbf24' }}>{c.s3_tip_label}</strong> {c.s3_tip}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.s4_h2}</h2>
        <p style={pStyle}>{c.s4_p1}</p>
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>{c.th_spec}</th>
                <th style={thStyle}>{c.th_requirement}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>{c.spec_images}</td><td style={tdStyle}>{c.images_range}</td></tr>
              <tr><td style={highlightTd}>{c.spec_recsize}</td><td style={tdStyle}>1000 × 1500 px (2:3) or 1000 × 1000 px (1:1)</td></tr>
              <tr><td style={highlightTd}>{c.spec_match}</td><td style={tdStyle}>{c.match_note}</td></tr>
              <tr><td style={highlightTd}>{c.spec_format}</td><td style={tdStyle}>JPG, PNG</td></tr>
              <tr><td style={highlightTd}>{c.spec_filesize_per}</td><td style={tdStyle}>≤ 20 MB</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.s5_h2}</h2>
        <p style={pStyle}>{c.s5_p1}</p>
        {c.best_practices.map((item, idx) => (
          <div key={idx} style={{ marginBottom: 20, padding: '16px 20px', background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 6, marginTop: 0 }}>{idx + 1}. {item.title}</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6 }}>{item.body}</p>
          </div>
        ))}
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
