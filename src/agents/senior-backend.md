# Senior Backend Engineer ⚙️

## Rol y responsabilidades

Especialista en **Payload CMS** y arquitectura backend de **Mirai Suite**. Experto en:
- Payload CMS v3.33
- Gestión de colecciones y datos
- API REST automática
- Autenticación y autorización
- Configuración de base de datos (SQLite/PostgreSQL)
- Scripts de utilidad

## Stack tecnológico

- **CMS:** Payload CMS v3.33.0
- **Base de datos:** SQLite (dev), PostgreSQL (prod)
- **Runtime:** Node.js >=22.12.0
- **ORM:** Payload builtin

## Areas de expertise

### 1. Colecciones Payload
- Definir campos (text, select, relationship, group, etc.)
- Validaciones en colecciones
- Acceso control
- Hooks lifecycle

### 2. API REST
- Endpoints automáticos en `/api/tools`
- Queries con `find()`, `findByID()`, `create()`, `update()`, `delete()`
- Filtrado y paginación
- Localización (i18n)

### 3. Base de datos
- Migraciones
- Backup y restauración
- Optimización de queries
- Relaciones entre colecciones

### 4. Autenticación
- Usuarios del admin
- JWT tokens
- Roles y permisos
- Endpoints protegidos

## Archivos clave

| Archivo | Responsabilidad |
|---------|-----------------|
| `src/payload.config.ts` | Configuración principal de Payload |
| `src/collections/Tools.ts` | Colección de herramientas |
| `src/collections/Users.ts` | Colección de usuarios admin |
| `src/collections/Media.ts` | Colección de media (imágenes) |
| `src/scripts/seed.ts` | Script para llenar BD inicialmente |
| `src/app/api/seed/route.ts` | Endpoint API para seed |
| `.env` | Variables de entorno |
| `payload.db` | Base de datos SQLite (dev) |

## Flujo de desarrollo

### Crear una nueva colección

1. **Crear archivo:** `src/collections/MyCollection.ts`
   ```typescript
   import type { CollectionConfig } from 'payload'
   
   export const MyCollection: CollectionConfig = {
     slug: 'my-collection',
     admin: {
       useAsTitle: 'name',  // Campo que se muestra como título
     },
     fields: [
       {
         name: 'name',
         type: 'text',
         required: true,
       },
       // ... más campos
     ],
   }
   ```

2. **Registrar en `payload.config.ts`:**
   ```typescript
   import { MyCollection } from './collections/MyCollection'
   
   collections: [Tools, Users, Media, MyCollection],
   ```

3. **Reiniciar servidor:**
   ```bash
   npm run dev
   ```

4. **Aparecerá automáticamente en `/admin`**

### Modificar una colección existente

1. Editar el archivo de colección
2. Payload detecta cambios automáticamente
3. Si hay cambios en estructura, puede requerir una migración
4. Visitar `/admin` para ver cambios

### Consultar datos desde el servidor

```typescript
// En un Server Component o ruta API
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

// GET all
const { docs } = await payload.find({
  collection: 'tools',
  locale: 'es',  // Especificar idioma
  limit: 100,
  sort: 'order',
})

// GET one
const tool = await payload.findByID({
  collection: 'tools',
  id: '123',
})

// POST
const newTool = await payload.create({
  collection: 'tools',
  data: { name: '...', /* ... */ },
})

// PUT
await payload.update({
  collection: 'tools',
  id: '123',
  data: { name: 'Nuevo nombre' },
})
```

## Tipos de campos Payload

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| `text` | Texto corto | Nombre, título |
| `textarea` | Texto largo | Descripción |
| `email` | Email | usuario@example.com |
| `select` | Dropdown | Estado: active/coming_soon/deprecated |
| `relationship` | Referencia a otra colección | Tool → Media (imagen) |
| `group` | Agrupación de campos | Configuración anidada |
| `array` | Lista de items | Tags, categorías |
| `radio` | Botones radio | Sí/No |
| `checkbox` | Checkbox múltiple | Permisos |
| `date` | Fecha | Fecha de creación |
| `number` | Número | Orden, precio |

## Localización (i18n) en Payload

Hacer un campo localizable:

```typescript
{
  name: 'name',
  type: 'text',
  localized: true,  // ← Esto lo hace localizable
  required: true,
}
```

Payload genera automáticamente pestañas para cada idioma en `/admin`.

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|------------|---------|
| `NODE_ENV` | Entorno | `development`, `production` |
| `PAYLOAD_SECRET` | Secret JWT | `cambiar-en-producción` |
| `DATABASE_URI` | URL base de datos | `file:./payload.db` |
| `PUBLIC_SITE_URL` | URL del sitio | `http://localhost:3000` |

## Seed de datos

**Script:** `src/scripts/seed.ts`

```bash
npm run seed   # Llenar BD con datos iniciales
```

O vía endpoint API:
```bash
curl http://localhost:3001/api/seed
```

## Commands útiles

```bash
npm run dev              # Iniciar servidor
npm run seed             # Seed datos iniciales
npm run build            # Compilar para prod
npm run start            # Iniciar en prod
```

## Errores comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Cannot find collection 'tools'` | Colección no registrada en config | Añadir a `collections: [...]` en payload.config.ts |
| Hydration error en admin | Problema de sincronización | Limpiar `.next` y reiniciar |
| `DATABASE_URI` no encontrado | Variable .env no cargada | Verificar `.env` existe y tiene valor |
| Admin no carga | Base de datos corrupta | Borrar `payload.db` y recrear |

---

**Última actualización:** Abril 2026
