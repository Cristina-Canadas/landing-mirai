# 🚀 Deploy en Railway — Guía Completa

## Paso 1: Crear cuenta en Railway

1. Abre https://railway.app
2. Click "Login with GitHub"
3. Autoriza la conexión

## Paso 2: Crear nuevo proyecto

1. En Railway dashboard: Click "+ New Project"
2. Selecciona: "Deploy from GitHub repo"
3. Selecciona el repositorio: `Rosten1805/mirai-landing`
4. Autoriza si es necesario

## Paso 3: Railway configura automáticamente

Railway detectará:
- ✅ Next.js (automático)
- ✅ Node.js version
- ✅ npm install + npm run build

## Paso 4: Añadir PostgreSQL

En Railway dashboard del proyecto:

1. Click "+ Add Service"
2. Selecciona "Database"
3. Selecciona "PostgreSQL"
4. Railway automáticamente:
   - Crea la BD
   - Genera `DATABASE_URI`
   - La añade a variables de entorno

## Paso 5: Configurar variables de entorno

En Railway (Project Settings → Variables):

```env
# Obligatorios
NODE_ENV=production
PAYLOAD_SECRET=tu-secret-super-seguro-12345

# Automático de PostgreSQL (Railway lo pone solo)
DATABASE_URI=postgresql://user:password@host:port/db

# URLs de herramientas (rellenar con los valores reales)
PUBLIC_SITE_URL=https://tu-app.up.railway.app
PUBLIC_URL_MIRAI_CORE_TOOLS=https://...
PUBLIC_URL_EXTRANET_DATA_READER=https://...
# ... resto de URLs

# Opcional
PUBLIC_GA_MEASUREMENT_ID=
PUBLIC_PLAUSIBLE_DOMAIN=
```

## Paso 6: Deploy

Railway automáticamente:
1. ✅ Detecta cambios en GitHub
2. ✅ Hace `npm install`
3. ✅ Hace `npm run build`
4. ✅ Ejecuta `npm run start`
5. ✅ Despliega en `tu-app.up.railway.app`

## Paso 7: Primera ejecución (Seed de datos)

Después del primer deploy:

```bash
# En Railway, abre la terminal del proyecto
railway run npm run seed
```

O desde local:
```bash
# Conectar a Railway
railway connect

# Ejecutar seed
railway run npm run seed
```

---

## 📍 URLs útiles

| Recurso | URL |
|---------|-----|
| Dashboard | https://railway.app/dashboard |
| Docs | https://docs.railway.app |
| Pricing | https://railway.app/pricing |

---

## ✅ Checklist final

- [ ] Cuenta creada en Railway
- [ ] Repositorio conectado
- [ ] PostgreSQL creado
- [ ] Variables de entorno configuradas
- [ ] `PAYLOAD_SECRET` guardado de forma segura
- [ ] Deploy iniciado
- [ ] URL en vivo visible
- [ ] Seed de datos ejecutado

---

## 🆘 Troubleshooting

### "Build failed"
```bash
# Ver logs en Railway:
railway logs
```

### "Database connection error"
```bash
# Verificar DATABASE_URI
railway env

# Ejecutar seed
railway run npm run seed
```

### Admin no carga en `/admin`
```bash
# Verificar que Payload CMS está desplegado
# Ver logs: railway logs

# Ejecutar seed si falta
railway run npm run seed
```

---

**Tiempo de setup:** 5-10 minutos ⏱️
