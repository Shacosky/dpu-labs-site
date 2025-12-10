'use client';

import { useI18n } from '@/contexts/I18nContext';

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
  const { t } = useI18n();

  return (
    <section id="stack" aria-labelledby="stack-title" className="scroll-mt-20">
      <h2 id="stack-title" className="section-title">{t('stack.title')}</h2>
      <p className="mt-2 max-w-2xl muted">
        {t('stack.subtitle')}
      </p>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {TOOLS.map((tool) => (
          <div key={tool} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-neutral-200">
            {tool}
          </div>
        ))}
      </div>
    </section>
  );
}

