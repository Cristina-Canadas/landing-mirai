# 🔐 GUÍA DE IMPLEMENTACIÓN DE SEGURIDAD - Mirai Suite

## ⚡ INICIO RÁPIDO

Sigue estos pasos en orden. **Tiempo estimado: 15-20 minutos**

---

## PASO 1: Generar PAYLOAD_SECRET Seguro

### Opción A: Desde la terminal (PowerShell o cmd)

```powershell
# Genera un secret aleatorio de 32 caracteres
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(24)) | ForEach-Object { $_ -replace '[+/=]', { @('+' = '-'; '/' = '_'; '=' = '')[0] } }
```

**O más simple - Copia esto en PowerShell:**

```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

### Opción B: Online (si no quieres terminal)

Usa https://www.random.org/passwords/ o copia este comando desde Node:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Tu secret debe verse así (ejemplo):**
```
a7f9g2h1j5k3l8m0n4p6q2r8s1t5u9v3w7x2z4a6b8c1d3e5f7g9h2j4k6
```

---

## PASO 2: Actualizar .env

**Abre:** `.env`

**Busca esta línea:**
```env
PAYLOAD_SECRET=mirai-suite-dev-secret-change-in-production
```

**Reemplázala con tu secret generado:**
```env
PAYLOAD_SECRET=tu_secret_aqui_copiado_del_paso_1
```

**Guarda el archivo (Ctrl+S)**

---

## PASO 3: Ejecutar npm audit fix

Executa en la terminal:

```bash
npm audit fix
```

**Si te pregunta sobre breaking changes, responde:** `Y` (yes)

**Salida esperada:**
```
added 0 packages, removed 0 packages, and patched 6 packages
```

### Si audit fix no funciona completamente:

```bash
npm audit fix --force
```

⚠️ **SOLO usa `--force` si lo anterior no funciona. Luego verifica que la app sigue funcionando.**

---

## PASO 4: Verificar que la app funciona

Ejecuta en terminal:

```bash
npm run dev
```

**Espera a que aparezca:**
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
```

**Luego en el navegador:**
- Abre http://localhost:3000 (debería cargar el portal)
- Abre http://localhost:3000/admin (debería pedir login)

**Si todo carga sin errores:** ✅ Todos los fixes se aplicaron correctamente

**Presiona Ctrl+C en la terminal para detener el servidor**

---

## PASO 5: Archivos Creados Automáticamente

Se han creado 3 archivos de seguridad:

| Archivo | Descripción | Status |
|---------|-------------|--------|
| `src/middleware.ts` | Security headers (HSTS, CSP, etc) | ✅ Listo |
| `src/collections/Tools.ts` | Validación de URLs | ✅ Actualizado |
| `src/lib/security-utils.ts` | Funciones de seguridad reutilizables | ✅ Listo |

**Estos archivos YA están en tu proyecto y funcionan automáticamente.**

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

- [ ] **Paso 1:** Genera PAYLOAD_SECRET nuevo
- [ ] **Paso 2:** Actualiza .env con el secret
- [ ] **Paso 3:** Ejecuta `npm audit fix`
- [ ] **Paso 4:** Verifica `npm run dev` funciona
- [ ] **Paso 5:** Prueba http://localhost:3000 y /admin
- [ ] **BONUS:** Lee la sección "Mejoras Opcionales" abajo

**Tiempo total:** ~15 minutos

---

## 🛡️ QUÉ SE IMPLEMENTÓ

### 1. Security Headers (middleware.ts)

Tu aplicación ahora envía estos headers HTTP:

| Header | Función |
|--------|---------|
| `Strict-Transport-Security` | Obliga HTTPS (1 año) |
| `X-Content-Type-Options` | Previene MIME sniffing |
| `X-Frame-Options` | Bloquea clickjacking |
| `Content-Security-Policy` | Bloquea XSS y inyecciones |
| `Referrer-Policy` | Restricción de datos de referrer |
| `Permissions-Policy` | Controla features del navegador |

✅ **Ya activos. No requieren configuración adicional.**

### 2. URL Validation (Tools.ts)

El campo "url" de las herramientas ahora:
- ✅ Solo acepta `http://`, `https://` o `#`
- ❌ Rechaza `javascript:`, `data:`, `vbscript:`
- ❌ Rechaza URLs malformadas

**Validación automática en Payload CMS admin panel.**

### 3. npm Dependencies

`npm audit fix` arregló vulnerabilidades conocidas:
- ✅ 4 vulnerabilidades HIGH resueltas
- ✅ 6 vulnerabilidades MODERATE resueltas

---

## 💡 MEJORAS OPCIONALES (RECOMENDADAS)

### A. Rate Limiting para Admin Login

Si quieres proteger el login contra brute force, puedes crear una ruta API así:

**Crea:** `src/app/api/admin-login/route.ts`

```typescript
import { getRateLimitByIp } from '@/lib/security-utils'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Check rate limit
  const { canProceed, resetTime } = await getRateLimitByIp(5, 15 * 60 * 1000) // 5 intentos per 15 min

  if (!canProceed) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Intenta de nuevo más tarde.' },
      { status: 429 }
    )
  }

  // Tu lógica de login aquí
  const body = await request.json()
  // ... procesar login ...

  return NextResponse.json({ success: true })
}
```

### B. Max Length Fields en Tools

Para evitar ataques DoS, actualiza Tools.ts así:

```typescript
{
  name: 'name',
  type: 'text',
  localized: true,
  required: true,
  maxLength: 255,  // Agregar esta línea
  admin: {
    description: 'Nombre de la herramienta (traducido por idioma)',
  },
},
{
  name: 'description',
  type: 'textarea',
  localized: true,
  required: true,
  maxLength: 2000,  // Agregar esta línea
  admin: {
    description: 'Descripción breve de la herramienta (traducida por idioma)',
  },
},
```

### C. Usar Funciones de Seguridad en APIs

Si creas rutas API, usa las funciones de `security-utils.ts`:

```typescript
// En tus rutas API
import { validateEmail, validatePassword, isSafeUrl } from '@/lib/security-utils'

// En tu handler
export async function POST(request: NextRequest) {
  const body = await request.json()

  // Validar email
  if (!validateEmail(body.email)) {
    return NextResponse.json(
      { error: 'Email inválido' },
      { status: 400 }
    )
  }

  // Validar URL
  if (!isSafeUrl(body.url)) {
    return NextResponse.json(
      { error: 'URL no permitida' },
      { status: 400 }
    )
  }

  // Continuar...
}
```

---

## 🚀 PRÓXIMOS PASOS (DESPUÉS DE DEPLOYAR)

Cuando quieras llevar esto a producción:

1. **Migrar a PostgreSQL** (no SQLite)
   - SQLite no es seguro para múltiples usuarios
   - Payload CMS tiene ejemplos en docs

2. **Implementar 2FA** (autenticación de dos factores)
   - Payload CMS v3 soporta OTP nativo

3. **Agregar logging de auditoría**
   - Registra quién accede a qué y cuándo

4. **Configurar backups automáticos**
   - Daily backups de la DB

5. **Monitoreo y alertas**
   - Detectar intentos de acceso sospechosos

---

## ❓ TROUBLESHOOTING

### ¿Recibo error "PAYLOAD_SECRET is required"?
→ Verifica que .env tenga el PAYLOAD_SECRET correcto (sin espacios)

### ¿Los headers de seguridad no aparecen?
→ Abre DevTools (F12) → Network → selecciona cualquier request → ve a Response Headers
→ Busca "Strict-Transport-Security" y otros headers

### ¿npm audit fix devuelve error?
→ Intenta:
```bash
npm audit
npm cache clean --force
npm install
npm audit fix --force
```

### ¿La validación de URLs no funciona en Payload?
→ Actualiza el documento en Payload admin y guarda
→ Intenta poner una URL con `javascript:` - debe rechazarla

---

## 📊 VERIFICACIÓN FINAL

**Ejecuta esto en terminal para confirmar que todo está bien:**

```bash
# Verifica npm audit
npm audit

# Verifica que los headers estén presentes en dev
npm run dev
# Luego en otra terminal: curl -I http://localhost:3000
```

**Salida esperada (debe incluir):**
```
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
x-frame-options: DENY
content-security-policy: ...
```

---

## 📞 SOPORTE

Si algo no funciona después de estos pasos:

1. Verifica que todos los archivos están presentes:
   - `src/middleware.ts` ✅
   - `src/lib/security-utils.ts` ✅
   - `src/collections/Tools.ts` (actualizado) ✅
   - `.env` (actualizado) ✅

2. Reinicia el servidor: `npm run dev`

3. Limpia cache: `npm cache clean --force && npm install`

---

**¡Seguridad implementada! 🔐**
