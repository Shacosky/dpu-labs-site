'use client';

import { useI18n } from '@/contexts/I18nContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const CASES = [
  {
    key: 'financial',
    tags: ['AWS', 'Lambda', 'Terraform', 'EventBridge'],
    color: 'emerald',
  },
  {
    key: 'ecommerce',
    tags: ['AI', 'RAG', 'Vector DB', 'Observability'],
    color: 'blue',
  },
  {
    key: 'telecom',
    tags: ['Purple Team', 'MDR', 'Sigma', 'CI/CD'],
    color: 'rose',
  },
];

const colorMap = {
  emerald: {
    bg: 'group-hover:from-emerald-500/10 group-hover:to-teal-500/10',
    border: 'group-hover:border-emerald-400/30',
    tagBg: 'bg-emerald-500/10',
    tagBorder: 'border-emerald-400/20',
    tagText: 'text-emerald-200',
  },
  blue: {
    bg: 'group-hover:from-blue-500/10 group-hover:to-cyan-500/10',
    border: 'group-hover:border-blue-400/30',
    tagBg: 'bg-blue-500/10',
    tagBorder: 'border-blue-400/20',
    tagText: 'text-blue-200',
  },
  rose: {
    bg: 'group-hover:from-rose-500/10 group-hover:to-pink-500/10',
    border: 'group-hover:border-rose-400/30',
    tagBg: 'bg-rose-500/10',
    tagBorder: 'border-rose-400/20',
    tagText: 'text-rose-200',
  },
};

export function Cases() {
  const { t } = useI18n();
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section id="cases" aria-labelledby="cases-title" className="scroll-mt-20">
      <div 
        ref={headerRef}
        className={`text-center transition-all duration-700 ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 id="cases-title" className="section-title">{t('cases.title')}</h2>
        <p className="mt-3 max-w-2xl muted mx-auto">
          {t('cases.subtitle')}
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {CASES.map((c, index) => {
          const colors = colorMap[c.color as keyof typeof colorMap];
          const { ref, isVisible } = useScrollReveal<HTMLElement>();
          return (
            <article 
              key={c.key}
              ref={ref}
              className={`group relative rounded-xl border border-white/10 ${colors.border} bg-white/5 p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${colors.bg}`} />
              
              <div className="relative">
                {/* Header with icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                    <svg className="w-6 h-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-xs text-neutral-500 font-mono">Case Study</span>
                </div>
                
                <h3 className="text-white font-semibold text-xl mb-3 group-hover:text-brand-200 transition-colors">
                  {t(`cases.items.${c.key}.title`)}
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                  {t(`cases.items.${c.key}.summary`)}
                </p>
                
                {/* Tags */}
                <ul className="flex flex-wrap gap-2">
                  {c.tags.map((tag) => (
                    <li 
                      key={tag} 
                      className={`text-xs ${colors.tagText} ${colors.tagBg} border ${colors.tagBorder} rounded-full px-3 py-1.5 font-medium`}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

