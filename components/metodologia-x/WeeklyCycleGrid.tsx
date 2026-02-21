import { weeklyCycle } from './constants';

export function WeeklyCycleGrid() {
  return (
    <section id="ciclo-operativo" className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-violet-300">Ciclo Semanal</p>
        <h2 className="section-title">Operación orientada a ejecución continua</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {weeklyCycle.map((item, index) => (
          <article
            key={item.day}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/60"
            style={{ animation: 'fade-in-up 0.6s ease-out both', animationDelay: `${index * 100}ms` }}
          >
            <span className="absolute inset-x-0 top-0 h-0.5 bg-violet-500/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">{item.day}</p>
            <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-300">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
