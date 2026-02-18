import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SENT — DPUXLABS',
  description: 'SENT adds instant visual feedback when you send an email in Gmail.',
};

const modes = [
  {
    name: 'SENT',
    detail: 'A clean flash that confirms the moment your message leaves.',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-400/40',
    text: 'text-emerald-200',
  },
  {
    name: 'SENT.',
    detail: 'A grounded dot for a calm and certain final send state.',
    bg: 'bg-brand-500/20',
    border: 'border-brand-400/40',
    text: 'text-brand-200',
  },
  {
    name: 'Email sent',
    detail: 'A soft label that mirrors the language you already trust in Gmail.',
    bg: 'bg-blue-500/20',
    border: 'border-blue-400/40',
    text: 'text-blue-200',
  },
];

const ctaClasses =
  'inline-flex items-center justify-center rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-brand-400/50 hover:text-brand-200';

export default function SentProjectPage() {
  return (
    <div className="py-12 sm:py-16 space-y-16">
      <section className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-300">Micro-product</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-white">SENT</h1>
        <p className="mt-4 text-lg text-neutral-200">Instant feedback when you send an email.</p>
        <p className="mt-5 text-neutral-300 leading-relaxed">
          Sending a message is a small act with real weight. SENT adds a simple visual cue right after send,
          so you can breathe, trust it landed, and move on.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="https://chrome.google.com/webstore" target="_blank" rel="noreferrer" className={ctaClasses}>
            Install from Chrome Web Store
          </Link>
          <Link href="https://github.com/dpuxlabs/sent" target="_blank" rel="noreferrer" className={ctaClasses}>
            View on GitHub
          </Link>
          <Link
            href="https://github.com/dpuxlabs/sent/releases/latest"
            target="_blank"
            rel="noreferrer"
            className={ctaClasses}
          >
            Download ZIP
          </Link>
        </div>
      </section>

      <section aria-labelledby="sent-modes-title">
        <h2 id="sent-modes-title" className="section-title">
          Three ways to feel it
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {modes.map((mode) => (
            <article key={mode.name} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-medium text-white">{mode.name}</h3>
              <div className={`mt-4 rounded-lg border p-4 ${mode.bg} ${mode.border}`}>
                <div className="rounded-md bg-neutral-950/80 border border-white/10 px-3 py-2 text-center text-sm text-neutral-300">
                  Gmail compose
                </div>
                <div className={`mt-3 rounded-md border px-3 py-2 text-sm font-medium ${mode.border} ${mode.text}`}>
                  {mode.name}
                </div>
              </div>
              <p className="mt-4 text-sm text-neutral-300">{mode.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="how-it-works-title" className="max-w-3xl">
        <h2 id="how-it-works-title" className="section-title">
          How it works
        </h2>
        <ol className="mt-6 space-y-3 text-neutral-300">
          <li className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">1. Install the extension</li>
          <li className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">2. Send an email in Gmail</li>
          <li className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">3. Feel the moment</li>
        </ol>
      </section>

      <section className="border-t border-white/10 pt-8 text-sm text-neutral-400">
        <p>A micro-product by DPUXLABS</p>
        <p className="mt-1">Open-source (MIT)</p>
      </section>
    </div>
  );
}
