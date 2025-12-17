'use client';

import { useEffect, useState } from 'react';

type ErrorType = 'react_error' | 'api_error' | 'network_error' | 'validation_error' | 'unknown';

interface ErrorLog {
  _id: string;
  userId?: string;
  type: ErrorType;
  message: string;
  stack?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export function ErrorsList() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<{ type?: ErrorType; resolved?: boolean }>({});
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);

  const fetchErrors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.type) params.set('type', filter.type);
      if (filter.resolved !== undefined) params.set('resolved', String(filter.resolved));

      const res = await fetch(`/api/errors?${params}`);
      const json = await res.json();
      if (json.success) setErrors(json.data);
    } catch (error) {
      console.error('Error fetching errors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrors();
  }, [filter]);

  const markResolved = async (id: string, resolved: boolean) => {
    try {
      const res = await fetch(`/api/errors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolved }),
      });
      if (res.ok) await fetchErrors();
    } catch (error) {
      console.error('Error updating error:', error);
    }
  };

  const deleteError = async (id: string) => {
    if (!confirm('¿Eliminar este error del registro?')) return;
    try {
      const res = await fetch(`/api/errors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedError(null);
        await fetchErrors();
      }
    } catch (error) {
      console.error('Error deleting error:', error);
    }
  };

  const errorTypes: { value: ErrorType; label: string }[] = [
    { value: 'react_error', label: 'React Error' },
    { value: 'api_error', label: 'API Error' },
    { value: 'network_error', label: 'Network Error' },
    { value: 'validation_error', label: 'Validation Error' },
    { value: 'unknown', label: 'Unknown' },
  ];

  const stats = {
    total: errors.length,
    unresolved: errors.filter((e) => !e.resolved).length,
    resolved: errors.filter((e) => e.resolved).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Errores del Sistema</h2>
        <button
          onClick={fetchErrors}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
        >
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-neutral-400 text-sm mb-1">Total</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-neutral-400 text-sm mb-1">Sin resolver</p>
          <p className="text-2xl font-bold text-red-400">{stats.unresolved}</p>
        </div>
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
          <p className="text-neutral-400 text-sm mb-1">Resueltos</p>
          <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filter.type || ''}
          onChange={(e) => setFilter({ ...filter, type: (e.target.value as ErrorType) || undefined })}
          className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
        >
          <option value="">Todos los tipos</option>
          {errorTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <select
          value={filter.resolved === undefined ? '' : String(filter.resolved)}
          onChange={(e) =>
            setFilter({
              ...filter,
              resolved: e.target.value === '' ? undefined : e.target.value === 'true',
            })
          }
          className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
        >
          <option value="">Todos</option>
          <option value="false">Sin resolver</option>
          <option value="true">Resueltos</option>
        </select>
      </div>

      {/* List */}
      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Tipo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Mensaje</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">URL</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {errors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-neutral-400">
                  {loading ? 'Cargando...' : 'No hay errores registrados'}
                </td>
              </tr>
            ) : (
              errors.map((err) => (
                <tr
                  key={err._id}
                  className="border-b border-white/10 hover:bg-white/5 cursor-pointer"
                  onClick={() => setSelectedError(err)}
                >
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        err.type === 'react_error'
                          ? 'bg-purple-500/20 text-purple-300'
                          : err.type === 'api_error'
                            ? 'bg-red-500/20 text-red-300'
                            : err.type === 'network_error'
                              ? 'bg-orange-500/20 text-orange-300'
                              : 'bg-neutral-500/20 text-neutral-300'
                      }`}
                    >
                      {err.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white truncate max-w-xs">
                    {err.message}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-400 truncate max-w-[200px]">
                    {err.url || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        err.resolved
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {err.resolved ? 'Resuelto' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-400">
                    {new Date(err.createdAt).toLocaleString('es-CL')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markResolved(err._id, !err.resolved);
                      }}
                      className="text-blue-400 hover:text-blue-300 mr-2"
                    >
                      {err.resolved ? 'Reabrir' : 'Resolver'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedError && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedError(null)}
        >
          <div
            className="max-w-3xl w-full rounded-xl border border-white/10 bg-neutral-900 p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">Detalle del Error</h3>
              <button
                onClick={() => setSelectedError(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-neutral-400">Tipo</label>
                <p className="text-white mt-1">{selectedError.type}</p>
              </div>
              <div>
                <label className="text-sm text-neutral-400">Mensaje</label>
                <p className="text-white mt-1">{selectedError.message}</p>
              </div>
              {selectedError.url && (
                <div>
                  <label className="text-sm text-neutral-400">URL</label>
                  <p className="text-white mt-1 break-all">{selectedError.url}</p>
                </div>
              )}
              {selectedError.stack && (
                <div>
                  <label className="text-sm text-neutral-400">Stack Trace</label>
                  <pre className="mt-1 p-3 rounded-lg bg-black/30 text-xs text-neutral-300 overflow-auto max-h-40">
                    {selectedError.stack}
                  </pre>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-neutral-400">Creado</label>
                  <p className="text-white mt-1">
                    {new Date(selectedError.createdAt).toLocaleString('es-CL')}
                  </p>
                </div>
                {selectedError.resolved && selectedError.resolvedAt && (
                  <div>
                    <label className="text-sm text-neutral-400">Resuelto</label>
                    <p className="text-white mt-1">
                      {new Date(selectedError.resolvedAt).toLocaleString('es-CL')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  markResolved(selectedError._id, !selectedError.resolved);
                  setSelectedError(null);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
              >
                {selectedError.resolved ? 'Marcar como No Resuelto' : 'Marcar como Resuelto'}
              </button>
              <button
                onClick={() => deleteError(selectedError._id)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
              >
                Eliminar
              </button>
              <button
                onClick={() => setSelectedError(null)}
                className="px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
