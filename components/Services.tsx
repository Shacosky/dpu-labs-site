'use client';

import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const ITEMS = [
  {
    key: 'software',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-brand-400" aria-hidden>
        <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="2" />
        <path d="M8 10l2 2-2 2m6-4l-2 2 2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    gradient: 'from-brand-500/20 to-purple-500/20',
  },
  {
    key: 'transformation',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-cyan-400" aria-hidden>
        <path d="M4 12h16M12 4l4 4-4 4m0 0L8 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 12l4 4-4 4m0 0l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    gradient: 'from-cyan-500/20 to-blue-500/20',
  },
  {
    key: 'advisory',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-emerald-400" aria-hidden>
        <path d="M8 11a4 4 0 118 0v1h1a2 2 0 012 2v4H5v-4a2 2 0 012-2h1v-1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    key: 'cybersecurity',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-rose-400" aria-hidden>
        <path d="M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7l7-4z" stroke="currentColor" strokeWidth="2" />
        <path d="M10 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    gradient: 'from-rose-500/20 to-pink-500/20',
  },
  {
    key: 'kaizen',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-amber-400" aria-hidden>
        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="2" />
        <path d="M7 12h10M12 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
  {
    key: 'operations',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-indigo-400" aria-hidden>
        <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="16" cy="16" r="2" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    gradient: 'from-indigo-500/20 to-violet-500/20',
  },
];

export function Services() {
  const { t } = useI18n();
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const closeModal = () => setSelectedService(null);

  return (
    <section id="services" aria-labelledby="services-title" className="scroll-mt-20">
      <div 
        ref={headerRef}
        className={`text-center transition-all duration-700 ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 id="services-title" className="section-title">{t('services.title')}</h2>
        <p className="mt-3 max-w-2xl muted mx-auto">
          {t('services.subtitle')}
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item, index) => {
          const { ref, isVisible } = useScrollReveal<HTMLButtonElement>();
          return (
            <button
              key={item.key}
              ref={ref}
              onClick={() => setSelectedService(item.key)}
              className={`group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-500/10 text-left w-full cursor-pointer ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Animated gradient background */}
              <div className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${item.gradient}`} />
              
              <div className="relative">
                {/* Icon with background */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors mb-4">
                  {item.icon}
                </div>
                
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-brand-200 transition-colors">
                  {t(`services.items.${item.key}.title`)}
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {t(`services.items.${item.key}.description`)}
                </p>
              </div>
              
              {/* Hover arrow indicator */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="bg-neutral-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 sm:p-8 animate-scale-in shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-white"
              aria-label="Cerrar modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-brand-500/10 mb-6">
              {ITEMS.find(item => item.key === selectedService)?.icon}
            </div>

            {/* Content */}
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {t(`services.items.${selectedService}.title`)}
            </h3>
            
            <p className="text-neutral-300 leading-relaxed mb-6">
              {t(`services.items.${selectedService}.fullDescription`)}
            </p>

            {/* Features list */}
            <div className="space-y-3 mb-6">
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide">
                {t('services.modal.features')}
              </h4>
              {[1, 2, 3, 4].map((i) => {
                const featureKey = `services.items.${selectedService}.features.${i}`;
                const feature = t(featureKey);
                if (feature === featureKey) return null;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm text-neutral-300">{feature}</p>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <a
              href="#contact"
              onClick={closeModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 text-sm font-semibold transition-all hover:scale-105 shadow-lg shadow-brand-500/20"
            >
              {t('services.modal.cta')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

