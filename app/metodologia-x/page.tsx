import type { Metadata } from 'next';
import Link from 'next/link';
import { WeeklyCycleGrid } from '@/components/metodologia-x/WeeklyCycleGrid';
import { PrinciplesList } from '@/components/metodologia-x/PrinciplesList';

export const metadata: Metadata = {
  title: 'Metodología X',
  description:
    'Framework Operativo Oficial de DPUXLABS: sistema semanal enfocado en velocidad, QA obligatorio, seguridad integrada y producción constante.',
  alternates: {
    canonical: '/metodologia-x',
  },
  openGraph: {
    title: 'Metodología X | DPUXLABS',
    description:
      'Sistema de ejecución semanal orientado a velocidad, calidad y producción constante con enfoque purple team.',
    url: 'https://dpuxlabs.cl/metodologia-x',
    type: 'article',
  },
};

export default function MetodologiaXPage() {
  return (
    <div className="space-y-20 py-12 sm:space-y-24 sm:py-16">
      <section className="relative overflow-hidden rounded-3xl border border-violet-400/30 bg-neutral-950 px-6 py-14 sm:px-12">
        <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-violet-700/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative max-w-3xl space-y-6 animate-fade-in-up">
          <p className="text-xs uppercase tracking-[0.28em] text-violet-300">Framework oficial</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">Metodología X</h1>
          <p className="text-xl text-violet-100/90">Framework Operativo Oficial de DPUXLABS</p>
          <p className="max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">
            Sistema de ejecución semanal orientado a velocidad, calidad y producción constante.
          </p>
          <Link
            href="#ciclo-operativo"
            className="inline-flex items-center gap-2 rounded-full bg-[#6A0DAD] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-700/30"
          >
            Ver Ciclo Operativo
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <WeeklyCycleGrid />
      <PrinciplesList />

      <section className="rounded-3xl bg-[#6A0DAD] px-6 py-12 text-center shadow-2xl shadow-violet-900/30 sm:px-10">
        <p className="text-2xl font-semibold tracking-tight text-white sm:text-4xl">
          “No seguimos metodologías. Las construimos.”
        </p>
      </section>
    </div>
  );
}
