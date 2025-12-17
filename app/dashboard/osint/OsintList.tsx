'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { OsintDiagram } from './OsintDiagram';
import { buildFromNL } from '@/lib/osint/nl';

type OsintTarget = {
  id: string;
  targetType: 'person' | 'company';
  name: string;
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

export function OsintList() {
  const [targets, setTargets] = useState<OsintTarget[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showNL, setShowNL] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<OsintTarget | null>(null);
  const [form, setForm] = useState({
    targetType: 'person' as 'person' | 'company',
    name: '',
    aliases: '',
    emails: '',
    phones: '',
    urls: '',
    tags: '',
    notes: '',
  });
  const [nl, setNl] = useState({
    targetType: 'person' as 'person' | 'company',
    name: '',
    prompt: '',
  });
  const [nlBusy, setNlBusy] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'person' | 'company'>('all');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string; timestamp: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);
  const [chatStats, setChatStats] = useState({ totalTokens: 0, totalCost: 0, lastMessageTokens: 0, lastMessageCost: 0 });
  const { showError, showSuccess } = useToast();

  // Cálculo de costo (GPT-4o-mini: input $0.15/1M, output $0.60/1M)
  const calculateCost = (tokens: number) => {
    // Estimación promedio: 30% input, 70% output
    const inputTokens = tokens * 0.3;
    const outputTokens = tokens * 0.7;
    return (inputTokens * 0.15 + outputTokens * 0.6) / 1000000;
  };

  const fetchTargets = async () => {
    setLoading(true);
    try {
      const q = filterType === 'all' ? '' : `?targetType=${filterType}`;
      const res = await fetch(`/api/osint${q}`);
      const json = await res.json();
      if (json.success) {
        setTargets(json.data);
      } else {
        showError(json.error || 'Error al cargar targets', 'Error de API');
      }
    } catch (error: any) {
      showError(
        error.message || 'No se pudo conectar con el servidor',
        'Error de red'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargets();
  }, []);

  useEffect(() => {
    fetchTargets();
  }, [filterType]);

  const toArray = (s: string) =>
    s
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      targetType: form.targetType,
      name: form.name,
      aliases: toArray(form.aliases),
      emails: toArray(form.emails),
      phones: toArray(form.phones),
      urls: toArray(form.urls),
      tags: toArray(form.tags),
      notes: form.notes,
    };
    try {
      const res = await fetch('/api/osint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok) {
        setShowForm(false);
        setForm({ targetType: 'person', name: '', aliases: '', emails: '', phones: '', urls: '', tags: '', notes: '' });
        await fetchTargets();
        showSuccess('Target OSINT creado correctamente');
      } else {
        showError(json.error || 'Error al crear target', 'Error');
      }
    } catch (error: any) {
      showError(error.message || 'Error de red al crear target', 'Error');
    }
  };

  const handleNLSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nl.name.trim() || !nl.prompt.trim()) {
      showError('Completa nombre y el prompt en lenguaje natural', 'Faltan datos');
      return;
    }
    try {
      setNlBusy(true);
      const { payload, meta } = buildFromNL(nl.name.trim(), nl.targetType, nl.prompt.trim());
      const res = await fetch('/api/osint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        showError(json.error || 'Error al crear target con NL', 'Error');
        return;
      }
      setNl({ targetType: 'person', name: '', prompt: '' });
      await fetchTargets();
      showSuccess('Target creado desde prompt en lenguaje natural');
      if (meta.dorks?.length) {
        // Mostrar dorks como información al usuario en la consola (evitar persistir innecesariamente)
        console.info('[DORKS]', meta.dorks);
      }
    } catch (error: any) {
      showError(error.message || 'Error de red al crear con NL', 'Error');
    } finally {
      setNlBusy(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedTarget) return;

    const userMessage = {
      role: 'user' as const,
      content: chatInput.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setChatBusy(true);

    try {
      const res = await fetch(`/api/osint/${selectedTarget.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history: chatMessages,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        showError(json.error || 'Error al procesar chat', 'Error');
        setChatBusy(false);
        return;
      }

      const assistantMessage = {
        role: 'assistant' as const,
        content: json.data.response,
        timestamp: new Date().toISOString(),
      };

      const tokensUsed = json.data.tokensUsed || 0;
      const messageCost = calculateCost(tokensUsed);

      setChatMessages((prev) => [...prev, assistantMessage]);
      setChatStats((prev) => ({
        totalTokens: prev.totalTokens + tokensUsed,
        totalCost: prev.totalCost + messageCost,
        lastMessageTokens: tokensUsed,
        lastMessageCost: messageCost,
      }));
    } catch (error: any) {
      showError(error.message || 'Error en la conversación', 'Error');
    } finally {
      setChatBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {selectedTarget ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedTarget(null)}
              className="px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium flex items-center gap-2"
            >
              ← Volver a la lista
            </button>
            <h2 className="text-2xl font-bold text-white">{selectedTarget.name}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Diagrama OSINT */}
            <div className="lg:col-span-2">
              <OsintDiagram target={selectedTarget} />
            </div>

            {/* Chat/Conversación */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden flex flex-col h-[600px]">
                <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-semibold text-white">💬 Conversación</h3>
                      <p className="text-xs text-neutral-400 mt-1">Analiza y pregunta sobre este target</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-300">
                        <span className="font-mono">{chatStats.totalTokens}</span> tokens
                      </p>
                      <p className="text-xs text-green-400/80 font-mono">
                        ${chatStats.totalCost.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-neutral-500 text-sm mt-8">
                      <p>Inicia una conversación sobre este target.</p>
                      <p className="text-xs mt-2">Pregunta sobre perfiles, conexiones, o análisis.</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                            msg.role === 'user'
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/10 text-neutral-200'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className="text-xs opacity-60 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString('es-CL', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  {chatBusy && (
                    <div className="flex justify-start gap-2">
                      <div className="bg-white/10 rounded-lg px-3 py-2 text-sm text-neutral-300">
                        <span className="inline-block animate-pulse">Escribiendo...</span>
                      </div>
                    </div>
                  )}
                  {chatStats.lastMessageTokens > 0 && !chatBusy && (
                    <div className="text-xs text-neutral-500 text-center py-2 border-t border-white/10 mt-2">
                      Último mensaje: {chatStats.lastMessageTokens} tokens (~${chatStats.lastMessageCost.toFixed(4)})
                    </div>
                  )}
                </div>

                {/* Input */}
                <form onSubmit={handleChatSubmit} className="p-3 bg-white/5 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Escribe tu pregunta o análisis..."
                      className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                      disabled={chatBusy}
                    />
                    <button
                      type="submit"
                      disabled={chatBusy || !chatInput.trim()}
                      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium"
                    >
                      Enviar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Objetivos OSINT</h2>
        <div className="flex gap-2 items-center">
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            <button onClick={() => setFilterType('all')} className={`px-3 py-2 text-sm ${filterType==='all'?'bg-white/10 text-white':'text-neutral-300 hover:bg-white/5'}`}>Todos</button>
            <button onClick={() => setFilterType('person')} className={`px-3 py-2 text-sm ${filterType==='person'?'bg-white/10 text-white':'text-neutral-300 hover:bg-white/5'}`}>Personas</button>
            <button onClick={() => setFilterType('company')} className={`px-3 py-2 text-sm ${filterType==='company'?'bg-white/10 text-white':'text-neutral-300 hover:bg-white/5'}`}>Empresas</button>
          </div>
          <button
            onClick={fetchTargets}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
          >
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium"
          >
            + Nuevo Target
          </button>
          <button
            onClick={() => setShowNL(!showNL)}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium"
          >
            ✨ NL
          </button>
        </div>
      </div>

      {showNL && (
        <form onSubmit={handleNLSubmit} className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex gap-3 items-center">
              <label className="text-sm text-neutral-300">Tipo:</label>
              <select
                value={nl.targetType}
                onChange={(e) => setNl({ ...nl, targetType: e.target.value as 'person' | 'company' })}
                className="px-3 py-2 rounded-lg bg-neutral-800 border border-white/20 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              >
                <option value="person" className="bg-neutral-800 text-white">Persona</option>
                <option value="company" className="bg-neutral-800 text-white">Empresa</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Nombre (persona/empresa/alias)"
              value={nl.name}
              onChange={(e) => setNl({ ...nl, name: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500 col-span-2"
              required
            />
            <textarea
              placeholder="Escribe lo que quieres que busquemos (ej: 'busca perfiles en linkedin y github, intenta correos y agrega tag fintech')"
              value={nl.prompt}
              onChange={(e) => setNl({ ...nl, prompt: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500 col-span-2 min-h-[100px]"
              required
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={nlBusy} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-sm font-medium">
              {nlBusy ? 'Procesando…' : 'Crear desde NL'}
            </button>
            <button type="button" onClick={() => setShowNL(false)} className="px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium">
              Cerrar
            </button>
          </div>
          <p className="text-xs text-neutral-400">Solo usamos datos públicos y generamos URLs canónicas y dorks como ayuda. No se recolectan credenciales.</p>
        </form>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex gap-3 items-center">
              <label className="text-sm text-neutral-300">Tipo:</label>
              <select
                value={form.targetType}
                onChange={(e) => setForm({ ...form, targetType: e.target.value as 'person' | 'company' })}
                className="px-3 py-2 rounded-lg bg-neutral-800 border border-white/20 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              >
                <option value="person" className="bg-neutral-800 text-white">Persona</option>
                <option value="company" className="bg-neutral-800 text-white">Empresa</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Nombre (persona/empresa/alias)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500 col-span-2"
              required
            />
            <input
              type="text"
              placeholder="Aliases (separados por coma)"
              value={form.aliases}
              onChange={(e) => setForm({ ...form, aliases: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500 col-span-2"
            />
            <input
              type="text"
              placeholder="Emails (coma)"
              value={form.emails}
              onChange={(e) => setForm({ ...form, emails: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500"
            />
            <input
              type="text"
              placeholder="Teléfonos (coma)"
              value={form.phones}
              onChange={(e) => setForm({ ...form, phones: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500"
            />
            <input
              type="text"
              placeholder="URLs (coma)"
              value={form.urls}
              onChange={(e) => setForm({ ...form, urls: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500 col-span-2"
            />
            <input
              type="text"
              placeholder="Tags (coma)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500 col-span-2"
            />
            <textarea
              placeholder="Notas (no incluir credenciales)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500 col-span-2 min-h-[100px]"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium">
              Guardar
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Tipo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Emails</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">URLs</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Tags</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actualizado</th>
            </tr>
          </thead>
          <tbody>
            {targets.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-neutral-400">No hay targets OSINT aún</td>
              </tr>
            ) : (
              targets.map((t) => (
                <tr 
                  key={t.id} 
                  className="border-b border-white/10 hover:bg-white/5 cursor-pointer"
                  onClick={() => setSelectedTarget(t)}
                >
                  <td className="px-6 py-4 text-sm text-neutral-300">{t.targetType === 'person' ? 'Persona' : 'Empresa'}</td>
                  <td className="px-6 py-4 text-sm text-white">{t.name}</td>
                  <td className="px-6 py-4 text-sm text-neutral-300 truncate max-w-[240px]">{t.emails.join(', ')}</td>
                  <td className="px-6 py-4 text-sm text-neutral-300 truncate max-w-[240px]">{t.urls.join(', ')}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {t.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-neutral-200">{tag}</span>
                      ))}
                      {t.tags.length > 4 && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-neutral-400">+{t.tags.length - 4}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-400">{new Date(t.updatedAt).toLocaleString('es-CL')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
        </>
      )}
    </div>
  );
}
