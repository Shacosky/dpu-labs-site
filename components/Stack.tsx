const TOOLS = [
  'AWS',
  'Kubernetes',
  'Terraform',
  'TypeScript',
  'Node.js',
  'Python',
  'Next.js',
  'PostgreSQL',
  'OpenSearch',
  'LangChain',
  'OpenAI API',
  'GitHub Actions',
];

export function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="scroll-mt-20">
      <h2 id="stack-title" className="section-title">Stack</h2>
      <p className="mt-2 max-w-2xl muted">
        Standards‑aligned technologies for secure, observable, and scalable delivery.
      </p>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {TOOLS.map((t) => (
          <div key={t} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200">
            {t}
          </div>
        ))}
      </div>
    </section>
  );
}

