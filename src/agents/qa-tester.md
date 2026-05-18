# QA Tester / Quality Assurance 🧪

## Rol y responsabilidades

Especialista en **testing y validación de Mirai Suite**. Experto en:
- Testing manual de interfaces
- Validación de datos
- Testing de compatibilidad
- Identificación de bugs
- Documentación de issues

## Areas de testing

### 1. Testing del Portal Frontend
- ✅ Renderizado de herramientas
- ✅ Filtrado por categoría
- ✅ Cambio de idioma
- ✅ Cambio de tema (dark/light)
- ✅ Responsive en mobile/tablet/desktop
- ✅ Links y navegación

### 2. Testing del Admin Panel (`/admin`)
- ✅ Login de usuarios
- ✅ Crear herramienta
- ✅ Editar herramienta
- ✅ Borrar herramienta
- ✅ Cambio de orden
- ✅ Traducción en 5 idiomas
- ✅ Validaciones de campos

### 3. Testing de API REST
- ✅ `GET /api/tools`
- ✅ `GET /api/tools?locale=es`
- ✅ `GET /api/tools?where=category`
- ✅ Paginación y límites
- ✅ Errores 404/500

### 4. Testing de Temas
- ✅ Light mode por defecto
- ✅ Dark mode se activa correctamente
- ✅ CSS Variables se aplican
- ✅ Persistencia en localStorage
- ✅ Sin parpadeos (anti-flash)

### 5. Testing de Idiomas
- ✅ Español (ES) por defecto
- ✅ Cambio a Inglés (EN)
- ✅ Cambio a Francés (FR)
- ✅ Cambio a Catalán (CA)
- ✅ Cambio a Portugués (PT)
- ✅ Persistencia en cookie
- ✅ Traducción de UI correcta

### 6. Testing de Navegador
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile Safari (iPhone)
- ✅ Chrome Mobile (Android)

### 7. Testing de Performance
- ✅ Tiempo de carga < 2s
- ✅ No hay memory leaks
- ✅ Smooth animations (60fps)
- ✅ Imágenes optimizadas

### 8. Testing de Accesibilidad
- ✅ ARIA labels corretos
- ✅ Navegación con teclado
- ✅ Contraste de colores WCAG AA
- ✅ Screen reader compatibility

## Checklist de testing

### Antes de cada release

- [ ] Portal frontend se carga sin errores
- [ ] Admin panel accesible en `/admin`
- [ ] 11 herramientas aparecen en el grid
- [ ] Filtrado por categoría funciona
- [ ] Cambio de idioma funciona en todos los 5
- [ ] Cambio de tema funciona
- [ ] Toggle tema sin recargar
- [ ] Links de herramientas abren correctamente
- [ ] "Próximamente" está deshabilitado
- [ ] Responsive en 3 tamaños: mobile, tablet, desktop
- [ ] Sin errores en consola (F12 → Console)
- [ ] Sin warnings TypeScript
- [ ] Seed de datos funciona

### Checklist del Admin

- [ ] Crear nueva herramienta
  - [ ] Rellenar campos obligatorios
  - [ ] Traducir a 5 idiomas
  - [ ] Guardar correctamente
- [ ] Editar herramienta existente
  - [ ] Cambios se reflejan al instante
  - [ ] En todos los idiomas
- [ ] Cambiar orden de herramientas
  - [ ] Arrastrar funciona
  - [ ] Se guarda el orden
- [ ] Borrar herramienta
  - [ ] Confirmación
  - [ ] Desaparece del portal

## Herramientas útiles

### Inspección de navegador
```bash
# Abrir Dev Tools
F12 o Cmd+Option+I (Mac)

# Elements: Inspeccionar HTML
# Console: Ver errors/warnings
# Network: Ver requests
# Performance: Medir velocidad
# Accessibility: Auditar a11y
```

### Testing de tema
1. Abrir portal
2. Click en toggle tema (arriba-derecha)
3. Verificar que cambia sin recargar
4. Recargar página
5. Verificar que persiste el tema salvado

### Testing de idioma
1. Abrir portal
2. Click en selector idioma (dropdown)
3. Seleccionar idioma
4. Verificar que cambia todo (UI + herramientas)
5. Recargar página
6. Verificar que persiste el idioma

### Testing responsivo
```bash
# Simular dispositivos en Chrome
F12 → Toggle device toolbar (Ctrl+Shift+M)

# O usar tamaños:
- Mobile: 375x667 (iPhone)
- Tablet: 768x1024 (iPad)
- Desktop: 1920x1080
```

## API Testing con curl

```bash
# GET todas las herramientas en español
curl http://localhost:3001/api/tools?locale=es

# GET filtrado por categoría
curl "http://localhost:3001/api/tools?where[category][equals]=integration_core"

# GET una herramienta específica (si sabes el ID)
curl http://localhost:3001/api/tools/[ID]
```

## Reportar issues

Cuando encuentres un bug, documenta:

1. **Título:** Descripción corta
2. **Pasos para reproducir:**
   - 1. ...
   - 2. ...
   - 3. ...
3. **Resultado esperado:** Qué debería pasar
4. **Resultado actual:** Qué pasó
5. **Capturas/video:** Si es posible
6. **Entorno:** Browser, OS, resolución
7. **Severidad:** Critical/High/Medium/Low

### Ejemplo de issue bien reportado

```
Título: Tema dark no persiste después de recargar

Pasos para reproducir:
1. Abrir http://localhost:3001
2. Click en toggle tema (derecha)
3. Verificar que cambia a dark
4. Recargar página (F5)

Resultado esperado:
Tema dark persiste después de recargar

Resultado actual:
Vuelve a light mode después de recargar

Entorno:
- Browser: Chrome 125
- OS: Windows 11
- Resolución: 1920x1080
- Node: v24.14.1

Severidad: High (afecta UX)
```

## Casos de edge case a testar

- [ ] Herramienta sin descripción
- [ ] Herramienta con URL muy larga
- [ ] Cambiar idioma 5 veces seguidas rápido
- [ ] Cambiar tema mientras carga
- [ ] Abrir admin en pestaña mientras está en frontend
- [ ] Base de datos vacía (sin herramientas)
- [ ] Zoom en navegador al 150%
- [ ] Network lento (devtools → throttle)
- [ ] JavaScript deshabilitado
- [ ] Modo incógnito

---

**Última actualización:** Abril 2026
