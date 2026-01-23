
"use client";
import React from 'react';
import ProjectCard from './ProjectCard';
import { useProjects } from '@/hooks/useProjects';

const projects = [
  {
    title: 'Ciberseguridad',
    value: 'Soluciones defensivas, preventivas y de monitoreo para proteger activos digitales y empresariales.',
    features: [
      'Análisis de vulnerabilidades',
      'Monitoreo de amenazas en tiempo real',
      'Implementación de controles de seguridad',
      'Respuesta ante incidentes',
      'Cumplimiento normativo',
    ],
    useCases: [
      'Protección de infraestructura TI',
      'Auditorías de seguridad',
      'Defensa contra ataques y malware',
      'Monitoreo continuo de sistemas',
    ],
    contactUrl: '/contact',
  },
  {
    title: 'CCTV y Seguridad Física',
    value: 'Implementación y gestión de sistemas de videovigilancia y seguridad física para empresas y comunidades.',
    features: [
      'Instalación de cámaras y sensores',
      'Integración con sistemas de alarma',
      'Monitoreo remoto y local',
      'Soporte y mantenimiento',
      'Soluciones escalables',
    ],
    useCases: [
      'Condominios y edificios corporativos',
      'Empresas y fábricas',
      'Comunidades y espacios públicos',
      'Integración con seguridad digital',
    ],
    contactUrl: '/contact',
  },
];

export default function ProjectsSection() {
  const { projects, loading, error, fetchProjects, createProject } = useProjects();

  const [form, setForm] = React.useState({
    name: '',
    type: '',
    description: '',
    features: [''],
    useCases: [''],
  });
  const [formLoading, setFormLoading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field: 'features' | 'useCases', idx: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === idx ? value : item)),
    }));
  };

  const addArrayField = (field: 'features' | 'useCases') => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayField = (field: 'features' | 'useCases', idx: number) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      if (!form.name || !form.type) {
        setFormError('Nombre y tipo son obligatorios');
        setFormLoading(false);
        return;
      }
      // Filtrar arrays vacíos
      const payload = {
        ...form,
        features: form.features.filter((f) => f.trim() !== ''),
        useCases: form.useCases.filter((u) => u.trim() !== ''),
      };
      await createProject(payload);
      setForm({ name: '', type: '', description: '', features: [''], useCases: [''] });
    } catch (err: any) {
      setFormError(err.message || 'Error al crear proyecto');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Proyectos</h1>

      {/* Formulario para crear proyecto */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-xl border border-white/10 bg-white/5">
        <h2 className="text-xl font-semibold text-white mb-4">Crear nuevo proyecto</h2>
        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre del proyecto"
            className="w-full px-3 py-2 rounded bg-neutral-900 text-white border border-white/10 mb-2"
            required
          />
          <input
            type="text"
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="Tipo de proyecto"
            className="w-full px-3 py-2 rounded bg-neutral-900 text-white border border-white/10 mb-2"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción (opcional)"
            className="w-full px-3 py-2 rounded bg-neutral-900 text-white border border-white/10 mb-2"
            rows={3}
          />
        </div>
        <div className="mb-4">
          <label className="block text-white font-semibold mb-2">Características (features)</label>
          {form.features.map((f, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={f}
                onChange={(e) => handleArrayChange('features', i, e.target.value)}
                placeholder={`Feature #${i + 1}`}
                className="flex-1 px-3 py-2 rounded bg-neutral-900 text-white border border-white/10"
              />
              <button type="button" onClick={() => removeArrayField('features', i)} className="px-2 text-red-400">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayField('features')} className="px-3 py-1 bg-brand-500 text-white rounded hover:bg-brand-400">Agregar característica</button>
        </div>
        <div className="mb-4">
          <label className="block text-white font-semibold mb-2">Casos típicos (useCases)</label>
          {form.useCases.map((u, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={u}
                onChange={(e) => handleArrayChange('useCases', i, e.target.value)}
                placeholder={`Caso #${i + 1}`}
                className="flex-1 px-3 py-2 rounded bg-neutral-900 text-white border border-white/10"
              />
              <button type="button" onClick={() => removeArrayField('useCases', i)} className="px-2 text-red-400">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayField('useCases')} className="px-3 py-1 bg-brand-500 text-white rounded hover:bg-brand-400">Agregar caso</button>
        </div>
        {formError && <div className="text-red-400 mb-2">{formError}</div>}
        <button
          type="submit"
          className="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-400"
          disabled={formLoading}
        >
          {formLoading ? 'Creando...' : 'Crear proyecto'}
        </button>
      </form>

      {loading && <div className="text-neutral-400">Cargando proyectos...</div>}
      {error && (
        <div className="text-red-400 mb-4">
          Error: {error}
          <button
            className="ml-4 px-3 py-1 bg-brand-500 text-white rounded hover:bg-brand-400"
            onClick={fetchProjects}
          >
            Reintentar
          </button>
        </div>
      )}
      {projects.length === 0 && !loading && !error && (
        <div className="text-neutral-400">No hay proyectos aún.</div>
      )}
      {projects.map((p, i) => (
        <ProjectCard
          key={p._id || i}
          title={p.name}
          value={p.description || ''}
          features={p.features || []}
          useCases={p.useCases || []}
          contactUrl={"/contact"}
        />
      ))}
    </section>
  );
}
