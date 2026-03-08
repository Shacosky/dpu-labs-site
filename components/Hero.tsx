'use client';

import { useEffect, useState } from 'react';
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
  const slides = [
    {
      badgeKey: 'hero.badge',
      titleKey: 'hero.title',
      descriptionKey: 'hero.description',
    },
    {
      badgeKey: 'hero.slide2.badge',
      titleKey: 'hero.slide2.title',
      descriptionKey: 'hero.slide2.description',
    },
    {
      badgeKey: 'hero.slide3.badge',
      titleKey: 'hero.slide3.title',
      descriptionKey: 'hero.slide3.description',
    },
  ];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[activeSlide];

  return (
    <section aria-labelledby="hero-title" className="pt-6 sm:pt-10 pb-8">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/60 to-neutral-950 p-8 sm:p-12 lg:p-16">
        {/* Subtle gradient orbs (not animated, just visual) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]" />
        
        {/* Content */}
        <div className="relative space-y-8 sm:space-y-10">
          {/* Carousel */}
          <div className="rounded-2xl border border-brand-400/20 bg-gradient-to-r from-brand-500/10 via-white/5 to-purple-500/10 p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/40 bg-brand-500/10 px-3 py-1.5 text-xs text-brand-200">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              {t(currentSlide.badgeKey)}
            </div>
            <h2 className="mt-4 text-2xl sm:text-4xl font-semibold text-white leading-tight">{t(currentSlide.titleKey)}</h2>
            <p className="mt-3 text-neutral-300 leading-relaxed max-w-3xl">{t(currentSlide.descriptionKey)}</p>

            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-xs tracking-[0.16em] uppercase text-neutral-400">
                {String(activeSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </p>

              <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.titleKey}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={activeSlide === index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    activeSlide === index ? 'w-8 bg-brand-400' : 'w-2.5 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
              </div>
            </div>
          </div>

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
