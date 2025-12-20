"use client";

import { FormEvent, useMemo, useState } from 'react';
import { WhatsAppButton } from './WhatsAppButton';
import { useI18n } from '@/contexts/I18nContext';

export function Contact() {
  const { t, locale } = useI18n();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const waHref = useMemo(() => {
    const base = 'https://wa.me/56942867168?text=';
    const greeting = locale === 'es' 
      ? `Hola DPU Labs, soy ${name || '—'}. `
      : `Hi DPU Labs, I'm ${name || '—'}. `;
    const emailText = email 
      ? (locale === 'es' ? `Mi correo es ${email}. ` : `My email is ${email}. `)
      : '';
    const messageText = message 
      ? (locale === 'es' ? `Mensaje: ${message}` : `Message: ${message}`)
      : (locale === 'es' 
          ? 'Me gustaría conversar sobre un proyecto en ciberseguridad/automatización.' 
          : 'I would like to discuss a cybersecurity/automation project.');
    
    const text = greeting + emailText + messageText;
    return base + encodeURIComponent(text);
  }, [name, email, message, locale]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    window.open(waHref, '_blank', 'noopener');
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20">
      <div className="text-center">
        <h2 id="contact-title" className="section-title">{t('contact.title')}</h2>
        <p className="mt-3 max-w-2xl muted mx-auto">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Formulario */}
        <form onSubmit={onSubmit} className="group rounded-xl border border-white/10 hover:border-white/20 bg-white/5 p-6 transition-all duration-300">
          <div className="grid gap-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
                {t('contact.form.name')}
              </label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-neutral-900/50 backdrop-blur-sm px-4 py-3 text-white placeholder:text-neutral-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-colors"
                placeholder={t('contact.form.namePlaceholder')}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                {t('contact.form.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-neutral-900/50 backdrop-blur-sm px-4 py-3 text-white placeholder:text-neutral-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-colors"
                placeholder={t('contact.form.emailPlaceholder')}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">
                {t('contact.form.message')}
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-neutral-900/50 backdrop-blur-sm px-4 py-3 text-white placeholder:text-neutral-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-colors resize-none"
                placeholder={t('contact.form.messagePlaceholder')}
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 text-sm font-semibold transition-all hover:scale-105 shadow-lg shadow-brand-500/20"
                aria-label={t('contact.form.submit')}
              >
                {t('contact.form.submit')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-300 hover:text-white underline underline-offset-4 transition-colors"
              >
                {t('contact.form.openWhatsApp')}
              </a>
            </div>
          </div>
        </form>

        {/* Info de WhatsApp */}
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-brand-500/5 via-white/5 to-purple-500/5 p-6 relative overflow-hidden">
          {/* Efecto de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[100px]" />
          
          <div className="relative">
            {/* Icono de WhatsApp */}
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-500/10 mb-4">
              <svg className="w-6 h-6 text-brand-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            
            <h3 className="text-white font-semibold text-lg mb-2">{t('contact.whatsapp.title')}</h3>
            <p className="text-brand-300 font-mono text-sm mb-6">{t('contact.whatsapp.phone')}</p>
            
            <WhatsAppButton label={t('contact.whatsapp.cta')} size="md" className="w-full mb-6" />
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-neutral-300">{t('contact.whatsapp.info1')}</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-neutral-300">{t('contact.whatsapp.info2')}</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-neutral-300">{t('contact.whatsapp.info3')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

