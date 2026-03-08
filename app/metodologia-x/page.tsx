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
      {/* Sección Casos Seleccionados */}
      <section className="relative overflow-hidden rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-950/50 to-neutral-950 px-6 py-16 sm:px-12">
        <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />
        
        <div className="relative max-w-3xl space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-2 border border-violet-400/30">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              <span className="text-xs font-semibold text-violet-200 uppercase tracking-wider">Casos Seleccionados</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Descubre cómo transformamos <span className="text-violet-400">resultados reales</span>
            </h2>
            
            <p className="text-lg text-neutral-300 leading-relaxed max-w-2xl">
              Casos de estudio de implementaciones exitosas en infraestructura, inteligencia artificial, y ciberseguridad. Conoce los desafíos, soluciones y resultados medibles de nuestros proyectos.
            </p>
          </div>

          {/* CTA Cards */}
          <div className="grid gap-4 sm:grid-cols-3 mt-10">
            {[
              { title: 'Infraestructura', icon: '🏗️', color: 'from-emerald-500/20 to-teal-500/20' },
              { title: 'Inteligencia Artificial', icon: '🤖', color: 'from-blue-500/20 to-cyan-500/20' },
              { title: 'Ciberseguridad', icon: '🛡️', color: 'from-rose-500/20 to-pink-500/20' },
            ].map((item) => (
              <div
                key={item.title}
                className={`group relative rounded-xl border border-white/10 bg-gradient-to-br ${item.color} p-6 transition-all duration-300 hover:scale-105 hover:border-white/20 hover:shadow-lg cursor-pointer`}
              >
                <div className="relative flex flex-col gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="text-white font-semibold text-sm sm:text-base group-hover:text-violet-200">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    Explora implementaciones y mejores prácticas
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-violet-600/50 hover:scale-105 group"
            >
              Ver todos los casos
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="rounded-3xl bg-[#6A0DAD] px-6 py-12 text-center shadow-2xl shadow-violet-900/30 sm:px-10">
        <p className="text-2xl font-semibold tracking-tight text-white sm:text-4xl">
          “No seguimos metodologías. Las construimos.”
        </p>
      </section>
    </div>
  );
}
