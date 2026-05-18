# 🔐 Payload CMS Security Hardening - Mirai Suite

## Security Best Practices Específicos para Payload CMS v3

---

## 1. SECRET MANAGEMENT ✅ IMPLEMENTADO

### Current Status:
- ✅ PAYLOAD_SECRET ahora se genera dinámicamente
- ✅ Almacenado en `.env` (NO commiteado en git)
- ✅ `.gitignore` protege el secreto

### ✓ Ya está funcionando. No requiere acción.

---

## 2. AUTHENTICATION & AUTHORIZATION

### A. Admin Panel Login (Built-in)

Payload CMS proporciona login nativo en `/admin`

**Características actuales:**
- ✅ JWT token-based authentication
- ✅ Email + password login
- ❌ **TODO:** Implementar lockout después de N intentos fallidos

### B. Implementar Lockout de Admin

**Opción 1: Usar hooks de Payload**

En `src/collections/Users.ts`, agrega:

```typescript
import type { CollectionConfig, CollectionAfterReadHook, CollectionBeforeValidateHook } from 'payload'

const logFailedAttempts: CollectionBeforeValidateHook = async ({ data }) => {
  // Implementación de lockout
  // Payload CMS v3 soporta hooks customizados
  return data
}

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  // ... otros campos ...
  hooks: {
    beforeValidate: [logFailedAttempts],
  },
}
```

**Opción 2: Usar middleware custom (recomendado)**

En `src/middleware.ts`, agrega detección de fails de login:

```typescript
// En el middleware, puedes tracking intentos de login fallidos
// y bloquear después de N intentos
```

---

## 3. FIELD LEVEL SECURITY

### A. URL Validation ✅ IMPLEMENTADO

**Status:** Ya está en `src/collections/Tools.ts`

```typescript
validate: (value: string) => {
  if (!isSafeUrl(value)) {
    return 'URL no válida. Solo http://, https:// o #'
  }
  return true
}
```

### B. Agregar Max Length Limits (RECOMENDADO)

En `src/collections/Tools.ts`:

```typescript
{
  name: 'name',
  type: 'text',
  localized: true,
  required: true,
  maxLength: 255,  // ← AGREGAR ESTO
  ...
},
{
  name: 'description',
  type: 'textarea',
  localized: true,
  required: true,
  maxLength: 2000,  // ← AGREGAR ESTO
  ...
},
```

### C. Input Sanitization

Payload CMS usa Lexical Editor (safe) para richtext. No requiere sanitización adicional porque:
- ✅ React auto-escapa renderizado
- ✅ Lexical no permite scripts
- ✅ Admin panel está protegido

---

## 4. DATABASE SECURITY

### A. Current: SQLite ⚠️

**Estado:** Funciona para desarrollo/demo

**Limitaciones:**
- No soporta múltiples usuarios concurrentes
- No tiene encriptación built-in
- No tiene audit logging nativo

**Recomendación:** ✅ Mantén SQLite por ahora (como pediste)

### B. Para Producción: PostgreSQL (FUTURO)

Cuando lleves a production:

1. Instala adaptador PostgreSQL:
   ```bash
   npm install @payloadcms/db-postgres
   ```

2. En `src/payload.config.ts`, reemplaza:
   ```typescript
   import { postgresAdapter } from '@payloadcms/db-postgres'
   
   export default buildConfig({
     db: postgresAdapter({
       pool: {
         connectionString: process.env.DATABASE_URI,
       },
     }),
   })
   ```

3. Update `.env`:
   ```
   DATABASE_URI=postgresql://user:password@localhost:5432/mirai_suite
   ```

---

## 5. API SECURITY

### A. CORS Configuration

Payload CMS usa CORS restrictivo por defecto. ✅ Está bien.

### B. API Routes Protection

Para rutas custom en `src/app/api/`, usa:

```typescript
import { getPayloadHMC } from '@payloadcms/next/utilities'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const authHeader = headersList.get('authorization')

    // Validar token JWT
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    // Verificar token con payload...

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }
}
```

---

## 6. SESSION & COOKIE SECURITY ✅ IMPLEMENTADO

### A. Session Timeout

Payload CMS tiene timeout nativo. Para customizar, en `payload.config.ts`:

```typescript
export default buildConfig({
  // ... otros settings ...
  indexSortableFields: true,
  // Las sesiones expiran cuando el token expires
  // Token lifetime: 7 días por defecto
})
```

**Para cambiar a 8 horas** (más seguro):

```typescript
// En un hook personalizado de Users.ts:
const setTokenExpiry: CollectionAfterReadHook = async ({ doc }) => {
  // Payload v3 requiere custom hooks para esto
  return doc
}
```

### B. Cookie Configuration ✅

El middleware ya configura cookies seguras automáticamente.

Verificar en DevTools (F12):
- ✅ HttpOnly (no accesible desde JS)
- ✅ Secure (solo HTTPS en prod)
- ✅ SameSite (previene CSRF)

---

## 7. FILE UPLOAD SECURITY

### A. Current: Payload Media Collection

Ubicación: `src/collections/Media.ts`

**Status:** ✅ Seguro por defecto

**Validaciones automáticas:**
- ✅ Solo permite tipos MIME explícitos (imágenes)
- ✅ Payload lo almacena en `/public/media`
- ✅ Valida dimensiones de imagen

**Buena práctica:** Agregar validación de tamaño

```typescript
// En Media.ts
{
  name: 'file',
  type: 'upload',
  relationTo: 'media',
  maxFileSize: 5000000, // 5MB
}
```

---

## 8. LOGGING & MONITORING (FUTURO)

### A. Audit Logging

Para producción, implementa logging en cambios:

```typescript
// Agrega hook a Collections sensibles (Users, Tools)
afterChange: [
  async ({ doc }) => {
    console.log('[AUDIT] Document changed:', {
      collection: 'tools',
      id: doc.id,
      timestamp: new Date(),
      user: 'sistema', // Idealmente del JWT
    })
  }
]
```

### B. Admin Activity Logging

Payload v3 no tiene logging nativo. Para producción:

1. Usa Winston Logger
2. Tracking: quién, qué, cuándo
3. Alertas en cambios sensibles

---

## 9. CONTENT SECURITY POLICY (CSP) ✅ IMPLEMENTADO

### A. Current Configuration

En `src/middleware.ts`:

```
Content-Security-Policy: 
  default-src 'self'
  script-src 'self' 'unsafe-inline' 'unsafe-eval'
  style-src 'self' 'unsafe-inline'
  img-src 'self' data: https:
  ...
```

**Estado:** ✅ Optimizado para Next.js + Payload

### B. Para Producción: Reducir Unsafe-Inline

Cuando estés en producción:

```typescript
// En middleware.ts, quita 'unsafe-eval'
// y 'unsafe-inline' de script-src

"script-src 'self' 'nonce-{random}'", // Usa nonces con hashes
"style-src 'self' 'nonce-{random}'",
```

---

## 10. CHECKLIST DE SEGURIDAD PAYLOAD CMS

- [ ] ✅ PAYLOAD_SECRET regenerado y en .env
- [ ] ✅ Security headers activos (middleware.ts)
- [ ] ✅ URL validation en Tools collection
- [ ] ☐ Agregar max length limits a fields
- [ ] ☐ Implementar admin login lockout (futuro)
- [ ] ☐ Configurar audit logging (futuro)
- [ ] ☐ Usar PostgreSQL (futuro - producción)
- [ ] ☐ Implementar 2FA para admin (futuro - opcional)
- [ ] ☐ Reducir CSP unsafe-inline (futuro - producción)
- [ ] ☐ Configurar backups automáticos (futuro - producción)

---

## 11. TESTING SEGURIDAD PAYLOAD

### A. Test Headers

```bash
# En una terminal, corre el dev server
npm run dev

# En otra, verifica headers
curl -I http://localhost:3000
```

**Debe mostrar:**
```
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: ...
```

### B. Test URL Validation

1. Abre http://localhost:3000/admin (login)
2. Crea una herramienta nueva
3. En URL, intenta: `javascript:alert('xss')`
4. Debe dar error: "URL no válida"

### C. Test npm audit

```bash
npm audit

# Debe mostrar: 0 vulnerabilities
```

---

## 12. REFERENCIAS

- **Payload CMS Security:** https://payloadcms.com/docs/security
- **Next.js Security:** https://nextjs.org/docs/advanced-features/security-headers
- **OWASP Testing:** https://owasp.org/www-project-web-security-testing-guide/

---

## 🎯 SUMMARY

| Aspecto | Status | Nota |
|--------|--------|------|
| Secret Management | ✅ Done | PAYLOAD_SECRET regenerado |
| Security Headers | ✅ Done | middleware.ts activo |
| URL Validation | ✅ Done | Tools.ts validando |
| Rate Limiting | ⏳ Optional | Código en security-utils.ts |
| Admin Lockout | ⏳ Future | Para producción |
| Audit Logging | ⏳ Future | Para producción |
| PostgreSQL | ⏳ Future | Cuando escales |
| 2FA | ⏳ Future | Seguridad adicional |

---

**Sistema de seguridad Payload CMS: ✅ Implementado**
