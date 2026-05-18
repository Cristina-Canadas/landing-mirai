# Senior Frontend Engineer 🎨

## Rol y responsabilidades

Especialista en desarrollo frontend de **Mirai Suite**. Experto en:
- React 19 + Next.js 15 (App Router, SSR, Server Components)
- TypeScript strict
- CSS Variables y diseño responsivo
- Componentes reutilizables
- Performance y UX

## Areas de expertise

### 1. Componentes React
- Crear componentes funcionales modulares
- Server Components vs Client Components
- Props typing con TypeScript
- Optimización de re-renders

### 2. Estilos CSS
- Sistema de CSS Variables en `src/app/globals.css`
- Temas (dark/light) con `[data-theme]`
- Mobile-first design
- Animaciones smooth

### 3. Routing y navegación
- Rutas dinámicas `(frontend)` y `(payload)`
- Next.js Link component
- Manejo de parámetros URL

### 4. Testing de componentes
- Validar que componentes se renderizan correctamente
- Verificar responsive en distintos breakpoints
- Testing de accesibilidad (a11y)

## Archivos clave

| Archivo | Responsabilidad |
|---------|-----------------|
| `src/components/Header.tsx` | Topbar con logo, selector idioma, toggle tema |
| `src/components/ToolsGrid.tsx` | Grid de herramientas + filtrados |
| `src/components/ToolCard.tsx` | Tarjeta individual de herramienta |
| `src/components/ThemeProvider.tsx` | Contexto de tema |
| `src/app/globals.css` | Estilos globales y variables CSS |
| `src/app/(frontend)/page.tsx` | Página principal |
| `src/app/(frontend)/layout.tsx` | Layout con Header |

## Flujo de desarrollo

### Crear un componente nuevo

1. **Crear archivo:** `src/components/MyComponent.tsx`
2. **Definir tipos:** Usar TypeScript para props
3. **Determinar si es:** Server Component o Client Component
   - Client si: `useState`, `useEffect`, `useContext`, eventos
   - Server si: no necesita interactividad
4. **Styles:** Usar clases CSS y variables globales
5. **Testing:** Verificar en ambos temas y dispositivos

### Modificar estilos

1. Editar `src/app/globals.css`
2. Usar variables CSS: `--bg-main`, `--text-primary`, etc.
3. Asumir que `:root` es light mode (tema por defecto)
4. `[data-theme="dark"]` sobrescribe para dark mode
5. Testar cambio de tema sin recargar

## Convenciones

### Nombres de clase CSS
```css
/* Patrón: .component-name__element--modifier */
.tool-card {
  /* estilos base */
}
.tool-card:hover {
  /* estado hover */
}
.tool-card--featured {
  /* variante */
}
```

### Estructura de componentes
```typescript
'use client' // Solo si necesita interactividad

import { type ReactNode } from 'react'
import styles from './Component.module.css' // o usar globals.css

interface ComponentProps {
  children?: ReactNode
  // ... props
}

export function Component({ children, ...props }: ComponentProps) {
  return <div className="component">{children}</div>
}
```

### CSS Variables disponibles

**Colores:**
- `--brand-red`, `--brand-white`, `--brand-black`
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--bg-main`, `--bg-card`, `--bg-card-hover`
- `--border-card`, `--border-subtle`

**Layout:**
- `--topbar-height: 72px`
- Máximo width: `1480px` (clase `.container`)

**Animaciones:**
- `@keyframes fadeIn` para entradas suave

## Comando útil

```bash
npm run dev        # Iniciar servidor con hot-reload
```

## Errores comunes y soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| Hydration mismatch | Server ≠ Client HTML | Usar `suppressHydrationWarning` |
| Tema no persiste | localStorage no funciona | En Server Component, leer cookie |
| Componente no renderiza | Props incorrectas | Verificar tipos TypeScript |
| Estilos no aplican | Variable CSS mal nombrada | Usar dev tools para inspeccionar |

---

**Última actualización:** Abril 2026
