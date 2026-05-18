# 🚨 IMMEDIATE ACTIONS — Security Fixes

## 1. Cambiar PAYLOAD_SECRET (CRÍTICO)

**Problema:** El .env usa valor por defecto conocido

```bash
# 1. Generar secret aleatorio
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Output ejemplo:
# Fx7K9mN2PqL8vW4xZ1aB5cD6eF3gH0jK2lM9nO4pQ7rS=

# 2. Actualizar .env
PAYLOAD_SECRET=Fx7K9mN2PqL8vW4xZ1aB5cD6eF3gH0jK2lM9nO4pQ7rS=

# 3. Reiniciar servidor
npm run dev
```

---

## 2. Agregar Security Headers (CRÍTICO)

**Crear archivo:** `src/middleware.ts`

```typescript
import type { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const securityHeaders = [
  ['Strict-Transport-Security', 'max-age=31536000; includeSubDomains'],
  ['X-Content-Type-Options', 'nosniff'],
  ['X-Frame-Options', 'DENY'],
  ['X-XSS-Protection', '1; mode=block'],
  [
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  ],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['Permissions-Policy', 'geolocation=(), microphone=(), camera=()'],
  ['X-DNS-Prefetch-Control', 'off'],
  ['X-Download-Options', 'noopen'],
]

export function middleware(request: NextRequest): NextResponse {
  const response = NextResponse.next()

  securityHeaders.forEach(([header, value]) => {
    response.headers.set(header, value)
  })

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

**Verificar headers:**
```bash
curl -I http://localhost:3001
# Deberías ver los headers de seguridad
```

---

## 3. Ejecutar npm audit fix (CRÍTICO)

```bash
# 1. Ver vulnerabilidades
npm audit

# 2. Auto-fix
npm audit fix

# 3. Si necesario (cuidado, puede romper cosas)
npm audit fix --force

# 4. Verificar nuevamente
npm audit

# 5. Testear que todo funciona
npm run dev
```

---

## 4. Validación de URLs en Tools (ALTA)

**Archivo:** `src/collections/Tools.ts`

Agregar validación al campo `url`:

```typescript
{
  name: 'url',
  type: 'text',
  required: true,
  defaultValue: '#',
  validate: (value: string) => {
    // Permitir "#" para herramientas sin URL
    if (value === '#') return true
    
    try {
      const url = new URL(value)
      const dangerousProtocols = ['javascript:', 'data:', 'vbscript:']
      
      if (dangerousProtocols.includes(url.protocol)) {
        return 'Protocol no permitido. Use http:// o https://'
      }
      
      return true
    } catch {
      return 'URL inválida. Ejemplo: https://ejemplo.com'
    }
  },
  admin: {
    description: 'URL de la herramienta. Usar "#" si aún no está disponible.',
  },
}
```

---

## 5. Agregar Max Length a campos (MEDIA)

**Archivo:** `src/collections/Tools.ts`

```typescript
{
  name: 'name',
  type: 'text',
  localized: true,
  required: true,
  maxLength: 255,
  admin: {
    description: 'Nombre de la herramienta (traducido por idioma)',
  },
},

{
  name: 'description',
  type: 'textarea',
  localized: true,
  required: true,
  maxLength: 2000,
  admin: {
    description: 'Descripción breve de la herramienta (traducida por idioma)',
  },
},
```

---

## 6. Configurar Session Timeout (ALTA)

**Archivo:** `src/payload.config.ts`

```typescript
export default buildConfig({
  // ... resto de config
  
  // Session configuration
  session: {
    secret: process.env.PAYLOAD_SECRET || 'session-secret',
    expiration: 60 * 60 * 24 * 7, // 7 días
    absolute: 60 * 60 * 24 * 30, // 30 días máximo
  },

  admin: {
    user: 'users',
    // ... resto
  },
})
```

---

## 7. Logging de Auditoría (MEDIA)

**Crear archivo:** `src/plugins/audit-logging.ts`

```typescript
import type { Config } from 'payload'

export const auditLoggingPlugin = () => (config: Config) => {
  return {
    ...config,
    hooks: {
      afterOperation: [
        async ({ operation, result, req }) => {
          // Log solo operaciones Admin
          if (req?.user && operation !== 'read') {
            const timestamp = new Date().toISOString()
            const action = {
              timestamp,
              operation,
              userId: req.user?.id,
              userEmail: req.user?.email,
              collection: result?.collection,
              docId: result?.id,
              method: req?.method,
              path: req?.path,
            }
            
            // En producción, enviar a Sentry o logging service
            console.log('[AUDIT]', JSON.stringify(action))
          }
        },
      ],
    },
  }
}

// En payload.config.ts:
import { auditLoggingPlugin } from './plugins/audit-logging'

export default buildConfig({
  // ...
  plugins: [auditLoggingPlugin()],
})
```

---

## 8. Fortalecer Validación Users (MEDIA)

**Archivo:** `src/collections/Users.ts`

```typescript
import type { CollectionConfig } from 'payload'

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    passwordMinLength: 12,
    lockTime: 60 * 60 * 1000, // Lockout 1 hora después de 5 intentos fallidos
    maxLoginAttempts: 5,
  },
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 255,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    // Password es manejado automáticamente por Payload auth
  ],
}
```

---

## 9. Configurar .env.production (PREPARE PARA PROD)

**Crear archivo:** `.env.production`

```env
NODE_ENV=production
PUBLIC_SITE_URL=https://yourdomain.com

# Secrets - CAMBIAR EN PRODUCCIÓN
PAYLOAD_SECRET=<tu-secret-aleatorio>
DATABASE_URI=postgresql://user:password@host:5432/mirai_suite
JWT_SECRET=<tu-jwt-secret-aleatorio>

# URLs
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

---

## 10. Checklist de Verificación

```bash
# 1. Security Headers instalados
curl -I http://localhost:3001 | grep -i "Strict-Transport"

# 2. npm audit limpio
npm audit
# No debe haber "critical" o "high"

# 3. PAYLOAD_SECRET cambiado
grep "mirai-suite-dev" .env
# No debe encontrar el valor por defecto

# 4. Middleware.ts existe
test -f src/middleware.ts && echo "OK" || echo "FALTA"

# 5. TypeScript limpio
npm run lint

# 6. Servidor funciona
npm run dev
# Debería arrancar sin errores
```

---

## 📅 ORDEN DE INSTALACIÓN

```bash
1. npm audit fix
   ↓
2. Creación de src/middleware.ts
   ↓
3. Cambiar PAYLOAD_SECRET
   ↓
4. Reiniciar servidor (npm run dev)
   ↓
5. Validación de URLs en Tools.ts
   ↓
6. Agregar max length en campos
   ↓
7. Configurar session timeout
   ↓
8. Test de todo
   ↓
9. Actualizar .env.production (para después)
   ↓
10. Commit y push
```

---

## ✅ VERIFICATION

Después de hacer los cambios:

```bash
# 1. Compilar TypeScript
npx tsc --noEmit

# 2. Run linter
npm run lint

# 3. Iniciar dev
npm run dev

# 4. Verificar headers
curl -I http://localhost:3001
# Deberías ver Strict-Transport-Security, X-Frame-Options, etc.

# 5. Verificar admin
# - Abre http://localhost:3001/admin
# - Login con credentials
# - Crear herramienta con URL inválida para probar validación

# 6. Verificar npm audit
npm audit
# Idealmente: 0 high/critical vulnerabilities
```

---

## ⚠️ ADVERTENCIAS

❌ **NO HACER:**
- No commitear .env con secrets reales
- No usar valores por defecto en producción
- No ignorar vulnerabilidades "high"
- No saltarse validación de inputs

✅ **SÍ HACER:**
- Revisar cada cambio antes de deploy
- Testea en staging antes de producción
- Mantén secrets en variables de entorno
- Usa HTTPS en producción
- Realiza auditorías periódicas

---

**Tiempo estimado:** 1-2 horas de implementación + testing

**Soporte:** Si necesitas help, revisar SECURITY-GUIDE.md
