# i18n Specialist / Translation Expert 🌍

## Rol y responsabilidades

Especialista en **internacionalización y multiidioma** de **Mirai Suite**. Experto en:
- Gestión de traducciones en 5 idiomas
- Payload CMS localización
- Coherencia terminológica
- Calidad de traducción
- Fallback language management

## Idiomas soportados

| Código | Idioma | Native | Speakers | Status |
|--------|--------|---------|----------|---------|
| `es` | Español | 🇪🇸 | 500M+ | ✓ Default |
| `en` | English | 🇬🇧 | 1.5B+ | ✓ Completo |
| `fr` | Français | 🇫🇷 | 300M+ | ✓ Completo |
| `ca` | Català | 🇦🇩 | 10M+ | ✓ Completo |
| `pt` | Português | 🇵🇹 | 250M+ | ✓ Completo |

**Fallback:** Si falta una traducción, vuelve a Español (es).

## Áreas de traducción

### 1. Contenido de herramientas (Payload CMS)
**Ubicación:** Admin panel → Tools collection

Campos a traducir por herramienta:
- `name` — Nombre de la herramienta
- `description` — Descripción breve

**Ejemplo:**
```
[Tool: Mirai Core Tools]
├─ ES: "Mirai Core Tools"
├─ EN: "Mirai Core Tools"
├─ FR: "Outils Core Mirai"
├─ CA: "Eines Core Mirai"
└─ PT: "Ferramentas Core Mirai"

[Descripción]
├─ ES: "Previsualiza tarifas, ajusta variables CSS..."
├─ EN: "Preview rates, adjust Core CSS variables..."
├─ FR: "Prévisualisez les tarifs, ajustez..."
├─ CA: "Previsualitza tarifes, ajusta..."
└─ PT: "Visualize tarifas, ajuste..."
```

### 2. Textos de UI (Código - translations.ts)
**Ubicación:** `src/i18n/translations.ts`

Textos que NO son contenido de herramientas:
- Títulos y subtítulos
- Etiquetas de botones
- Placeholders
- Mensajes
- Nombres de categorías
- Textos de estado

## Gestión de traducciones

### Proceso de traducción de nueva herramienta

1. **Frontend:**
   - Admin crea nueva herramienta en español
   - Rellena nombre y descripción en `es`

2. **Backend:**
   - Admin va a cada idioma (EN, FR, CA, PT)
   - Traduce nombre y descripción
   - Click "Save"

3. **Verificación:**
   - Frontend recarga
   - Verificar que cambiando idioma muestra traducción correcta

### Gestión en Payload CMS

Para agregar idiomas localizados:

```typescript
// En cada campo que queremos traduzca:
{
  name: 'name',
  type: 'text',
  localized: true,  // ← Esto lo hace localizable
  required: true,
  admin: {
    description: 'Traducir a todos los idiomas',
  },
}
```

### Gestión en código (translations.ts)

```typescript
const translations = {
  es: {
    ui: {
      heroTitle: "Bienvenido a Mirai Suite",
      subtitle: "Portal de herramientas internas",
      allCategories: "Todas las categorías",
      comingSoon: "Próximamente",
      deprecated: "Obsoleta",
      categories: {
        integration_core: "Integración & Core",
        layout_css: "Layout & CSS",
        content_elementor: "Contenido & Elementor",
        seo_audit: "SEO & Auditoría",
      },
    },
  },
  en: {
    ui: {
      heroTitle: "Welcome to Mirai Suite",
      subtitle: "Internal tools portal",
      allCategories: "All categories",
      comingSoon: "Coming Soon",
      deprecated: "Deprecated",
      categories: {
        integration_core: "Integration & Core",
        layout_css: "Layout & CSS",
        content_elementor: "Content & Elementor",
        seo_audit: "SEO & Audit",
      },
    },
  },
  // ... FR, CA, PT
}
```

## Glosario de términos

Para mantener consistencia, aquí están los términos clave traducidos:

### Herramientas
| Concepto | ES | EN | FR | CA | PT |
|----------|-----|-----|-----|-----|-----|
| Herramienta | Herramienta | Tool | Outil | Eina | Ferramenta |
| Portal | Portal | Portal | Portail | Portal | Portal |
| Admin | Admin | Admin | Admin | Admin | Admin |
| Categoría | Categoría | Category | Catégorie | Categoria | Categoria |
| Estado | Estado | Status | Statut | Estat | Status |

### Estados
| Concepto | ES | EN | FR | CA | PT |
|----------|-----|-----|-----|-----|-----|
| Activo | Activa | Active | Actif | Activa | Ativa |
| Próximamente | Próximamente | Coming Soon | Prochainement | Proximament | Em breve |
| Obsoleto | Obsoleta | Deprecated | Obsolète | Obsoleta | Descontinuada |

### UI
| Concepto | ES | EN | FR | CA | PT |
|----------|-----|-----|-----|-----|-----|
| Todos | Todos | All | Tous | Tot | Tudo |
| Filtrar | Filtrar | Filter | Filtrer | Filtrar | Filtrar |
| Abrir | Abrir | Open | Ouvrir | Obrir | Abrir |
| Cerrar | Cerrar | Close | Fermer | Tancar | Fechar |
| Guardar | Guardar | Save | Enregistrer | Guardar | Salvar |
| Borrar | Borrar | Delete | Supprimer | Eliminar | Deletar |
| Más | Más | More | Plus | Més | Mais |
| Menos | Menos | Less | Moins | Menys | Menos |

### Categorías
| Concepto | ES | EN | FR | CA | PT |
|----------|-----|-----|-----|-----|-----|
| Integración & Core | Integración & Core | Integration & Core | Intégration & Noyau | Integració & Core | Integração & Core |
| Layout & CSS | Layout & CSS | Layout & CSS | Mise en page & CSS | Maqueta & CSS | Layout & CSS |
| Contenido & Elementor | Contenido & Elementor | Content & Elementor | Contenu & Elementor | Contingut & Elementor | Conteúdo & Elementor |
| SEO & Auditoría | SEO & Auditoría | SEO & Audit | SEO & Audit | SEO & Auditoria | SEO & Auditoria |

## Checklist de traducción

### Antes de lancar una nueva herramienta

- [ ] **Nombre:**
  - [ ] ES: Gramática y ortografía correctas
  - [ ] EN: Naming consistente con otras tools
  - [ ] FR: Usar términos técnicos franceses
  - [ ] CA: Catalan correcto
  - [ ] PT: Portugués correcto

- [ ] **Descripción:**
  - [ ] ES: 1-2 frases, clara y concisa
  - [ ] EN: Traducción precisa, no literal
  - [ ] FR: Mantener tono profesional
  - [ ] CA: Catalan idiomático
  - [ ] PT: Portugués de Brasil o Portugal (consistente)

- [ ] **Categoría:** Usar valores estándar (nunca crear nuevos sin avisar)

- [ ] **Estado:** Correcto (active/coming_soon/deprecated)

- [ ] **Testing:**
  - [ ] Cambiar frontend a cada idioma
  - [ ] Verificar que aparece traducida
  - [ ] Sin caracteres rotos
  - [ ] Longitud razonable en UI

## Guidelines de traducción

### Español
- **Tono:** Formal pero accesible
- **Género:** Aunque sea herramienta (fem.), usar género natural
- **Acrónimos:** Mantener en inglés si es más conocido (CSS, SEO)
- **Ejemplos:** Core, Layout, Elementor → no traducir

### English
- **Tono:** Professional, technical
- **Capitalization:** Title Case para títulos
- **Términos técnicos:** Mantener exactos (CSS, JSON, etc.)
- **Ejemplos:** Keep brand names as-is

### Français
- **Tono:** Formal, académico
- **Género:** Usar género correcto de objeto
- **Acrónimos:** Traducir si existe equivalente (SEO → RCES)
- **Apóstrofes:** Usar correctamente (l'outil, d'Elementor)

### Català
- **Tono:** Formal, professional
- **Género:** Femenino para "eina" (herramienta)
- **Accentos:** Usar sempre (á, é, í, ó, ú)
- **Apostrofes:** Corrigue (l'eina, d'Elementor)

### Português
- **Tono:** Professional
- **Variante:** Portugués de Brasil (pt-BR) por defecto
- **Acentos:** Usar obligatoriamente
- **Pluales:** Consistente (s/es)

## Validación de traducciones

### Ortografía y gramática
- [ ] Sin errores de ortografía
- [ ] Conjugación verbal correcta
- [ ] Concordancia género/número correcto
- [ ] Puntuación adecuada

### Consistencia
- [ ] Términos iguales siempre traducidos igual
- [ ] Tono uniforme en idioma
- [ ] Longitud similar al original (máx ±20%)

### Técnica
- [ ] Sin caracteres especiales rotos
- [ ] Longitud cabe en UI (no overflow)
- [ ] Si hay variables placeholder: mantenerlas (`{foo}`)

### Localización
- [ ] Fechas en formato correcto
- [ ] Monedas si aplica
- [ ] Medidas/unidades si aplica

## Agregar nuevo idioma

Para agregar por ejemplo Italiano (it):

1. **En `payload.config.ts`:**
   ```typescript
   localization: {
     locales: ['es', 'en', 'fr', 'ca', 'pt', 'it'],
     defaultLocale: 'es',
     fallback: true,
   }
   ```

2. **En `translations.ts`:**
   ```typescript
   const translations = {
     // ... otros
     it: {
       ui: {
         heroTitle: "Benvenuto a Mirai Suite",
         // ...
       },
     },
   }
   ```

3. **En `Header.tsx`:**
   Agregar opción al selector:
   ```typescript
   <option value="it">Italiano</option>
   ```

4. **Reiniciar servidor:**
   ```bash
   npm run dev
   ```

## Comandos útiles

```bash
npm run dev    # Cambios en translations se hot-reload
```

## Recursos

### Archivos clave
- `src/i18n/translations.ts` — Textos UI en 5 idiomas
- `src/collections/Tools.ts` — Colección con campos localizados
- `src/components/Header.tsx` — Selector de idioma
- `src/app/(frontend)/layout.tsx` — Detección de idioma

### Variables importantes
```typescript
// Header.tsx
const language = localStorage.getItem('language') || 'es'

// Server (layout.tsx)
const language = cookies().get('language')?.value || 'es'

// Para cambiar idioma:
localStorage.setItem('language', 'en')
document.cookie = 'language=en'
```

---

**Última actualización:** Abril 2026
