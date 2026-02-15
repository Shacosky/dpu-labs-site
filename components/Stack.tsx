'use client';

import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';

interface StackConfig {
  id: string;
  name: string;
  description: string;
  tools: Array<{ name: string; category: string }>;
  confidential: {
    industry: string;
    useCases: string[];
    securityLevel: string;
    scaleMetrics?: string;
  };
}

const STACKS: StackConfig[] = [
  {
    id: 'stack-1',
    name: 'Full-Stack Modern',
    description: 'Next.js + NestJS + PostgreSQL + Vercel',
    tools: [
      { name: 'Next.js', category: 'Frontend' },
      { name: 'NestJS', category: 'Backend' },
      { name: 'TypeScript', category: 'Language' },
      { name: 'PostgreSQL', category: 'Database' },
      { name: 'Prisma', category: 'ORM' },
      { name: 'Vercel', category: 'Cloud' },
      { name: 'GitHub Actions', category: 'CI/CD' },
    ],
    confidential: {
      industry: 'SaaS / Aplicaciones Web',
      useCases: [
        'Plataformas web escalables',
        'Dashboards y CMS',
        'APIs REST y WebSockets',
      ],
      securityLevel: 'JWT + CORS + Rate Limiting',
      scaleMetrics: '10k+ concurrent users',
    },
  },
  {
    id: 'stack-2',
    name: 'Enterprise Backend',
    description: 'Java Spring Boot + PostgreSQL + AWS',
    tools: [
      { name: 'Java', category: 'Language' },
      { name: 'Spring Boot', category: 'Framework' },
      { name: 'PostgreSQL', category: 'Database' },
      { name: 'Maven', category: 'Build Tool' },
      { name: 'Docker', category: 'Container' },
      { name: 'AWS EC2/RDS', category: 'Cloud' },
      { name: 'GitHub Actions', category: 'CI/CD' },
    ],
    confidential: {
      industry: 'Enterprise / Financial',
      useCases: [
        'Microservicios escalables',
        'Procesamiento de transacciones',
        'Integración con APIs legacy',
      ],
      securityLevel: 'OAuth2 + Spring Security',
      scaleMetrics: '100k+ requests/day',
    },
  },
  {
    id: 'stack-3',
    name: '.NET Enterprise',
    description: 'ASP.NET Core + SQL Server + Azure',
    tools: [
      { name: 'C#', category: 'Language' },
      { name: 'ASP.NET Core', category: 'Framework' },
      { name: 'SQL Server', category: 'Database' },
      { name: 'Entity Framework', category: 'ORM' },
      { name: 'Azure', category: 'Cloud' },
      { name: 'Docker', category: 'Container' },
      { name: 'Azure DevOps', category: 'CI/CD' },
    ],
    confidential: {
      industry: 'Corporate / Government',
      useCases: [
        'Aplicaciones empresariales críticas',
        'Integración con ecosistema Microsoft',
        'Compliance y auditoría',
      ],
      securityLevel: 'Active Directory + SSL/TLS',
      scaleMetrics: '50k+ daily active users',
    },
  },
  {
    id: 'stack-4',
    name: 'Data & AI',
    description: 'Python + FastAPI + análisis de datos y ML',
    tools: [
      { name: 'Python', category: 'Language' },
      { name: 'FastAPI', category: 'Framework' },
      { name: 'Pandas', category: 'Data Processing' },
      { name: 'Scikit-learn', category: 'ML' },
      { name: 'PostgreSQL', category: 'Database' },
      { name: 'Jupyter', category: 'DataScience' },
      { name: 'AWS / Google Cloud', category: 'Cloud' },
    ],
    confidential: {
      industry: 'Data Science / Analytics / IA',
      useCases: [
        'Modelos predictivos y ML',
        'Análisis exploratorio de datos',
        'Pipelines de automatización IA',
      ],
      securityLevel: 'API Key + Data Encryption',
      scaleMetrics: '1TB+ data processing',
    },
  },
];

const categoryColors: Record<string, string> = {
  'Backend': 'bg-slate-500/10 text-slate-200 border-slate-400/30',
  'Frontend': 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-400/30',
  'Container': 'bg-lime-500/10 text-lime-300 border-lime-400/30',
  'Cloud': 'bg-blue-500/10 text-blue-300 border-blue-400/30',
  'Language': 'bg-orange-500/10 text-orange-300 border-orange-400/30',
  'Runtime': 'bg-cyan-500/10 text-cyan-300 border-cyan-400/30',
  'Database': 'bg-indigo-500/10 text-indigo-300 border-indigo-400/30',
  'CI/CD': 'bg-teal-500/10 text-teal-300 border-teal-400/30',
  'Framework': 'bg-rose-500/10 text-rose-300 border-rose-400/30',
  'ORM': 'bg-amber-500/10 text-amber-300 border-amber-400/30',
  'Build Tool': 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30',
  'Data Processing': 'bg-violet-500/10 text-violet-300 border-violet-400/30',
  'ML': 'bg-pink-500/10 text-pink-300 border-pink-400/30',
  'DataScience': 'bg-cyan-500/10 text-cyan-300 border-cyan-400/30',
};

export function Stack() {
  const { t } = useI18n();
  const [expandedStacks, setExpandedStacks] = useState<Set<string>>(new Set());

  const toggleStack = (stackId: string) => {
    const newExpanded = new Set(expandedStacks);
    if (newExpanded.has(stackId)) {
      newExpanded.delete(stackId);
    } else {
      newExpanded.add(stackId);
    }
    setExpandedStacks(newExpanded);
  };

  return (
    <section id="stack" aria-labelledby="stack-title" className="scroll-mt-20">
      <div className="text-center">
        <h2 id="stack-title" className="section-title">{t('stack.title')}</h2>
        <p className="mt-3 max-w-2xl muted mx-auto">
          {t('stack.subtitle')}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {STACKS.map((stack) => {
          const isExpanded = expandedStacks.has(stack.id);

          return (
            <div
              key={stack.id}
              className="rounded-lg border border-white/10 bg-white/5 transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => toggleStack(stack.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/10 transition-colors"
              >
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">{stack.name}</h3>
                  <p className="text-sm text-neutral-400 mt-1">{stack.description}</p>
                </div>
                <svg
                  className={`w-5 h-5 text-brand-400 transition-transform duration-300 flex-shrink-0 ml-4 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {isExpanded && (
                <div className="border-t border-white/10 px-6 py-6 space-y-6 animate-fadeIn">
                  {/* Technologies Grid */}
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-300 mb-4 uppercase tracking-wider">
                      Tecnologías
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {stack.tools.map((tool) => (
                        <div
                          key={tool.name}
                          className="group relative rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 transition-all duration-300 hover:scale-105"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-neutral-100 group-hover:text-white transition-colors">
                              {tool.name}
                            </span>
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded-full border font-medium w-fit ${
                                categoryColors[tool.category] || categoryColors['Language']
                              }`}
                            >
                              {tool.category}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Confidential Information */}
                  <div className="border-t border-white/10 pt-6">
                    <h4 className="text-sm font-semibold text-neutral-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Información Operacional
                    </h4>

                    <div className="space-y-4 bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                      <div>
                        <p className="text-xs text-neutral-400 uppercase tracking-wider">Industria</p>
                        <p className="text-sm font-medium text-white mt-1">{stack.confidential.industry}</p>
                      </div>

                      <div>
                        <p className="text-xs text-neutral-400 uppercase tracking-wider">Casos de Uso</p>
                        <ul className="text-sm text-neutral-300 mt-2 space-y-1">
                          {stack.confidential.useCases.map((useCase, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-brand-400 mt-0.5">→</span>
                              <span>{useCase}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-xs text-neutral-400 uppercase tracking-wider">Nivel de Seguridad</p>
                        <p className="text-sm font-medium text-emerald-400 mt-1">
                          ✓ {stack.confidential.securityLevel}
                        </p>
                      </div>

                      {stack.confidential.scaleMetrics && (
                        <div>
                          <p className="text-xs text-neutral-400 uppercase tracking-wider">Escala</p>
                          <p className="text-sm text-neutral-300 mt-1">{stack.confidential.scaleMetrics}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

