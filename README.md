# Mirai Suite - Portal de Herramientas Internas

Portal interno para centralizar herramientas del equipo Front de Mirai.
El proyecto permite gestionar herramientas desde un panel admin y mostrarlas en una landing publica con filtros, busqueda, favoritos y soporte multi idioma.

## Objetivo del proyecto

Mirai Suite resuelve tres necesidades:

1. Tener un unico catalogo de herramientas internas.
2. Permitir que el equipo no tecnico actualice contenido desde `/admin`.
3. Publicar cambios en la landing sin tocar codigo en cada alta o cambio de herramienta.

## Stack tecnico

- Next.js 15 (App Router, SSR)
- React 19
- TypeScript 5
- Payload CMS v3
- SQLite en local (`payload.db`)
- PostgreSQL en produccion (via `DATABASE_URI`)

## Funcionalidades principales

- Panel de administracion integrado en `/admin`.
- Coleccion `tools` editable desde Payload CMS.
- Landing dinamica que lee herramientas desde CMS en tiempo real.
- Soporte i18n para 5 idiomas: `es`, `en`, `fr`, `ca`, `pt`.
- Filtro por categoria y busqueda por texto.
- Favoritos y "most used" guardados en `localStorage`.
- Tema claro/oscuro.
- Seed inicial para cargar herramientas de ejemplo.

## Requisitos

- Node.js `>=22.12.0`
- npm

## Puesta en marcha local

1. Instala dependencias:

```bash
npm install
```

2. Crea archivo de entorno:

```bash
copy .env.example .env
```

3. Inicia el proyecto:

```bash
npm run dev
```

4. Abre `http://localhost:3000`.
5. Entra en `http://localhost:3000/admin` y crea el primer usuario admin.
6. (Opcional pero recomendado) Carga datos iniciales:

```bash
npm run seed
```

## Scripts disponibles

- `npm run dev`: arranca entorno de desarrollo.
- `npm run build`: compila para produccion.
- `npm run start`: inicia la build en modo produccion.
- `npm run lint`: ejecuta linting de Next.js.
- `npm run seed`: inserta herramientas iniciales en Payload.
- `npm run payload`: ejecuta comandos de Payload CLI.
- `npm run security:audit`: auditoria interna de seguridad del proyecto.
- `npm run security:check`: `npm audit` con nivel `moderate`.
- `npm run security:fix`: intenta corregir vulnerabilidades de dependencias.

## Variables de entorno clave

Revisa `.env.example` para la lista completa. Minimo recomendado:

- `PAYLOAD_SECRET`: secreto de Payload/JWT.
- `DATABASE_URI`: base de datos (`file:./payload.db` en local).
- `NODE_ENV`: `development`, `staging` o `production`.
- `PUBLIC_SITE_URL`: URL publica de la aplicacion.

## Estructura base

```text
src/
  app/                # Rutas Next.js (frontend, admin y api)
  collections/        # Colecciones de Payload (tools, users, media)
  components/         # Componentes UI de la landing
  i18n/               # Traducciones y tipos de idioma
  scripts/            # Scripts de seed y auditoria de seguridad
  payload.config.ts   # Config principal de Payload CMS
```

## Flujo de contenido

1. Crear o editar herramientas en `/admin`.
2. Guardar cambios en la coleccion `tools`.
3. Visualizar cambios en la landing sin deploy adicional.

## Seguridad y documentacion

- Guia de seguridad: [SECURITY-GUIDE.md](SECURITY-GUIDE.md)
- Acciones aplicadas: [SECURITY-ACTIONS.md](SECURITY-ACTIONS.md)
- Reporte de auditoria: [SECURITY-AUDIT-REPORT.md](SECURITY-AUDIT-REPORT.md)
- Documentacion tecnica completa: [DOCUMENTACION_COMPLETA.md](DOCUMENTACION_COMPLETA.md)
- Arquitectura: [ARCHITECTURE.md](ARCHITECTURE.md)

## Estado

Proyecto activo, preparado para evolucionar de SQLite (local) a PostgreSQL (produccion).
