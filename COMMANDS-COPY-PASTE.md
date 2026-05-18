# 💻 COMANDOS PARA COPIAR/PEGAR

## 🔐 Generar PAYLOAD_SECRET (elige UNO)

### Opción 1: PowerShell (Windows)

```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

Copia el resultado (sin comillas)

### Opción 2: Node.js (cualquier OS)

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Opción 3: Online

https://www.random.org/passwords/?num=1&len=32&format=plain

---

## 📝 Actualizar .env

**Archivo:** `.env`

**Busca esta línea:**
```
PAYLOAD_SECRET=mirai-suite-dev-secret-change-in-production
```

**Reemplázala con tu secreto generado (ejemplo):**
```
PAYLOAD_SECRET=aBcDeF1gH2ijKlMn3oPqRsT4uVwXyZ5aB
```

**Guarda:** Ctrl+S

---

## 🚀 Verificar que TODO Funciona

### 1. Iniciar servidor de desarrollo

```bash
npm run dev
```

**Espera a ver:**
```
▲ Next.js 15.5.15
- Local: http://localhost:3000
✓ Ready in X.Xs
```

### 2. Probar en navegador

```
http://localhost:3000
```

Debe cargar el portal de herramientas

### 3. Probar admin panel

```
http://localhost:3000/admin
```

Debe pedir login (usuario/contraseña por defecto de Payload CMS)

### 4. Verificar headers (en otra terminal)

```bash
# Si tienes curl instalado:
curl -I http://localhost:3000

# Con PowerShell:
Invoke-WebRequest http://localhost:3000 | Select-Object -ExpandProperty Headers
```

**Debe mostra estos headers:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: ...
```

---

## 🔍 Verificar Vulnerabilidades

### Ver estado actual

```bash
npm audit
```

**Resultado esperado:**
```
7 vulnerabilities (4 moderate, 3 high)

Some of these issues require choosing alternate dependencies,
which may cause substantial changes to your application.
```

(Las 7 restantes están en Payload CMS y no se pueden arreglar sin actualizar Payload)

### (Opcional) Intentar más fixes

```bash
npm audit fix --force
```

---

## 🏗️ Compilación para Producción

### Verificar que compila sin errores

```bash
npm run build
```

**Resultado esperado:**
```
✓ Compiled successfully
✓ Linting and checking validity of types ...
Finalizing page optimization ...
```

### Ver tamaño del build

```bash
npm run build
# Busca en output:
# Route (app)                                Size  First Load JS
# ⚡ /                                     119 kB         225 kB
```

---

## 🧪 Testing de Seguridad (DevTools)

**En navegador:**

1. Abre http://localhost:3000
2. Presiona **F12** (abre DevTools)
3. Ve a la pestaña **Network**
4. Recarga la página (F5)
5. Haz click en la primera request (/)
6. Ve a **Response Headers**
7. Busca estos headers:
   - ✅ `strict-transport-security`
   - ✅ `x-content-type-options`
   - ✅ `x-frame-options`
   - ✅ `content-security-policy`

---

## 📦 Limpiar & Reinstalar dependencias

Si algo se queja:

```bash
npm cache clean --force
npm install
npm run dev
```

---

## 🛑 Detener el Servidor

**En la terminal donde corre `npm run dev`:**

Presiona: **Ctrl+C**

---

## 🔄 Flujo Completo de Instalación

Si necesitas hacer TODO desde 0:

```bash
# 1. Ir al directorio del proyecto
cd c:\Users\cristina.canadas_mir\Desktop\mirai-landing-main

# 2. Instalar dependencias
npm install

# 3. Limpiar dependencias (si hay problemas)
npm cache clean --force
npm install

# 4. Generar y actualizar PAYLOAD_SECRET en .env
# (Edita manualmente .env)

# 5. Aplicar fixes de seguridad
npm audit fix --force

# 6. Compilar
npm run build

# 7. Iniciar en desarrollo
npm run dev

# 8. Verificar en navegador
# - http://localhost:3000
# - http://localhost:3000/admin
```

---

## 📊 Información Útil

### Versiones

```bash
# Ver versión de Node
node --version

# Ver versión de NPM
npm --version

# Ver versión de Next.js
npm list next

# Ver versión de Payload
npm list payload
```

### Localización de configuración

```
.env                         ← Secretos y variables
src/middleware.ts            ← Security headers
src/collections/Tools.ts     ← URL validation
src/lib/security-utils.ts    ← Funciones de seguridad
src/payload.config.ts        ← Config de Payload CMS
next.config.ts               ← Config de Next.js
```

### Puerto en uso

Si el puerto 3000 está ocupado:

```bash
# Next.js automáticamente usa 3001, 3002, etc.
# O especificar puerto:
npm run dev -- -p 4000
```

---

## 🆘 Problemas Comunes

### "npm: comando no reconocido"

```bash
# Node.js no está en PATH
# Reinstala Node.js desde nodejs.org
# Luego abre una terminal NUEVA
```

### ".env no encontrado"

El archivo `.env` debe estar en la raíz del proyecto:
```
mirai-landing-main/
├── .env                 ← Aquí debe estar
├── package.json
├── src/
└── ...
```

### "PAYLOAD_SECRET is required"

Asegúrate que en `.env` tienes:
```
PAYLOAD_SECRET=tu_secret_aqui_sin_espacios
```

(sin comillas, sin espacios antes/después)

### TypeScript compilation error

```bash
npm cache clean --force
rmdir node_modules /s /q
npm install
npm run build
```

---

## 📞 Confirmación Final

**Cuando hayas completado TODO, ejecuta:**

```bash
# Terminal 1: Inicia el servidor
npm run dev

# Terminal 2: Verifica headers (ejecuta cuando dev esté listo)
curl -I http://localhost:3000

# Deberías ver algo como:
# HTTP/1.1 200 OK
# strict-transport-security: max-age=31536000; includeSubDomains
# x-content-type-options: nosniff
# x-frame-options: DENY
# content-security-policy: default-src 'self'; ...
```

✅ Si ves todos los headers = **¡TODO FUNCIONA!**

---

**Copiar/pegar estos comandos es la forma más rápida de asegurar tu aplicación. 🔐**
