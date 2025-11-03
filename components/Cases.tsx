const CASES = [
  {
    title: 'Financial services (Peru)',
    summary:
      'Serverless data integration on AWS with IaC and event‑driven design. 40% cost reduction and faster reporting.',
    tags: ['AWS', 'Lambda', 'Terraform', 'EventBridge'],
  },
  {
    title: 'E‑commerce (Mexico)',
    summary:
      'LLM assistant for support triage with secure RAG over product/FAQ data. AHT down 32%, CSAT up.',
    tags: ['AI', 'RAG', 'Vector DB', 'Observability'],
  },
  {
    title: 'Telecom (LatAm)',
    summary:
      'Detection engineering uplift: adversary emulation, use‑case catalog, and CI for detections.',
    tags: ['Purple Team', 'MDR', 'Sigma', 'CI/CD'],
  },
];

export function Cases() {
  return (
    <section id="cases" aria-labelledby="cases-title" className="scroll-mt-20">
      <h2 id="cases-title" className="section-title">Selected Cases</h2>
      <p className="mt-2 max-w-2xl muted">
        Pragmatic delivery across sectors. We tailor solutions to local regulations, risk, and team maturity.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {CASES.map((c) => (
          <article key={c.title} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-white font-medium">{c.title}</h3>
            <p className="mt-2 text-sm text-neutral-300 leading-relaxed">{c.summary}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {c.tags.map((t) => (
                <li key={t} className="text-xs text-brand-200 bg-brand-500/10 border border-brand-400/20 rounded-full px-2 py-1">
                  {t}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

