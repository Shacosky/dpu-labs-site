import crypto from 'node:crypto';

export type OsintTarget = {
  id: string;
  name: string;
  targetType: 'person' | 'company';
  aliases: string[];
  emails: string[];
  phones: string[];
  urls: string[];
  tags: string[];
  notes: string;
  sources: { name: string; url?: string; type?: string; collectedAt?: string }[];
  createdAt: string;
  updatedAt: string;
};

export interface SanitizedContext {
  targetId: string;
  name: string;
  targetType: 'person' | 'company';
  profileCount: number;
  emailCount: number;
  phoneCount: number;
  urlCount: number;
  tags: string[];
  sourceTypes: string[];
  sourceCount: number;
  lastUpdated: string;
  summary: string;
}

/**
 * Sanitize OSINT target data for AI chat
 * Remove PII and sensitive details, keep only aggregated metadata
 */
export function sanitizeTargetForChat(target: OsintTarget): SanitizedContext {
  const sourceTypes = [
    ...new Set(target.sources?.map((s) => s.type || 'unknown') || []),
  ] as string[];

  const summary = `${
    target.targetType === 'person' ? 'Persona' : 'Empresa'
  } identificada con ${target.urls.length} perfiles, ${target.tags.length} tags temáticos. Última actualización: ${new Date(target.updatedAt).toLocaleDateString('es-CL')}.`;

  return {
    targetId: target.id,
    name: target.name,
    targetType: target.targetType,
    profileCount: target.urls?.length || 0,
    emailCount: target.emails?.length || 0,
    phoneCount: target.phones?.length || 0,
    urlCount: target.urls?.length || 0,
    tags: target.tags || [],
    sourceTypes,
    sourceCount: target.sources?.length || 0,
    lastUpdated: target.updatedAt,
    summary,
  };
}

/**
 * Build system prompt for AI assistant
 */
export function buildSystemPrompt(context: SanitizedContext): string {
  return `Eres un analista OSINT especializado y experimentado. 

Tu rol es ayudar a analizar información sobre targets de inteligencia de código abierto (OSINT).

**Datos del target actual:**
- Nombre: ${context.name}
- Tipo: ${context.targetType === 'person' ? 'Persona' : 'Empresa'}
- Perfiles encontrados: ${context.profileCount}
- Tags: ${context.tags.join(', ') || 'Ninguno aún'}
- Fuentes: ${context.sourceCount} (tipos: ${context.sourceTypes.join(', ') || 'mixtas'})
- Resumen: ${context.summary}

**Instrucciones:**
1. Responde siempre en español
2. Basa tus análisis solo en datos públicos y metadatos del target
3. Sé objetivo y evita especulaciones
4. Si no tienes información suficiente, di "necesitamos más datos"
5. Sugiere próximos pasos de investigación cuando sea relevante
6. Respeta privacidad: nunca asumas información no documentada
7. Sé conciso pero informativo (máx 300 palabras por respuesta)

Contexto disponible para análisis: metadata agregada sin PII sensible.`;
}

/**
 * Hash target for audit logs (no revelar targetId completo)
 */
export function hashTargetForAudit(targetId: string): string {
  return crypto.createHash('sha256').update(targetId).digest('hex').slice(0, 8);
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

/**
 * Format chat history for API call
 */
export function formatChatHistory(messages: ChatMessage[]) {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
}
