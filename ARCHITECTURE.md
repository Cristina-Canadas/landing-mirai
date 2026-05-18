# Mirai Suite — Landing Portal: Arquitectura del Proyecto

## Resumen

**Mirai Suite** es un portal centralizado de herramientas internas para el equipo de Front Mirai. Construido con **Next.js 15 (App Router, SSR)** y **Payload CMS v3** como backend/admin integrado. El contenido se gestiona desde un panel de administración en `/admin` y se refleja inmediatamente en el frontend sin necesidad de rebuild.

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js (App Router, SSR) | ~15.4.11 |
| CMS / Admin | Payload CMS v3 | ^3.33.0 |
| Base de datos | SQLite (via better-sqlite3) | Payload adapter |
| UI | React + React DOM | ^19.0.0 |
| Iconos | lucide-react | ^0.474.0 |
| Tipos | TypeScript strict | ^5 |
| Estilos | CSS Variables + globals.css | — |
| Fuente | Raleway (next/font/google) | — |
| Runtime Node | Node.js | >=22.12.0 |

---

## Estructura de Directorios

```
Landing/
├── .claude/                           # Agentes de Claude Code
│   └── agents/
│       ├── senior-frontend.md
│       ├── senior-backend.md
│       ├── qa-tester.md
│       ├── ux-designer.md
│       └── i18n-specialist.md
├── public/                            # Assets estáticos
│   ├── favicon.ico
│   ├── favicon.svg
│   └── media/                         # Uploads de Payload (generado, no commitear)
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout: fuente Raleway, anti-flash script
│   │   ├── globals.css                # Variables CSS + estilos de todos los componentes
│   │   ├── (frontend)/                # Grupo de rutas: portal público
│   │   │   ├── layout.tsx             # Lee cookie de idioma → monta Header + ThemeProvider
│   │   │   └── page.tsx               # Home SSR: fetch Payload → pasa datos a ToolsGrid
│   │   └── (payload)/                 # Grupo de rutas: Payload CMS
│   │       ├── layout.tsx             # Layout vacío para el admin
│   │       ├── importMap.ts           # Generado por Payload (no editar)
│   │       ├── admin/[[...segments]]/ # Admin UI de Payload → /admin
│   │       │   └── page.tsx
│   │       └── api/[...slug]/         # API REST de Payload → /api/*
│   │           └── route.ts
│   ├── collections/
│   │   ├── Tools.ts                   # Colección de herramientas (localizada: 5 idiomas)
│   │   ├── Users.ts                   # Usuarios del admin (auth integrada de Payload)
│   │   └── Media.ts                   # Uploads de imágenes
│   ├── components/
│   │   ├── ThemeProvider.tsx          # Context dark/light (client component)
│   │   ├── Header.tsx                 # Nav: logo + selector idioma + toggle tema (client)
│   │   ├── ToolsGrid.tsx              # Grid con filtrado por categoría (client component)
│   │   └── ToolCard.tsx              # Tarjeta de herramienta (recibe props del server)
│   ├── assets/                        # Imágenes procesadas por Next.js
│   │   ├── logo-mirai-go-sin-fondo.webp
│   │   └── mirai.png
│   ├── i18n/
│   │   └── translations.ts            # UI strings en ES/EN/FR/CA/PT (no tool content)
│   ├── scripts/
│   │   └── seed.ts                    # Seed inicial: crea las 11 herramientas en Payload
│   └── payload.config.ts              # Configuración de Payload CMS
├── .env                               # Variables de entorno (no commitear)
├── .env.example                       # Plantilla de variables
├── ARCHITECTURE.md                    # Este archivo
├── CLAUDE.md                          # Instrucciones para agentes de Claude Code
├── next.config.ts                     # Config de Next.js (wrapped con withPayload)
├── package.json
├── payload.db                         # Base de datos SQLite (generada, no commitear)
└── tsconfig.json
```

---

## Arquitectura de Componentes

```
RootLayout (src/app/layout.tsx)
  │  Carga fuente Raleway, script anti-flash de tema
  │
  ├── FrontendLayout (src/app/(frontend)/layout.tsx)  [Server Component]
  │     Lee cookie 'language' → determina idioma
  │     └── ThemeProvider [Client Component]
  │           └── Header [Client Component]
  │                 ├── Logo (next/image)
  │                 ├── LanguageSelector → onChange: set cookie + router.refresh()
  │                 └── ThemeToggle → onClick: toggleTheme()
  │
  └── HomePage (src/app/(frontend)/page.tsx)  [Server Component, force-dynamic]
        Lee cookie 'language'
        Fetch Payload: tools con locale correcto
        Pasa traducciones UI + datos de tools a:
        └── ToolsGrid [Client Component]
              ├── CategoryFilter (botones, estado local de React)
              └── ToolCard × N [presentacional]
                    ├── Icono Lucide React
                    ├── Nombre + descripción (ya traducidos por servidor)
                    ├── Badge de estado
                    ├── Tag de categoría
                    └── CTA (Abrir herramienta / Próximamente)
```

---

## Flujo de Datos

```
[Admin: /admin]
  Content editor añade/edita herramienta en Payload UI
    → Guardado en payload.db (SQLite)
    → Próximo request al frontend lo refleja inmediatamente (SSR)

[Frontend: /]
  Request llega al servidor
    → FrontendLayout lee cookie 'language' (default: 'es')
    → HomePage llama payload.find({ locale: 'es', sort: 'order' })
    → Payload devuelve tools con name/description en el idioma correcto
    → Server Component pasa tools + translations[lang] a ToolsGrid
    → React hidrata el cliente con estado de filtro = 'all'

[Cambio de idioma en Header]
  onClick → localStorage.setItem + document.cookie
    → router.refresh()
    → Next.js re-ejecuta Server Components con la nueva cookie
    → Página renderizada en el nuevo idioma (sin reload completo)

[Cambio de tema en Header]
  onClick → localStorage.setItem + data-theme en <html>
    → CSS Variables cambian instantáneamente (no hay request)
```

---

## Sistema de i18n

### Estrategia
- **Idiomas soportados:** ES (default), EN, FR, CA, PT
- **Persistencia:** `localStorage` (cliente) + cookie HTTP (servidor)
- **Sin routing por idioma** (`/es/`, `/en/`): todo en la misma URL `/`
- **Cambio de idioma:** `router.refresh()` → re-renderiza Server Components

### Dónde vive cada tipo de contenido

| Contenido | Dónde se gestiona |
|-----------|-------------------|
| Nombres y descripciones de herramientas | Payload admin (campo localizado) |
| Textos UI: heroTitle, subtitle, footer... | `src/i18n/translations.ts` |
| Nombres de categorías | `src/i18n/translations.ts` |

### Payload localization
En `payload.config.ts`:
```typescript
localization: {
  locales: ['es', 'en', 'fr', 'ca', 'pt'],
  defaultLocale: 'es',
  fallback: true,  // Si no hay traducción, usa 'es'
}
```
Los campos `name` y `description` de `Tools.ts` tienen `localized: true`.

---

## Payload CMS

### Panel de administración
- URL: `http://localhost:3000/admin` (dev) / `https://tudominio.com/admin` (prod)
- Primer acceso: crear usuario administrador
- Autenticación: email + password (Payload auth integrada)

### Colecciones

| Colección | Descripción |
|-----------|-------------|
| `tools` | Herramientas del portal (localizada, ordenable) |
| `users` | Administradores del panel |
| `media` | Uploads de imágenes (guardados en `public/media/`) |

### Tools collection — campos

| Campo | Tipo | Localizado |
|-------|------|-----------|
| `name` | text | Sí |
| `description` | textarea | Sí |
| `url` | text | No |
| `category` | select | No |
| `status` | select (active/coming_soon/deprecated) | No |
| `icon` | select (nombres de Lucide) | No |
| `order` | number | No |

---

## Sistema de Temas

| Aspecto | Implementación |
|---------|---------------|
| Temas | Dark (default) / Light |
| Mecanismo | `data-theme="light"` en `<html>` |
| Persistencia | `localStorage.getItem('theme')` |
| Anti-flash | Script inline en `<head>` (antes de hydration) |
| Provider | `ThemeProvider.tsx` (React Context) |
| Variables | Definidas en `globals.css` bajo `[data-theme="light"]` |

---

## Design System

### Colores de marca

| Variable | Valor | Uso |
|----------|-------|-----|
| `--brand-red` | `#c71827` | Acentos, CTAs, activo |
| `--brand-white` | `#ffffff` | Texto dark mode |
| `--brand-black` | `#000000` | Fondo dark mode |
| `--accent-shadow` | `rgba(199, 24, 39, 0.3)` | Sombras hover |

### Tipografía
- Familia: **Raleway** (cargada con `next/font/google`, variable `--font-raleway`)
- Fallback: system-ui, -apple-system, sans-serif

### Responsive Breakpoints
| Columnas | Breakpoint |
|----------|-----------|
| 4 col | > 1200px |
| 3 col | > 900px |
| 2 col | > 768px |
| 1 col | < 768px |

---

## Variables de Entorno

```env
# Payload
PAYLOAD_SECRET=          # Secret para JWT (obligatorio en producción)
DATABASE_URI=            # file:./payload.db (default) o conexión PostgreSQL

# Site
NODE_ENV=development
PUBLIC_SITE_URL=http://localhost:3000

# Herramientas (para referencia, las URLs se gestionan desde el admin)
# PUBLIC_URL_MIRAI_CORE_TOOLS=
```

Ver `.env.example` para la lista completa.

---

## Scripts

```bash
npm run dev     # Dev server → localhost:3000
npm run build   # Build de producción
npm run start   # Servidor de producción (requiere build previo)
npm run seed    # Seed inicial: crea 11 herramientas en Payload (ejecutar una vez)
npm run lint    # Linter Next.js
```

## Primer Setup

```bash
1. npm install
2. Crear .env desde .env.example (añadir PAYLOAD_SECRET)
3. npm run dev
4. Abrir localhost:3000/admin → crear usuario admin
5. En otra terminal: npm run seed
6. Las herramientas aparecen en el portal
```

---

## Roadmap de Escalabilidad

- [ ] Páginas de detalle individuales por herramienta (`/tools/[slug]`)
- [ ] Colección de Categorías en Payload (gestión dinámica de categorías)
- [ ] Roles de usuario (admin vs editor) con Payload access control
- [ ] Imagen de portada por herramienta (campo Media en Tools)
- [ ] Búsqueda de herramientas en tiempo real (Payload API)
- [ ] Migración a PostgreSQL para producción
- [ ] Múltiples secciones/páginas del portal (no solo herramientas)
- [ ] Analytics de uso de herramientas
- [ ] Rutas por idioma (`/es/`, `/en/`) para SEO si se hace público

---

## Equipo de Agentes (Claude Code)

| Agente | Archivo | Responsabilidad |
|--------|---------|----------------|
| Senior Frontend | `.claude/agents/senior-frontend.md` | Componentes React, CSS, JS cliente, Next.js pages |
| Senior Backend | `.claude/agents/senior-backend.md` | Payload collections, API routes, SSR, DB |
| QA Tester | `.claude/agents/qa-tester.md` | Testing, accesibilidad, cross-browser |
| UX Designer | `.claude/agents/ux-designer.md` | Design system, UX, animaciones |
| i18n Specialist | `.claude/agents/i18n-specialist.md` | Traducciones, localización |
