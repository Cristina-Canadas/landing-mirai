export type CategoryFilterKey = string

export const SUPPORTED_LANGUAGES = ['es', 'en', 'fr', 'ca', 'pt'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

interface TranslationBundle {
  ui: {
    heroTitle: string
    heroSubtitle: string
    footerNote: string
    openTool: string
    comingSoon: string
    deprecated: string
    portfolioLink: string
    languageLabel: string
    dashboard: string
    categories: string
    favorites: string
    recent: string
    noFavorites: string
    noResults: string
    searchPlaceholder: string
    allTools: string
    mostUsed: string
  }
  categories: Record<CategoryFilterKey, string>
}

export const translations: Record<SupportedLanguage, TranslationBundle> = {
  es: {
    ui: {
      heroTitle: 'Mirai Suite',
      heroSubtitle:
        'Una coleccion de herramientas y utilidades para agilizar flujos de trabajo y mejorar la productividad en desarrollo, SEO y contenido.',
      footerNote: 'Solo para uso interno.',
      openTool: 'Abrir herramienta',
      comingSoon: 'Proximamente',
      deprecated: 'Obsoleta',
      portfolioLink: 'Portfolio Mirai',
      languageLabel: 'Idioma',
      dashboard: 'Dashboard',
      categories: 'Categorias',
      favorites: 'Favoritos',
      recent: 'Recientes',
      noFavorites: 'Sin favoritos aun',
      noResults: 'Sin resultados',
      searchPlaceholder: 'Buscar herramienta...',
      allTools: 'Todas las herramientas',
      mostUsed: 'Más usadas',
    },
    categories: {
      all: 'Todas',
      integration_core: 'Integracion & Core',
      layout_css: 'Layout & CSS',
      content_elementor: 'Contenido & Elementor',
      seo_audit: 'SEO & Auditoria',
    },
  },
  en: {
    ui: {
      heroTitle: 'Mirai Suite',
      heroSubtitle:
        'A curated collection of tools and utilities designed to streamline workflows and enhance productivity across development, SEO, and content creation.',
      footerNote: 'For internal use only.',
      openTool: 'Open Tool',
      comingSoon: 'Coming Soon',
      deprecated: 'Deprecated',
      portfolioLink: 'Mirai Portfolio',
      languageLabel: 'Language',
      dashboard: 'Dashboard',
      categories: 'Categories',
      favorites: 'Favorites',
      recent: 'Recent',
      noFavorites: 'No favorites yet',
      noResults: 'No results found',
      searchPlaceholder: 'Search tools...',
      allTools: 'All tools',
      mostUsed: 'Most used',
    },
    categories: {
      all: 'All',
      integration_core: 'Integration & Core',
      layout_css: 'Layout & CSS',
      content_elementor: 'Content & Elementor',
      seo_audit: 'SEO & Audit',
    },
  },
  fr: {
    ui: {
      heroTitle: 'Mirai Suite',
      heroSubtitle:
        "Une collection d'outils et d'utilitaires pour simplifier les flux de travail et ameliorer la productivite en developpement, SEO et contenu.",
      footerNote: 'Usage interne uniquement.',
      openTool: "Ouvrir l'outil",
      comingSoon: 'Bientot disponible',
      deprecated: 'Obsolete',
      portfolioLink: 'Portfolio Mirai',
      languageLabel: 'Langue',
      dashboard: 'Tableau de bord',
      categories: 'Categories',
      favorites: 'Favoris',
      recent: 'Recents',
      noFavorites: 'Pas encore de favoris',
      noResults: 'Aucun resultat',
      searchPlaceholder: "Rechercher un outil...",
      allTools: 'Tous les outils',
      mostUsed: 'Les plus utilisés',
    },
    categories: {
      all: 'Tous',
      integration_core: 'Integration & Core',
      layout_css: 'Mise en page & CSS',
      content_elementor: 'Contenu & Elementor',
      seo_audit: 'SEO & Audit',
    },
  },
  ca: {
    ui: {
      heroTitle: 'Mirai Suite',
      heroSubtitle:
        "Una colleccio d'eines i utilitats per agilitzar fluxos de treball i millorar la productivitat en desenvolupament, SEO i contingut.",
      footerNote: "Per a us intern nomes.",
      openTool: 'Obrir eina',
      comingSoon: 'Proximament',
      deprecated: 'Obsolet',
      portfolioLink: 'Portfoli Mirai',
      languageLabel: 'Idioma',
      dashboard: 'Tauler',
      categories: 'Categories',
      favorites: 'Favorits',
      recent: 'Recents',
      noFavorites: 'Sense favorits encara',
      noResults: 'Sense resultats',
      searchPlaceholder: 'Cerca una eina...',
      allTools: 'Totes les eines',
      mostUsed: 'Més usades',
    },
    categories: {
      all: 'Totes',
      integration_core: 'Integracio & Core',
      layout_css: 'Layout & CSS',
      content_elementor: 'Contingut & Elementor',
      seo_audit: 'SEO & Auditoria',
    },
  },
  pt: {
    ui: {
      heroTitle: 'Mirai Suite',
      heroSubtitle:
        'Uma colecao de ferramentas e utilitarios para simplificar fluxos de trabalho e aumentar a produtividade em desenvolvimento, SEO e conteudo.',
      footerNote: 'Apenas para uso interno.',
      openTool: 'Abrir ferramenta',
      comingSoon: 'Em breve',
      deprecated: 'Obsoleto',
      portfolioLink: 'Portfolio Mirai',
      languageLabel: 'Idioma',
      dashboard: 'Painel',
      categories: 'Categorias',
      favorites: 'Favoritos',
      recent: 'Recentes',
      noFavorites: 'Sem favoritos ainda',
      noResults: 'Sem resultados',
      searchPlaceholder: 'Procurar ferramenta...',
      allTools: 'Todas as ferramentas',
      mostUsed: 'Mais usadas',
    },
    categories: {
      all: 'Todas',
      integration_core: 'Integracao & Core',
      layout_css: 'Layout & CSS',
      content_elementor: 'Conteudo & Elementor',
      seo_audit: 'SEO & Auditoria',
    },
  },
}
