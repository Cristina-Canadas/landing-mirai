/**
 * Seed script — Mirai Suite
 *
 * Populates Payload with all categories and tools.
 * Run ONCE after the first `npm run dev` and admin user creation:
 *
 *   npm run seed
 *
 * Requires an existing payload.db (created when you first visit /admin).
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

interface SeedTool {
  icon: string
  url: string
  category: 'integration_core' | 'layout_css' | 'content_elementor' | 'seo_audit'
  status: 'active' | 'coming_soon' | 'deprecated'
  order: number
  name: { es: string; en: string; fr: string; ca: string; pt: string }
  description: { es: string; en: string; fr: string; ca: string; pt: string }
}

const CATEGORIES = [
  {
    slug: 'integration_core',
    color: 'blue' as const,
    icon: 'Settings',
    name: { es: 'Integración & Core', en: 'Integration & Core', fr: 'Intégration & Core', ca: 'Integració & Core', pt: 'Integração & Core' },
  },
  {
    slug: 'layout_css',
    color: 'green' as const,
    icon: 'Paintbrush',
    name: { es: 'Layout & CSS', en: 'Layout & CSS', fr: 'Mise en page & CSS', ca: 'Layout & CSS', pt: 'Layout & CSS' },
  },
  {
    slug: 'content_elementor',
    color: 'purple' as const,
    icon: 'FormInput',
    name: { es: 'Contenido & Elementor', en: 'Content & Elementor', fr: 'Contenu & Elementor', ca: 'Contingut & Elementor', pt: 'Conteúdo & Elementor' },
  },
  {
    slug: 'seo_audit',
    color: 'orange' as const,
    icon: 'ScanSearch',
    name: { es: 'SEO & Auditoría', en: 'SEO & Auditing', fr: 'SEO & Audit', ca: 'SEO & Auditoria', pt: 'SEO & Auditoria' },
  },
]

const SEED_TOOLS: SeedTool[] = [
  {
    icon: 'Search',
    url: 'https://screamingweb.vercel.app/',
    category: 'seo_audit',
    status: 'active',
    order: 1,
    name: {
      es: 'Screaming Web',
      en: 'Screaming Web',
      fr: 'Screaming Web',
      ca: 'Screaming Web',
      pt: 'Screaming Web',
    },
    description: {
      es: 'Rastreador web en tiempo real para webs de hoteles pequeños, con descubrimiento de URLs y segmentación avanzada por idioma o estructura.',
      en: 'Real-time website crawler for small hotel websites, with URL discovery and advanced segmentation by language or site structure.',
      fr: 'Crawler web en temps réel pour les petits sites hôteliers, avec découverte d\'URLs et segmentation avancée.',
      ca: 'Rastrejador web en temps real per a webs d\'hotels petits, amb descobriment d\'URLs i segmentació avançada.',
      pt: 'Rastreador web em tempo real para sites de hotéis pequenos, com descoberta de URLs e segmentação avançada.',
    },
  },
  {
    icon: 'Crop',
    url: 'https://mirai-video-converter-933833413263.us-west1.run.app/',
    category: 'content_elementor',
    status: 'active',
    order: 2,
    name: {
      es: 'Mirai Video Converter',
      en: 'Mirai Video Converter',
      fr: 'Mirai Video Converter',
      ca: 'Mirai Video Converter',
      pt: 'Mirai Video Converter',
    },
    description: {
      es: 'Optimiza vídeos para la web recortando la duración y reduciendo el tamaño del archivo.',
      en: 'Optimize videos for the web by trimming duration and reducing file size.',
      fr: 'Optimisez les vidéos pour le web en réduisant leur durée et leur taille.',
      ca: 'Optimitza vídeos per a la web retallant la durada i reduint la mida de l\'arxiu.',
      pt: 'Otimize vídeos para a web reduzindo a duração e o tamanho do arquivo.',
    },
  },
  {
    icon: 'Search',
    url: 'https://screaming.codev.cloud/',
    category: 'seo_audit',
    status: 'active',
    order: 3,
    name: {
      es: 'Chain Hotels Screaming Web',
      en: 'Chain Hotels Screaming Web',
      fr: 'Chain Hotels Screaming Web',
      ca: 'Chain Hotels Screaming Web',
      pt: 'Chain Hotels Screaming Web',
    },
    description: {
      es: 'Diseñado para grandes webs hoteleras y cadenas con estructuras complejas, contenido multilingüe y miles de URLs.',
      en: 'Designed for large hotel websites and hotel chains with complex structures, multilingual content, and thousands of URLs.',
      fr: 'Conçu pour les grands sites hôteliers et chaînes avec structures complexes, contenu multilingue et des milliers d\'URLs.',
      ca: 'Dissenyat per a grans webs hoteleres i cadenes amb estructures complexes, contingut multilingüe i milers d\'URLs.',
      pt: 'Projetado para grandes sites hoteleiros e redes com estruturas complexas, conteúdo multilíngue e milhares de URLs.',
    },
  },
  {
    icon: 'WandSparkles',
    url: 'https://miraimaps.vercel.app/',
    category: 'layout_css',
    status: 'active',
    order: 4,
    name: {
      es: 'MapyMaker',
      en: 'MapyMaker',
      fr: 'MapyMaker',
      ca: 'MapyMaker',
      pt: 'MapyMaker',
    },
    description: {
      es: 'Genera automáticamente mapas de marca que coinciden con los colores, tipografía y estilo visual de cada hotel.',
      en: 'Automatically generates branded maps matching each hotel\'s colors, typography, and visual style.',
      fr: 'Génère automatiquement des cartes personnalisées correspondant aux couleurs, typographie et style visuel de chaque hôtel.',
      ca: 'Genera automàticament mapes de marca que coincideixen amb els colors, tipografia i estil visual de cada hotel.',
      pt: 'Gera automaticamente mapas de marca que combinam com as cores, tipografia e estilo visual de cada hotel.',
    },
  },
  {
    icon: 'Image',
    url: 'https://frontmirai.com/tools/image-resizer/',
    category: 'seo_audit',
    status: 'active',
    order: 5,
    name: {
      es: 'Image Resizer',
      en: 'Image Resizer',
      fr: "Redimensionneur d'Images",
      ca: "Redimensionador d'Imatges",
      pt: 'Redimensionador de Imagens',
    },
    description: {
      es: 'Convierte, optimiza y transforma imágenes en lote con control de encuadre y formato.',
      en: 'Convert, optimize, and transform images in batches with framing and format controls.',
      fr: 'Convertit, optimise et transforme des images en lot avec contrôle du cadrage et du format.',
      ca: "Converteix, optimitza i transforma imatges en lot amb control d'enquadrament i format.",
      pt: 'Converte, otimiza e transforma imagens em lote com controle de enquadramento e formato.',
    },
  },
  {
    icon: 'ArrowRightLeft',
    url: 'https://frontmirai.com/tools/redirection-assistant/',
    category: 'seo_audit',
    status: 'active',
    order: 6,
    name: {
      es: 'Redirection Assistant',
      en: 'Redirection Assistant',
      fr: 'Assistant de Redirection',
      ca: 'Assistent de Redireccions',
      pt: 'Assistente de Redirecionamento',
    },
    description: {
      es: 'Compara URLs objetivo de Audit con URLs actuales de Screaming Frog para ayudar en redirecciones y exportar XLSX.',
      en: 'Compare target Audit URLs against current Screaming Frog URLs to assist redirections and export XLSX.',
      fr: "Compare les URL cibles d'Audit avec les URL actuelles de Screaming Frog et exporte en XLSX.",
      ca: "Compara URL objectiu d'Audit amb URL actuals de Screaming Frog i exporta a XLSX.",
      pt: 'Compara URLs alvo de Audit com URLs atuais do Screaming Frog e exporta para XLSX.',
    },
  },
  {
    icon: 'Paintbrush',
    url: 'https://frontmirai.com/tools/css-sorter/',
    category: 'layout_css',
    status: 'active',
    order: 7,
    name: {
      es: 'CSS Sorter',
      en: 'CSS Sorter',
      fr: 'Trieur CSS',
      ca: 'Ordenador CSS',
      pt: 'Organizador CSS',
    },
    description: {
      es: 'Ordena propiedades CSS rápidamente para seguir el estándar Elementor 2026.',
      en: 'Sort CSS properties quickly to match the Elementor 2026 standard order.',
      fr: "Trie rapidement les propriétés CSS selon l'ordre de standardisation Elementor 2026.",
      ca: "Ordena ràpidament propietats CSS seguint l'estandardització Elementor 2026.",
      pt: 'Organize propriedades CSS rapidamente conforme a padronização Elementor 2026.',
    },
  },
  {
    icon: 'Calculator',
    url: 'https://frontmirai.com/tools/clamp-calculator/',
    category: 'layout_css',
    status: 'active',
    order: 8,
    name: {
      es: 'Clamp Calculator',
      en: 'Clamp Calculator',
      fr: 'Calculateur Clamp',
      ca: 'Calculadora Clamp',
      pt: 'Calculadora Clamp',
    },
    description: {
      es: 'Genera valores clamp con puntos mínimos y máximos manteniendo una lectura clara.',
      en: 'Generate clamp values with min and max breakpoints while keeping attributes readable.',
      fr: 'Génère des valeurs clamp avec points min et max tout en gardant une lecture claire.',
      ca: 'Genera valors clamp amb punts mínim i màxim mantenint la lectura clara.',
      pt: 'Gere valores clamp com pontos mínimo e máximo mantendo os atributos legíveis.',
    },
  },
  {
    icon: 'ShieldAlert',
    url: 'https://docs.google.com/spreadsheets/d/1Pky7lkPnpRlikbJILQjb3FIrAYIcczKn6kgtNsod0LE/edit?usp=sharing',
    category: 'seo_audit',
    status: 'active',
    order: 9,
    name: {
      es: 'Audit URL Checker',
      en: 'Audit URL Checker',
      fr: "Vérificateur d'URL Audit",
      ca: "Comprovador d'URL Audit",
      pt: 'Verificador de URL Audit',
    },
    description: {
      es: 'Hoja de Google para validar auditorías y detectar posibles errores en el proceso de importación.',
      en: 'Google Sheet to validate audits and detect possible import process errors.',
      fr: "Feuille Google pour vérifier les audits et détecter les erreurs possibles d'importation.",
      ca: "Full de càlcul de Google per validar audits i detectar errors d'importació.",
      pt: 'Planilha Google para validar auditorias e detectar possíveis erros no processo de importação.',
    },
  },
  {
    icon: 'Code',
    url: 'https://frontmirai.com/tools/xml-to-elementor-json/',
    category: 'content_elementor',
    status: 'deprecated',
    order: 10,
    name: {
      es: 'XML to Elementor JSON',
      en: 'XML to Elementor JSON',
      fr: 'XML vers JSON Elementor',
      ca: 'XML a JSON Elementor',
      pt: 'XML para JSON Elementor',
    },
    description: {
      es: 'Divide XML exportado de páginas de WordPress en archivos JSON de Elementor. Ya no se usa.',
      en: 'Split exported WordPress page XML into Elementor JSON files. No longer in use.',
      fr: 'Découpe un XML exporté de pages WordPress en JSON Elementor. Outil non utilisé.',
      ca: "Divideix un XML exportat de pàgines WordPress en JSON d'Elementor. Ja no s'utilitza.",
      pt: 'Divide XML exportado de páginas WordPress em JSON do Elementor. Ferramenta descontinuada.',
    },
  },
  {
    icon: 'ImagePlus',
    url: '#',
    category: 'content_elementor',
    status: 'coming_soon',
    order: 11,
    name: {
      es: 'Pop up Image Generator',
      en: 'Pop up Image Generator',
      fr: "Générateur d'Image Pop up",
      ca: "Generador d'Imatge Pop up",
      pt: 'Gerador de Imagem Pop up',
    },
    description: {
      es: 'Genera imágenes de pop up a partir de una imagen base editando contenido y textos.',
      en: 'Generate popup images from a base image while editing content and text.',
      fr: 'Génère des images de pop up depuis une image de base en modifiant le contenu et les textes.',
      ca: 'Genera imatges de pop up des de una imatge base modificant contingut i textos.',
      pt: 'Gere imagens para pop up a partir de uma imagem base editando conteúdo e textos.',
    },
  },
  {
    icon: 'FormInput',
    url: 'https://frontmirai.com/tools/elementor-form-generator/',
    category: 'content_elementor',
    status: 'active',
    order: 12,
    name: {
      es: 'Elementor Form Generator',
      en: 'Elementor Form Generator',
      fr: 'Générateur de Formulaire Elementor',
      ca: 'Generador de Formulari Elementor',
      pt: 'Gerador de Formulário Elementor',
    },
    description: {
      es: 'Genera JSON del widget de formularios de Elementor con la configuración básica del hotel desde su ID.',
      en: 'Generate Elementor form widget JSON with the basic hotel setup from a hotel ID.',
      fr: 'Génère le JSON du widget de formulaire Elementor à partir de la configuration hôtel de base.',
      ca: "Genera JSON del widget de formulari Elementor amb la configuració bàsica de l'hotel.",
      pt: 'Gere JSON do widget de formulário Elementor com configuração básica do hotel.',
    },
  },
  {
    icon: 'Link',
    url: 'https://frontmirai.com/tools/forwarder-url-creator/',
    category: 'integration_core',
    status: 'active',
    order: 13,
    name: {
      es: 'Forwarder URL Creator',
      en: 'Forwarder URL Creator',
      fr: "Créateur d'URL Forwarder",
      ca: "Creador d'URL Forwarder",
      pt: 'Criador de URL Forwarder',
    },
    description: {
      es: 'Genera URLs del proceso de reserva desde el ID de hotel y parámetros opcionales como check-in, noches y promocode.',
      en: 'Build booking process URLs from hotel IDs and optional parameters like check-in, nights, and promocode.',
      fr: "Génère des URL du processus de réservation à partir d'un ID hôtel et de paramètres optionnels.",
      ca: "Genera URL del procés de reserva a partir de l'ID d'hotel i paràmetres opcionals.",
      pt: 'Gere URLs do processo de reserva a partir do ID do hotel com parâmetros opcionais.',
    },
  },
  {
    icon: 'Database',
    url: 'https://frontmirai.com/tools/extranet-data-reader/',
    category: 'integration_core',
    status: 'active',
    order: 14,
    name: {
      es: 'Extranet Data Reader',
      en: 'Extranet Data Reader',
      fr: 'Lecteur de Données Extranet',
      ca: 'Lector de Dades Extranet',
      pt: 'Leitor de Dados Extranet',
    },
    description: {
      es: 'Obtiene datos recurrentes y relevantes de Extranet introduciendo IDs individuales o de cadena.',
      en: 'Get recurring and relevant Extranet data by entering individual or chain IDs.',
      fr: 'Récupère les données Extranet pertinentes et récurrentes via un ID individuel ou de chaîne.',
      ca: "Obté dades rellevants i recurrents de l'Extranet amb ID individual o de cadena.",
      pt: 'Obtenha dados recorrentes e relevantes da Extranet usando ID individual ou de cadeia.',
    },
  },
  {
    icon: 'Settings',
    url: 'https://frontmirai.com/tools/mirai-core-tools/',
    category: 'integration_core',
    status: 'active',
    order: 15,
    name: {
      es: 'Mirai Core Tools',
      en: 'Mirai Core Tools',
      fr: 'Outils Core Mirai',
      ca: 'Eines Core Mirai',
      pt: 'Ferramentas Core Mirai',
    },
    description: {
      es: 'Previsualiza tarifas, ajusta variables CSS de Core, descarga snippets HTML y obtiene pasos de implementación.',
      en: 'Preview rates, adjust Core CSS variables, download HTML snippets, and get implementation steps.',
      fr: "Prévisualise les tarifs, ajuste les variables CSS Core, télécharge des extraits HTML et obtient des instructions d'implémentation.",
      ca: "Previsualitza tarifes, ajusta variables CSS de Core, descarrega snippets HTML i obté passos d'implementació.",
      pt: 'Visualize tarifas, ajuste variáveis CSS do Core, baixe snippets HTML e obtenha passos de implementação.',
    },
  },
]

async function seed() {
  console.log('🌱 Starting seed...')

  const payload = await getPayload({ config })

  // 1. Create categories
  console.log('\n📂 Seeding categories...')
  const categoryIdMap: Record<string, number> = {}

  for (const cat of CATEGORIES) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      categoryIdMap[cat.slug] = existing.docs[0].id as number
      console.log(`⏭  Category already exists: ${cat.slug}`)
      continue
    }

    const created = await payload.create({
      collection: 'categories',
      locale: 'en',
      data: { name: cat.name.en, slug: cat.slug, color: cat.color, icon: cat.icon },
    })

    for (const lang of ['es', 'fr', 'ca', 'pt'] as const) {
      await payload.update({
        collection: 'categories',
        id: created.id,
        locale: lang,
        data: { name: cat.name[lang] },
      })
    }

    categoryIdMap[cat.slug] = created.id as number
    console.log(`✅ Created category: ${cat.slug}`)
  }

  // 2. Create tools
  console.log('\n🔧 Seeding tools...')
  const { totalDocs } = await payload.find({ collection: 'tools', limit: 1 })

  if (totalDocs > 0) {
    console.log(`⚠️  Found ${totalDocs} existing tools. Skipping tools seed to avoid duplicates.`)
    console.log('   Delete all tools from /admin/collections/tools first if you want to re-seed.')
    process.exit(0)
  }

  for (const tool of SEED_TOOLS) {
    const categoryId = categoryIdMap[tool.category]
    if (!categoryId) {
      console.log(`⚠️  Category not found for: ${tool.name.en} — skipped`)
      continue
    }

    const created = await payload.create({
      collection: 'tools',
      locale: 'en',
      data: {
        name: tool.name.en,
        description: tool.description.en,
        url: tool.url,
        category: categoryId,
        status: tool.status,
        icon: tool.icon,
        order: tool.order,
      },
    })

    for (const lang of ['es', 'fr', 'ca', 'pt'] as const) {
      await payload.update({
        collection: 'tools',
        id: created.id,
        locale: lang,
        data: {
          name: tool.name[lang],
          description: tool.description[lang],
        },
      })
    }

    console.log(`✅ Created: ${tool.name.en}`)
  }

  console.log(`\n✨ Seed complete — ${SEED_TOOLS.length} tools, ${CATEGORIES.length} categories.`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
