import Link from 'next/link';

interface ProjectCardProps {
  title: string;
  value: string;
  features: string[];
  useCases: string[];
  contactUrl?: string;
}

export default function ProjectCard({ title, value, features, useCases, contactUrl }: ProjectCardProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-6 mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-neutral-300 mb-4">{value}</p>
      <ul className="list-disc pl-5 mb-4 text-neutral-200">
        {features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      <div className="mb-4">
        <span className="font-semibold text-white">Casos típicos:</span>
        <ul className="list-disc pl-5 text-neutral-200">
          {useCases.map((u, i) => (
            <li key={i}>{u}</li>
          ))}
        </ul>
      </div>
      {contactUrl && (
        <Link href={contactUrl} className="inline-block px-4 py-2 bg-brand-500 text-white font-bold rounded hover:bg-brand-400 transition-colors">
          Contactar / Cotizar
        </Link>
      )}
    </section>
  );
}
