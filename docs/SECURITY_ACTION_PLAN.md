# 🎯 Plan de Acción - Seguridad Inmediata

## ✅ Hallazgos Positivos

1. **Headers de seguridad** ✅ **YA APLICADOS** en `next.config.ts`
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - X-XSS-Protection: 1; mode=block
   - Referrer-Policy: strict-origin-when-cross-origin
   - Permissions-Policy: geolocation=(), microphone=(), camera=()
   - Strict-Transport-Security: max-age=31536000

2. **Validación OSINT Input** ✅ **COMPLETA**
   - targetType validado con enum: ['person', 'company']
   - name: max 300 caracteres
   - aliases, phones, tags: max 300, 50, 50 respectivamente
   - emails: validación de email
   - urls: validación de URL
   - Prevención de DoS por tamaño

3. **Criptografía** ✅ **GOLD STANDARD**
   - AES-256-GCM
   - IV aleatorio
   - Authentication tag
   - Rotación de claves soportada

---

## 🔴 Acción CRÍTICA - Antes de Producción

### 1. **Implementar Redis para Rate Limiting**

**Por qué:** En memoria no escala y resetea en deploys

**Tiempo estimado:** 2-3 horas

**Pasos:**

1. **Instalar Redis (Vercel Upstash)**
   ```bash
   npm install @upstash/redis
   # o ioredis
   npm install ioredis
   ```

2. **Obtener REDIS_URL**
   - Crear cuenta en [upstash.com](https://upstash.com)
   - O usar Redis en producción (AWS ElastiCache, Heroku Redis, etc)

3. **Actualizar `lib/rateLimit.ts`**
   ```typescript
   import { Redis } from '@upstash/redis';
   
   const redis = new Redis({
     url: process.env.UPSTASH_REDIS_REST_URL!,
     token: process.env.UPSTASH_REDIS_REST_TOKEN!,
   });
   
   export async function checkRateLimit(request: NextRequest) {
     const key = getRateLimitKey(request);
     const count = await redis.incr(key);
     
     if (count === 1) {
       await redis.expire(key, 60); // 1 minuto
     }
     
     return {
       allowed: count <= 100,
       remaining: Math.max(0, 100 - count),
       resetTime: Date.now() + 60 * 1000,
     };
   }
   ```

4. **Agregar a `.env.local` (dev)**
   ```
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxxxx
   ```

5. **Agregar a Vercel Dashboard (prod)**
   - Settings → Environment Variables

---

### 2. **Crear MongoDB User Específico para Producción**

**Por qué:** No usar admin para conectar desde app

**Tiempo estimado:** 15 minutos

**Pasos:**

1. Ir a [mongodb.com](https://mongodb.com) → Atlas
2. Seleccionar cluster
3. Security → Database Access
4. Click "Add Database User"
5. Crear usuario: `dpu-labs-prod`
6. Permisos: `readWrite` en base de datos específica
7. Copiar connection string
8. Usar en Vercel ENV: `MONGODB_URI`

---

### 3. **Habilitar Encryption at Rest en MongoDB**

**Por qué:** Proteger datos en disco

**Tiempo estimado:** 5 minutos

**Pasos:**

1. MongoDB Atlas → Cluster → Security
2. Buscar "Encryption at Rest"
3. Habilitar con AWS KMS o Master Key de MongoDB
4. Aplicar cambios

---

## 🟡 Verificación - Esta Semana

### 1. **Test de Autorización**

Verificar que NO puedo acceder a datos de otro usuario:

```bash
# Terminal 1: Login como usuario A
# Obtener su token/session

# Terminal 2: Intentar acceder a /api/osint de usuario B
# DEBE retornar 401 o datos vacíos
```

**Script de test:**
```typescript
// test/auth.test.ts
import { auth } from '@clerk/nextjs/server';

test('User A cannot access User B osint targets', async () => {
  // Mock userId = 'user-a'
  // GET /api/osint → should return empty or user-a data only
  
  // Mock userId = 'user-b'
  // GET /api/osint → should return empty or user-b data only
});
```

### 2. **Test de Rate Limiting**

```bash
# Enviar 101 requests en 60 segundos
for i in {1..101}; do
  curl -H "Authorization: Bearer TOKEN" \
       https://localhost:3000/api/errors
done

# Esperado: 101º request retorna 429 Too Many Requests
```

### 3. **Verificar .gitignore**

```bash
git ls-files | grep -E "\\.env|\\.env\\.local|secrets"
# Debería estar vacío
```

---

## 📋 Test Cases Manuales

### Test 1: Validación de Input Malicioso

```bash
# Intentar inyectar código en OSINT
curl -X POST http://localhost:3000/api/osint \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<img src=x onerror=alert(1)>",
    "targetType": "person"
  }'

# DEBE: Parsear sin ejecutar JS (validado por Zod)
```

### Test 2: Acceso No Autorizado

```bash
# Sin autenticación
curl http://localhost:3000/api/osint

# DEBE: 401 Unauthorized
```

### Test 3: Validación de targetType

```bash
# targetType inválido
curl -X POST http://localhost:3000/api/osint \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "targetType": "invalid_type"
  }'

# DEBE: 400 Bad Request (Zod validation error)
```

---

## 📅 Cronograma

### **Hoy (30 de Enero)**
- [ ] Revisar este documento
- [ ] Verificar que `.env.local` NO esté en git
- [ ] Confirmar headers en production

### **Mañana (31 de Enero)**
- [ ] Implementar Redis (2-3 horas)
- [ ] Test local de rate limiting

### **2 de Febrero (antes de deploy)**
- [ ] Crear MongoDB user específico
- [ ] Habilitar encryption at rest
- [ ] Hacer test suite de autorización
- [ ] Verificar no hay secretos en commits

### **3+ de Febrero**
- [ ] Deploy a producción
- [ ] Monitorear logs
- [ ] Configurar alertas

---

## 🛠️ Herramientas Útiles

### Verificar Secretos en Git

```bash
# Escanear histórico de commits
git log --all --full-history -- .env*
git log --all --full-history -- secrets

# Buscar credenciales
git log -S "MONGODB_URI" --all
git log -S "CLERK_SECRET" --all
```

### Testing de Seguridad

```bash
# OWASP ZAP (escaneo de vulnerabilidades web)
# Docker: docker run -t owasp/zap2docker-stable

# Validar headers HTTP
curl -I https://your-domain.com
# Debe mostrar los security headers

# Test de rate limiting
ab -n 101 -c 1 https://your-api.com/api/endpoint
```

---

## 📚 Referencias

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security)
- [Clerk Docs](https://clerk.com/docs)
- [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)

---

## ✅ Sign-off

**Revisión realizada:** 30 de Enero, 2026  
**Revisor:** AI Security Audit  
**Estado:** ✅ APTO PARA DESARROLLO | ⚠️ NECESITA MEJORAS ANTES DE PRODUCCIÓN

**Próxima revisión:** 10 de Febrero, 2026 (post-implementación Redis)
