/**
 * Chat client abstraction - supports OpenAI and future providers
 */

export interface ChatResponse {
  message: string;
  tokensUsed: number;
  model: string;
  provider: 'openai' | 'anthropic' | 'mock';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Mock client for testing (no API calls)
 */
export async function mockChatCall(
  userMessage: string,
  _systemPrompt: string,
  _history: ChatMessage[]
): Promise<ChatResponse> {
  // Simulate delay
  await new Promise((r) => setTimeout(r, 500));

  const responses: Record<string, string> = {
    perfiles: 'Encontramos 3 perfiles públicos asociados a este target. LinkedIn es la fuente principal de datos profesionales.',
    tags: `Basado en los tags ("fintech", "tech"), este target muestra perfil de profesional técnico en sector fintech.`,
    conexiones: 'Las fuentes sugieren conexiones en el ecosistema fintech. Recomendamos investigar co-apariciones en eventos o publicaciones.',
    default: `Analicé tu pregunta sobre este target. Con los datos disponibles, puedo decir que hay ${Math.floor(Math.random() * 5) + 1} perfiles públicos documentados. ¿Qué aspecto específico te interesa investigar?`,
  };

  let response = responses.default;
  const lower = userMessage.toLowerCase();
  if (lower.includes('perfil'))
    response = responses.perfiles;
  else if (lower.includes('tag') || lower.includes('categoría'))
    response = responses.tags;
  else if (lower.includes('conexión') || lower.includes('relación'))
    response = responses.conexiones;

  return {
    message: response,
    tokensUsed: Math.floor(Math.random() * 200) + 50,
    model: 'mock-v1',
    provider: 'mock',
  };
}

/**
 * OpenAI client
 */
export async function openaiChatCall(
  userMessage: string,
  systemPrompt: string,
  history: ChatMessage[],
  apiKey: string
): Promise<ChatResponse> {
  if (!apiKey) throw new Error('OPENAI_API_KEY no configurado');

  const messages = [
    ...history.map((h) => ({ role: h.role as 'user' | 'assistant', content: h.content })),
    { role: 'user' as const, content: userMessage },
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system' as const, content: systemPrompt },
        ...messages,
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const message = data.choices[0]?.message?.content || 'Sin respuesta';
  const tokensUsed = data.usage?.total_tokens || 0;

  return {
    message,
    tokensUsed,
    model: 'gpt-4o-mini',
    provider: 'openai',
  };
}

/**
 * Anthropic client (Claude)
 */
export async function anthropicChatCall(
  userMessage: string,
  systemPrompt: string,
  history: ChatMessage[],
  apiKey: string
): Promise<ChatResponse> {
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY no configurado');

  const messages = [
    ...history.map((h) => ({ role: h.role as 'user' | 'assistant', content: h.content })),
    { role: 'user' as const, content: userMessage },
  ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const message = data.content[0]?.text || 'Sin respuesta';
  const tokensUsed = data.usage?.input_tokens + data.usage?.output_tokens || 0;

  return {
    message,
    tokensUsed,
    model: 'claude-3-5-sonnet-20241022',
    provider: 'anthropic',
  };
}

/**
 * Factory: select chat provider
 */
export async function callChatProvider(
  userMessage: string,
  systemPrompt: string,
  history: ChatMessage[],
  provider: string
): Promise<ChatResponse> {
  if (provider === 'openai') {
    const apiKey = process.env.OPENAI_API_KEY;
    return openaiChatCall(userMessage, systemPrompt, history, apiKey || '');
  }

  if (provider === 'anthropic') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    return anthropicChatCall(userMessage, systemPrompt, history, apiKey || '');
  }

  // Default to mock for development
  return mockChatCall(userMessage, systemPrompt, history);
}
