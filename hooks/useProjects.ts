import { useState, useEffect } from 'react';

export interface Project {
  _id?: string;
  name: string;
  type: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  budget?: number;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('No se pudo cargar los proyectos');
      const data = await res.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (data: Partial<Project>) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al crear proyecto');
    }
    await fetchProjects(); // Recargar desde la base de datos
    const newProject = await res.json();
    return newProject;
  };

  return { projects, loading, error, createProject, fetchProjects };
}