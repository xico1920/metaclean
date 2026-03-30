'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BlogPost from '@/app/components/BlogPost'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Remove EXIF Metadata from Images (2025 Guide)',
  description: 'What EXIF metadata is, why you should remove it before uploading to ad platforms, and the fastest ways to strip it.',
  datePublished: '2025-03-30',
  author: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  publisher: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://metaclean.pro/blog/remove-exif-metadata-images' },
}

const content = {
  en: {
    tag: 'Privacy & Tech',
    readTime: '6 min read',
    h1: 'How to Remove EXIF Metadata from Images (2025 Guide)',
    subtitle: "Every photo you take contains hidden data — GPS location, camera model, timestamps, and more. Here's what it is, why it matters for advertisers, and how to strip it fast.",
    s1_h2: 'What Is EXIF Metadata?',
    s1_p1: "EXIF (Exchangeable Image File Format) is data automatically embedded in image files by cameras, smartphones, and editing software. It's invisible when you look at the image — but it's there.",
    s1_p2: "When you take a photo on your iPhone, the resulting JPEG contains not just the image — it contains a hidden data block with dozens of fields:",
    th_datatype: 'Data Type',
    th_example: 'Example',
    row_gps: 'GPS Location',
    row_device: 'Device model',
    row_date: 'Date & time',
    row_camera: 'Camera settings',
    row_software: 'Software',
    row_copyright: 'Copyright',
    row_color: 'Color profile',
    row_orientation: 'Orientation',
    s1_p3: "Beyond EXIF, images can also contain IPTC (news/editorial metadata), XMP (Adobe's extended metadata), and ICC profiles (color management data). Together these can add 50-200KB to a file.",
    s2_h2: 'Why Advertisers Should Remove Metadata',
    s2_r1_h3: '1. Ad platform policy filters',
    s2_r1_p: "Meta, TikTok, and Google scan image metadata during ad review. Images with GPS coordinates in certain regions, copyright metadata from stock sites when used without license, or editing software signatures from tools flagged in previous violations — all can trigger automated rejections.",
    s2_r2_h3: '2. Image hash fingerprinting',
    s2_r2_p: "Ad platforms generate a hash (unique fingerprint) of every image uploaded. When you re-upload a previously rejected image, the hash matches and it gets blocked instantly. Stripping metadata and recompressing changes the binary data — which changes the hash — giving the image a fresh identity.",
    s2_r3_h3: '3. File size reduction',
    s2_r3_p: "EXIF and IPTC data can add 20-100KB per image. For TikTok ads with a 500KB limit, stripping metadata can mean the difference between passing and failing the file size check without any quality loss.",
    s2_r4_h3: '4. Privacy protection',
    s2_r4_p: "If you photograph products at your home or studio, your GPS coordinates are embedded in every photo. When you upload to an ad platform, that location data goes with it. Stripping metadata protects your physical location from being exposed.",
    s3_h2: 'How to Remove EXIF Metadata',
    s3_opt1_h3: 'Option 1: MetaClean (Fastest — recommended for advertisers)',
    s3_opt1_p: 'Upload your image, click process — EXIF, IPTC, GPS, and XMP data are all stripped automatically. Also resizes to ad platform formats simultaneously. Best for media buyers processing multiple images for campaigns.',
    s3_opt1_cta_p: 'Strips all metadata + resizes to every ad format in one step. Free, no account needed.',
    s3_opt1_ctaBtn: 'Strip metadata free →',
    s3_opt2_h3: 'Option 2: On Windows (built-in)',
    s3_opt2_p: 'Right-click the image → Properties → Details tab → "Remove Properties and Personal Information" → "Remove the following properties from this file" → Select All → OK.',
    s3_opt2_limit_label: 'Limitation:',
    s3_opt2_limit: "Only removes some EXIF fields. Doesn't remove XMP or IPTC. Doesn't work for batch processing.",
    s3_opt3_h3: 'Option 3: On Mac (Preview)',
    s3_opt3_p: 'Export the image via File → Export → uncheck "Preserve EXIF data". This removes most metadata but not all — XMP data from Adobe products may persist.',
    s3_opt3_limit_label: 'Limitation:',
    s3_opt3_limit: 'Inconsistent — some metadata survives export. Not reliable for complete removal.',
    s3_opt4_h3: 'Option 4: Photoshop (Export As)',
    s3_opt4_p: 'File → Export → Export As → uncheck "Metadata". This removes EXIF but may preserve ICC color profiles and some XMP data depending on the version.',
    s4_h2: 'What Gets Removed vs What Stays',
    th_method: 'Method',
    th_exif: 'EXIF',
    th_gps: 'GPS',
    th_iptc: 'IPTC',
    th_xmp: 'XMP',
    th_batch: 'Batch',
    row_metaclean: 'MetaClean',
    row_windows: 'Windows (built-in)',
    row_mac: 'Mac Preview',
    row_photoshop: 'Photoshop Export As',
    partial: 'Partial',
    faq_h2: 'Frequently Asked Questions',
    faqs: [
      { q: 'Does removing EXIF data affect image quality?', a: 'No. EXIF metadata is stored separately from the image pixel data. Removing it has zero effect on visual quality or resolution. The image looks identical before and after.' },
      { q: 'Does every image have EXIF data?', a: 'Most do — any image taken with a digital camera or smartphone, or edited in Photoshop, Lightroom, or similar software. Screenshots may have device data. PNG files can contain metadata in a different format (tEXt chunks). Even stock images downloaded from Shutterstock or Getty carry license metadata.' },
      { q: 'Is it legal to remove image metadata?', a: "For images you own or have licensed for use, yes. Don't remove copyright metadata from images you don't own the rights to — that could constitute copyright infringement (removing copyright management information is illegal in many jurisdictions under DMCA/equivalent laws)." },
      { q: 'How much file size does removing metadata save?', a: 'Typically 20-150KB per image. More for images with extensive IPTC/XMP data (news photos, stock images). Less for simple smartphone photos. For TikTok ads with a 500KB limit, this saving can be significant.' },
      { q: 'Can ad platforms still identify my images after removing metadata?', a: 'Yes — through perceptual hashing (image fingerprinting based on visual content, not file data). This is separate from metadata scanning. If an image was rejected for content reasons (nudity, prohibited products), the visual hash is stored and the image will be identified regardless of metadata.' },
    ],
  },
  pt: {
    tag: 'Privacidade & Tech',
    readTime: '6 min de leitura',
    h1: 'Como Remover Metadados EXIF de Imagens (Guia 2025)',
    subtitle: 'Cada foto que tiras contém dados ocultos — localização GPS, modelo da câmara, timestamps e muito mais. O que é, por que importa para anunciantes e como os remover rapidamente.',
    s1_h2: 'O Que São Metadados EXIF?',
    s1_p1: 'O EXIF (Exchangeable Image File Format) é informação automaticamente incorporada nos ficheiros de imagem por câmaras, smartphones e software de edição. É invisível quando olhas para a imagem — mas está lá.',
    s1_p2: 'Quando tiras uma foto com o teu iPhone, o JPEG resultante contém não só a imagem — contém um bloco de dados oculto com dezenas de campos:',
    th_datatype: 'Tipo de Dados',
    th_example: 'Exemplo',
    row_gps: 'Localização GPS',
    row_device: 'Modelo do dispositivo',
    row_date: 'Data e hora',
    row_camera: 'Definições da câmara',
    row_software: 'Software',
    row_copyright: 'Direitos de autor',
    row_color: 'Perfil de cor',
    row_orientation: 'Orientação',
    s1_p3: 'Para além do EXIF, as imagens podem também conter IPTC (metadados jornalísticos/editoriais), XMP (metadados alargados da Adobe) e perfis ICC (dados de gestão de cor). Em conjunto, estes podem adicionar 50-200KB a um ficheiro.',
    s2_h2: 'Por Que os Anunciantes Devem Remover Metadados',
    s2_r1_h3: '1. Filtros de política das plataformas de anúncios',
    s2_r1_p: 'O Meta, TikTok e Google analisam os metadados das imagens durante a revisão de anúncios. Imagens com coordenadas GPS em certas regiões, metadados de direitos de autor de bancos de imagens usados sem licença, ou assinaturas de software marcadas em violações anteriores — tudo pode desencadear rejeições automáticas.',
    s2_r2_h3: '2. Fingerprinting por hash de imagem',
    s2_r2_p: 'As plataformas de anúncios geram um hash (impressão digital única) de cada imagem carregada. Quando voltas a carregar uma imagem anteriormente rejeitada, o hash corresponde e fica bloqueada instantaneamente. Remover os metadados e recomprimir altera os dados binários — o que muda o hash — dando à imagem uma identidade nova.',
    s2_r3_h3: '3. Redução do tamanho do ficheiro',
    s2_r3_p: 'Os dados EXIF e IPTC podem adicionar 20-100KB por imagem. Para anúncios TikTok com um limite de 500KB, remover os metadados pode ser a diferença entre passar ou falhar a verificação de tamanho de ficheiro sem qualquer perda de qualidade.',
    s2_r4_h3: '4. Proteção da privacidade',
    s2_r4_p: 'Se fotografas produtos em casa ou no estúdio, as tuas coordenadas GPS estão incorporadas em cada foto. Quando carregas para uma plataforma de anúncios, esses dados de localização vão com elas. Remover os metadados protege a tua localização física de ser exposta.',
    s3_h2: 'Como Remover Metadados EXIF',
    s3_opt1_h3: 'Opção 1: MetaClean (Mais rápido — recomendado para anunciantes)',
    s3_opt1_p: 'Carrega a tua imagem, clica em processar — os dados EXIF, IPTC, GPS e XMP são todos removidos automaticamente. Também redimensiona para os formatos das plataformas de anúncios em simultâneo. Ideal para media buyers que processam múltiplas imagens para campanhas.',
    s3_opt1_cta_p: 'Remove todos os metadados + redimensiona para todos os formatos de anúncio num só passo. Grátis, sem conta necessária.',
    s3_opt1_ctaBtn: 'Remover metadados grátis →',
    s3_opt2_h3: 'Opção 2: No Windows (integrado)',
    s3_opt2_p: 'Clica com o botão direito na imagem → Propriedades → separador Detalhes → "Remover Propriedades e Informações Pessoais" → "Remover as seguintes propriedades deste ficheiro" → Selecionar tudo → OK.',
    s3_opt2_limit_label: 'Limitação:',
    s3_opt2_limit: 'Apenas remove alguns campos EXIF. Não remove XMP ou IPTC. Não funciona para processamento em lote.',
    s3_opt3_h3: 'Opção 3: No Mac (Pré-visualização)',
    s3_opt3_p: 'Exporta a imagem via Ficheiro → Exportar → desmarca "Preservar dados EXIF". Isto remove a maior parte dos metadados, mas não todos — os dados XMP de produtos Adobe podem persistir.',
    s3_opt3_limit_label: 'Limitação:',
    s3_opt3_limit: 'Inconsistente — alguns metadados sobrevivem à exportação. Não é fiável para remoção completa.',
    s3_opt4_h3: 'Opção 4: Photoshop (Exportar como)',
    s3_opt4_p: 'Ficheiro → Exportar → Exportar como → desmarca "Metadados". Isto remove o EXIF mas pode preservar perfis de cor ICC e alguns dados XMP dependendo da versão.',
    s4_h2: 'O Que é Removido vs O Que Fica',
    th_method: 'Método',
    th_exif: 'EXIF',
    th_gps: 'GPS',
    th_iptc: 'IPTC',
    th_xmp: 'XMP',
    th_batch: 'Lote',
    row_metaclean: 'MetaClean',
    row_windows: 'Windows (integrado)',
    row_mac: 'Mac Pré-visualização',
    row_photoshop: 'Photoshop Exportar como',
    partial: 'Parcial',
    faq_h2: 'Perguntas Frequentes',
    faqs: [
      { q: 'Remover dados EXIF afeta a qualidade da imagem?', a: 'Não. Os metadados EXIF são armazenados separadamente dos dados de pixel da imagem. Removê-los não tem qualquer efeito na qualidade visual ou resolução. A imagem parece idêntica antes e depois.' },
      { q: 'Todas as imagens têm dados EXIF?', a: 'A maioria tem — qualquer imagem tirada com uma câmara digital ou smartphone, ou editada no Photoshop, Lightroom ou software semelhante. As capturas de ecrã podem ter dados do dispositivo. Os ficheiros PNG podem conter metadados num formato diferente (blocos tEXt). Até as imagens de stock descarregadas do Shutterstock ou Getty têm metadados de licença.' },
      { q: 'É legal remover metadados de imagens?', a: 'Para imagens que possuis ou tens licença de uso, sim. Não removes metadados de direitos de autor de imagens cujos direitos não possuis — isso pode constituir violação de direitos de autor (remover informações de gestão de direitos de autor é ilegal em muitas jurisdições ao abrigo do DMCA/leis equivalentes).' },
      { q: 'Quanto espaço poupa a remoção de metadados?', a: 'Tipicamente 20-150KB por imagem. Mais para imagens com dados IPTC/XMP extensos (fotos de notícias, imagens de stock). Menos para fotos simples de smartphone. Para anúncios TikTok com um limite de 500KB, esta poupança pode ser significativa.' },
      { q: 'As plataformas de anúncios ainda podem identificar as minhas imagens após remover os metadados?', a: 'Sim — através de hashing percetual (impressão digital de imagem baseada no conteúdo visual, não nos dados do ficheiro). Isto é separado da análise de metadados. Se uma imagem foi rejeitada por razões de conteúdo (nudez, produtos proibidos), o hash visual é armazenado e a imagem será identificada independentemente dos metadados.' },
    ],
  },
  es: {
    tag: 'Privacidad & Tech',
    readTime: '6 min de lectura',
    h1: 'Cómo Eliminar Metadatos EXIF de Imágenes (Guía 2025)',
    subtitle: 'Cada foto que tomas contiene datos ocultos — ubicación GPS, modelo de cámara, marcas de tiempo y más. Qué es, por qué importa para los anunciantes y cómo eliminarlo rápidamente.',
    s1_h2: '¿Qué Son los Metadatos EXIF?',
    s1_p1: 'EXIF (Exchangeable Image File Format) son datos incrustados automáticamente en archivos de imagen por cámaras, smartphones y software de edición. Son invisibles cuando miras la imagen — pero están ahí.',
    s1_p2: 'Cuando tomas una foto con tu iPhone, el JPEG resultante contiene no solo la imagen — contiene un bloque de datos ocultos con docenas de campos:',
    th_datatype: 'Tipo de Dato',
    th_example: 'Ejemplo',
    row_gps: 'Ubicación GPS',
    row_device: 'Modelo del dispositivo',
    row_date: 'Fecha y hora',
    row_camera: 'Configuración de cámara',
    row_software: 'Software',
    row_copyright: 'Derechos de autor',
    row_color: 'Perfil de color',
    row_orientation: 'Orientación',
    s1_p3: 'Más allá del EXIF, las imágenes también pueden contener IPTC (metadatos periodísticos/editoriales), XMP (metadatos extendidos de Adobe) y perfiles ICC (datos de gestión del color). En conjunto, pueden añadir 50-200KB a un archivo.',
    s2_h2: 'Por Qué los Anunciantes Deben Eliminar los Metadatos',
    s2_r1_h3: '1. Filtros de política de las plataformas publicitarias',
    s2_r1_p: 'Meta, TikTok y Google analizan los metadatos de las imágenes durante la revisión de anuncios. Imágenes con coordenadas GPS en ciertas regiones, metadatos de derechos de autor de bancos de imágenes usados sin licencia, o firmas de software marcadas en infracciones anteriores — todo puede desencadenar rechazos automáticos.',
    s2_r2_h3: '2. Huella digital por hash de imagen',
    s2_r2_p: 'Las plataformas publicitarias generan un hash (huella digital única) de cada imagen subida. Cuando vuelves a subir una imagen previamente rechazada, el hash coincide y queda bloqueada instantáneamente. Eliminar los metadatos y recomprimir cambia los datos binarios — lo que cambia el hash — dando a la imagen una identidad nueva.',
    s2_r3_h3: '3. Reducción del tamaño del archivo',
    s2_r3_p: 'Los datos EXIF e IPTC pueden añadir 20-100KB por imagen. Para anuncios de TikTok con un límite de 500KB, eliminar los metadatos puede ser la diferencia entre pasar o fallar la verificación de tamaño de archivo sin ninguna pérdida de calidad.',
    s2_r4_h3: '4. Protección de la privacidad',
    s2_r4_p: 'Si fotografías productos en tu casa o estudio, tus coordenadas GPS están incrustadas en cada foto. Cuando subes a una plataforma publicitaria, esos datos de ubicación van con ellas. Eliminar los metadatos protege tu ubicación física de ser expuesta.',
    s3_h2: 'Cómo Eliminar Metadatos EXIF',
    s3_opt1_h3: 'Opción 1: MetaClean (Más rápido — recomendado para anunciantes)',
    s3_opt1_p: 'Sube tu imagen, haz clic en procesar — los datos EXIF, IPTC, GPS y XMP se eliminan automáticamente. También redimensiona a los formatos de las plataformas publicitarias simultáneamente. Ideal para media buyers que procesan múltiples imágenes para campañas.',
    s3_opt1_cta_p: 'Elimina todos los metadatos + redimensiona a todos los formatos de anuncio en un solo paso. Gratis, sin cuenta necesaria.',
    s3_opt1_ctaBtn: 'Eliminar metadatos gratis →',
    s3_opt2_h3: 'Opción 2: En Windows (integrado)',
    s3_opt2_p: 'Clic derecho en la imagen → Propiedades → pestaña Detalles → "Quitar propiedades e información personal" → "Quitar las siguientes propiedades de este archivo" → Seleccionar todo → Aceptar.',
    s3_opt2_limit_label: 'Limitación:',
    s3_opt2_limit: 'Solo elimina algunos campos EXIF. No elimina XMP ni IPTC. No funciona para procesamiento por lotes.',
    s3_opt3_h3: 'Opción 3: En Mac (Vista Previa)',
    s3_opt3_p: 'Exporta la imagen mediante Archivo → Exportar → desmarca "Conservar datos EXIF". Esto elimina la mayoría de los metadatos pero no todos — los datos XMP de productos de Adobe pueden persistir.',
    s3_opt3_limit_label: 'Limitación:',
    s3_opt3_limit: 'Inconsistente — algunos metadatos sobreviven a la exportación. No es fiable para la eliminación completa.',
    s3_opt4_h3: 'Opción 4: Photoshop (Exportar como)',
    s3_opt4_p: 'Archivo → Exportar → Exportar como → desmarca "Metadatos". Esto elimina el EXIF pero puede conservar perfiles de color ICC y algunos datos XMP dependiendo de la versión.',
    s4_h2: 'Qué Se Elimina vs Qué Permanece',
    th_method: 'Método',
    th_exif: 'EXIF',
    th_gps: 'GPS',
    th_iptc: 'IPTC',
    th_xmp: 'XMP',
    th_batch: 'Lote',
    row_metaclean: 'MetaClean',
    row_windows: 'Windows (integrado)',
    row_mac: 'Mac Vista Previa',
    row_photoshop: 'Photoshop Exportar como',
    partial: 'Parcial',
    faq_h2: 'Preguntas Frecuentes',
    faqs: [
      { q: '¿Eliminar datos EXIF afecta la calidad de la imagen?', a: 'No. Los metadatos EXIF se almacenan separadamente de los datos de píxeles de la imagen. Eliminarlos no tiene ningún efecto en la calidad visual ni en la resolución. La imagen se ve idéntica antes y después.' },
      { q: '¿Todas las imágenes tienen datos EXIF?', a: 'La mayoría sí — cualquier imagen tomada con una cámara digital o smartphone, o editada en Photoshop, Lightroom o software similar. Las capturas de pantalla pueden tener datos del dispositivo. Los archivos PNG pueden contener metadatos en un formato diferente (bloques tEXt). Incluso las imágenes de stock descargadas de Shutterstock o Getty tienen metadatos de licencia.' },
      { q: '¿Es legal eliminar los metadatos de las imágenes?', a: 'Para imágenes que posees o tienes licencia de uso, sí. No elimines metadatos de derechos de autor de imágenes cuyos derechos no posees — eso podría constituir una infracción de derechos de autor (eliminar información de gestión de derechos de autor es ilegal en muchas jurisdicciones bajo el DMCA/leyes equivalentes).' },
      { q: '¿Cuánto espacio ahorra la eliminación de metadatos?', a: 'Típicamente 20-150KB por imagen. Más para imágenes con datos IPTC/XMP extensos (fotos de noticias, imágenes de stock). Menos para fotos simples de smartphone. Para anuncios de TikTok con un límite de 500KB, este ahorro puede ser significativo.' },
      { q: '¿Las plataformas publicitarias aún pueden identificar mis imágenes después de eliminar los metadatos?', a: 'Sí — mediante hashing perceptual (huella digital de imagen basada en el contenido visual, no en los datos del archivo). Esto es independiente del análisis de metadatos. Si una imagen fue rechazada por razones de contenido (desnudez, productos prohibidos), el hash visual se almacena y la imagen será identificada independientemente de los metadatos.' },
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

export default function RemoveExifMetadata() {
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

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.s1_h2}</h2>
        <p style={pStyle}>{c.s1_p1}</p>
        <p style={pStyle}>{c.s1_p2}</p>

        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>{c.th_datatype}</th>
                <th style={thStyle}>{c.th_example}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>{c.row_gps}</td><td style={tdStyle}>Lat: 41.1496° N, Lon: 8.6109° W</td></tr>
              <tr><td style={highlightTd}>{c.row_device}</td><td style={tdStyle}>Apple iPhone 15 Pro</td></tr>
              <tr><td style={highlightTd}>{c.row_date}</td><td style={tdStyle}>2025-03-15 14:32:08</td></tr>
              <tr><td style={highlightTd}>{c.row_camera}</td><td style={tdStyle}>f/1.8, 1/500s, ISO 64</td></tr>
              <tr><td style={highlightTd}>{c.row_software}</td><td style={tdStyle}>Adobe Photoshop 26.0</td></tr>
              <tr><td style={highlightTd}>{c.row_copyright}</td><td style={tdStyle}>© 2025 Shutterstock Inc.</td></tr>
              <tr><td style={highlightTd}>{c.row_color}</td><td style={tdStyle}>sRGB IEC61966-2.1</td></tr>
              <tr><td style={highlightTd}>{c.row_orientation}</td><td style={tdStyle}>Rotate 90° CW</td></tr>
            </tbody>
          </table>
        </div>

        <p style={pStyle}>{c.s1_p3}</p>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.s2_h2}</h2>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 10, marginTop: 0 }}>{c.s2_r1_h3}</h3>
          <p style={pStyle}>{c.s2_r1_p}</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 10, marginTop: 0 }}>{c.s2_r2_h3}</h3>
          <p style={pStyle}>{c.s2_r2_p}</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 10, marginTop: 0 }}>{c.s2_r3_h3}</h3>
          <p style={pStyle}>{c.s2_r3_p}</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 10, marginTop: 0 }}>{c.s2_r4_h3}</h3>
          <p style={pStyle}>{c.s2_r4_p}</p>
        </div>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.s3_h2}</h2>

        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 12, marginTop: 0 }}>{c.s3_opt1_h3}</h3>
          <p style={pStyle}>{c.s3_opt1_p}</p>
          <div style={calloutStyle}>
            <p style={{ margin: '0 0 12px', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{c.s3_opt1_cta_p}</p>
            <Link href="/dashboard" style={{ display: 'inline-block', padding: '9px 18px', background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'white', textDecoration: 'none' }}>
              {c.s3_opt1_ctaBtn}
            </Link>
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 12, marginTop: 0 }}>{c.s3_opt2_h3}</h3>
          <p style={pStyle}>{c.s3_opt2_p}</p>
          <p style={pStyle}><strong style={{ color: 'rgba(255,255,255,0.5)' }}>{c.s3_opt2_limit_label}</strong> {c.s3_opt2_limit}</p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 12, marginTop: 0 }}>{c.s3_opt3_h3}</h3>
          <p style={pStyle}>{c.s3_opt3_p}</p>
          <p style={pStyle}><strong style={{ color: 'rgba(255,255,255,0.5)' }}>{c.s3_opt3_limit_label}</strong> {c.s3_opt3_limit}</p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'white', marginBottom: 12, marginTop: 0 }}>{c.s3_opt4_h3}</h3>
          <p style={pStyle}>{c.s3_opt4_p}</p>
        </div>
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.s4_h2}</h2>
        <div style={tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>{c.th_method}</th>
                <th style={thStyle}>{c.th_exif}</th>
                <th style={thStyle}>{c.th_gps}</th>
                <th style={thStyle}>{c.th_iptc}</th>
                <th style={thStyle}>{c.th_xmp}</th>
                <th style={thStyle}>{c.th_batch}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={highlightTd}>{c.row_metaclean}</td><td style={tdStyle}>✓</td><td style={tdStyle}>✓</td><td style={tdStyle}>✓</td><td style={tdStyle}>✓</td><td style={tdStyle}>✓</td></tr>
              <tr><td style={highlightTd}>{c.row_windows}</td><td style={tdStyle}>{c.partial}</td><td style={tdStyle}>✓</td><td style={tdStyle}>✗</td><td style={tdStyle}>✗</td><td style={tdStyle}>✗</td></tr>
              <tr><td style={highlightTd}>{c.row_mac}</td><td style={tdStyle}>{c.partial}</td><td style={tdStyle}>✓</td><td style={tdStyle}>✗</td><td style={tdStyle}>✗</td><td style={tdStyle}>✗</td></tr>
              <tr><td style={highlightTd}>{c.row_photoshop}</td><td style={tdStyle}>✓</td><td style={tdStyle}>✓</td><td style={tdStyle}>✓</td><td style={tdStyle}>{c.partial}</td><td style={tdStyle}>✗</td></tr>
            </tbody>
          </table>
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
