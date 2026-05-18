# Mirai Suite — Documentación Completa

## 📋 Tabla de Contenidos

1. [¿Qué es Mirai Suite?](#qué-es-mirai-suite)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [¿Qué es Payload CMS?](#qué-es-payload-cms)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Flujo de Funcionamiento](#flujo-de-funcionamiento)
6. [Sistema de Idiomas (i18n)](#sistema-de-idiomas-i18n)
7. [Sistema de Temas](#sistema-de-temas)
8. [Cómo Gestionar Herramientas](#cómo-gestionar-herramientas)
9. [Guía de Desarrollo](#guía-de-desarrollo)
10. [Cambios Futuros Planeados](#cambios-futuros-planeados)
11. [Troubleshooting](#troubleshooting)

---

## ¿Qué es Mirai Suite?

**Mirai Suite** es un **portal centralizado de herramientas internas** para el equipo de Front Mirai. Es un sitio web donde todos los miembros del equipo pueden acceder de forma rápida y sencilla a todas las herramientas que necesitan.

### Características principales

- ✅ **Portal en vivo** — Sin necesidad de despliegues cada vez que añades una herramienta
- ✅ **Panel de administración integrado** — Gestiona todo desde `/admin` (interface gráfica, no código)
- ✅ **Multiidioma** — Soporte para 5 idiomas (Español, Inglés, Francés, Catalán, Portugués)
- ✅ **Tema oscuro/claro** — Cambio de tema sin recargar la página
- ✅ **Filtrado por categoría** — Los usuarios pueden filtrar herramientas rápidamente
- ✅ **SEO optimizado** — Renderizado en el servidor (SSR) para mejor indexación

### Diferencia con un sitio tradicional

En un sitio tradicional:
```
Editas contenido → Haces rebuild → Despliegas → Esperas a que esté en vivo
```

En **Mirai Suite**:
```
Editas en el admin (/admin) → ¡Listo! Los cambios están ya en vivo
```

---

## Tecnologías Utilizadas

### Frontend

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Next.js** | ~15.4.11 | Framework React con Server-Side Rendering (SSR) |
| **React** | ^19.0.0 | Librería de componentes interactivos |
| **TypeScript** | ^5 | Lenguaje tipado (mayor seguridad en el código) |
| **CSS Variables** | — | Sistema de estilos sin CSS-in-JS |
| **Raleway** | — | Fuente de marca (cargada con next/font) |

### Backend / Admin

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Payload CMS** | ^3.33.0 | Panel de administración + API REST integrada |
| **SQLite** | — | Base de datos local (adaptador de Payload) |
| **Node.js** | >=22.12.0 | Entorno de ejecución de JavaScript en servidor |

### Complementos

| Librería | Versión | Propósito |
|---------|---------|----------|
| **lucide-react** | ^0.474.0 | Icons escalables (SVG) |
| **sharp** | ^0.32.6 | Procesamiento de imágenes |

---

## ¿Qué es Payload CMS?

### Concepto

**Payload CMS** es un **CMS moderno construido con Node.js + React**. A diferencia de WordPress (que es separado), Payload **se integra directamente en tu aplicación Next.js**.

### Características de Payload

#### 1. **Panel de Administración**
- URL: `http://localhost:3000/admin`
- Interface gráfica para gestionar contenido
- No necesitas conocer código para usar el admin
- Autenticación con email + password

#### 2. **Base de Datos Integrada**
- Payload gestiona la base de datos automáticamente
- En desarrollo: SQLite (archivo `payload.db`)
- En producción: PostgreSQL (recomendado)

#### 3. **API REST Automática**
- Endpoint: `http://localhost:3000/api/tools`
- GET: obtener herramientas
- POST: crear herramientas
- PUT/PATCH: editar herramientas
- DELETE: eliminar herramientas

#### 4. **Localización (i18n)**
- Payload integra soporte para múltiples idiomas
- Cada campo localizable se puede traducir a 5 idiomas
- Fallback automático si falta traducción

#### 5. **Autenticación**
- Payload proporciona sistema de usuarios + login
- Solo administradores pueden acceder al admin panel

### Comparación: Payload vs WordPress

| Aspecto | Payload | WordPress |
|--------|---------|-----------|
| Dónde vive | Dentro de tu app Next.js | Servidor separado |
| Tecnología | Node.js + React | PHP |
| Admin | Integrado en tu sitio | Panel wordpress.com/admin |
| Base de datos | Local o PostgreSQL | MySQL |
| Curva de aprendizaje | Baja (interface intuitiva) | Media |
| Flexibilidad | Alta (código abierto) | Media |
| Hosting | Mismo que tu app | Separado |
| Costo | Gratuito | Varía (plugins pagos) |

---

## Estructura del Proyecto

```
Landing/
│
├── 📁 public/                    # Archivos estáticos que nunca cambian
│   ├── favicon.ico
│   ├── favicon.svg
│   └── media/                    # Uploads de imágenes (generado automáticamente)
│
├── 📁 src/
│   │
│   ├── 📁 app/                  # Routing de Next.js (cada carpeta = una ruta)
│   │   │
│   │   ├── layout.tsx           # Layout raíz: carga fuento Raleway, anti-flash script
│   │   ├── globals.css          # Variables CSS globales + estilos de componentes
│   │   │
│   │   ├── 📁 (frontend)/       # Grupo de rutas: el portal público
│   │   │   ├── layout.tsx       # Layout del portal: detecta idioma, monta Header
│   │   │   └── page.tsx         # Página de inicio: obtiene herramientas de Payload
│   │   │
│   │   └── 📁 (payload)/        # Grupo de rutas: Payload CMS
│   │       ├── layout.tsx       # Layout vacío para el admin
│   │       ├── importMap.js     # Generado automáticamente por Payload (no tocar)
│   │       ├── 📁 admin/        # Panel admin en /admin
│   │       │   └── [[...segments]]/page.tsx
│   │       └── 📁 api/          # API REST en /api/* (también generada por Payload)
│   │           └── [...slug]/route.ts
│   │
│   ├── 📁 collections/          # Definiciones de datos de Payload
│   │   ├── Tools.ts             # Colección: herramientas
│   │   ├── Users.ts             # Colección: usuarios del admin
│   │   └── Media.ts             # Colección: uploads de imágenes
│   │
│   ├── 📁 components/           # Componentes React reutilizables
│   │   ├── ThemeProvider.tsx    # Contexto para el tema dark/light
│   │   ├── Header.tsx           # Encabezado: logo + selector idioma + toggle tema
│   │   ├── ToolsGrid.tsx        # Grid de herramientas + filtros
│   │   └── ToolCard.tsx         # Tarjeta individual de herramienta
│   │
│   ├── 📁 assets/               # Imágenes procesadas
│   │   ├── logo-mirai.webp
│   │   └── mirai.png
│   │
│   ├── 📁 i18n/                 # Internacionalización
│   │   └── translations.ts      # Cadenas de texto en 5 idiomas
│   │
│   ├── 📁 scripts/              # Scripts especiales
│   │   └── seed.ts              # Script para llenar la BD con datos iniciales
│   │
│   └── payload.config.ts        # Configuración de Payload CMS
│
├── 📁 .claude/                  # Configuración de agentes de Claude
│   └── agents/
│       ├── senior-frontend.md
│       ├── senior-backend.md
│       ├── qa-tester.md
│       ├── ux-designer.md
│       └── i18n-specialist.md
│
├── 📄 .env                      # Variables de entorno (no subir a Git)
├── 📄 .env.example              # Plantilla de variables
├── 📄 ARCHITECTURE.md           # Documentación técnica (en inglés)
├── 📄 CLAUDE.md                 # Instrucciones para agentes
├── 📄 DOCUMENTACION_COMPLETA.md # Este archivo
├── 📄 next.config.ts            # Config de Next.js
├── 📄 tsconfig.json             # Config de TypeScript
├── 📄 package.json              # Dependencias y scripts
└── 📄 payload.db                # Base de datos SQLite (generada, no commitear)
```

---

## Flujo de Funcionamiento

### 1. Inicio del servidor

```bash
npm run dev
```

Next.js inicia en `http://localhost:3000`:
- Puerto 3000: tu app (frontend + admin)
- Payload se inicializa automáticamente
- SQLite se crea en `payload.db` si no existe

### 2. Primer acceso al admin

Abre `http://localhost:3000/admin`:

1. Payload te pide crear un usuario administrador (email + contraseña)
2. Inicia sesión
3. Ves el panel con las colecciones (Tools, Users, Media)

### 3. Seed inicial de datos

En otra terminal:
```bash
npm run seed
```

Script `src/scripts/seed.ts`:
- Crea 11 herramientas predefinidas
- Las inserta en Payload CMS
- Cada herramienta tiene traducción en 5 idiomas

### 4. Editar herramientas en el admin

En `/admin`:
1. Click en "Tools" → lista de herramientas
2. Click en una herramienta para editar
3. Cada campo tiene pestañas para idiomas (ES, EN, FR, CA, PT)
4. Click "Save" → cambios reflejados al instante

### 5. Frontend obtiene los cambios

Cuando visitas `http://localhost:3000`:

1. Next.js (servidor) recibe la request
2. Detecta el idioma de la cookie del usuario
3. Hace una petición a Payload API: `GET /api/tools?locale=es`
4. Payload devuelve las herramientas en ese idioma
5. React renderiza el HTML con los datos
6. El navegador recibe la página lista para mostrar
7. React "hidrata" interactividad (filtros, cambio de tema)

### Flujo visual

```
┌─────────────────────────────────────┐
│ Usuario visita / en navegador        │
└──────────────┬──────────────────────┘
               │
               ├─→ Next.js Server (SSR)
               │     ├─→ Lee cookie "language" → default "es"
               │     ├─→ Fetch a Payload: GET /api/tools?locale=es
               │     └─→ Construye HTML con tools + traducciones
               │
               ├─→ Envía HTML al navegador
               │
               ├─→ React hidrata en cliente
               │     ├─→ Monta ThemeProvider
               │     ├─→ Monta Header (selector idioma, toggle tema)
               │     └─→ Monta ToolsGrid (estado de filtro)
               │
               └─→ Usuario ve portal completamente funcional
                    ├─→ Puede cambiar idioma
                    ├─→ Puede filtrar herramientas
                    └─→ Puede cambiar tema
```

---

## Sistema de Idiomas (i18n)

### Configuración

Payload soporta 5 idiomas:

| Código | Nombre | Flag |
|--------|--------|------|
| `es` | Español | 🇪🇸 |
| `en` | English | 🇬🇧 |
| `fr` | Français | 🇫🇷 |
| `ca` | Català | 🇦🇩 |
| `pt` | Português | 🇵🇹 |

Configuración en `src/payload.config.ts`:
```typescript
localization: {
  locales: ['es', 'en', 'fr', 'ca', 'pt'],
  defaultLocale: 'es',  // Idioma por defecto
  fallback: true,        // Si falta traducción, usa español
}
```

### Dónde va cada cosa

#### 1. **Contenido de herramientas** (gestionar en `/admin`)

Archivo: `src/collections/Tools.ts`

Campos localizados:
- `name` (Nombre de la herramienta)
- `description` (Descripción)

Ejemplo en el admin:
```
[Tool Name]
├─ Español:  "Core UI"
├─ English:  "Core UI"
├─ Français: "Core UI"
├─ Català:   "Core UI"
└─ Português "Core UI"
```

#### 2. **Textos de la UI** (gestionar en código)

Archivo: `src/i18n/translations.ts`

Textos que NO son contenido de herramientas:
- "Bienvenido a Mirai Suite"
- "Todas las categorías"
- "Próximamente"
- "Nombres de categorías"
- etc.

Ejemplo:
```typescript
// src/i18n/translations.ts
const translations = {
  es: {
    ui: {
      heroTitle: "Bienvenido a Mirai Suite",
      subtitle: "Portal de herramientas internas",
      allCategories: "Todas las categorías",
      comingSoon: "Próximamente",
      openTool: "Abrir herramienta",
    }
  },
  en: {
    ui: {
      heroTitle: "Welcome to Mirai Suite",
      subtitle: "Internal tools portal",
      allCategories: "All categories",
      comingSoon: "Coming soon",
      openTool: "Open tool",
    }
  },
  // ... más idiomas
}
```

### Cómo cambia el idioma

**En el frontend (cliente):**

1. Usuario hace click en selector de idioma en el Header
2. `Header.tsx` ejecuta:
   ```typescript
   localStorage.setItem('language', 'en')  // Guardar preferencia
   document.cookie = 'language=en'         // Cookie para servidor
   router.refresh()                        // Re-renderizar Server Components
   ```
3. Next.js vuelve a ejecutar `page.tsx` y `layout.tsx`
4. Esos componentes leen la cookie y usan el nuevo idioma
5. Payload API devuelve tools en el nuevo idioma
6. La página se renderiza en inglés

**En el backend (servidor):**

Cuando renderizamos el servidor:
```typescript
// src/app/(frontend)/page.tsx
const language = cookies().get('language')?.value || 'es'
const tools = await payload.find({
  collection: 'tools',
  locale: language,  // ← Usa el idioma de la cookie
})
```

### Añadir un nuevo idioma

Para añadir un 6º idioma (p.ej., Italiano):

1. **En `payload.config.ts`:**
   ```typescript
   localization: {
     locales: ['es', 'en', 'fr', 'ca', 'pt', 'it'],  // ← Añadir 'it'
     defaultLocale: 'es',
     fallback: true,
   }
   ```

2. **En `translations.ts`:**
   ```typescript
   const translations = {
     // ... otros idiomas
     it: {
       ui: {
         heroTitle: "Benvenuto in Mirai Suite",
         subtitle: "Portale di strumenti interni",
         // ... más textos
       }
     }
   }
   ```

3. **En `Header.tsx`:**
   Añadir opción al selector de idioma:
   ```typescript
   <option value="it">Italiano</option>
   ```

4. **Reiniciar servidor:**
   ```bash
   npm run dev
   ```

---

## Sistema de Temas

### ¿Cómo funciona?

**Mirai Suite** tiene dos temas:
- 🌙 **Dark** (por defecto)
- ☀️ **Light**

#### Cambio de tema sin recargar la página

1. Usuario hace click en botón toggle en Header
2. `Header.tsx` ejecuta:
   ```typescript
   const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
   localStorage.setItem('theme', newTheme)
   document.documentElement.setAttribute('data-theme', newTheme)
   ```
3. CSS Variables cambian automáticamente
4. Toda la página se redibuja en el nuevo tema

#### Anti-flash (evitar parpadeo)

Problema: Si no haces nada, verás el tema oscuro un momento y luego pasa a claro.

Solución: Script en `<head>` de `src/app/layout.tsx`:
```typescript
<script
  dangerouslySetInnerHTML={{
    __html: `try{
      const t = localStorage.getItem('theme')
      if (t === 'light') {
        document.documentElement.setAttribute('data-theme', 'light')
      }
    } catch(e) {}`,
  }}
/>
```

Este script:
1. Se ejecuta ANTES de que React aparezca
2. Lee localStorage
3. Aplica el tema correcto en `<html>`
4. Cuando llega React, ya está el tema correcto (sin parpadeo)

### Variables CSS

Todas las variables están en `src/app/globals.css`:

```css
:root {
  --brand-red: #c71827;
  --brand-white: #ffffff;
  --brand-black: #000000;
  /* ... más variables */
}

[data-theme="light"] {
  --bg: var(--brand-white);
  --text: var(--brand-black);
  --border: #e0e0e0;
}

[data-theme="dark"] {
  --bg: var(--brand-black);
  --text: var(--brand-white);
  --border: #333333;
}
```

Luego los componentes usan:
```css
body {
  background: var(--bg);
  color: var(--text);
}
```

### Responsivo

| Breakpoint | Ancho | Grid |
|-----------|-------|------|
| Mobile | < 768px | 1 columna |
| Tablet | 768px - 900px | 2 columnas |
| Desktop | 900px - 1200px | 3 columnas |
| Wide | > 1200px | 4 columnas |

Las variables breakpoint están en `globals.css`.

---

## Cómo Gestionar Herramientas

### Panel de Administración

**URL:** `http://localhost:3000/admin`

#### 1. Acceso

- Email: el que creaste en primer setup
- Contraseña: la que creaste en primer setup

#### 2. Ver lista de herramientas

Click en "Tools" en la barra lateral:

```
Herramientas
├─ Core UI
├─ SEO Tools
├─ Layout Framework
├─ Contenido Manager
└─ ...
```

#### 3. Editar una herramienta

Click en la herramienta → abre formulario:

```
Nombre
├─ Español: "Core UI"
├─ English: "Core UI"
├─ Français: "Interface Noyau"
├─ Català: "Core UI"
└─ Português: "Core UI"

Descripción
├─ [multicampo localizado]

URL
└─ https://core.mirai.dev

Categoría
├─ UI Components / Documentación / Utilidades / ...

Estado
├─ Active / Coming Soon / Deprecated

Icono (Lucide React)
├─ Package / FileCode / Settings / ...

Orden
└─ 1 (posición en el grid)
```

#### 4. Guardar cambios

Click "Save" → Payload actualiza la BD:
- Los cambios aparecen al instante en el frontend
- No necesitas rebuild ni redeploy

#### 5. Crear nueva herramienta

Click "+ Create Tool":

1. Rellena todos los campos
2. Añade traducciones en todos los idiomas
3. Click "Save"
4. Aparece en el portal al instante

#### 6. Cambiar orden de herramientas

En la lista, arrastra herramientas para ordenarlas:

```
Herramientas (Drag to reorder)
1. [≡≡≡] Core UI
2. [≡≡≡] SEO Tools
3. [≡≡≡] Layout Framework
```

O edita el campo "orden" manualmente.

### Campos de una herramienta

| Campo | Tipo | Ejemplo | Obligatorio |
|-------|------|---------|-----------|
| **name** | Texto | "Core UI" | Sí |
| **description** | Descripción | "Componentes..." | Sí |
| **url** | URL | "https://core.dev" | Sí |
| **category** | Selección | "UI Components" | Sí |
| **status** | Selección | "active" | Sí |
| **icon** | Selección | "Package" | Sí |
| **order** | Número | 1 | No (auto) |

### Estados de herramienta

| Estado | Ícono | Comportamiento |
|--------|-------|---|
| **active** | ✅ | Visible con botón "Abrir" |
| **coming_soon** | ⏳ | Visible con botón "Próximamente" (deshabilitado) |
| **deprecated** | ❌ | Oculta del portal (solo admin ve) |

### Categorías disponibles

Hardcodeadas en `src/i18n/translations.ts`:
```typescript
categories: {
  es: ['UI Components', 'Documentación', 'Utilidades', 'Diseño', 'Otros'],
  en: ['UI Components', 'Documentation', 'Utilities', 'Design', 'Other'],
  // ...
}
```

Para añadir una nueva categoría: editar `translations.ts` + reiniciar.

---

## Guía de Desarrollo

### Setup Inicial

```bash
# 1. Clonar/descargar el proyecto
cd Landing

# 2. Instalar dependencias
npm install

# 3. Crear fichero .env
cp .env.example .env
# Editar .env y añadir PAYLOAD_SECRET si es necesario

# 4. Iniciar servidor
npm run dev

# 5. En otra terminal, seed de datos (una sola vez)
npm run seed
```

### Desarrollo diario

```bash
# Terminal 1: Servidor dev
npm run dev

# Acceso:
# - Portal: http://localhost:3000
# - Admin: http://localhost:3000/admin
# - API: http://localhost:3000/api/tools
```

### Estructura de componentes

#### Server vs Client Components

**Server Components** (por defecto):
- Se ejecutan en el servidor
- Pueden acceder a BD directamente
- No tienen `useState`, `useEffect`, etc.
- Perfecto para fetch de datos

```typescript
// src/app/(frontend)/page.tsx [Server Component]
export default async function HomePage() {
  const tools = await getTools()
  return <ToolsGrid tools={tools} />
}
```

**Client Components** (necesitan `'use client'`):
- Se ejecutan en el navegador
- Tienen estado interactivo
- Pueden usar `useState`, `useEffect`, etc.
- Perfecto para UI interactiva

```typescript
// src/components/ToolsGrid.tsx [Client Component]
'use client'
import { useState } from 'react'

export function ToolsGrid({ tools }) {
  const [filter, setFilter] = useState('all')
  return (
    <div>
      <button onClick={() => setFilter('ui')}>UI Components</button>
      {/* renderizar tools */}
    </div>
  )
}
```

### Fetch de datos de Payload

#### Desde el servidor (Next.js)

```typescript
import payload from 'payload'

// Obtener todas las herramientas en español
const tools = await payload.find({
  collection: 'tools',
  locale: 'es',
  sort: 'order',
})

// Filtrar por categoría
const uiTools = await payload.find({
  collection: 'tools',
  where: {
    category: { equals: 'UI Components' }
  },
  locale: 'es',
})
```

#### Desde el cliente (API REST)

```typescript
// src/components/ToolsGrid.tsx
const response = await fetch('/api/tools?locale=es')
const { docs } = await response.json()
```

### Estilos CSS

**No usar CSS-in-JS.** Todo va en `src/app/globals.css`:

```css
/* Variables */
:root {
  --color-primary: #c71827;
  --space-sm: 0.5rem;
  --space-md: 1rem;
}

/* Componente */
.tool-card {
  padding: var(--space-md);
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  transition: all 0.2s ease;
}

.tool-card:hover {
  box-shadow: 0 4px 12px var(--accent-shadow);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .tool-card {
    padding: var(--space-sm);
  }
}
```

Luego en componentes:

```typescript
export function ToolCard({ tool }) {
  return (
    <div className="tool-card">
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
    </div>
  )
}
```

### Icono Lucide React

```typescript
import { Package, FileCode, Settings } from 'lucide-react'

export function ToolCard({ tool }) {
  const IconComponent = getIconByName(tool.icon) // 'Package' → Package component
  
  return (
    <div>
      <IconComponent size={32} />
      <h3>{tool.name}</h3>
    </div>
  )
}
```

---

## Cambios Futuros Planeados

### Corto plazo (1-2 meses)

#### 1. Páginas de detalle individual

```
URL: /tools/core-ui
Componentes: página dedicada para cada herramienta
Contenido: descripción expandida, screenshots, docs, etc.
```

**Cómo hacer:**
1. Crear ruta: `src/app/(frontend)/tools/[slug]/page.tsx`
2. Añadir campo `slug` en Tools collection
3. Generar páginas dinámicamente con Next.js

#### 2. Colección de Categorías en Payload

En lugar de hardcodear categorías en `translations.ts`, gestionarlas desde admin:

**Nuevas rutas:**
1. Click "Tools Settings" en admin
2. Crear categorías con nombre traducido
3. Las herramientas las usan automáticamente

#### 3. Imágenes por herramienta

Cada herramienta podría tener:
- Logo personalizado
- Screenshot
- Portada

**Cómo:**
1. Añadir campo `image` (type: Media) en Tools
2. Mostrar en ToolCard con `<Image />`

### Mediano plazo (3-6 meses)

#### 4. Roles de usuario

- Admin: acceso total
- Editor: solo editar tools
- Viewer: solo lectura

**Cómo:** Payload tiene built-in access control

#### 5. Búsqueda de herramientas

Campo de búsqueda que filtre tools por nombre/descripción en tiempo real.

**Cómo:** Usar Payload API con where + contains

#### 6. Migración a PostgreSQL

Cambiar de SQLite a PostgreSQL en producción para mejor escalabilidad.

**Cómo:** Cambiar adapter en `payload.config.ts`

### Largo plazo (6+ meses)

#### 7. Múltiples secciones del portal

No solo herramientas, sino:
- Blog de tutoriales
- Eventos internos
- Anuncios del equipo
- Guías de estilo

#### 8. Analytics

Trackear qué herramientas se usan más, cuál es la hora pico, etc.

#### 9. Integración con Slack

Notificaciones cuando se publica una nueva herramienta

#### 10. Rutas por idioma para SEO

Si el portal se hace público:
```
/es/tools
/en/tools
/fr/tools
```

---

## Troubleshooting

### Error: "Cannot destructure property 'config' of 'se(...)' as it is undefined"

**Causa:** Payload configuration incompleta u obsoleta después de un cambio.

**Solución:**
```bash
# 1. Limpiar
rm -rf .next
rm -rf node_modules/.payload

# 2. Reinstalar
npm install

# 3. Reiniciar
npm run dev
```

### Error: "Hydration mismatch between Server and Client"

**Causa:** El HTML generado en el servidor es diferente al del cliente.

**Solución:**
- Revisar que no haya `new Date()` o valores random en Server Components
- Usar `suppressHydrationWarning` en elementos que varían

### Admin no carga en `/admin`

**Causas posibles:**
1. Payload no está correctamente inicializado
2. Base de datos corrupta

**Solución:**
```bash
# 1. Verificar que payload.db existe
ls -la payload.db

# 2. Si no, crear nuevo
rm payload.db
npm run dev
# Crear usuario admin nuevamente

# 3. Hacer seed
npm run seed
```

### Los cambios en las herramientas no aparecen en el portal

**Causas:**
1. Cache de Next.js
2. TypeScript errors ocultos

**Solución:**
```bash
# 1. Limpiar cache
npm run dev -- --no-experimental-app-cache

# 2. Forzar recompile
touch src/app/layout.tsx
# Next.js debería detectar cambios

# 3. Restart completo
npm run dev
```

### Error de tipos TypeScript

**Causa:** `payload-types.ts` desactualizado

**Solución:**
```bash
# Para regenerar tipos
npm run dev
# El server regenera automáticamente

# O fuerza regeneración
rm src/payload-types.ts
npm run dev
```

---

## Comandos Útiles

```bash
# Desarrollo local
npm run dev              # Iniciar servidor (recompila automáticamente)

# Producción
npm run build            # Compilar para producción
npm run start            # Iniciar servidor compilado

# Datos
npm run seed             # Llenar BD con datos iniciales (una sola vez)

# Calidad de código
npm run lint             # Ejecutar linter (Next.js built-in)

# Limpieza
rm -rf .next             # Limpiar cache
npm install              # Reinstalar dependencias
```

---

## Glosario

| Término | Explicación |
|---------|------------|
| **SSR** | Server-Side Rendering: renderizar HTML en el servidor antes de enviarlo |
| **Hydration** | React "hidrata" el HTML del servidor, añadiendo interactividad |
| **Server Component** | Componente que se ejecuta en el servidor (Next.js 13+) |
| **Client Component** | Componente que se ejecuta en el navegador (necesita `'use client'`) |
| **CMS** | Content Management System: gestor de contenido |
| **API REST** | Interface para comunicarse con el servidor (GET, POST, etc.) |
| **Localización** | Traducción de contenido a múltiples idiomas |
| **Dark Mode** | Tema oscuro de interfaz |
| **Token CSS** | Variable CSS que define un estilo (color, espaciado, etc.) |
| **i18n** | Abreviatura de "internationalization" (18 letras entre i y n) |

---

## Contacto y soporte

Si tienes dudas:

1. **Revisa ARCHITECTURE.md** — Documentación técnica detallada
2. **Revisa este documento** — Responde la mayoría de preguntas
3. **Revisa CLAUDE.md** — Instrucciones para los agentes
4. **Consulta a un miembro del equipo Front**

---

**Última actualización:** Abril 2026
**Mantenedor:** Equipo Front Mirai
**Licencia:** Interno (no público)
