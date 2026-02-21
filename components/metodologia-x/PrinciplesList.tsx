import { principles } from './constants';

export function PrinciplesList() {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-violet-300">Principios</p>
        <h2 className="section-title">Reglas no negociables de Metodología X</h2>
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {principles.map((principle, index) => (
          <li
            key={principle}
            className="flex items-start gap-4 rounded-xl border border-white/10 bg-neutral-900/70 p-4"
            style={{ animation: 'fade-in 0.4s ease-out both', animationDelay: `${index * 80}ms` }}
          >
            <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full border border-violet-300/50 bg-violet-500/20 text-violet-200">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="text-sm text-neutral-200">{principle}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
