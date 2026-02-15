'use client';

import { useI18n } from '@/contexts/I18nContext';

const PROOF_CARDS = [
  {
    icon: '⚙️',
    key: 'architecture',
    titleKey: 'hero.proofCards.architecture.title',
    descriptionKey: 'hero.proofCards.architecture.description',
  },
  {
    icon: '🚀',
    key: 'production',
    titleKey: 'hero.proofCards.production.title',
    descriptionKey: 'hero.proofCards.production.description',
  },
  {
    icon: '🧠',
    key: 'ai',
    titleKey: 'hero.proofCards.ai.title',
    descriptionKey: 'hero.proofCards.ai.description',
  },
];

export function Hero() {
  const { t } = useI18n();

  return (
    <section aria-labelledby="hero-title" className="pt-6 sm:pt-10 pb-8">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/60 to-neutral-950 p-8 sm:p-12 lg:p-16">
        {/* Subtle gradient orbs (not animated, just visual) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
        
        {/* Content */}
        <div className="relative space-y-8 sm:space-y-10">
          {/* Headline & Subtext */}
          <div className="max-w-3xl">
            <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              {t('hero.engineering.title')}
              <span className="block text-brand-400">{t('hero.engineering.subtitle')}</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed max-w-2xl">
              {t('hero.engineering.description')}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#stack"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors"
            >
              {t('hero.engineering.cta1')}
            </a>
            <a
              href="#security"
              className="px-6 py-3 border border-white/20 hover:bg-white/5 text-white font-semibold rounded-lg transition-colors"
            >
              {t('hero.engineering.cta2')}
            </a>
            <a
              href="#contact"
              className="px-6 py-3 border border-white/20 hover:bg-white/5 text-white font-semibold rounded-lg transition-colors"
            >
              {t('hero.engineering.cta3')}
            </a>
          </div>

          {/* Proof Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {PROOF_CARDS.map((card) => (
              <div
                key={card.key}
                className="group rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-6 transition-colors"
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{t(card.titleKey)}</h3>
                <p className="text-sm text-neutral-400">{t(card.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
