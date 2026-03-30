'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BlogPost from '@/app/components/BlogPost'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Meta Ads Image Sizes: The Complete 2025 Guide',
  description: 'Every Facebook and Instagram ad image size in one place — Feed, Stories, Reels, Carousel, and Collection.',
  datePublished: '2025-03-30',
  author: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  publisher: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://metaclean.pro/blog/meta-ads-image-size' },
}

const content = {
  en: {
    tag: 'Meta Ads',
    readTime: '6 min read',
    h1: 'Meta Ads Image Sizes: The Complete 2025 Guide',
    subtitle: 'Every Facebook and Instagram ad image size in one place — Feed, Stories, Reels, Carousel, and Collection. Updated for 2025.',
    intro1: "Getting your image sizes wrong is one of the most common reasons Meta rejects ad creatives. Too small and Meta won't serve them. Wrong aspect ratio and they get cropped badly. Over the file size limit and your upload fails silently.",
    intro2: 'This guide covers every required size, aspect ratio, and file limit for Meta ads in 2025 — across Facebook Feed, Instagram Feed, Stories, Reels, and Carousel formats.',
    s1_h2: 'Quick Reference: All Meta Ad Image Sizes',
    th_format: 'Format',
    th_resolution: 'Resolution',
    th_ratio: 'Aspect Ratio',
    th_maxfile: 'Max File Size',
    row_feed_square: 'Feed (Square)',
    row_feed_portrait: 'Feed (Portrait)',
    row_feed_landscape: 'Feed (Landscape)',
    row_stories: 'Stories & Reels',
    row_carousel: 'Carousel',
    row_collection: 'Collection Cover',
    row_rightcol: 'Right Column',
    s1_tip: 'Tip: Meta recommends the 4:5 portrait format (1080×1350) for Feed placements — it takes up the most screen real estate and typically gets more attention than square or landscape.',
    s2_h2: 'Why Image Size Affects Ad Performance',
    s2_p1: "Meta's algorithm doesn't just check if your image is technically valid — it also affects delivery. Images that perfectly match the placement ratio get more surface area on screen, which directly impacts CTR.",
    s2_p2: 'If you upload a 1920×1080 landscape image to a Feed placement, Meta will crop it to fit. You lose control of what shows, and subjects often get cut out. The fix is to resize before you upload, not after.',
    s3_h2: 'Facebook Feed Image Sizes',
    s3_p1: 'Facebook Feed supports three aspect ratios. Meta will automatically crop any image that falls outside the 1.91:1 to 4:5 range — so anything taller than 4:5 gets cropped to 4:5.',
    th_type: 'Type',
    th_recommended: 'Recommended Size',
    th_min: 'Min Size',
    row_square: 'Square',
    row_portrait: 'Portrait',
    row_landscape: 'Landscape',
    s3_note_label: 'File type:',
    s3_note: 'JPG or PNG. JPG is preferred for photos (smaller file size, same visual quality). PNG for graphics with text or transparency.',
    s4_h2: 'Instagram Feed & Stories Image Sizes',
    s4_p1: 'Instagram Feed follows the same sizes as Facebook Feed. Stories and Reels use the full vertical screen — 9:16.',
    th_placement: 'Placement',
    th_size: 'Size',
    th_notes: 'Notes',
    note_versatile: 'Most versatile',
    note_mobile_ctr: 'Best for mobile CTR',
    note_safe_zone: 'Keep safe zone: top/bottom 250px',
    note_same_stories: 'Same as Stories',
    note_square_only: 'Square only',
    s4_warning_label: 'Stories safe zone:',
    s4_warning: 'Keep important content (text, faces, CTAs) within the middle 1080×1420px. The top 250px and bottom 250px are covered by the UI (profile icon, CTA button).',
    s5_h2: 'Why Meta Rejects Images: The Metadata Problem',
    s5_p1: 'Even perfectly sized images can get flagged. One of the less obvious reasons is EXIF metadata — hidden data embedded in your image file that can include GPS coordinates, camera model, software used, and timestamps.',
    s5_p2: 'Some ad platforms scan this data. Images from certain cameras or editing software get flagged algorithmically, especially if the metadata suggests the image was previously used or was taken in a specific location that triggers policy filters.',
    s5_p3: 'The fix is simple: strip the metadata before uploading. Tools like MetaClean do this automatically alongside resizing — you upload once and get clean, correctly-sized creatives for every placement.',
    s6_h2: 'How to Resize Images for Meta Ads (The Fast Way)',
    s6_p1: 'Manually resizing every creative to 7 different sizes in Photoshop takes 20–30 minutes per image. For agencies and media buyers running multiple clients or SKUs, this adds up fast.',
    s6_p2: 'The automated workflow:',
    s6_step1: 'Upload your original high-resolution image (ideally 2000px+ on the short side)',
    s6_step2: 'Select the Meta platform in MetaClean',
    s6_step3: 'Choose which formats you need (or select all)',
    s6_step4: 'Adjust crop position for each format if needed (or use AI autocrop)',
    s6_step5: 'Download — all formats in a single ZIP, metadata stripped, ready to upload',
    s6_cta_label: 'MetaClean handles this automatically.',
    s6_cta: 'Upload your image, pick Meta, and get all 4 formats (1:1, 4:5, 9:16, 1.91:1) in one download — with EXIF stripped.',
    s6_ctaBtn: 'Try it free — no account needed →',
    faq_h2: 'Frequently Asked Questions',
    faqs: [
      {
        q: 'What is the best image size for Meta ads in 2025?',
        a: 'The 4:5 portrait format (1080×1350px) performs best on mobile Feed placements because it occupies more screen space. For multi-placement campaigns, use 1:1 (1080×1080px) as it works across Feed, Stories (with cropping), and Carousel.',
      },
      {
        q: 'What file size limit does Meta have for ad images?',
        a: 'Meta allows up to 30MB for image ads. In practice, keep JPGs under 1MB for faster loading and better delivery. Large files slow down ad loading, which hurts performance on slower connections.',
      },
      {
        q: 'Can I use the same image for Facebook and Instagram ads?',
        a: 'Yes — if you use 1:1 or 4:5 formats. These work across both platforms. Just ensure your creative was designed to work vertically for mobile placements.',
      },
      {
        q: 'Why does Meta crop my images automatically?',
        a: 'Meta crops images that fall outside the supported aspect ratio range (1.91:1 to 4:5). If your image is wider or taller than these limits, Meta will center-crop it. Always resize to the exact target format to maintain control over composition.',
      },
      {
        q: 'Do I need to remove EXIF data from my ad images?',
        a: "It's best practice. EXIF metadata can reveal GPS location, camera model, and editing software. Some platforms use this data in content review. Stripping it before upload reduces the chance of unnecessary flags and protects privacy.",
      },
    ],
  },
  pt: {
    tag: 'Meta Ads',
    readTime: '6 min de leitura',
    h1: 'Tamanhos de Imagem para Meta Ads: O Guia Completo 2025',
    subtitle: 'Todos os tamanhos de imagem para anúncios no Facebook e Instagram num só lugar — Feed, Stories, Reels, Carrossel e Coleção. Atualizado para 2025.',
    intro1: 'Usar tamanhos de imagem incorretos é uma das razões mais comuns pelas quais o Meta rejeita criativos. Demasiado pequenas e o Meta não as serve. Proporção errada e são cortadas de forma inadequada. Acima do limite de tamanho de ficheiro e o carregamento falha silenciosamente.',
    intro2: 'Este guia cobre todos os tamanhos, proporções e limites de ficheiro para anúncios Meta em 2025 — no Facebook Feed, Instagram Feed, Stories, Reels e formatos Carrossel.',
    s1_h2: 'Referência Rápida: Todos os Tamanhos de Imagem Meta Ads',
    th_format: 'Formato',
    th_resolution: 'Resolução',
    th_ratio: 'Proporção',
    th_maxfile: 'Tamanho Máx.',
    row_feed_square: 'Feed (Quadrado)',
    row_feed_portrait: 'Feed (Retrato)',
    row_feed_landscape: 'Feed (Paisagem)',
    row_stories: 'Stories e Reels',
    row_carousel: 'Carrossel',
    row_collection: 'Capa de Coleção',
    row_rightcol: 'Coluna Direita',
    s1_tip: 'Dica: O Meta recomenda o formato retrato 4:5 (1080×1350) para posicionamentos no Feed — ocupa mais espaço no ecrã e tende a obter mais atenção do que formatos quadrados ou paisagem.',
    s2_h2: 'Por Que o Tamanho da Imagem Afeta o Desempenho dos Anúncios',
    s2_p1: 'O algoritmo do Meta não verifica apenas se a imagem é tecnicamente válida — também afeta a entrega. Imagens que correspondem perfeitamente à proporção do posicionamento ocupam mais área no ecrã, o que impacta diretamente o CTR.',
    s2_p2: 'Se carregar uma imagem paisagem de 1920×1080 para um posicionamento de Feed, o Meta irá cortá-la. Perde o controlo sobre o que aparece e os elementos principais são frequentemente cortados. A solução é redimensionar antes de carregar, não depois.',
    s3_h2: 'Tamanhos de Imagem para o Facebook Feed',
    s3_p1: 'O Facebook Feed suporta três proporções. O Meta irá cortar automaticamente qualquer imagem fora do intervalo 1.91:1 a 4:5 — por isso, qualquer imagem mais alta do que 4:5 é cortada para 4:5.',
    th_type: 'Tipo',
    th_recommended: 'Tamanho Recomendado',
    th_min: 'Tamanho Mín.',
    row_square: 'Quadrado',
    row_portrait: 'Retrato',
    row_landscape: 'Paisagem',
    s3_note_label: 'Formato de ficheiro:',
    s3_note: 'JPG ou PNG. JPG é preferido para fotografias (menor tamanho de ficheiro, mesma qualidade visual). PNG para gráficos com texto ou transparência.',
    s4_h2: 'Tamanhos de Imagem para Instagram Feed e Stories',
    s4_p1: 'O Instagram Feed segue os mesmos tamanhos que o Facebook Feed. Stories e Reels usam o ecrã vertical completo — 9:16.',
    th_placement: 'Posicionamento',
    th_size: 'Tamanho',
    th_notes: 'Notas',
    note_versatile: 'Mais versátil',
    note_mobile_ctr: 'Melhor CTR mobile',
    note_safe_zone: 'Manter zona segura: topo/base 250px',
    note_same_stories: 'Igual aos Stories',
    note_square_only: 'Apenas quadrado',
    s4_warning_label: 'Zona segura dos Stories:',
    s4_warning: 'Mantenha o conteúdo importante (texto, rostos, CTAs) dentro dos 1080×1420px centrais. Os 250px superiores e inferiores são cobertos pela interface (ícone de perfil, botão CTA).',
    s5_h2: 'Por Que o Meta Rejeita Imagens: O Problema dos Metadados',
    s5_p1: 'Mesmo imagens com tamanho correto podem ser sinalizadas. Uma das razões menos óbvias são os metadados EXIF — dados ocultos incorporados no ficheiro de imagem que podem incluir coordenadas GPS, modelo de câmara, software utilizado e marcas temporais.',
    s5_p2: 'Algumas plataformas de anúncios analisam estes dados. Imagens de determinadas câmaras ou software de edição são sinalizadas algoritmicamente, especialmente se os metadados sugerem que a imagem foi usada anteriormente ou tirada num local que aciona filtros de política.',
    s5_p3: 'A solução é simples: remova os metadados antes de carregar. Ferramentas como o MetaClean fazem isto automaticamente em conjunto com o redimensionamento — carrega uma vez e obtém criativos limpos e com o tamanho correto para cada posicionamento.',
    s6_h2: 'Como Redimensionar Imagens para Meta Ads (O Método Rápido)',
    s6_p1: 'Redimensionar manualmente cada criativo para 7 tamanhos diferentes no Photoshop demora 20 a 30 minutos por imagem. Para agências e media buyers com vários clientes ou produtos, isto acumula-se rapidamente.',
    s6_p2: 'O fluxo de trabalho automatizado:',
    s6_step1: 'Carregue a sua imagem original em alta resolução (idealmente 2000px+ no lado mais curto)',
    s6_step2: 'Selecione a plataforma Meta no MetaClean',
    s6_step3: 'Escolha os formatos necessários (ou selecione todos)',
    s6_step4: 'Ajuste a posição de corte para cada formato se necessário (ou use o recorte automático por IA)',
    s6_step5: 'Descarregue — todos os formatos num único ZIP, metadados removidos, prontos para carregar',
    s6_cta_label: 'O MetaClean trata disto automaticamente.',
    s6_cta: 'Carregue a sua imagem, escolha Meta e obtenha todos os 4 formatos (1:1, 4:5, 9:16, 1.91:1) numa única transferência — com EXIF removido.',
    s6_ctaBtn: 'Experimente gratuitamente — sem conta →',
    faq_h2: 'Perguntas Frequentes',
    faqs: [
      {
        q: 'Qual é o melhor tamanho de imagem para Meta Ads em 2025?',
        a: 'O formato retrato 4:5 (1080×1350px) tem melhor desempenho em posicionamentos de Feed no mobile porque ocupa mais espaço no ecrã. Para campanhas em múltiplos posicionamentos, use 1:1 (1080×1080px) pois funciona no Feed, Stories (com corte) e Carrossel.',
      },
      {
        q: 'Qual é o limite de tamanho de ficheiro do Meta para imagens de anúncios?',
        a: 'O Meta permite até 30MB para anúncios de imagem. Na prática, mantenha os JPGs abaixo de 1MB para carregamento mais rápido e melhor entrega. Ficheiros grandes atrasam o carregamento dos anúncios, prejudicando o desempenho em ligações mais lentas.',
      },
      {
        q: 'Posso usar a mesma imagem para anúncios no Facebook e Instagram?',
        a: 'Sim — se usar formatos 1:1 ou 4:5. Estes funcionam em ambas as plataformas. Certifique-se apenas de que o criativo foi concebido para funcionar verticalmente em posicionamentos mobile.',
      },
      {
        q: 'Por que razão o Meta corta as minhas imagens automaticamente?',
        a: 'O Meta corta imagens que estão fora do intervalo de proporção suportado (1.91:1 a 4:5). Se a sua imagem for mais larga ou mais alta do que estes limites, o Meta irá centrá-la e cortá-la. Redimensione sempre para o formato alvo exato para manter o controlo sobre a composição.',
      },
      {
        q: 'Preciso de remover os dados EXIF das minhas imagens de anúncios?',
        a: 'É uma boa prática. Os metadados EXIF podem revelar localização GPS, modelo de câmara e software de edição. Algumas plataformas usam estes dados na revisão de conteúdo. Removê-los antes de carregar reduz a probabilidade de sinalizações desnecessárias e protege a privacidade.',
      },
    ],
  },
  es: {
    tag: 'Meta Ads',
    readTime: '6 min de lectura',
    h1: 'Tamaños de Imagen para Meta Ads: Guía Completa 2025',
    subtitle: 'Todos los tamaños de imagen para anuncios de Facebook e Instagram en un solo lugar — Feed, Stories, Reels, Carrusel y Colección. Actualizado para 2025.',
    intro1: 'Usar tamaños de imagen incorrectos es una de las razones más comunes por las que Meta rechaza los creativos. Demasiado pequeñas y Meta no las sirve. Proporción incorrecta y se recortan mal. Por encima del límite de tamaño de archivo y la carga falla silenciosamente.',
    intro2: 'Esta guía cubre todos los tamaños, proporciones y límites de archivo requeridos para anuncios de Meta en 2025 — en Facebook Feed, Instagram Feed, Stories, Reels y formatos de Carrusel.',
    s1_h2: 'Referencia Rápida: Todos los Tamaños de Imagen para Meta Ads',
    th_format: 'Formato',
    th_resolution: 'Resolución',
    th_ratio: 'Proporción',
    th_maxfile: 'Tamaño Máx.',
    row_feed_square: 'Feed (Cuadrado)',
    row_feed_portrait: 'Feed (Vertical)',
    row_feed_landscape: 'Feed (Horizontal)',
    row_stories: 'Stories y Reels',
    row_carousel: 'Carrusel',
    row_collection: 'Portada de Colección',
    row_rightcol: 'Columna Derecha',
    s1_tip: 'Consejo: Meta recomienda el formato vertical 4:5 (1080×1350) para posicionamientos en el Feed — ocupa más espacio en pantalla y suele captar más atención que los formatos cuadrados o horizontales.',
    s2_h2: 'Por Qué el Tamaño de la Imagen Afecta el Rendimiento de los Anuncios',
    s2_p1: 'El algoritmo de Meta no solo verifica si tu imagen es técnicamente válida — también afecta la entrega. Las imágenes que coinciden perfectamente con la proporción del posicionamiento ocupan más área en pantalla, lo que impacta directamente el CTR.',
    s2_p2: 'Si subes una imagen horizontal de 1920×1080 a un posicionamiento de Feed, Meta la recortará para que encaje. Pierdes el control sobre lo que se muestra y los sujetos suelen quedar cortados. La solución es redimensionar antes de subir, no después.',
    s3_h2: 'Tamaños de Imagen para el Facebook Feed',
    s3_p1: 'El Facebook Feed admite tres proporciones. Meta recortará automáticamente cualquier imagen fuera del rango 1.91:1 a 4:5 — por lo que cualquier imagen más alta que 4:5 se recorta a 4:5.',
    th_type: 'Tipo',
    th_recommended: 'Tamaño Recomendado',
    th_min: 'Tamaño Mín.',
    row_square: 'Cuadrado',
    row_portrait: 'Vertical',
    row_landscape: 'Horizontal',
    s3_note_label: 'Formato de archivo:',
    s3_note: 'JPG o PNG. JPG es preferido para fotos (menor tamaño de archivo, misma calidad visual). PNG para gráficos con texto o transparencia.',
    s4_h2: 'Tamaños de Imagen para Instagram Feed y Stories',
    s4_p1: 'El Instagram Feed sigue los mismos tamaños que el Facebook Feed. Stories y Reels usan la pantalla vertical completa — 9:16.',
    th_placement: 'Posicionamiento',
    th_size: 'Tamaño',
    th_notes: 'Notas',
    note_versatile: 'Más versátil',
    note_mobile_ctr: 'Mejor CTR en móvil',
    note_safe_zone: 'Mantener zona segura: arriba/abajo 250px',
    note_same_stories: 'Igual que Stories',
    note_square_only: 'Solo cuadrado',
    s4_warning_label: 'Zona segura de Stories:',
    s4_warning: 'Mantén el contenido importante (texto, rostros, CTAs) dentro de los 1080×1420px centrales. Los 250px superiores e inferiores están cubiertos por la interfaz (icono de perfil, botón CTA).',
    s5_h2: 'Por Qué Meta Rechaza Imágenes: El Problema de los Metadatos',
    s5_p1: 'Incluso las imágenes con el tamaño correcto pueden ser marcadas. Una de las razones menos obvias son los metadatos EXIF — datos ocultos incrustados en el archivo de imagen que pueden incluir coordenadas GPS, modelo de cámara, software utilizado y marcas de tiempo.',
    s5_p2: 'Algunas plataformas de anuncios analizan estos datos. Las imágenes de ciertas cámaras o software de edición se marcan algorítmicamente, especialmente si los metadatos sugieren que la imagen fue usada anteriormente o tomada en una ubicación específica que activa filtros de política.',
    s5_p3: 'La solución es simple: elimina los metadatos antes de subir. Herramientas como MetaClean hacen esto automáticamente junto con el redimensionamiento — subes una vez y obtienes creativos limpios y con el tamaño correcto para cada posicionamiento.',
    s6_h2: 'Cómo Redimensionar Imágenes para Meta Ads (El Método Rápido)',
    s6_p1: 'Redimensionar manualmente cada creativo a 7 tamaños diferentes en Photoshop tarda 20 a 30 minutos por imagen. Para agencias y media buyers con múltiples clientes o SKUs, esto se acumula rápidamente.',
    s6_p2: 'El flujo de trabajo automatizado:',
    s6_step1: 'Sube tu imagen original en alta resolución (idealmente 2000px+ en el lado corto)',
    s6_step2: 'Selecciona la plataforma Meta en MetaClean',
    s6_step3: 'Elige los formatos que necesitas (o selecciona todos)',
    s6_step4: 'Ajusta la posición de recorte para cada formato si es necesario (o usa el recorte automático con IA)',
    s6_step5: 'Descarga — todos los formatos en un solo ZIP, metadatos eliminados, listos para subir',
    s6_cta_label: 'MetaClean lo gestiona automáticamente.',
    s6_cta: 'Sube tu imagen, elige Meta y obtén los 4 formatos (1:1, 4:5, 9:16, 1.91:1) en una sola descarga — con EXIF eliminado.',
    s6_ctaBtn: 'Pruébalo gratis — sin cuenta →',
    faq_h2: 'Preguntas Frecuentes',
    faqs: [
      {
        q: '¿Cuál es el mejor tamaño de imagen para Meta Ads en 2025?',
        a: 'El formato vertical 4:5 (1080×1350px) funciona mejor en posicionamientos de Feed en móvil porque ocupa más espacio en pantalla. Para campañas en múltiples posicionamientos, usa 1:1 (1080×1080px) ya que funciona en Feed, Stories (con recorte) y Carrusel.',
      },
      {
        q: '¿Cuál es el límite de tamaño de archivo de Meta para imágenes de anuncios?',
        a: 'Meta permite hasta 30MB para anuncios de imagen. En la práctica, mantén los JPGs por debajo de 1MB para una carga más rápida y mejor entrega. Los archivos grandes ralentizan la carga de anuncios, lo que perjudica el rendimiento en conexiones lentas.',
      },
      {
        q: '¿Puedo usar la misma imagen para anuncios de Facebook e Instagram?',
        a: 'Sí — si usas formatos 1:1 o 4:5. Estos funcionan en ambas plataformas. Solo asegúrate de que tu creativo esté diseñado para funcionar verticalmente en posicionamientos móviles.',
      },
      {
        q: '¿Por qué Meta recorta mis imágenes automáticamente?',
        a: 'Meta recorta imágenes que están fuera del rango de proporción admitido (1.91:1 a 4:5). Si tu imagen es más ancha o más alta que estos límites, Meta la centrará y recortará. Siempre redimensiona al formato objetivo exacto para mantener el control sobre la composición.',
      },
      {
        q: '¿Necesito eliminar los datos EXIF de mis imágenes de anuncios?',
        a: 'Es una buena práctica. Los metadatos EXIF pueden revelar ubicación GPS, modelo de cámara y software de edición. Algunas plataformas usan estos datos en la revisión de contenido. Eliminarlos antes de subir reduce la posibilidad de marcas innecesarias y protege la privacidad.',
      },
    ],
  },
}

const sectionStyle = {
  marginBottom: 48,
}

const h2Style = {
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: '-0.5px',
  color: 'white',
  marginBottom: 16,
  marginTop: 0,
}

const pStyle = {
  fontSize: 15,
  color: 'rgba(255,255,255,0.6)',
  lineHeight: 1.75,
  margin: '0 0 16px',
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
  marginBottom: 8,
}

const thStyle = {
  textAlign: 'left',
  padding: '10px 14px',
  background: 'rgba(255,255,255,0.03)',
  borderBottom: '1px solid rgba(255,255,255,0.07)',
  color: 'rgba(255,255,255,0.4)',
  fontWeight: 600,
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const tdStyle = {
  padding: '10px 14px',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  color: 'rgba(255,255,255,0.7)',
  verticalAlign: 'top',
}

const highlightTd = {
  ...tdStyle,
  color: '#a5b4fc',
  fontWeight: 600,
}

const tableWrap = {
  background: '#0d0d14',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 12,
  overflow: 'hidden',
  marginBottom: 32,
}

const calloutStyle = {
  background: 'rgba(99,102,241,0.08)',
  border: '1px solid rgba(99,102,241,0.2)',
  borderRadius: 12,
  padding: '16px 20px',
  marginBottom: 32,
}

export default function MetaAdsSizes() {
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

      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#818cf8', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 6, padding: '2px 8px' }}>{c.tag}</span>
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

      {/* Intro */}
      <div style={sectionStyle}>
        <p style={pStyle}>{c.intro1}</p>
        <p style={pStyle}>{c.intro2}</p>
      </div>

      {/* Quick reference */}
      <div style={sectionStyle}>
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
              <tr><td style={highlightTd}>{c.row_feed_square}</td><td style={tdStyle}>1080 × 1080 px</td><td style={tdStyle}>1:1</td><td style={tdStyle}>30 MB</td></tr>
              <tr><td style={highlightTd}>{c.row_feed_portrait}</td><td style={tdStyle}>1080 × 1350 px</td><td style={tdStyle}>4:5</td><td style={tdStyle}>30 MB</td></tr>
              <tr><td style={highlightTd}>{c.row_feed_landscape}</td><td style={tdStyle}>1200 × 628 px</td><td style={tdStyle}>1.91:1</td><td style={tdStyle}>30 MB</td></tr>
              <tr><td style={highlightTd}>{c.row_stories}</td><td style={tdStyle}>1080 × 1920 px</td><td style={tdStyle}>9:16</td><td style={tdStyle}>30 MB</td></tr>
              <tr><td style={highlightTd}>{c.row_carousel}</td><td style={tdStyle}>1080 × 1080 px</td><td style={tdStyle}>1:1</td><td style={tdStyle}>30 MB</td></tr>
              <tr><td style={highlightTd}>{c.row_collection}</td><td style={tdStyle}>1200 × 628 px</td><td style={tdStyle}>1.91:1</td><td style={tdStyle}>30 MB</td></tr>
              <tr><td style={highlightTd}>{c.row_rightcol}</td><td style={tdStyle}>1200 × 1200 px</td><td style={tdStyle}>1:1</td><td style={tdStyle}>30 MB</td></tr>
            </tbody>
          </table>
        </div>

        <div style={calloutStyle}>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            <strong style={{ color: '#a5b4fc' }}>Tip:</strong> {c.s1_tip}
          </p>
        </div>
      </div>

      {/* Why sizes matter */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>{c.s2_h2}</h2>
        <p style={pStyle}>{c.s2_p1}</p>
        <p style={pStyle}>{c.s2_p2}</p>
      </div>

      {/* Facebook Feed */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>{c.s3_h2}</h2>
        <p style={pStyle}>{c.s3_p1}</p>
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>{c.th_type}</th>
                <th style={thStyle}>{c.th_recommended}</th>
                <th style={thStyle}>{c.th_min}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>{c.row_square}</td><td style={tdStyle}>1080 × 1080 px</td><td style={tdStyle}>600 × 600 px</td></tr>
              <tr><td style={highlightTd}>{c.row_portrait}</td><td style={tdStyle}>1080 × 1350 px</td><td style={tdStyle}>600 × 750 px</td></tr>
              <tr><td style={highlightTd}>{c.row_landscape}</td><td style={tdStyle}>1200 × 628 px</td><td style={tdStyle}>600 × 314 px</td></tr>
            </tbody>
          </table>
        </div>
        <p style={pStyle}>
          <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{c.s3_note_label}</strong> {c.s3_note}
        </p>
      </div>

      {/* Instagram */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>{c.s4_h2}</h2>
        <p style={pStyle}>{c.s4_p1}</p>
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>{c.th_placement}</th>
                <th style={thStyle}>{c.th_size}</th>
                <th style={thStyle}>{c.th_notes}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>Feed Square</td><td style={tdStyle}>1080 × 1080 px</td><td style={tdStyle}>{c.note_versatile}</td></tr>
              <tr><td style={highlightTd}>Feed Portrait</td><td style={tdStyle}>1080 × 1350 px</td><td style={tdStyle}>{c.note_mobile_ctr}</td></tr>
              <tr><td style={highlightTd}>Stories</td><td style={tdStyle}>1080 × 1920 px</td><td style={tdStyle}>{c.note_safe_zone}</td></tr>
              <tr><td style={highlightTd}>Reels</td><td style={tdStyle}>1080 × 1920 px</td><td style={tdStyle}>{c.note_same_stories}</td></tr>
              <tr><td style={highlightTd}>Explore</td><td style={tdStyle}>1080 × 1080 px</td><td style={tdStyle}>{c.note_square_only}</td></tr>
            </tbody>
          </table>
        </div>

        <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }}>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            <strong style={{ color: '#fbbf24' }}>{c.s4_warning_label}</strong> {c.s4_warning}
          </p>
        </div>
      </div>

      {/* Metadata section */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>{c.s5_h2}</h2>
        <p style={pStyle}>
          {c.s5_p1}
        </p>
        <p style={pStyle}>{c.s5_p2}</p>
        <p style={pStyle}>{c.s5_p3}</p>
      </div>

      {/* How to resize */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>{c.s6_h2}</h2>
        <p style={pStyle}>{c.s6_p1}</p>
        <p style={pStyle}>{c.s6_p2}</p>
        <ol style={{ paddingLeft: 20, margin: '0 0 16px' }}>
          <li style={{ ...pStyle, margin: '0 0 8px' }}>{c.s6_step1}</li>
          <li style={{ ...pStyle, margin: '0 0 8px' }}>{c.s6_step2}</li>
          <li style={{ ...pStyle, margin: '0 0 8px' }}>{c.s6_step3}</li>
          <li style={{ ...pStyle, margin: '0 0 8px' }}>{c.s6_step4}</li>
          <li style={{ ...pStyle, margin: '0 0 8px' }}>{c.s6_step5}</li>
        </ol>

        <div style={calloutStyle}>
          <p style={{ margin: '0 0 12px', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            <strong style={{ color: '#a5b4fc' }}>{c.s6_cta_label}</strong> {c.s6_cta}
          </p>
          <Link href="/dashboard" style={{
            display: 'inline-block',
            padding: '9px 18px',
            background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            color: 'white',
            textDecoration: 'none',
            letterSpacing: '-0.2px',
          }}>
            {c.s6_ctaBtn}
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div style={sectionStyle}>
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
