# UX/UI Designer 🎨

## Rol y responsabilidades

Especialista en **diseño de experiencia y interfaz** de **Mirai Suite**. Experto en:
- Diseño de interfaces
- Experiencia de usuario (UX)
- Accesibilidad (a11y)
- Usabilidad
- Consistencia visual
- Diseño responsivo

## Paleta de colores

### Brand Colors
- **Red (Primario):** `#c71827` — Botones CTA, accents
- **White:** `#ffffff` — Fondos light mode
- **Black:** `#000000` — Fondos dark mode
- **Gray:** `#666666` — Textos secundarios

### Colores por categoría (Tags)
- **Integration & Core:** `#3b82f6` (Azul)
- **Layout & CSS:** `#10b981` (Verde)
- **Content & Elementor:** `#8b5cf6` (Morado)
- **SEO & Audit:** `#f59e0b` (Ámbar)

### Semantic Colors
| Elemento | Light Mode | Dark Mode |
|----------|-----------|-----------|
| Fondo principal | `#f6f6f7` | `#0a0a0a` |
| Fondo tarjeta | `rgba(255,255,255,0.9)` | `rgba(255,255,255,0.04)` |
| Texto primario | `#111111` | `#f5f5f5` |
| Texto secundario | `#444444` | `rgba(255,255,255,0.65)` |
| Borde | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.09)` |

## Tipografía

### Fuente principal
- **Museo Sans Rounded** (custom font)
- Weights: 100, 300, 500, 700, 900, 1000
- Cargada con `next/font/local`

### Escala tipográfica
- **H1 (Hero):** 48px, weight 700
- **H2 (Section):** 36px, weight 700
- **H3 (Subsection):** 28px, weight 600
- **Body:** 16px, weight 400
- **Small:** 14px, weight 400
- **Micro:** 12px, weight 300

## Componentes y patrones

### Grid de herramientas
- **Desktop (>1200px):** 4 columnas
- **Tablet (768-1200px):** 3 columnas
- **Mobile (<768px):** 1 columna
- **Gap:** 1.5rem entre items

### Tarjeta de herramienta (ToolCard)
```
┌─────────────────────────┐
│  🔧 Icon                 │
│                          │
│  Nombre de herramienta   │
│                          │
│  Descripción corta de    │
│  qué hace esta tool...   │
│                          │
│  [categoría] [status]    │
│                          │
│  [Abrir herramienta]     │
└─────────────────────────┘
```

**Estados:**
- **Normal:** Borde sutil, hover levanta tarjeta
- **Hover:** Sombra, borde rojo, transform up
- **Coming Soon:** Deshabilitado, opacidad 0.6
- **Deprecated:** Oculto del frontend

### Topbar
```
[Logo Mirai] [Espacio]  [Selector idioma] [Toggle tema]
```

**Altura:** 72px
**Backdrop blur:** 16px
**Sticky:** Fixed top
**Z-index:** 100

## Principios de diseño

### 1. Claridad
- Información clara y directa
- Jerarquía visual evidente
- Sin clutter

### 2. Consistencia
- Espacios uniformes
- Colores usados consistentemente
- Interacciones predecibles

### 3. Accesibilidad
- Contraste WCAG AA mínimo
- Elementos grandes para click (44x44px min)
- Navegación por teclado funcional
- ARIA labels para screen readers

### 4. Responsividad
- Mobile-first
- Fluido en todos los tamaños
- Touch-friendly en móvil

### 5. Performance
- Animaciones smooth (60fps)
- Transiciones suaves (0.2s-0.4s)
- Iconos SVG (Lucide React)

## Checklist de diseño

### Visual
- [ ] Colores siguen paleta brand
- [ ] Tipografía consistente
- [ ] Espacios (padding/margin) son múltiplos de 0.5rem
- [ ] Alineación perfecta (grid/flexbox)
- [ ] Sombras sutiles, no overdone
- [ ] Bordes con color brand-red en hover

### Interacción
- [ ] Botones tienen hover state
- [ ] Transiciones suaves (no jarring)
- [ ] Estados de deshabilitado claros
- [ ] Feedback visual immediate (loading, success, error)

### Accesibilidad
- [ ] Contraste mínimo 4.5:1 en texto
- [ ] Elementos clickeables ≥44x44px
- [ ] Navegación por teclado Tab funciona
- [ ] Labels en formularios/inputs
- [ ] Alt text en imágenes
- [ ] ARIA live regions para cambios dinámicos

### Responsive
- [ ] Mobile (320px) sin scroll horizontal
- [ ] Tablet (768px) se ve bien
- [ ] Desktop (1200px) usa espacio correctamente
- [ ] Touch targets suficientemente grandes en móvil

## Temas (Dark/Light Mode)

### Light Mode (Default)
- Fondo: Blanco suave `#f6f6f7`
- Texto: Negro oscuro `#111111`
- Tarjetas: Blanco `#ffffff`
- Bordes: Gris claro

**Sensación:** Limpio, profesional, moderno

### Dark Mode
- Fondo: Negro puro `#0a0a0a`
- Texto: Blanco suave `#f5f5f5`
- Tarjetas: Gris oscuro transparente `rgba(255,255,255,0.04)`
- Bordes: Gris oscuro

**Sensación:** Elegante, sofisticado, moderno

### Transición entre temas
- Duración: 0.3s
- Easing: ease
- Sin parpadeos
- Todos los elementos de transición

## Iconografía

**Librería:** Lucide React (v0.474.0)
**Tamaño:** 24-32px en tarjetas
**Color:** Heredado del texto
**Estilo:** Stroke (no fill)

Iconos usados actualmente:
- Settings → Core Tools
- Database → Extranet
- Link → Forwarder
- Calculator → Clamp
- Paintbrush → CSS Sorter
- FormInput → Form Generator
- ImagePlus → Image Generator
- Code → XML Parser
- ShieldAlert → Audit Checker
- ArrowRightLeft → Redirection
- Image → Image Resizer

## Mejoras de diseño futuras

### Corto plazo
- [ ] Page de detalle de herramienta con descripciones expandidas
- [ ] Página de categoría (ver todas las tools de una categoría)
- [ ] Animación de entrada al cargar grid

### Mediano plazo
- [ ] Imágenes/logos por herramienta
- [ ] Screenshots en página de detalle
- [ ] Búsqueda visual con preview
- [ ] Historial de visualización

### Largo plazo
- [ ] Modo personalizado (favoritos)
- [ ] Recomendaciones
- [ ] Animaciones micro-interactions mejoradas
- [ ] Tema color system (más allá de dark/light)

## Recursos

### Documentación de componentes
- `src/components/Header.tsx` — Topbar
- `src/components/ToolsGrid.tsx` — Grid + Filtros
- `src/components/ToolCard.tsx` — Tarjeta individual
- `src/app/globals.css` — Estilos globales

### Variables CSS disponibles
Ver `src/app/globals.css`:
- Brand colors: `--brand-red`, `--brand-white`, etc.
- Category colors: `--cat-integration`, `--cat-layout`, etc.
- Semantic: `--bg-main`, `--text-primary`, `--border-card`
- Layout: `--topbar-height`

## Design System

Mirai Suite usa un **design system minimalista**:
- Colores limitados
- Tipografía simple (una fuente)
- Espaciado predecible
- Componentes reutilizables
- Responsivo desde el inicio

**Filosofía:** Menos es más. Limpidez y funcionalidad primero.

---

**Última actualización:** Abril 2026
