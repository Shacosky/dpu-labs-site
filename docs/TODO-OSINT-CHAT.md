# TODO: OSINT Chat Integration

## Overview
Implementar conversación contextual sobre targets OSINT usando IA, manteniendo compliance y privacidad.

## Fase 1: Infraestructura Backend (Semana 1)

### 1.1 Setup API Route + Environment
- [ ] Crear `/app/api/osint/[id]/chat/route.ts`
- [ ] Agregar env vars:
  - `OPENAI_API_KEY` o `ANTHROPIC_API_KEY`
  - `CHAT_MODEL` (ej: "gpt-4o-mini" o "claude-3-5-sonnet")
- [ ] Instalar dependencias: `npm install openai` (o `@anthropic-ai/sdk`)
- [ ] Documentar en `.env.local.example`

### 1.2 Context Sanitization
- [ ] Crear `/lib/osint/chatContext.ts`:
  - `sanitizeTargetForChat(target)` → devuelve contexto sin PII cruda
  - Incluir: nombre, tipo, cantidad de perfiles, tags, resumen de fuentes
  - EXCLUIR: emails exactos, phones, credentials hints
- [ ] Unit tests para sanitización
- [ ] Validar con ejemplos reales

### 1.3 Chat History Storage (Opcional pero recomendado)
- [ ] Extender schema `OsintTarget` con campo `chatHistory`
  - Estructura: `[{ role, content, timestamp, modelUsed }]`
- [ ] Migración MongoDB si es necesario
- [ ] Limpieza de historial: mantener últimos 50 mensajes
- [ ] Endpoint para borrar historial: `DELETE /api/osint/[id]/chat`

### 1.4 Rate Limiting
- [ ] Aplicar rate limit a `/api/osint/[id]/chat`
  - Sugerencia: 10 mensajes/minuto por usuario
  - Usar existing `checkRateLimit()` de `lib/rateLimit.ts`
- [ ] Responder con 429 si se excede

## Fase 2: API Integration (Semana 2)

### 2.1 OpenAI Integration (Opción A - Más barato)
- [ ] Implementar `callOpenAI(message, context, history)` en `/lib/osint/chatClient.ts`
- [ ] Model: `gpt-4o-mini` (costo: ~$0.15/1M tokens input)
- [ ] System prompt templating:
  ```
  "Eres analista OSINT especializado. Datos del target: {context}.
   Responde en español, mantén objectividad, no hagas afirmaciones sin evidencia."
  ```
- [ ] Error handling: timeouts, API errors, token limit
- [ ] Test con 5-10 conversaciones reales

### 2.2 Anthropic Integration (Opción B - Mejor razonamiento)
- [ ] Implementar `callAnthropic(message, context, history)` en `/lib/osint/chatClient.ts`
- [ ] Model: `claude-3-5-sonnet-20241022` (costo: ~$3/1M tokens)
- [ ] Similar system prompt
- [ ] Comparar calidad respuestas vs OpenAI

### 2.3 Abstracción de Provider
- [ ] Factory pattern: `getChatClient(provider: 'openai' | 'anthropic')`
- [ ] Permitir switch en env var `CHAT_PROVIDER`
- [ ] Tests con ambos providers

## Fase 3: Frontend Enhancement (Semana 2)

### 3.1 Stream Responses (UX Mejorada)
- [ ] Cambiar chat input a usar `fetch(..., { signal })` con streaming
- [ ] Renderizar respuesta palabra-por-palabra (más natural)
- [ ] Agregar botón "Detener" si stream está activo
- [ ] Indicador visual: animación mientras llega respuesta

### 3.2 Chat Persistence
- [ ] Al cerrar detail view, guardar historial en sessionStorage
- [ ] Al reabrir mismo target, restaurar historial
- [ ] Botón "Limpiar conversación" en UI

### 3.3 Quick Actions
- [ ] Botones predefinidos bajo input:
  - "¿Qué perfiles tiene?" 
  - "¿Está en redes?"
  - "Resumen ejecutivo"
  - "Analiza tags"
- [ ] Llenar automáticamente input + enviar

## Fase 4: Seguridad & Compliance (Semana 3)

### 4.1 Audit Logging
- [ ] Loguear cada llamada a chat:
  - userId, targetId, messageLength, modelUsed, tokenCount, timestamp
  - Guardar en `osintChatLogs` collection
- [ ] Endpoint admin: `GET /api/admin/osint-chat-logs` (solo owner)
- [ ] Nunca loguear contenido del mensaje (privacidad)

### 4.2 Data Privacy
- [ ] Validar que usuario owns target antes de responder
- [ ] Sanitización doble en backend (nunca confiar en frontend)
- [ ] Respetar GDPR: permitir export de conversación en JSON
- [ ] Permitir delete completo de chat history

### 4.3 Cost Control
- [ ] Dashboard: mostrar tokens gastados por target
- [ ] Warning si se exceden $X/mes
- [ ] Límite hard: máximo 1000 tokens por respuesta
- [ ] Opción para deshabilitar chat en target (admin)

## Fase 5: MCP Migration (Futuro - Opcional)

### 5.1 MCP Server Setup
- [ ] Crear `/mcp-server/osint-chat-server.ts` basado en oficial
- [ ] Implementar `resources://osint/{targetId}` (contexto sanitizado)
- [ ] Herramientas MCP:
  - `analyze_target` → retorna análisis local
  - `search_aliases` → busca en DB local
  - `get_sources_summary` → resume fuentes

### 5.2 Integration
- [ ] Reemplazar OpenAI/Anthropic con llamadas locales a MCP
- [ ] Zero tokens cost, máxima privacidad
- [ ] Trade-off: depende de LLM local (llama2, mistral, etc)

### 5.3 Testing
- [ ] Comparar respuestas MCP vs OpenAI en 20 casos
- [ ] Benchmarks de velocidad

## Testing Checklist

- [ ] Unit tests: `sanitizeTargetForChat()`
- [ ] Integration tests: `POST /api/osint/[id]/chat` con mock API
- [ ] E2E: usuario real crea target → abre chat → envía mensaje → recibe respuesta
- [ ] Load test: 100 mensajes concurrentes
- [ ] Security: intentar acceder a target que no owns
- [ ] Privacy: validar no se loguea PII en audit logs

## Deployment Checklist

- [ ] Env vars configurados en Vercel/Railway
- [ ] Secrets rotados
- [ ] Rate limits activos
- [ ] Monitoring: alertas si API cost > threshold
- [ ] Documentación actualizada (README, SECURITY_AUDIT.md)
- [ ] Changelog entry: v1.1.0 - OSINT Chat Integration

## Estimación

| Fase | Esfuerzo | Timeline |
|------|----------|----------|
| 1 (Infraestructura) | Medium | 4-5 días |
| 2 (API Integration) | Medium | 3-4 días |
| 3 (Frontend) | Small | 2-3 días |
| 4 (Security) | Medium | 4-5 días |
| 5 (MCP) | Large | 1-2 semanas |
| **Total** | **Large** | **3-4 semanas** |

## Decision Points

**Ahora (Semana 1):**
- [ ] Elegir provider: OpenAI (barato) vs Anthropic (mejor) vs MCP (privado)
- [ ] Presupuesto: ¿cuánto gastar en tokens/mes?
- [ ] Scope: ¿historial persistente o sesión solo?

**Después (Semana 4+):**
- [ ] Evaluar usar MCP si costos de tokens son altos
- [ ] Agregar más herramientas: búsqueda de patrones, comparación targets, exportes

## Links Útiles

- OpenAI API Docs: https://platform.openai.com/docs/api-reference/chat/create
- Anthropic API Docs: https://docs.anthropic.com/
- MCP Spec: https://modelcontextprotocol.io/
- Rate Limiting: [RFC 6585 - HTTP Status Code 429](https://tools.ietf.org/html/rfc6585)
