# Agentes de Mirai Suite 🤖

Guía de especialistas para el desarrollo de **Mirai Suite**. Cada agente tiene un rol específico y expertise en un área.

## 📁 Ubicación

Todos los agentes están en `src/agents/`:
```
src/agents/
├── senior-frontend.md
├── senior-backend.md
├── qa-tester.md
├── ux-designer.md
└── i18n-specialist.md
```

## 👥 Equipos disponibles

### 1️⃣ Senior Frontend Engineer 🎨
**Archivo:** `src/agents/senior-frontend.md`

Especialista en:
- React 19 + Next.js 15
- Componentes reutilizables
- CSS Variables y themes
- Responsive design
- Performance frontend

**Usa cuando necesites:**
- Crear/modificar componentes
- Arreglar estilos CSS
- Mejorar responsividad
- Optimizar performance
- Implementar nuevas features UI

### 2️⃣ Senior Backend Engineer ⚙️
**Archivo:** `src/agents/senior-backend.md`

Especialista en:
- Payload CMS
- API REST
- Colecciones de datos
- Base de datos
- Autenticación

**Usa cuando necesites:**
- Crear colecciones nuevas
- Modificar Payload config
- Gestionar datos
- Crear endpoints
- Debugging de API

### 3️⃣ QA Tester 🧪
**Archivo:** `src/agents/qa-tester.md`

Especialista en:
- Testing manual
- Validación de features
- Identificación de bugs
- Cross-browser testing
- Documentación de issues

**Usa cuando necesites:**
- Testear nueva feature
- Validar antes de launch
- Reportar bugs sistematicamente
- Crear test plans
- Verificar compatibilidad

### 4️⃣ UX/UI Designer 🎨
**Archivo:** `src/agents/ux-designer.md`

Especialista en:
- Diseño de interfaces
- Experiencia de usuario
- Accesibilidad (a11y)
- Paleta de colores
- Design system

**Usa cuando necesites:**
- Diseñar nuevas pantallas
- Mejorar UX
- Auditar accesibilidad
- Guías de diseño
- Consistencia visual

### 5️⃣ i18n Specialist 🌍
**Archivo:** `src/agents/i18n-specialist.md`

Especialista en:
- Internacionalización
- Traducción multiidioma
- Localization
- Payload i18n
- Termonlogía consistente

**Usa cuando necesites:**
- Traducir contenido
- Agregar idioma nuevo
- Validar traducciones
- Mantener glosario
- Configurar localizacion

### 6️⃣ Security Engineer 🔒
**Archivo:** `src/agents/security-engineer.md`

Especialista en:
- Escaneo de vulnerabilidades
- Ciberseguridad
- OWASP Top 10
- Hardening de infraestructura
- Secrets management

**Usa cuando necesites:**
- Auditar seguridad del proyecto
- Escanear dependencias vulnerables
- Validar headers de seguridad
- Implementar autenticación segura
- Preparar para producción
- Detectar XSS, CSRF, inyecciones

## 🚀 Cómo usar los agentes

### Opción 1: Invoke específico (Copilot Chat)
En VS Code, usa el chat de Copilot y menciona al agente:

```
@senior-frontend cómo creo un nuevo componente para...
```

### Opción 2: Leer directamente
Abre el archivo del agente y lee las instrucciones:

```bash
# Terminal
cat src/agents/senior-frontend.md
```

### Opción 3: Dentro de prompts personalizados
Referencia el agente en `.instructions.md` personalizado

## 📊 Matriz de decisión

¿Quién debería trabajar en esto?

| Tarea | Frontend | Backend | QA | UX | i18n | Security |
|-------|----------|---------|-----|----|----|----------|
| Crear componente React | ✅ | | | | | |
| Styled CSS | ✅ | | | ✅ | | |
| Nuevo campo Payload | | ✅ | | | | |
| Query a base datos | | ✅ | | | | |
| Testar feature | | | ✅ | | | |
| Reportar bug | | | ✅ | | | |
| Diseñar pantalla nueva | | | | ✅ | | |
| Validar a11y | | | | ✅ | | |
| Traducir contenido | | ✅ | | | ✅ | |
| Agregar idioma | | ✅ | | | ✅ | |
| Theme dark/light | ✅ | | | ✅ | | |
| Optimizar perf | ✅ | | | | | |
| Auditar seguridad | | | | | | ✅ |
| Escanear vulnerabilidades | | | | | | ✅ |
| Configurar headers | | | | | | ✅ |
| Proteger endpoints | | ✅ | | | | ✅ |

## 🎯 Flujo común de trabajo

### Crear una nueva herramienta

```
1. UX Designer     → Diseña cómo se vería
2. Backend         → Agrega campos en Payload
3. Frontend        → Implementa componentes
4. i18n Specialist → Traduce campos
5. QA Tester       → Valida en todos los idiomas + temas
6. Security        → Audita seguridad (si aplica)
```

### Arreglar un bug visual

```
1. QA Tester       → Reporta bug (pasos, entorno)
2. Frontend        → Arregla CSS/JS
3. UX Designer     → Valida que siga design system
4. QA Tester       → Verifica fix
```

### Mejorar accesibilidad

```
1. UX Designer     → Audita a11y
2. Frontend        → Implementa cambios
3. QA Tester       → Valida con screen reader
```

### Pre-deployment a Producción

```
1. Backend         → Migra payload.db a PostgreSQL
2. Security        → Ejecuta npm run security:audit
3. QA Tester       → Testing completo (todos temas/idiomas)
4. Security        → Verifica headers y autenticación
5. Backend         → Configura backups y monitoring
6. Todos           → Checkeo final antes de deploy
```

## 🔗 Documentación relacionada

- [DOCUMENTACION_COMPLETA.md](DOCUMENTACION_COMPLETA.md) — Documentación completa del proyecto
- [ARCHITECTURE.md](ARCHITECTURE.md) — Arquitectura técnica
- [SECURITY-GUIDE.md](SECURITY-GUIDE.md) — Guía de seguridad y cómo ejecutar auditorías
- [README.md](README.md) — Quick start

## 📝 Agregar nuevo agente

Para crear un nuevo agente especialista:

1. Crear archivo: `src/agents/my-agent.md`
2. Incluir secciones:
   - **Rol y responsabilidades**
   - **Areas de expertise**
   - **Archivos clave**
   - **Convenciones**
   - **Troubleshooting**
3. Actualizar este archivo (AGENTS.md)

## 🎓 Template para nuevo agente

```markdown
# Agente Especialista 🎯

## Rol y responsabilidades

[Descripción clara del rol]

## Areas de expertise

- Área 1
- Área 2
- Área 3

## Archivos clave

| Archivo | Responsabilidad |
|---------|-----------------|
| path/file.ts | Description |

## Flujo de desarrollo

[Pasos típicos para trabajar en este rol]

## Convenciones

[Estándares y mejores prácticas]

## Troubleshooting

[Problemas comunes y soluciones]
```

## 💡 Tips para usar agentes

1. **Sé específico:** Cuanta más información des, mejor la ayuda
2. **Lee el agente primero:** Familiarízate con el contexto
3. **Sigue convenciones:** Cada agente tiene standards
4. **Referencia archivos:** Usa rutas relativas claras
5. **Testing:** Siempre verifica con QA antes de merge

## 📞 Contacto

Si necesitas un agente especializado en algo que no existe:
1. Describe el área
2. Crea el archivo siguiendo el template
3. Comparte con el equipo

---

**Última actualización:** Abril 2026
**Versión:** 1.0
