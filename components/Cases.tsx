'use client';

import { useI18n } from '@/contexts/I18nContext';

const CASES = [
  {
    key: 'financial',
    tags: ['AWS', 'Lambda', 'Terraform', 'EventBridge'],
  },
  {
    key: 'ecommerce',
    tags: ['AI', 'RAG', 'Vector DB', 'Observability'],
  },
  {
    key: 'telecom',
    tags: ['Purple Team', 'MDR', 'Sigma', 'CI/CD'],
  },
];

export function Cases() {
  const { t } = useI18n();

  return (
    <section id="cases" aria-labelledby="cases-title" className="scroll-mt-20">
      <h2 id="cases-title" className="section-title">{t('cases.title')}</h2>
      <p className="mt-2 max-w-2xl muted">
        {t('cases.subtitle')}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {CASES.map((c) => (
          <article key={c.key} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-white font-medium">{t(`cases.items.${c.key}.title`)}</h3>
            <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
              {t(`cases.items.${c.key}.summary`)}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {c.tags.map((tag) => (
                <li key={tag} className="text-xs text-brand-200 bg-brand-500/10 border border-brand-400/20 rounded-full px-2 py-1">
                  {tag}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

