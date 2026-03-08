import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
// import { Cases } from '@/components/Cases';
import { Stack } from '@/components/Stack';
import { SecurityObservability } from '@/components/SecurityObservability';
import { Contact } from '@/components/Contact';
import { ProjectsPreview } from '@/components/ProjectsPreview';
import Link from 'next/link';

// Cache estático: revalidar cada hora (3600s)
export const revalidate = 3600;

export default function Page() {
  return (
    <div className="space-y-28 sm:space-y-32 py-12 sm:py-16">
      <Hero />
      <div className="my-8 sm:my-12 border-t border-white/10 w-full" />
      <Services />
      <div className="my-8 sm:my-12 border-t border-white/10 w-full" />
      
      {/* Sección CTA - Metodología X */}
      <section className="relative overflow-hidden rounded-3xl border border-violet-400/30 bg-gradient-to-br from-purple-950/40 via-neutral-950 to-violet-950/30 px-6 py-16 sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 -bottom-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-2 border border-violet-400/30">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              <span className="text-xs font-semibold text-violet-200 uppercase tracking-wider">Framework Operativo</span>
            </div>
            
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              Conoce <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300">Metodología X</span>
            </h2>
            
            <p className="text-lg sm:text-xl text-neutral-200 leading-relaxed max-w-2xl">
              Nuestro framework operativo oficial: Sistema semanal orientado a velocidad, calidad y producción constante con enfoque purple team.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 pt-4">
            {['Ciclo Semanal', 'QA Obligatorio', 'Seguridad Integrada', 'Producción Constante'].map((feature) => (
              <div key={feature} className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 border border-white/10 hover:border-violet-400/50 transition-colors">
                <span className="text-violet-400">✓</span>
                <span className="text-sm text-neutral-300">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Link
              href="/metodologia-x"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:shadow-2xl hover:shadow-violet-600/50 hover:scale-105 group"
            >
              Explorar Metodología X
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-400/50 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-violet-500/10 hover:border-violet-400 group"
            >
              Contáctanos
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="my-8 sm:my-12 border-t border-white/10 w-full" />
      <ProjectsPreview />
      <div className="my-8 sm:my-12 border-t border-white/10 w-full" />
      <Stack />
      <div className="my-8 sm:my-12 border-t border-white/10 w-full" />
      <SecurityObservability />
      <div className="my-8 sm:my-12 border-t border-white/10 w-full" />
      <Contact />
    </div>
  );
}

