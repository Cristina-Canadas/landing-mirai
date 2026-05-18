import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// Solo disponible en development
// Llamar una sola vez: GET localhost:3000/api/seed

const SEED_TOOLS = [
  {
    icon: 'Settings', url: 'https://frontmirai.com/tools/mirai-core-tools/',
    category: 'integration_core', status: 'active', order: 1,
    name: { es: 'Mirai Core Tools', en: 'Mirai Core Tools', fr: 'Outils Core Mirai', ca: 'Eines Core Mirai', pt: 'Ferramentas Core Mirai' },
    description: {
      es: 'Previsualiza tarifas, ajusta variables CSS de Core, descarga snippets HTML y obtiene pasos de implementacion.',
      en: 'Preview rates, adjust Core CSS variables, download HTML snippets, and get implementation steps.',
      fr: "Previsualise les tarifs, ajuste les variables CSS Core, telecharge des extraits HTML et obtient des instructions d'implementation.",
      ca: "Previsualitza tarifes, ajusta variables CSS de Core, descarrega snippets HTML i obte passos d'implementacio.",
      pt: 'Visualize tarifas, ajuste variaveis CSS do Core, baixe snippets HTML e obtenha passos de implementacao.',
    },
  },
  {
    icon: 'Database', url: 'https://frontmirai.com/tools/extranet-data-reader/',
    category: 'integration_core', status: 'active', order: 2,
    name: { es: 'Extranet Data Reader', en: 'Extranet Data Reader', fr: 'Lecteur de Donnees Extranet', ca: 'Lector de Dades Extranet', pt: 'Leitor de Dados Extranet' },
    description: {
      es: 'Obtiene datos recurrentes y relevantes de Extranet introduciendo IDs individuales o de cadena.',
      en: 'Get recurring and relevant Extranet data by entering individual or chain IDs.',
      fr: 'Recupere les donnees Extranet pertinentes et recurrentes via un ID individuel ou de chaine.',
      ca: "Obte dades rellevants i recurrents de l'Extranet amb ID individual o de cadena.",
      pt: 'Obtenha dados recorrentes e relevantes da Extranet usando ID individual ou de cadeia.',
    },
  },
  {
    icon: 'Link', url: 'https://frontmirai.com/tools/forwarder-url-creator/',
    category: 'integration_core', status: 'active', order: 3,
    name: { es: 'Forwarder URL Creator', en: 'Forwarder URL Creator', fr: "Createur d'URL Forwarder", ca: "Creador d'URL Forwarder", pt: 'Criador de URL Forwarder' },
    description: {
      es: 'Genera URLs del proceso de reserva desde el ID de hotel y parametros opcionales como check-in, noches y promocode.',
      en: 'Build booking process URLs from hotel IDs and optional parameters like check-in, nights, and promocode.',
      fr: "Genere des URL du processus de reservation a partir d'un ID hotel et de parametres optionnels.",
      ca: "Genera URL del proces de reserva a partir de l'ID d'hotel i parametres opcionals.",
      pt: 'Gere URLs do processo de reserva a partir do ID do hotel com parametros opcionais.',
    },
  },
  {
    icon: 'Calculator', url: 'https://frontmirai.com/tools/clamp-calculator/',
    category: 'layout_css', status: 'active', order: 4,
    name: { es: 'Clamp Calculator', en: 'Clamp Calculator', fr: 'Calculateur Clamp', ca: 'Calculadora Clamp', pt: 'Calculadora Clamp' },
    description: {
      es: 'Genera valores clamp con puntos minimos y maximos manteniendo una lectura clara.',
      en: 'Generate clamp values with min and max breakpoints while keeping attributes readable.',
      fr: 'Genere des valeurs clamp avec points min et max tout en gardant une lecture claire.',
      ca: 'Genera valors clamp amb punts minim i maxim mantenint la lectura clara.',
      pt: 'Gere valores clamp com pontos minimo e maximo mantendo os atributos legiveis.',
    },
  },
  {
    icon: 'Paintbrush', url: 'https://frontmirai.com/tools/css-sorter/',
    category: 'layout_css', status: 'active', order: 5,
    name: { es: 'CSS Sorter', en: 'CSS Sorter', fr: 'Trieur CSS', ca: 'Ordenador CSS', pt: 'Organizador CSS' },
    description: {
      es: 'Ordena propiedades CSS rapidamente para seguir el estandar Elementor 2026.',
      en: 'Sort CSS properties quickly to match the Elementor 2026 standard order.',
      fr: "Trie rapidement les proprietes CSS selon l'ordre de standardisation Elementor 2026.",
      ca: "Ordena rapidament propietats CSS seguint l'estandarditzacio Elementor 2026.",
      pt: 'Organize propriedades CSS rapidamente conforme a padronizacao Elementor 2026.',
    },
  },
  {
    icon: 'FormInput', url: 'https://frontmirai.com/tools/elementor-form-generator/',
    category: 'content_elementor', status: 'active', order: 6,
    name: { es: 'Elementor Form Generator', en: 'Elementor Form Generator', fr: 'Generateur de Formulaire Elementor', ca: 'Generador de Formulari Elementor', pt: 'Gerador de Formulario Elementor' },
    description: {
      es: 'Genera JSON del widget de formularios de Elementor con la configuracion basica del hotel desde su ID.',
      en: 'Generate Elementor form widget JSON with the basic hotel setup from a hotel ID.',
      fr: 'Genere le JSON du widget de formulaire Elementor a partir de la configuration hotel de base.',
      ca: "Genera JSON del widget de formulari Elementor amb la configuracio basica de l'hotel.",
      pt: 'Gere JSON do widget de formulario Elementor com configuracao basica do hotel.',
    },
  },
  {
    icon: 'ImagePlus', url: '#',
    category: 'content_elementor', status: 'coming_soon', order: 7,
    name: { es: 'Pop up Image Generator', en: 'Pop up Image Generator', fr: "Generateur d'Image Pop up", ca: "Generador d'Imatge Pop up", pt: 'Gerador de Imagem Pop up' },
    description: {
      es: 'Genera imagenes de pop up a partir de una imagen base editando contenido y textos.',
      en: 'Generate popup images from a base image while editing content and text.',
      fr: 'Genere des images de pop up depuis une image de base en modifiant le contenu et les textes.',
      ca: 'Genera imatges de pop up des de una imatge base modificant contingut i textos.',
      pt: 'Gere imagens para pop up a partir de uma imagem base editando conteudo e textos.',
    },
  },
  {
    icon: 'Code', url: 'https://frontmirai.com/tools/xml-to-elementor-json/',
    category: 'content_elementor', status: 'deprecated', order: 8,
    name: { es: 'XML to Elementor JSON', en: 'XML to Elementor JSON', fr: 'XML vers JSON Elementor', ca: 'XML a JSON Elementor', pt: 'XML para JSON Elementor' },
    description: {
      es: 'Divide XML exportado de paginas de WordPress en archivos JSON de Elementor. Ya no se usa.',
      en: 'Split exported WordPress page XML into Elementor JSON files. No longer in use.',
      fr: 'Decoupe un XML exporte de pages WordPress en JSON Elementor. Outil non utilise.',
      ca: "Divideix un XML exportat de pagines WordPress en JSON d'Elementor. Ja no s'utilitza.",
      pt: 'Divide XML exportado de paginas WordPress em JSON do Elementor. Ferramenta descontinuada.',
    },
  },
  {
    icon: 'ShieldAlert', url: 'https://docs.google.com/spreadsheets/d/1Pky7lkPnpRlikbJILQjb3FIrAYIcczKn6kgtNsod0LE/edit?usp=sharing',
    category: 'seo_audit', status: 'active', order: 9,
    name: { es: 'Audit URL Checker', en: 'Audit URL Checker', fr: "Verificateur d'URL Audit", ca: "Comprovador d'URL Audit", pt: 'Verificador de URL Audit' },
    description: {
      es: 'Hoja de Google para validar auditorias y detectar posibles errores en el proceso de importacion.',
      en: 'Google Sheet to validate audits and detect possible import process errors.',
      fr: "Feuille Google pour verifier les audits et detecter les erreurs possibles d'importation.",
      ca: "Full de calcul de Google per validar audits i detectar errors d'importacio.",
      pt: 'Planilha Google para validar auditorias e detectar possiveis erros no processo de importacao.',
    },
  },
  {
    icon: 'ArrowRightLeft', url: 'https://frontmirai.com/tools/redirection-assistant/',
    category: 'seo_audit', status: 'active', order: 10,
    name: { es: 'Redirection Assistant', en: 'Redirection Assistant', fr: 'Assistant de Redirection', ca: 'Assistent de Redireccions', pt: 'Assistente de Redirecionamento' },
    description: {
      es: 'Compara URLs objetivo de Audit con URLs actuales de Screaming Frog para ayudar en redirecciones y exportar XLSX.',
      en: 'Compare target Audit URLs against current Screaming Frog URLs to assist redirections and export XLSX.',
      fr: "Compare les URL cibles d'Audit avec les URL actuelles de Screaming Frog et exporte en XLSX.",
      ca: "Compara URL objectiu d'Audit amb URL actuals de Screaming Frog i exporta a XLSX.",
      pt: 'Compara URLs alvo de Audit com URLs atuais do Screaming Frog e exporta para XLSX.',
    },
  },
  {
    icon: 'Image', url: 'https://frontmirai.com/tools/image-resizer/',
    category: 'content_elementor', status: 'active', order: 11,
    name: { es: 'Image Resizer', en: 'Image Resizer', fr: "Redimensionneur d'Images", ca: "Redimensionador d'Imatges", pt: 'Redimensionador de Imagens' },
    description: {
      es: 'Convierte, optimiza y transforma imagenes en lote con control de encuadre y formato.',
      en: 'Convert, optimize, and transform images in batches with framing and format controls.',
      fr: 'Convertit, optimise et transforme des images en lot avec controle du cadrage et du format.',
      ca: "Converteix, optimitza i transforma imatges en lot amb control d'enquadrament i format.",
      pt: 'Converte, otimiza e transforma imagens em lote com controle de enquadramento e formato.',
    },
  },
]

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development' }, { status: 403 })
  }

  try {
    const payload = await getPayload({ config })

    const { totalDocs } = await payload.find({ collection: 'tools', limit: 1 })
    if (totalDocs > 0) {
      return NextResponse.json({
        message: `Seed skipped: already ${totalDocs} tools in the database.`,
        totalDocs,
      })
    }

    const created: string[] = []

    for (const tool of SEED_TOOLS) {
      const doc = await payload.create({
        collection: 'tools',
        locale: 'es',
        data: {
          name: tool.name.es,
          description: tool.description.es,
          url: tool.url,
          category: tool.category as any,
          status: tool.status as any,
          icon: tool.icon,
          order: tool.order,
        },
      })

      for (const lang of ['en', 'fr', 'ca', 'pt'] as const) {
        await payload.update({
          collection: 'tools',
          id: doc.id,
          locale: lang,
          data: {
            name: tool.name[lang],
            description: tool.description[lang],
          },
        })
      }

      created.push(tool.name.en)
    }

    return NextResponse.json({
      message: `Seed complete — ${created.length} tools created.`,
      tools: created,
    })
  } catch (err) {
    console.error('Seed error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
