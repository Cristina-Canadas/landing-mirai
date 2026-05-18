# 🔒 Guía de Uso — Security Engineer

## Quick Start

```bash
# Ejecutar auditoría de seguridad completa
npm run security:audit

# Chequear vulnerabilidades de npm
npm run security:check

# Auto-fix vulnerabilidades (cuidado!!)
npm run security:fix
```

## Descripciones detalladas

### 1. `npm run security:audit`
**Script:** `src/scripts/security-audit.ts`

Ejecuta una auditoría completa de seguridad que incluye:

#### ✓ Escaneo de dependencias
- Lee output de `npm audit`
- Categoriza por severidad (critical, high, medium, low)
- Sugiere fixes

#### ✓ Validación de secrets
- Verifica que `.env` existe
- Verifica que `.env` está en `.gitignore`
- Escanea git history en busca de secrets
- Detecta valores por defecto inseguros

#### ✓ Headers de seguridad
- Busca middleware con headers
- Valida presencia de:
  - `Strict-Transport-Security`
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Content-Security-Policy`

#### ✓ Variables de entorno
- Verifica que existen todas las requeridas
- Detesta valores por defecto peligrosos
- Valida formato correcto

#### ✓ Configuración Payload
- Verifica autenticación del admin
- Detecta SQLite (OK dev, warning prod)
- Valida colecciones seguras

#### ✓ Patrones inseguros en código
- Busca `eval()`
- Detecta `dangerouslySetInnerHTML` sin sanitización
- Encuentra `@ts-ignore` abusivos
- Identifica accesos dinámicos a `process.env`

**Output:**
```
🔒 SECURITY AUDIT — Mirai Suite

✅ Todas las dependencias están seguras
✅ No se encontraron secrets expuestos
❌ Headers de seguridad faltantes (3 issues)
✅ Variables de entorno configuradas correctamente
✅ Configuración de Payload es segura
✅ No se encontraron patrones inseguros

📊 RESUMEN
Total de vulnerabilidades: 3
  🔴 Críticas:  0
  🟠 Altas:     1
  🟡 Medias:    2
  🔵 Bajas:     0
  ⚪ Info:      0

📄 Reporte guardado en: security-audit-report.json
```

**Reporte JSON:**
```json
{
  "timestamp": "2026-04-13T10:00:00Z",
  "projectName": "Mirai Suite",
  "summary": {
    "total": 3,
    "critical": 0,
    "high": 1,
    "medium": 2,
    "low": 0,
    "info": 0
  },
  "vulnerabilities": [
    {
      "severity": "high",
      "type": "missing-header",
      "message": "Header de seguridad faltante: Strict-Transport-Security",
      "fix": "Configurar HSTS en next.config.ts o middleware"
    }
  ]
}
```

### 2. `npm run security:check`
**Comando:** `npm audit --audit-level=moderate`

Escanea vulnerabilidades de npm sin automatizar fixes.

**Output:**
```
npm WARN deprecated <package>@1.0.0: reason

found 5 vulnerabilities (2 moderate, 3 low)
run `npm audit fix` to fix them, or `npm audit fix --force` to install breaking changes
```

### 3. `npm run security:fix`
**Comando:** `npm audit fix && npm audit fix --force`

Intenta auto-arreglar vulnerabilidades.

⚠️ **Ten cuidado:** Puede instalar breaking changes. Siempre testea después:

```bash
npm run security:fix
git diff package.json
npm test
```

---

## Cómo usar Security Checker (en código)

### Validar contraseña
```typescript
import { validatePassword } from '@/scripts/security-checker'

const result = validatePassword(userInput)
if (!result.valid) {
  console.error('Contraseña débil:', result.errors)
}
```

### Sanitizar input
```typescript
import { sanitizeInput } from '@/scripts/security-checker'

const clean = sanitizeInput(userInput)
db.insert({ name: clean })
```

### Validar email
```typescript
import { validateEmail } from '@/scripts/security-checker'

if (!validateEmail(email)) {
  throw new Error('Email inválido')
}
```

### Verificar URL segura
```typescript
import { isSafeUrl } from '@/scripts/security-checker'

if (isSafeUrl(externalUrl)) {
  window.location.href = externalUrl
}
```

---

## Headers de seguridad requeridos

Para implementarlos, agregar en `src/middleware.ts`:

```typescript
import { type NextResponse } from 'next/server'
import { SECURITY_HEADERS } from '@/scripts/security-checker'

export function middleware(request: React.NextRequest): NextResponse {
  const response = NextResponse.next()

  // Agregar headers de seguridad
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: ['/:path*'],
}
```

---

## Integración en CI/CD

### GitHub Actions
```yaml
# .github/workflows/security.yml
name: Security Audit

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run security:audit
      - run: npm run security:check
```

### Pre-commit hook
```bash
# Instalar husky
npm install husky --save-dev
npx husky install

# Crear hook
npx husky add .husky/pre-commit 'npm run security:check'
```

### Docker
```dockerfile
# Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Security check
RUN npm run security:check

COPY . .
RUN npm run build
```

---

## Mejores prácticas de seguridad

### 1. Nunca commitear `.env`
```bash
# .gitignore
.env
.env.local
.env.*.local
```

### 2. Usar variables de entorno
```typescript
// ✅ CORRECTO
const secret = process.env.PAYLOAD_SECRET

// ❌ INCORRECTO
const secret = "hardcoded-secret"
```

### 3. Sanitizar inputs
```typescript
// ✅ CORRECTO
const clean = sanitizeInput(userInput)

// ❌ INCORRECTO
const clean = userInput
```

### 4. Validar en servidor
```typescript
// ✅ CORRECTO - validar en servidor
if (!validateEmail(email)) {
  return { error: 'Invalid email' }
}

// ❌ INCORRECTO - solo validación frontend
// <input type="email" />
```

### 5. Usar HTTPS
```typescript
// ✅ CORRECTO
const isSecure = req.protocol === 'https'

// ❌ INCORRECTO
fetch('http://api.example.com')
```

### 6. Proteger endpoints
```typescript
// ✅ CORRECTO
export async function POST(req: Request) {
  if (!req.user?.isAdmin) {
    return new Response('Unauthorized', { status: 401 })
  }
  // ...
}
```

### 7. No exponer errores
```typescript
// ✅ CORRECTO
catch (error) {
  return { error: 'Internal server error' }  // Sin detalles
}

// ❌ INCORRECTO
catch (error) {
  return { error: error.message, stack: error.stack }  // Expone info
}
```

---

## Checklist pre-deployment a Producción

```
DEPENDENCIAS
☐ npm run security:check sin críticos/altos
☐ npm audit fix exitoso (si es necesario)
☐ package-lock.json actualizado

SECRETS
☐ .env configurado con valores reales
☐ PAYLOAD_SECRET es seguro (>32 chars, random)
☐ DATABASE_PASSWORD es fuerte
☐ .env está en .gitignore
☐ .env no está en git history

HEADERS
☐ Middleware con SECURITY_HEADERS
☐ HTTPS habilitado
☐ HSTS configurado

AUTH
☐ Admin tiene contraseña fuerte
☐ JWT_SECRET es seguro
☐ Session timeout configurado

DATABASE
☐ PostgreSQL (no SQLite)
☐ Backups configurados
☐ SSL/TLS en conexión

CÓDIGO
☐ npm run lint sin errores
☐ TypeScript strict
☐ No hay hardcoded secrets
☐ Inputs validados (server-side)

INFRAESTRUCTURA
☐ Rate limiting activo
☐ DDoS protection
☐ Firewall configurado
☐ Updates automáticos de seguridad
```

---

## Recursos adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Next.js Security](https://nextjs.org/docs/basic-features/security)
- [Payload CMS Security](https://payloadcms.com/docs/security)

---

**Última actualización:** Abril 2026
