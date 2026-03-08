import Link from 'next/link';

const projects = [
  {
    eyebrow: 'DPU Labs product',
    name: 'SecureShare',
    description: 'Plataforma de compartición segura de archivos con verificación automática y trazabilidad.',
    href: '/projects/secureshare',
  },
  {
    eyebrow: 'DPUXLABS micro-product',
    name: 'SENT',
    description: 'Instant feedback when you send an email.',
    href: '/projects/sent',
  },
];

export function ProjectsPreview() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="scroll-mt-20">
      <div className="text-center">
        <h2 id="projects-title" className="section-title">
          Projects
        </h2>
        <p className="mt-3 muted mx-auto max-w-2xl">Small tools we build to make digital moments feel better.</p>
      </div>

      <div className="mt-10 grid gap-4 max-w-4xl mx-auto md:grid-cols-2">
        {projects.map((project) => (
          <article key={project.name} className="rounded-xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-300">{project.eyebrow}</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{project.name}</h3>
            <p className="mt-2 text-neutral-300">{project.description}</p>

            <Link
              href={project.href}
              className="mt-6 inline-flex items-center rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-brand-400/50 hover:text-brand-200"
            >
              View →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
