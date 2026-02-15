'use client';

import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';

interface SecurityLevel {
  id: string;
  title: string;
  emoji: string;
  targetAudience: string;
  protects: string[];
  commonRisks: string[];
  basicControls: string[];
  color: string;
}

const SECURITY_LEVELS: SecurityLevel[] = [
  {
    id: 'personal',
    title: 'Privacidad Personal',
    emoji: '👤',
    targetAudience: 'Para ti como persona',
    protects: [
      'Tu identidad y documentos oficiales',
      'Fotos y archivos personales',
      'Cuentas bancarias y finanzas',
      'Redes sociales y perfil',
      'Tu dispositivo (celular, computador)',
      'Información de tu familia',
    ],
    commonRisks: [
      'Alguien usa tu nombre para estafar',
      'Hackean tu correo o redes sociales',
      'Roban tus fotos o documentos',
      'Fraudes en tu cuenta bancaria',
      'Virus o malware en tu computador',
    ],
    basicControls: [
      'Usa contraseñas únicas y fuertes',
      'Activa autenticación en dos pasos (2FA)',
      'Ten cuidado con mensajes sospechosos',
      'Cifra tu dispositivo',
      'Haz backups de tus archivos importantes',
      'Revisa quién accede a tus cuentas',
    ],
    color: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30',
  },
  {
    id: 'professional',
    title: 'Privacidad Profesional',
    emoji: '💼',
    targetAudience: 'Para ti como trabajador o emprendedor',
    protects: [
      'Tu correo profesional',
      'Código y proyectos (GitHub, repositorios)',
      'Accesos a infraestructura (AWS, Vercel, etc.)',
      'Datos e información de tus clientes',
      'Tu reputación digital',
      'Contratos y documentos de negocio',
    ],
    commonRisks: [
      'Te roban el código de tus proyectos',
      'Filtran datos confidenciales de clientes',
      'Alguien accede a tu infraestructura',
      'Tu email es hackeado y se envían mensajes falsos',
      'Daño a tu reputación profesional',
      'Pérdida de información crítica del negocio',
    ],
    basicControls: [
      'Protege tus accesos con contraseñas fuertes',
      'Usa variables de entorno seguras',
      'No compartas credenciales por email',
      'Revisa quién tiene acceso a qué',
      'Haz backups automáticos de proyectos',
      'Monitorea cambios en tu infraestructura',
    ],
    color: 'bg-blue-500/10 text-blue-300 border-blue-400/30',
  },
  {
    id: 'enterprise',
    title: 'Seguridad Empresarial',
    emoji: '🏢',
    targetAudience: 'Para tu empresa u organización',
    protects: [
      'Bases de datos y servidores',
      'Aplicaciones web y móviles',
      'Infraestructura en la nube',
      'Datos financieros y contables',
      'Información de empleados y clientes',
      'Continuidad operativa del negocio',
    ],
    commonRisks: [
      'Ransomware: secuestran tus datos y piden dinero',
      'Ataques DDoS: cae tu servicio',
      'Filtración masiva de datos sensibles',
      'Accesos no autorizados a información',
      'Pérdida total de datos sin posibilidad de recuperar',
      'Incumplimiento de leyes sobre protección de datos',
    ],
    basicControls: [
      'Arquitectura segura desde el inicio',
      'Firewall y separación de redes',
      'Sistema de alertas para actividades sospechosas',
      'Backups frecuentes en ubicaciones seguras',
      'Plan claro de qué hacer si ocurre un ataque',
      'Entrenar al equipo en seguridad',
    ],
    color: 'bg-violet-500/10 text-violet-300 border-violet-400/30',
  },
];

export function SecurityObservability() {
  const { t } = useI18n();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    personal: false,
    professional: false,
    enterprise: false,
  });

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="security" aria-labelledby="security-title" className="scroll-mt-20">
      <div className="text-center">
        <h2 id="security-title" className="section-title">Seguridad & Privacidad</h2>
        <p className="mt-3 max-w-2xl muted mx-auto">
          Protección integral para tu vida privada, tu trabajo y tu empresa. Simple, práctico y al alcance de todos.
        </p>
      </div>

      {/* Security Levels Grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SECURITY_LEVELS.map((level) => {
          const isExpanded = expandedItems[level.id] || false;

          return (
            <div
              key={level.id}
              className="rounded-lg border border-white/10 bg-white/5 transition-all duration-300 overflow-hidden flex flex-col h-fit"
            >
              <button
                onClick={() => toggleItem(level.id)}
                className={`w-full px-6 py-5 flex items-center justify-between hover:bg-white/10 transition-colors text-left ${level.color}`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-3xl flex-shrink-0">{level.emoji}</span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold truncate">{level.title}</h3>
                    <p className="text-xs opacity-80 mt-0.5 line-clamp-1">{level.targetAudience}</p>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ml-2 ${
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
                  {/* Qué protege */}
                  <div>
                    <h4 className="text-sm font-bold text-neutral-200 mb-3 uppercase tracking-wider">
                      ✓ Qué protege
                    </h4>
                    <ul className="space-y-2">
                      {level.protects.map((item, idx) => (
                        <li key={idx} className="text-sm text-neutral-300 flex items-start gap-2">
                          <span className="text-emerald-400 font-bold mt-0.5 flex-shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Riesgos comunes */}
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-sm font-bold text-neutral-200 mb-3 uppercase tracking-wider">
                      ⚠️ Riesgos comunes
                    </h4>
                    <ul className="space-y-2">
                      {level.commonRisks.map((risk, idx) => (
                        <li key={idx} className="text-sm text-neutral-300 flex items-start gap-2">
                          <span className="text-rose-400 font-bold mt-0.5 flex-shrink-0">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Controles básicos */}
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-sm font-bold text-neutral-200 mb-3 uppercase tracking-wider">
                      🛡️ Controles básicos
                    </h4>
                    <ul className="space-y-2">
                      {level.basicControls.map((control, idx) => (
                        <li key={idx} className="text-sm text-neutral-300 flex items-start gap-2">
                          <span className="text-blue-400 font-bold mt-0.5 flex-shrink-0">→</span>
                          <span>{control}</span>
                        </li>
                      ))}
                    </ul>
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

