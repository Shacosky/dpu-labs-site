import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SecureShare — DPU Labs',
  description: 'SecureShare es la plataforma de compartición segura de archivos con verificación automática y trazabilidad total.',
};

const features = [
  {
    title: 'Compartición segura',
    detail: 'Enlaces privados con expiración, contraseñas y alcance controlado por proyecto.',
  },
  {
    title: 'Verificación automática',
    detail: 'Análisis de tipo de archivo, integridad y metadatos antes de habilitar la descarga.',
  },
  {
    title: 'Registro y trazabilidad',
    detail: 'Auditoría de quién descarga, cuándo lo hace e IP de origen para cumplimiento y control.',
  },
  {
    title: 'Eliminación automática',
    detail: 'Políticas de retención y borrado seguro por fecha, inactividad o regla operativa.',
  },
];

const useCases = [
  'Industria musical: demos, beats, masters y stems (ej. Relokko Records).',
  'Empresas: intercambio de contratos y documentos sensibles.',
  'Equipos tecnológicos: releases internas y colaboración segura de prototipos.',
];

const ctaClasses =
  'inline-flex items-center justify-center rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-brand-400/50 hover:text-brand-200';

export default function SecureShareProjectPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16">
      <section className="max-w-4xl">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-300">Producto DPU Labs</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-white">SecureShare</h1>
        <p className="mt-4 text-lg text-neutral-200">
          Plataforma security-first para compartición segura de archivos con verificación automática y trazabilidad total.
        </p>
        <p className="mt-5 text-neutral-300 leading-relaxed">
          El MVP está orientado a archivos WAV para la industria musical, con controles de acceso, validación de integridad
          y auditoría completa de descargas.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/projects/secureshare/mvp-docs" className={ctaClasses}>
            Ver documentación técnica
          </Link>
          <Link href="#arquitectura" className={ctaClasses}>
            Revisar arquitectura
          </Link>
        </div>
      </section>

      <section aria-labelledby="secureshare-features-title">
        <h2 id="secureshare-features-title" className="section-title">
          Funcionalidades principales
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-medium text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-neutral-300">{feature.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="secureshare-use-cases-title" className="max-w-4xl">
        <h2 id="secureshare-use-cases-title" className="section-title">
          Casos de uso
        </h2>
        <ul className="mt-6 space-y-3 text-neutral-300">
          {useCases.map((item) => (
            <li key={item} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section id="arquitectura" aria-labelledby="secureshare-architecture-title" className="max-w-4xl">
        <h2 id="secureshare-architecture-title" className="section-title">
          Arquitectura tecnológica
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {['Frontend web app', 'Backend APIs de control y verificación', 'Worker de análisis automático', 'Repositorio seguro cifrado', 'Base de datos de trazabilidad y metadatos'].map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-neutral-200">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 pt-8 text-sm text-neutral-400">
        <p>SecureShare by DPU Labs SpA</p>
        <p className="mt-1">Security-first • Trazabilidad • Control total</p>
      </section>
    </div>
  );
}
