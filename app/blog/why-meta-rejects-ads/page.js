'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import BlogPost from '@/app/components/BlogPost'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Why Meta Rejects Ad Images (And How to Fix It)',
  description: 'The most common reasons Facebook and Instagram reject your ad creatives and exactly how to fix each one.',
  datePublished: '2025-03-30',
  author: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  publisher: { '@type': 'Organization', name: 'MetaClean', url: 'https://metaclean.pro' },
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://metaclean.pro/blog/why-meta-rejects-ads' },
}

const content = {
  en: {
    tag: 'Troubleshooting',
    readTime: '8 min read',
    h1: 'Why Meta Rejects Ad Images (And How to Fix It)',
    subtitle: "Meta's automated review system rejects millions of ads every day. Most rejections are fixable in under 5 minutes — if you know what to look for.",
    intro1: "Ad rejections cost you time, budget, and momentum. Meta's review system is largely automated — an algorithm scans your creative against hundreds of signals in seconds. When it triggers, you get a generic rejection message that often doesn't tell you the real reason.",
    intro2: "This guide covers the most common causes — from obvious (wrong image size) to subtle (EXIF metadata, previously rejected creatives, reused image hashes). Fix the right thing and your ad will pass review.",
    r1_h2: "1. Image Dimensions Don't Match the Placement",
    r1_p1: "Meta has strict minimum resolution requirements and supported aspect ratios. Images outside these ranges either get rejected or auto-cropped — often badly.",
    r1_problem_label: 'Problem:',
    r1_problem: 'Image is too small (under 600px on shortest side), or aspect ratio falls outside the 1.91:1 to 4:5 range.',
    r1_fix_label: 'Fix:',
    r1_fix: 'Resize to 1080×1080px (1:1), 1080×1350px (4:5), or 1200×628px (1.91:1) for Feed. Use 1080×1920px for Stories and Reels. MetaClean exports all four formats in one ZIP.',
    r2_h2: '2. Too Much Text in the Image',
    r2_p1: 'Meta\'s old "20% text rule" no longer results in hard rejection — but it still affects delivery. Ads with heavy text overlays get limited distribution and higher CPMs.',
    r2_p2: 'The algorithm detects text as a percentage of the image area. Large headlines, prices, and URLs covering more than 20% of the image will trigger the filter.',
    r2_problem_label: 'Problem:',
    r2_problem: 'Text (including logos, prices, URLs) covers more than 20% of the image area.',
    r2_fix_label: 'Fix:',
    r2_fix: 'Move text to the ad copy (headline, description fields) instead of the image. Use the image purely for visual impact — product, lifestyle, emotion. Keep any image text minimal and in one corner.',
    r3_h2: '3. Image Metadata Triggering Policy Filters',
    r3_p1: 'This is one of the least known rejection causes. EXIF metadata — hidden data embedded in your image file — can include GPS coordinates, camera model, editing software, and copyright information.',
    r3_p2: "Meta's systems scan this data. Images tagged with GPS coordinates in certain regions, images previously rejected (identified by image hash), or images with software metadata that conflicts with your account's business type can all trigger false positives in the review system.",
    r3_p3: "Stock images downloaded from certain sites carry embedded license metadata. Edited images retain the editing software signature. Screenshots carry device model data. None of this is visible to you — but Meta sees it.",
    r3_problem_label: 'Problem:',
    r3_problem: 'Image contains EXIF data (GPS, camera model, software, copyright) that triggers content filters.',
    r3_fix_label: 'Fix:',
    r3_fix: 'Strip all metadata before uploading. MetaClean removes EXIF, GPS, IPTC, and XMP data automatically during processing. A clean image with no metadata gives the algorithm less to flag.',
    r4_h2: '4. Previously Rejected Image Hash',
    r4_p1: "Meta stores a hash (digital fingerprint) of every image that has ever been rejected for policy violations. If you re-upload the exact same image — or a nearly identical version — it gets flagged automatically, even if the original rejection was a false positive.",
    r4_p2: "This is why simply re-uploading a rejected ad never works. The system matches the image hash in milliseconds.",
    r4_problem_label: 'Problem:',
    r4_problem: 'Re-uploading a previously rejected image hits the hash blocklist instantly.',
    r4_fix_label: 'Fix:',
    r4_fix: "Process the image through MetaClean before re-uploading. Stripping metadata and recompressing changes the image's binary data — which changes its hash. This is often enough to get a clean review on an image that was rejected for a non-obvious reason.",
    r5_h2: '5. Before/After and Body Image Claims',
    r5_p1: "Meta explicitly prohibits before/after images for health, weight loss, and cosmetic products. This includes side-by-side comparisons, images implying physical transformation, and images that might make users feel bad about their bodies.",
    r5_p2: "The detection is visual — the algorithm identifies composition patterns typical of before/after shots, not just the content.",
    r5_problem_label: 'Problem:',
    r5_problem: 'Image shows transformation, comparison, or body focus that violates personal health policies.',
    r5_fix_label: 'Fix:',
    r5_fix: 'Use lifestyle imagery instead of transformation imagery. Focus on the activity, not the result. Show the product in use rather than the effect on the body.',
    r6_h2: '6. Sensational or Clickbait Visual Style',
    r6_p1: "Images designed to shock, disturb, or provoke excessive curiosity — red circles, dramatic arrows, extreme close-ups of body parts, exaggerated facial expressions — trigger Meta's sensationalism filters.",
    r6_p2: 'This was a major ecommerce trend in 2018-2022 (the "weird product" ad style). Meta has since trained its models specifically to detect these patterns.',
    r6_problem_label: 'Problem:',
    r6_problem: 'Image uses visual tricks (circles, arrows, shock imagery) designed to force attention.',
    r6_fix_label: 'Fix:',
    r6_fix: 'Use clean, professional product photography or lifestyle imagery. The creative should earn attention through quality, not manipulation.',
    checklist_h2: 'Pre-Upload Checklist',
    checklist: [
      'Image is 1080×1080, 1080×1350, 1200×628, or 1080×1920px',
      'File size is under 30MB (under 1MB recommended)',
      'File format is JPG or PNG',
      'Text covers less than 20% of image area',
      'No before/after or body transformation imagery',
      'No shock, sensationalism, or exaggerated expressions',
      'EXIF/GPS metadata has been stripped',
      'Image has not been previously rejected',
      'No prohibited product categories (weapons, drugs, misleading health claims)',
      'Image matches the landing page content',
    ],
    cta_label: 'MetaClean handles the technical items automatically',
    cta: '— correct sizing, compression, and metadata removal. The policy items (text %, content type) you control in your creative design.',
    ctaBtn: 'Clean your creatives →',
    faq_h2: 'Frequently Asked Questions',
    faqs: [
      { q: 'How long does Meta ad review take?', a: 'Most ads are reviewed within 24 hours. Ads submitted on weekends or holidays can take up to 48 hours. If your ad is still "In Review" after 48 hours, duplicate the ad set and resubmit — sometimes the review queue gets stuck.' },
      { q: 'Can I appeal a rejected Meta ad?', a: 'Yes — in Ads Manager, find the rejected ad, click "See Details", then "Request Review". Human reviewers handle appeals. If you believe the rejection was a false positive, always appeal rather than just creating a new ad with the same content.' },
      { q: 'Why does Meta keep rejecting my ad with no clear reason?', a: "Meta's automated system gives generic rejection messages. The actual trigger could be metadata, image hash, or a subtle policy flag. Try: strip metadata, resize to exact specs, change the image slightly (crop, brightness, saturation), and resubmit." },
      { q: 'Does removing metadata really help with ad rejections?', a: 'Yes, for a specific category of false positives. Images with GPS data from certain locations, or images carrying metadata from software flagged in previous policy violations, can trigger automated review filters. Stripping metadata removes this risk.' },
      { q: 'What happens to my ad account if I keep getting rejections?', a: 'Repeated rejections increase your "policy violation history" which raises your risk score. Too many violations can lead to ad account restrictions or bans. Fix rejections quickly, appeal false positives, and keep your rejection rate low.' },
    ],
  },
  pt: {
    tag: 'Resolução de Problemas',
    readTime: '8 min de leitura',
    h1: 'Por Que o Meta Rejeita Imagens de Anúncios (E Como Resolver)',
    subtitle: 'O sistema automatizado de revisão do Meta rejeita milhões de anúncios todos os dias. A maioria das rejeições é resolvível em menos de 5 minutos — se souber o que procurar.',
    intro1: 'As rejeições de anúncios custam-lhe tempo, orçamento e momentum. O sistema de revisão do Meta é maioritariamente automatizado — um algoritmo analisa o seu criativo contra centenas de sinais em segundos. Quando é acionado, recebe uma mensagem de rejeição genérica que muitas vezes não indica a razão real.',
    intro2: 'Este guia cobre as causas mais comuns — desde as óbvias (tamanho de imagem errado) às subtis (metadados EXIF, criativos anteriormente rejeitados, hashes de imagem reutilizados). Corrija a coisa certa e o seu anúncio passará na revisão.',
    r1_h2: '1. As Dimensões da Imagem Não Correspondem ao Posicionamento',
    r1_p1: 'O Meta tem requisitos mínimos de resolução rigorosos e proporções suportadas. Imagens fora destes intervalos são rejeitadas ou cortadas automaticamente — frequentemente de forma inadequada.',
    r1_problem_label: 'Problema:',
    r1_problem: 'A imagem é demasiado pequena (abaixo de 600px no lado mais curto), ou a proporção está fora do intervalo 1.91:1 a 4:5.',
    r1_fix_label: 'Solução:',
    r1_fix: 'Redimensione para 1080×1080px (1:1), 1080×1350px (4:5) ou 1200×628px (1.91:1) para o Feed. Use 1080×1920px para Stories e Reels. O MetaClean exporta todos os quatro formatos num único ZIP.',
    r2_h2: '2. Demasiado Texto na Imagem',
    r2_p1: 'A antiga "regra dos 20% de texto" do Meta já não resulta em rejeição direta — mas ainda afeta a entrega. Anúncios com sobreposições de texto excessivas têm distribuição limitada e CPMs mais altos.',
    r2_p2: 'O algoritmo deteta o texto como percentagem da área da imagem. Títulos grandes, preços e URLs que cobrem mais de 20% da imagem acionarão o filtro.',
    r2_problem_label: 'Problema:',
    r2_problem: 'O texto (incluindo logótipos, preços, URLs) cobre mais de 20% da área da imagem.',
    r2_fix_label: 'Solução:',
    r2_fix: 'Mova o texto para o copy do anúncio (campos de título e descrição) em vez da imagem. Use a imagem apenas para impacto visual — produto, lifestyle, emoção. Mantenha qualquer texto na imagem mínimo e num canto.',
    r3_h2: '3. Metadados da Imagem a Acionar Filtros de Política',
    r3_p1: 'Esta é uma das causas de rejeição menos conhecidas. Os metadados EXIF — dados ocultos incorporados no ficheiro de imagem — podem incluir coordenadas GPS, modelo de câmara, software de edição e informações de direitos de autor.',
    r3_p2: 'Os sistemas do Meta analisam estes dados. Imagens com coordenadas GPS em certas regiões, imagens anteriormente rejeitadas (identificadas por hash), ou imagens com metadados de software que conflituam com o tipo de negócio da sua conta podem acionar falsos positivos no sistema de revisão.',
    r3_p3: 'Imagens de stock descarregadas de certos sites contêm metadados de licença incorporados. Imagens editadas retêm a assinatura do software de edição. Capturas de ecrã contêm dados do modelo de dispositivo. Nada disto é visível para si — mas o Meta vê.',
    r3_problem_label: 'Problema:',
    r3_problem: 'A imagem contém dados EXIF (GPS, modelo de câmara, software, direitos de autor) que acionam filtros de conteúdo.',
    r3_fix_label: 'Solução:',
    r3_fix: 'Remova todos os metadados antes de carregar. O MetaClean remove dados EXIF, GPS, IPTC e XMP automaticamente durante o processamento. Uma imagem limpa sem metadados dá ao algoritmo menos razões para sinalizar.',
    r4_h2: '4. Hash de Imagem Anteriormente Rejeitada',
    r4_p1: 'O Meta armazena um hash (impressão digital digital) de cada imagem que já foi rejeitada por violações de política. Se voltar a carregar a mesma imagem — ou uma versão quase idêntica — é sinalizada automaticamente, mesmo que a rejeição original tenha sido um falso positivo.',
    r4_p2: 'É por isto que simplesmente recarregar um anúncio rejeitado nunca funciona. O sistema corresponde ao hash da imagem em milissegundos.',
    r4_problem_label: 'Problema:',
    r4_problem: 'Recarregar uma imagem anteriormente rejeitada aciona instantaneamente a lista de bloqueio de hashes.',
    r4_fix_label: 'Solução:',
    r4_fix: 'Processe a imagem através do MetaClean antes de recarregar. Remover os metadados e recomprimir muda os dados binários da imagem — o que muda o seu hash. Isto é frequentemente suficiente para obter uma revisão limpa de uma imagem rejeitada por uma razão não óbvia.',
    r5_h2: '5. Imagens Antes/Depois e Afirmações Sobre o Corpo',
    r5_p1: 'O Meta proíbe explicitamente imagens antes/depois para produtos de saúde, perda de peso e cosméticos. Isto inclui comparações lado a lado, imagens que implicam transformação física e imagens que podem fazer os utilizadores sentir-se mal com os seus corpos.',
    r5_p2: 'A deteção é visual — o algoritmo identifica padrões de composição típicos de fotos antes/depois, não apenas o conteúdo.',
    r5_problem_label: 'Problema:',
    r5_problem: 'A imagem mostra transformação, comparação ou foco no corpo que viola as políticas de saúde pessoal.',
    r5_fix_label: 'Solução:',
    r5_fix: 'Use imagens de lifestyle em vez de imagens de transformação. Foque-se na atividade, não no resultado. Mostre o produto em uso em vez do efeito no corpo.',
    r6_h2: '6. Estilo Visual Sensacionalista ou Clickbait',
    r6_p1: 'Imagens concebidas para chocar, perturbar ou provocar curiosidade excessiva — círculos vermelhos, setas dramáticas, primeiros planos extremos de partes do corpo, expressões faciais exageradas — acionam os filtros de sensacionalismo do Meta.',
    r6_p2: 'Esta foi uma tendência importante no ecommerce entre 2018-2022 (o estilo de anúncios de "produto estranho"). O Meta desde então treinou os seus modelos especificamente para detetar estes padrões.',
    r6_problem_label: 'Problema:',
    r6_problem: 'A imagem usa truques visuais (círculos, setas, imagens chocantes) concebidos para forçar atenção.',
    r6_fix_label: 'Solução:',
    r6_fix: 'Use fotografia de produto limpa e profissional ou imagens de lifestyle. O criativo deve conquistar atenção pela qualidade, não pela manipulação.',
    checklist_h2: 'Lista de Verificação Pré-Carregamento',
    checklist: [
      'A imagem tem 1080×1080, 1080×1350, 1200×628 ou 1080×1920px',
      'O tamanho do ficheiro é inferior a 30MB (recomendado abaixo de 1MB)',
      'O formato do ficheiro é JPG ou PNG',
      'O texto cobre menos de 20% da área da imagem',
      'Sem imagens antes/depois ou de transformação corporal',
      'Sem choque, sensacionalismo ou expressões exageradas',
      'Os metadados EXIF/GPS foram removidos',
      'A imagem não foi rejeitada anteriormente',
      'Sem categorias de produtos proibidas (armas, drogas, afirmações de saúde enganosas)',
      'A imagem corresponde ao conteúdo da página de destino',
    ],
    cta_label: 'O MetaClean trata automaticamente dos itens técnicos',
    cta: '— dimensionamento correto, compressão e remoção de metadados. Os itens de política (% de texto, tipo de conteúdo) controla-os no design do seu criativo.',
    ctaBtn: 'Limpe os seus criativos →',
    faq_h2: 'Perguntas Frequentes',
    faqs: [
      { q: 'Quanto tempo demora a revisão de anúncios Meta?', a: 'A maioria dos anúncios é revista em 24 horas. Anúncios submetidos ao fim de semana ou feriados podem demorar até 48 horas. Se o seu anúncio ainda estiver "Em Revisão" após 48 horas, duplique o conjunto de anúncios e resubmeta — por vezes a fila de revisão fica bloqueada.' },
      { q: 'Posso recorrer de um anúncio Meta rejeitado?', a: 'Sim — no Gestor de Anúncios, encontre o anúncio rejeitado, clique em "Ver Detalhes" e depois em "Solicitar Revisão". Revisores humanos tratam dos recursos. Se acredita que a rejeição foi um falso positivo, recorra sempre em vez de criar um novo anúncio com o mesmo conteúdo.' },
      { q: 'Por que razão o Meta continua a rejeitar o meu anúncio sem razão clara?', a: 'O sistema automatizado do Meta fornece mensagens de rejeição genéricas. O gatilho real pode ser metadados, hash de imagem ou um sinal de política subtil. Tente: remover metadados, redimensionar para as especificações exatas, alterar ligeiramente a imagem (corte, brilho, saturação) e resubmeter.' },
      { q: 'Remover metadados realmente ajuda com rejeições de anúncios?', a: 'Sim, para uma categoria específica de falsos positivos. Imagens com dados GPS de certas localizações, ou imagens com metadados de software sinalizado em violações de política anteriores, podem acionar filtros de revisão automatizados. Remover os metadados elimina este risco.' },
      { q: 'O que acontece à minha conta de anúncios se continuo a receber rejeições?', a: 'Rejeições repetidas aumentam o seu "histórico de violações de política" o que eleva a sua pontuação de risco. Demasiadas violações podem levar a restrições ou banimentos da conta de anúncios. Resolva as rejeições rapidamente, recorra dos falsos positivos e mantenha a sua taxa de rejeição baixa.' },
    ],
  },
  es: {
    tag: 'Solución de Problemas',
    readTime: '8 min de lectura',
    h1: 'Por Qué Meta Rechaza las Imágenes de Anuncios (Y Cómo Solucionarlo)',
    subtitle: 'El sistema automatizado de revisión de Meta rechaza millones de anuncios cada día. La mayoría de los rechazos se pueden solucionar en menos de 5 minutos — si sabes qué buscar.',
    intro1: 'Los rechazos de anuncios te cuestan tiempo, presupuesto y momentum. El sistema de revisión de Meta es en gran medida automatizado — un algoritmo analiza tu creativo contra cientos de señales en segundos. Cuando se activa, recibes un mensaje de rechazo genérico que a menudo no te dice la razón real.',
    intro2: 'Esta guía cubre las causas más comunes — desde las obvias (tamaño de imagen incorrecto) hasta las sutiles (metadatos EXIF, creativos rechazados anteriormente, hashes de imagen reutilizados). Corrige lo correcto y tu anuncio pasará la revisión.',
    r1_h2: '1. Las Dimensiones de la Imagen No Coinciden con el Posicionamiento',
    r1_p1: 'Meta tiene requisitos mínimos de resolución estrictos y proporciones admitidas. Las imágenes fuera de estos rangos se rechazan o se recortan automáticamente — a menudo mal.',
    r1_problem_label: 'Problema:',
    r1_problem: 'La imagen es demasiado pequeña (menos de 600px en el lado más corto), o la proporción está fuera del rango 1.91:1 a 4:5.',
    r1_fix_label: 'Solución:',
    r1_fix: 'Redimensiona a 1080×1080px (1:1), 1080×1350px (4:5) o 1200×628px (1.91:1) para el Feed. Usa 1080×1920px para Stories y Reels. MetaClean exporta los cuatro formatos en un solo ZIP.',
    r2_h2: '2. Demasiado Texto en la Imagen',
    r2_p1: 'La antigua "regla del 20% de texto" de Meta ya no resulta en rechazo directo — pero sigue afectando la entrega. Los anuncios con superposiciones de texto excesivas tienen distribución limitada y CPMs más altos.',
    r2_p2: 'El algoritmo detecta el texto como porcentaje del área de la imagen. Los títulos grandes, precios y URLs que cubren más del 20% de la imagen activarán el filtro.',
    r2_problem_label: 'Problema:',
    r2_problem: 'El texto (incluidos logos, precios, URLs) cubre más del 20% del área de la imagen.',
    r2_fix_label: 'Solución:',
    r2_fix: 'Mueve el texto al copy del anuncio (campos de título y descripción) en lugar de la imagen. Usa la imagen únicamente para impacto visual — producto, lifestyle, emoción. Mantén cualquier texto en la imagen mínimo y en una esquina.',
    r3_h2: '3. Metadatos de la Imagen Activando Filtros de Política',
    r3_p1: 'Esta es una de las causas de rechazo menos conocidas. Los metadatos EXIF — datos ocultos incrustados en tu archivo de imagen — pueden incluir coordenadas GPS, modelo de cámara, software de edición e información de derechos de autor.',
    r3_p2: 'Los sistemas de Meta analizan estos datos. Las imágenes etiquetadas con coordenadas GPS en ciertas regiones, imágenes rechazadas anteriormente (identificadas por hash de imagen), o imágenes con metadatos de software que entran en conflicto con el tipo de negocio de tu cuenta pueden activar falsos positivos en el sistema de revisión.',
    r3_p3: 'Las imágenes de stock descargadas de ciertos sitios llevan metadatos de licencia incrustados. Las imágenes editadas retienen la firma del software de edición. Las capturas de pantalla llevan datos del modelo del dispositivo. Nada de esto es visible para ti — pero Meta lo ve.',
    r3_problem_label: 'Problema:',
    r3_problem: 'La imagen contiene datos EXIF (GPS, modelo de cámara, software, derechos de autor) que activan filtros de contenido.',
    r3_fix_label: 'Solución:',
    r3_fix: 'Elimina todos los metadatos antes de subir. MetaClean elimina datos EXIF, GPS, IPTC y XMP automáticamente durante el procesamiento. Una imagen limpia sin metadatos le da al algoritmo menos razones para marcarla.',
    r4_h2: '4. Hash de Imagen Rechazada Anteriormente',
    r4_p1: 'Meta almacena un hash (huella digital) de cada imagen que alguna vez ha sido rechazada por violaciones de política. Si vuelves a subir la misma imagen — o una versión casi idéntica — se marca automáticamente, incluso si el rechazo original fue un falso positivo.',
    r4_p2: 'Por eso simplemente volver a subir un anuncio rechazado nunca funciona. El sistema coincide con el hash de la imagen en milisegundos.',
    r4_problem_label: 'Problema:',
    r4_problem: 'Volver a subir una imagen rechazada anteriormente activa instantáneamente la lista de bloqueo de hashes.',
    r4_fix_label: 'Solución:',
    r4_fix: 'Procesa la imagen a través de MetaClean antes de volver a subirla. Eliminar los metadatos y recomprimir cambia los datos binarios de la imagen — lo que cambia su hash. Esto suele ser suficiente para obtener una revisión limpia de una imagen rechazada por una razón no obvia.',
    r5_h2: '5. Imágenes Antes/Después y Afirmaciones Sobre el Cuerpo',
    r5_p1: 'Meta prohíbe explícitamente las imágenes antes/después para productos de salud, pérdida de peso y cosméticos. Esto incluye comparaciones lado a lado, imágenes que implican transformación física e imágenes que podrían hacer que los usuarios se sientan mal con sus cuerpos.',
    r5_p2: 'La detección es visual — el algoritmo identifica patrones de composición típicos de fotos antes/después, no solo el contenido.',
    r5_problem_label: 'Problema:',
    r5_problem: 'La imagen muestra transformación, comparación o enfoque en el cuerpo que viola las políticas de salud personal.',
    r5_fix_label: 'Solución:',
    r5_fix: 'Usa imágenes de lifestyle en lugar de imágenes de transformación. Enfócate en la actividad, no en el resultado. Muestra el producto en uso en lugar del efecto en el cuerpo.',
    r6_h2: '6. Estilo Visual Sensacionalista o Clickbait',
    r6_p1: 'Las imágenes diseñadas para impactar, perturbar o provocar curiosidad excesiva — círculos rojos, flechas dramáticas, primeros planos extremos de partes del cuerpo, expresiones faciales exageradas — activan los filtros de sensacionalismo de Meta.',
    r6_p2: 'Esta fue una tendencia importante en el ecommerce entre 2018-2022 (el estilo de anuncios de "producto extraño"). Meta desde entonces ha entrenado sus modelos específicamente para detectar estos patrones.',
    r6_problem_label: 'Problema:',
    r6_problem: 'La imagen usa trucos visuales (círculos, flechas, imágenes impactantes) diseñados para forzar la atención.',
    r6_fix_label: 'Solución:',
    r6_fix: 'Usa fotografía de producto limpia y profesional o imágenes de lifestyle. El creativo debe ganar atención por calidad, no por manipulación.',
    checklist_h2: 'Lista de Verificación Previa a la Carga',
    checklist: [
      'La imagen es de 1080×1080, 1080×1350, 1200×628 o 1080×1920px',
      'El tamaño del archivo es inferior a 30MB (se recomienda menos de 1MB)',
      'El formato del archivo es JPG o PNG',
      'El texto cubre menos del 20% del área de la imagen',
      'Sin imágenes antes/después ni de transformación corporal',
      'Sin impacto, sensacionalismo o expresiones exageradas',
      'Los metadatos EXIF/GPS han sido eliminados',
      'La imagen no ha sido rechazada anteriormente',
      'Sin categorías de productos prohibidos (armas, drogas, afirmaciones de salud engañosas)',
      'La imagen coincide con el contenido de la página de destino',
    ],
    cta_label: 'MetaClean gestiona automáticamente los elementos técnicos',
    cta: '— dimensionamiento correcto, compresión y eliminación de metadatos. Los elementos de política (% de texto, tipo de contenido) los controlas en el diseño de tu creativo.',
    ctaBtn: 'Limpia tus creativos →',
    faq_h2: 'Preguntas Frecuentes',
    faqs: [
      { q: '¿Cuánto tiempo tarda la revisión de anuncios de Meta?', a: 'La mayoría de los anuncios se revisan en 24 horas. Los anuncios enviados durante fines de semana o festivos pueden tardar hasta 48 horas. Si tu anuncio sigue "En Revisión" después de 48 horas, duplica el conjunto de anuncios y vuelve a enviarlo — a veces la cola de revisión se atasca.' },
      { q: '¿Puedo apelar un anuncio de Meta rechazado?', a: 'Sí — en el Administrador de Anuncios, encuentra el anuncio rechazado, haz clic en "Ver Detalles" y luego en "Solicitar Revisión". Los revisores humanos gestionan las apelaciones. Si crees que el rechazo fue un falso positivo, apela siempre en lugar de crear un nuevo anuncio con el mismo contenido.' },
      { q: '¿Por qué Meta sigue rechazando mi anuncio sin razón clara?', a: 'El sistema automatizado de Meta da mensajes de rechazo genéricos. El desencadenante real podría ser metadatos, hash de imagen o una señal de política sutil. Prueba: eliminar metadatos, redimensionar a especificaciones exactas, cambiar ligeramente la imagen (recorte, brillo, saturación) y volver a enviar.' },
      { q: '¿Eliminar metadatos realmente ayuda con los rechazos de anuncios?', a: 'Sí, para una categoría específica de falsos positivos. Las imágenes con datos GPS de ciertas ubicaciones, o imágenes con metadatos de software marcado en violaciones de política anteriores, pueden activar filtros de revisión automatizados. Eliminar los metadatos elimina este riesgo.' },
      { q: '¿Qué pasa con mi cuenta de anuncios si sigo recibiendo rechazos?', a: 'Los rechazos repetidos aumentan tu "historial de violaciones de política" lo que eleva tu puntuación de riesgo. Demasiadas violaciones pueden llevar a restricciones o prohibiciones de la cuenta de anuncios. Soluciona los rechazos rápidamente, apela los falsos positivos y mantén tu tasa de rechazo baja.' },
    ],
  },
}

const pStyle = { fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: '0 0 16px' }
const h2Style = { fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', color: 'white', marginBottom: 16, marginTop: 0 }
const calloutStyle = { background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }
const errorStyle = { background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 16 }
const fixStyle = { background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 }

export default function WhyMetaRejectsAds() {
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

      {/* Reason 1 */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.r1_h2}</h2>
        <p style={pStyle}>{c.r1_p1}</p>
        <div style={errorStyle}>
          <p style={{ margin: 0, fontSize: 14, color: '#fca5a5', lineHeight: 1.6 }}>
            <strong>{c.r1_problem_label}</strong> {c.r1_problem}
          </p>
        </div>
        <div style={fixStyle}>
          <p style={{ margin: 0, fontSize: 14, color: '#6ee7b7', lineHeight: 1.6 }}>
            <strong>{c.r1_fix_label}</strong> {c.r1_fix}
          </p>
        </div>
      </div>

      {/* Reason 2 */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.r2_h2}</h2>
        <p style={pStyle}>{c.r2_p1}</p>
        <p style={pStyle}>{c.r2_p2}</p>
        <div style={errorStyle}>
          <p style={{ margin: 0, fontSize: 14, color: '#fca5a5', lineHeight: 1.6 }}>
            <strong>{c.r2_problem_label}</strong> {c.r2_problem}
          </p>
        </div>
        <div style={fixStyle}>
          <p style={{ margin: 0, fontSize: 14, color: '#6ee7b7', lineHeight: 1.6 }}>
            <strong>{c.r2_fix_label}</strong> {c.r2_fix}
          </p>
        </div>
      </div>

      {/* Reason 3 */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.r3_h2}</h2>
        <p style={pStyle}>{c.r3_p1}</p>
        <p style={pStyle}>{c.r3_p2}</p>
        <p style={pStyle}>{c.r3_p3}</p>
        <div style={errorStyle}>
          <p style={{ margin: 0, fontSize: 14, color: '#fca5a5', lineHeight: 1.6 }}>
            <strong>{c.r3_problem_label}</strong> {c.r3_problem}
          </p>
        </div>
        <div style={fixStyle}>
          <p style={{ margin: 0, fontSize: 14, color: '#6ee7b7', lineHeight: 1.6 }}>
            <strong>{c.r3_fix_label}</strong> {c.r3_fix}
          </p>
        </div>
      </div>

      {/* Reason 4 */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.r4_h2}</h2>
        <p style={pStyle}>{c.r4_p1}</p>
        <p style={pStyle}>{c.r4_p2}</p>
        <div style={errorStyle}>
          <p style={{ margin: 0, fontSize: 14, color: '#fca5a5', lineHeight: 1.6 }}>
            <strong>{c.r4_problem_label}</strong> {c.r4_problem}
          </p>
        </div>
        <div style={fixStyle}>
          <p style={{ margin: 0, fontSize: 14, color: '#6ee7b7', lineHeight: 1.6 }}>
            <strong>{c.r4_fix_label}</strong> {c.r4_fix}
          </p>
        </div>
      </div>

      {/* Reason 5 */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.r5_h2}</h2>
        <p style={pStyle}>{c.r5_p1}</p>
        <p style={pStyle}>{c.r5_p2}</p>
        <div style={errorStyle}>
          <p style={{ margin: 0, fontSize: 14, color: '#fca5a5', lineHeight: 1.6 }}>
            <strong>{c.r5_problem_label}</strong> {c.r5_problem}
          </p>
        </div>
        <div style={fixStyle}>
          <p style={{ margin: 0, fontSize: 14, color: '#6ee7b7', lineHeight: 1.6 }}>
            <strong>{c.r5_fix_label}</strong> {c.r5_fix}
          </p>
        </div>
      </div>

      {/* Reason 6 */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.r6_h2}</h2>
        <p style={pStyle}>{c.r6_p1}</p>
        <p style={pStyle}>{c.r6_p2}</p>
        <div style={errorStyle}>
          <p style={{ margin: 0, fontSize: 14, color: '#fca5a5', lineHeight: 1.6 }}>
            <strong>{c.r6_problem_label}</strong> {c.r6_problem}
          </p>
        </div>
        <div style={fixStyle}>
          <p style={{ margin: 0, fontSize: 14, color: '#6ee7b7', lineHeight: 1.6 }}>
            <strong>{c.r6_fix_label}</strong> {c.r6_fix}
          </p>
        </div>
      </div>

      {/* Checklist */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={h2Style}>{c.checklist_h2}</h2>
        <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 24px' }}>
          {c.checklist.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: idx < c.checklist.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={calloutStyle}>
        <p style={{ margin: '0 0 12px', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
          <strong style={{ color: '#a5b4fc' }}>{c.cta_label}</strong> {c.cta}
        </p>
        <Link href="/dashboard" style={{ display: 'inline-block', padding: '9px 18px', background: 'linear-gradient(135deg, #2563eb, #4f46e5, #8b5cf6)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'white', textDecoration: 'none' }}>
          {c.ctaBtn}
        </Link>
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
