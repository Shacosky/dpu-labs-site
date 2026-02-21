import Link from 'next/link';

export function ProjectsPreview() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="scroll-mt-20">
      <div className="text-center">
        <h2 id="projects-title" className="section-title">
          Projects
        </h2>
        <p className="mt-3 muted mx-auto max-w-2xl">Small tools we build to make digital moments feel better.</p>
      </div>

      <div className="mt-10 max-w-3xl mx-auto">
        <article className="rounded-xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-300">DPUXLABS micro-product</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">SENT</h3>
          <p className="mt-2 text-neutral-300">Instant feedback when you send an email.</p>

          <Link
            href="/projects/sent"
            className="mt-6 inline-flex items-center rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-brand-400/50 hover:text-brand-200"
          >
            View →
          </Link>
        </article>
      </div>
    </section>
  );
}
