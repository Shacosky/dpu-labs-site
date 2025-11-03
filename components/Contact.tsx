"use client";

import { FormEvent, useMemo, useState } from 'react';
import { WhatsAppButton } from './WhatsAppButton';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const waHref = useMemo(() => {
    const base = 'https://wa.me/56942867168?text=';
    const text = `Hola DPU Labs, soy ${name || '—'}. ` +
      (email ? `Mi correo es ${email}. ` : '') +
      (message ? `Mensaje: ${message}` : 'Me gustaría conversar sobre un proyecto en ciberseguridad/automatización.');
    return base + encodeURIComponent(text);
  }, [name, email, message]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    window.open(waHref, '_blank', 'noopener');
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20">
      <h2 id="contact-title" className="section-title">Let’s talk</h2>
      <p className="mt-2 max-w-2xl muted">
        Quick chat, scoping session, or security review. We respond fast.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <form onSubmit={onSubmit} className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="grid gap-4">
            <div>
              <label htmlFor="name" className="block text-sm text-neutral-300">Name</label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-white placeholder:text-neutral-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-neutral-300">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-white placeholder:text-neutral-500"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm text-neutral-300">Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-white placeholder:text-neutral-500"
                placeholder="What do you want to achieve?"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 text-sm font-medium"
                aria-label="Send via WhatsApp"
              >
                Send via WhatsApp
              </button>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-300 hover:text-white underline underline-offset-4"
              >
                Open WhatsApp
              </a>
            </div>
          </div>
        </form>

        <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-5">
          <h3 className="text-white font-medium">WhatsApp</h3>
          <p className="mt-1 text-sm text-neutral-300">+56 9 4286 7168</p>
          <div className="mt-4">
            <WhatsAppButton label="Chat now" size="md" className="w-full sm:w-auto" />
          </div>
          <ul className="mt-6 space-y-2 text-sm text-neutral-300">
            <li>• Response time: under 2 hours</li>
            <li>• Languages: Spanish, English</li>
            <li>• Regions: Peru, Mexico, Remote</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

