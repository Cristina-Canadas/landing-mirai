# Security Engineer / Ciberseguridad 🔒

## Rol y responsabilidades

Especialista en **ciberseguridad y hardening** de **Mirai Suite**. Experto en:
- Escaneo de dependencias vulnerables
- Detección de XSS, CSRF, SQL Injection
- Gestión de headers de seguridad
- Autenticación y autorización
- Validación de entrada/salida
- Criptografía y secrets management
- OWASP Top 10

## Stack de seguridad

- **npm audit** — Vulnerabilidades de paquetes
- **Snyk** — Análisis de dependencias avanzado
- **ESLint security plugins** — Detección de bad practices
- **OWASP headers** — Validación de headers HTTP
- **Payload Security** — Autenticación del CMS

## Areas de expertise

### 1. Dependencias
- Root/indirect vulnerabilities
- Outdated packages
- License compliance
- Supply chain security

### 2. Código
- XSS prevention
- CSRF protection
- SQL injection prevention
- Command injection
- Path traversal
- Insecure randomness

### 3. Infraestructura
- HTTP headers security
- HTTPS/TLS
- Cookie security
- CORS policy
- CSP (Content Security Policy)
- Environment variables exposure

### 4. Autenticación
- Password policies
- JWT security
- Session management
- Rate limiting
- Account lockout
- 2FA readiness

### 5. Data Protection
- Encryption at rest
- Encryption in transit
- Data sanitization
- PII handling
- Backup security

## Archivos clave

| Archivo | Responsabilidad |
|---------|-----------------|
| `src/scripts/security-audit.ts` | Script principal de auditoría |
| `src/scripts/security-checker.ts` | Utilidades de validación |
| `src/payload.config.ts` | Config de autenticación |
| `src/app/api/[...slug]/route.ts` | Protección de endpoints |
| `.env` | Secrets y credenciales |
| `package.json` | Vulnerabilidades de dependencias |
| `tsconfig.json` | Strict mode checking |

## Comandos

```bash
# Ejecutar auditoría de seguridad completa
npm run security:audit

# Ejecutar npm audit nativo
npm audit

# Ejecutar npm audit con fix automático
npm audit fix

# Verificar vulnerabilidades críticas
npm run security:check

# Verificar headers de seguridad
npm run security:headers

# Check de contraseñas/secrets expuestos
npm run security:secrets
```

## Flujo de auditoría

### 1. Escaneo de dependencias
```bash
npm audit
```
Genera reporte de vulnerabilidades con scores

### 2. Análisis de código
```bash
npm run lint
```
Busca patrones inseguros

### 3. Validación de configuración
```bash
npm run security:audit
```
Revisa headers, cookies, CORS, auth

### 4. Generación de reporte
```json
{
  "timestamp": "2026-04-13T10:00:00Z",
  "vulnerabilities": {
    "critical": 0,
    "high": 0,
    "medium": 2,
    "low": 5
  },
  "issues": [
    {
      "severity": "high",
      "type": "missing-header",
      "header": "X-Content-Type-Options",
      "fix": "Add 'X-Content-Type-Options: nosniff' to response headers"
    }
  ]
}
```

## Checklist de seguridad

### Pre-deployment
- [ ] `npm audit` sin vulnerabilidades críticas
- [ ] Secrets no expuestos en código
- [ ] `.env` no viene en git
- [ ] Headers de seguridad configurados
- [ ] CORS restrictivo
- [ ] Rate limiting activo
- [ ] SQL queries con parameterización
- [ ] Inputs validados y sanitizados
- [ ] CSP headers presentes
- [ ] HTTPS en producción

### Payload CMS
- [ ] Admin autenticado
- [ ] Usuarios con contraseñas fuertes
- [ ] Access control en colecciones
- [ ] Campos sensibles protegidos
- [ ] Uploads con validación
- [ ] API endpoints protegidos

### Node.js
- [ ] Strict mode enabled
- [ ] Error handling sin stack traces
- [ ] Logging sin datos sensibles
- [ ] Dependencies updatadas
- [ ] No usar eval() o similar
- [ ] Procesos con principio de menor privileg

### Base de datos
- [ ] Backup encriptado
- [ ] Acceso restringido
- [ ] Query logging para auditoría
- [ ] Prepared statements
- [ ] SSL/TLS en conexión

## Vulnerabilidades comunes

| Vuln | Cómo evitar | Test |
|------|------------|------|
| XSS | Sanitizar inputs, usar React escaping | npm audit + ESLint |
| CSRF | CSRF tokens, SameSite cookies | Headers check |
| SQL Injection | Prepared statements, ORM | Code review |
| Auth bypass | Validar JWT, rate limit | Security audit |
| Exposure secrets | .gitignore, .env | npm run security:secrets |

## Integración en CI/CD

### Pre-commit hook
```bash
# .husky/pre-commit
npm run security:check
```

### GitHub Actions
```yaml
- name: Security Audit
  run: npm run security:audit
```

### Docker build
```dockerfile
RUN npm audit --audit-level=moderate
```

## Variables de entorno críticas

```env
# NUNCA commitear estas
PAYLOAD_SECRET=cambiar-en-produccion
DATABASE_URI=file:./payload.db
DATABASE_PASSWORD=secreto
JWT_SECRET=cambiar-en-produccion

# Validar que existen
PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

## Headers de seguridad requeridos

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Mejoras futuras

- [ ] Integración con Snyk
- [ ] SAST (Static Application Security Testing)
- [ ] DAST (Dynamic Application Security Testing)
- [ ] Penetration testing automático
- [ ] Dependency scanning con SCA
- [ ] Secret scanning en git history
- [ ] WAF (Web Application Firewall) rules
- [ ] 2FA para admin
- [ ] Rate limiting por IP
- [ ] Audit logging automático

## Errores comunes

| Error | Solución |
|-------|----------|
| `npm audit` bloqueado en prod | Usar `--audit-level=high` en CI |
| Secrets en logs | Filtrar datos sensibles |
| Headers no aplicados | Usar middleware Next.js |
| CORS muy permisivo | Configurar whitelist específico |
| JWT expirado | Implementar refresh tokens |

---

**Última actualización:** Abril 2026
