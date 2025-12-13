'use client';

import { useI18n } from '@/contexts/I18nContext';

const ITEMS = [
  {
    key: 'software',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-brand-300" aria-hidden>
        <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="2" />
        <path d="M8 10l2 2-2 2m6-4l-2 2 2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'transformation',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-brand-300" aria-hidden>
        <path d="M4 12h16M12 4l4 4-4 4m0 0L8 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 12l4 4-4 4m0 0l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'advisory',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-brand-300" aria-hidden>
        <path d="M8 11a4 4 0 118 0v1h1a2 2 0 012 2v4H5v-4a2 2 0 012-2h1v-1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: 'cybersecurity',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-brand-300" aria-hidden>
        <path d="M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7l7-4z" stroke="currentColor" strokeWidth="2" />
        <path d="M10 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'kaizen',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-brand-300" aria-hidden>
        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="2" />
        <path d="M7 12h10M12 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'operations',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-brand-300" aria-hidden>
        <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="16" cy="16" r="2" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];

export function Services() {
  const { t } = useI18n();

  return (
    <section id="services" aria-labelledby="services-title" className="scroll-mt-20">
      <h2 id="services-title" className="section-title">{t('services.title')}</h2>
      <p className="mt-2 max-w-2xl muted">
        {t('services.subtitle')}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => (
          <div key={item.key} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3">
              {item.icon}
              <h3 className="text-white font-medium">{t(`services.items.${item.key}.title`)}</h3>
            </div>
            <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
              {t(`services.items.${item.key}.description`)}
            </p>
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-brand-500/10 to-transparent" />
          </div>
        ))}
      </div>
    </section>
  );
}

