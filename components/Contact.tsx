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
      <h2 id="contact-title" className="section-title">{t('contact.title')}</h2>
      <p className="mt-2 max-w-2xl muted">
        {t('contact.subtitle')}
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <form onSubmit={onSubmit} className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="grid gap-4">
            <div>
              <label htmlFor="name" className="block text-sm text-neutral-300">
                {t('contact.form.name')}
              </label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-white placeholder:text-neutral-500"
                placeholder={t('contact.form.namePlaceholder')}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-neutral-300">
                {t('contact.form.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-white placeholder:text-neutral-500"
                placeholder={t('contact.form.emailPlaceholder')}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm text-neutral-300">
                {t('contact.form.message')}
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-white placeholder:text-neutral-500"
                placeholder={t('contact.form.messagePlaceholder')}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 text-sm font-medium"
                aria-label={t('contact.form.submit')}
              >
                {t('contact.form.submit')}
              </button>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-300 hover:text-white underline underline-offset-4"
              >
                {t('contact.form.openWhatsApp')}
              </a>
            </div>
          </div>
        </form>

        <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-5">
          <h3 className="text-white font-medium">{t('contact.whatsapp.title')}</h3>
          <p className="mt-1 text-sm text-neutral-300">{t('contact.whatsapp.phone')}</p>
          <div className="mt-4">
            <WhatsAppButton label={t('contact.whatsapp.cta')} size="md" className="w-full sm:w-auto" />
          </div>
          <ul className="mt-6 space-y-2 text-sm text-neutral-300">
            <li>{t('contact.whatsapp.info1')}</li>
            <li>{t('contact.whatsapp.info2')}</li>
            <li>{t('contact.whatsapp.info3')}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

