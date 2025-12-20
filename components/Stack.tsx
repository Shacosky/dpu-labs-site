'use client';

import { useI18n } from '@/contexts/I18nContext';

const TOOLS = [
  { name: 'AWS', category: 'Cloud' },
  { name: 'Kubernetes', category: 'DevOps' },
  { name: 'Terraform', category: 'IaC' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Node.js', category: 'Runtime' },
  { name: 'Python', category: 'Language' },
  { name: 'Next.js', category: 'Framework' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'OpenSearch', category: 'Search' },
  { name: 'LangChain', category: 'AI' },
  { name: 'OpenAI API', category: 'AI' },
  { name: 'GitHub Actions', category: 'CI/CD' },
];

const categoryColors = {
  'Cloud': 'bg-blue-500/10 text-blue-300 border-blue-400/30',
  'DevOps': 'bg-purple-500/10 text-purple-300 border-purple-400/30',
  'IaC': 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30',
  'Language': 'bg-orange-500/10 text-orange-300 border-orange-400/30',
  'Runtime': 'bg-cyan-500/10 text-cyan-300 border-cyan-400/30',
  'Framework': 'bg-pink-500/10 text-pink-300 border-pink-400/30',
  'Database': 'bg-indigo-500/10 text-indigo-300 border-indigo-400/30',
  'Search': 'bg-amber-500/10 text-amber-300 border-amber-400/30',
  'AI': 'bg-rose-500/10 text-rose-300 border-rose-400/30',
  'CI/CD': 'bg-teal-500/10 text-teal-300 border-teal-400/30',
};

export function Stack() {
  const { t } = useI18n();

  return (
    <section id="stack" aria-labelledby="stack-title" className="scroll-mt-20">
      <div className="text-center">
        <h2 id="stack-title" className="section-title">{t('stack.title')}</h2>
        <p className="mt-3 max-w-2xl muted mx-auto">
          {t('stack.subtitle')}
        </p>
      </div>
      
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {TOOLS.map((tool) => (
          <div 
            key={tool.name} 
            className="group relative rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-4 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-100 group-hover:text-white transition-colors">
                  {tool.name}
                </span>
                <svg className="w-4 h-4 text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium w-fit ${categoryColors[tool.category as keyof typeof categoryColors]}`}>
                {tool.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

