'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
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

const SLIDES = [
  {
    badge: 'hero.badge',
    title: 'hero.title',
    description: 'hero.description',
  },
  {
    badge: 'hero.slide2.badge',
    title: 'hero.slide2.title',
    description: 'hero.slide2.description',
  },
  {
    badge: 'hero.slide3.badge',
    title: 'hero.slide3.title',
    description: 'hero.slide3.description',
  },
];

export function Hero() {
  const { t } = useI18n();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000); // Cambia cada 6 segundos

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setIsAutoPlaying(false);
  };

  return (
    <section aria-labelledby="hero-title" className="pt-6 sm:pt-10">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/60 to-neutral-950 p-8 sm:p-12 lg:p-16">
        {/* Grid background with animation */}
        <div className="absolute inset-0 bg-grid-dark bg-[length:24px_24px] opacity-20 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)] animate-grid-flow" />
        
        {/* Floating gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] animate-float-delayed" />
        
        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center text-white"
          aria-label="Slide anterior"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center text-white"
          aria-label="Siguiente slide"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <div className="relative min-h-[400px] sm:min-h-[450px]">
          {SLIDES.map((slide, index) => (
            <div
              key={index}
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

