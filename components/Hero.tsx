'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useI18n } from '@/contexts/I18nContext';

// Lazy load WhatsAppButton (no crítico para FCP/LCP)
const WhatsAppButton = dynamic(() => import('./WhatsAppButton').then(m => ({ default: m.WhatsAppButton })), {
  ssr: false,
  loading: () => (
    <div className="inline-flex items-center justify-center rounded-md bg-brand-500/20 text-white px-5 py-3 text-base animate-pulse">
      Cargando...
    </div>
  ),
});

export function Hero() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="hero-title" className="pt-6 sm:pt-10">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/60 to-neutral-950 p-6 sm:p-10">
        <div className="absolute inset-0 bg-grid-dark bg-[length:24px_24px] opacity-20 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/40 bg-brand-500/10 px-3 py-1.5 text-xs text-brand-200">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 shadow-[0_0_12px_#a78bfa]" />
            {t('hero.badge')}
          </div>
          <h1 id="hero-title" className="mt-4 text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white">
            {t('hero.title')}
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-neutral-300">
            {t('hero.description')}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <WhatsAppButton label={t('hero.whatsapp')} size="lg" />
            <Link
              href="#services"
              className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 hover:bg-white/10 text-white px-5 py-3 text-base"
            >
              {t('hero.explore')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

