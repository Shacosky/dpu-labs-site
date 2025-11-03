const ITEMS = [
  {
    title: 'AI Automation',
    desc: 'Intelligent assistants, secure RAG, workflow orchestration and observability for real business impact.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-brand-300" aria-hidden>
        <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Cloud & DevOps (AWS)',
    desc: 'Well‑Architected workloads, IaC (Terraform), containers/serverless, CI/CD and FinOps on AWS.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-brand-300" aria-hidden>
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Cybersecurity (Purple Team)',
    desc: 'Adversary emulation meets detection engineering: harden, test, and uplift SOC effectiveness.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-brand-300" aria-hidden>
        <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: 'Data & Integration',
    desc: 'Event‑driven pipelines, APIs and integration patterns that unlock analytics and automation.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-brand-300" aria-hidden>
        <path d="M3 7h18M3 12h12M3 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="scroll-mt-20">
      <h2 id="services-title" className="section-title">Services</h2>
      <p className="mt-2 max-w-2xl muted">
        From design to run: secure automation and cloud platforms delivered to standards, with local context in Peru and Mexico.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <div key={item.title} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3">
              {item.icon}
              <h3 className="text-white font-medium">{item.title}</h3>
            </div>
            <p className="mt-3 text-sm text-neutral-300 leading-relaxed">{item.desc}</p>
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-brand-500/10 to-transparent" />
          </div>
        ))}
      </div>
    </section>
  );
}

