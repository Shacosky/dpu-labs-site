'use client';

import Link from 'next/link';

const PROOF_CARDS = [
  {
    icon: '⚙️',
    title: 'Architecture',
    description: 'System design, backend robustness, modular patterns, scalability from day one.',
  },
  {
    icon: '🚀',
    title: 'Production',
    description: 'Real systems in production. Observability, logging, deployments, reliability.',
  },
  {
    icon: '🧠',
    title: 'Applied AI',
    description: 'RAG, automation, assistants, LLM integration. Evidence-based implementations.',
  },
];

export function Hero() {
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
              Software Engineer
              <span className="block text-brand-400">Systems & Architecture</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed max-w-2xl">
              Backend-first. Production-ready. Security mindset. Real systems, not startups.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#experience"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors"
            >
              Experience
            </a>
            <a
              href="#projects"
              className="px-6 py-3 border border-white/20 hover:bg-white/5 text-white font-semibold rounded-lg transition-colors"
            >
              Projects
            </a>
            <a
              href="#assistant"
              className="px-6 py-3 border border-white/20 hover:bg-white/5 text-white font-semibold rounded-lg transition-colors"
            >
              Ask Something
            </a>
          </div>

          {/* Proof Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {PROOF_CARDS.map((card, idx) => (
              <div
                key={idx}
                className="group rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-6 transition-colors"
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-sm text-neutral-400">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
              className={`absolute inset-0 transition-all duration-700 ${
                index === currentSlide
                  ? 'opacity-100 translate-x-0'
                  : index < currentSlide
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full'
              }`}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/40 bg-brand-500/10 px-4 py-2 text-xs text-brand-200 animate-fade-in-up backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400 shadow-[0_0_16px_#a78bfa] animate-pulse-glow" />
                {t(slide.badge)}
              </div>
              <h1 id="hero-title" className="mt-6 text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white animate-fade-in-up animation-delay-100 bg-gradient-to-br from-white via-white to-neutral-300 bg-clip-text text-transparent">
                {t(slide.title)}
              </h1>
              <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-neutral-300 leading-relaxed animate-fade-in-up animation-delay-200">
                {t(slide.description)}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
                <WhatsAppButton label={t('hero.whatsapp')} size="lg" />
                <Link
                  href="#services"
                  className="group inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white px-6 py-3.5 text-base font-medium transition-all hover:border-white/20 hover:scale-105"
                >
                  {t('hero.explore')}
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-brand-500'
                  : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

