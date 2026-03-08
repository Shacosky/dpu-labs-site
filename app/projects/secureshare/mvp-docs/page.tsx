import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SecureShare MVP Docs — DPU Labs',
  description: 'Documentación base de API, flujo seguro y plantilla de dashboard de trazabilidad para SecureShare.',
};

const endpoints = [
  {
    method: 'POST',
    route: '/api/secureshare/upload',
    purpose: 'Subida de archivo WAV y registro inicial.',
  },
  {
    method: 'POST',
    route: '/api/secureshare/files/:id/analyze',
    purpose: 'Verificación automática de tipo, integridad y metadatos.',
  },
  {
    method: 'POST',
    route: '/api/secureshare/files/:id/secure-link',
    purpose: 'Creación de enlace privado con expiración, password y límites.',
  },
  {
    method: 'GET',
    route: '/api/secureshare/access/:token',
    purpose: 'Validación de políticas y descarga trazable.',
  },
  {
    method: 'GET',
    route: '/api/secureshare/files/:id/audit',
    purpose: 'Consulta de historial de acceso por archivo.',
  },
];

const flow = ['Subida (WAV)', 'Análisis automático', 'Enlace seguro', 'Acceso/Descarga', 'Eliminación automática'];

export default function SecureShareMvpDocsPage() {
  return (
    <div className="py-12 sm:py-16 space-y-14">
      <header className="max-w-4xl">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-300">Documentación técnica</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-white">SecureShare MVP</h1>
        <p className="mt-4 text-neutral-300">
          Código base referencial, endpoints y blueprint de trazabilidad para integrar SecureShare en entorno web.
        </p>
      </header>

      <section>
        <h2 className="section-title">Flujo seguro de archivo</h2>
        <ol className="mt-6 grid gap-3 md:grid-cols-5 text-sm text-neutral-200">
          {flow.map((step, index) => (
            <li key={step} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <span className="text-brand-300 font-semibold">{index + 1}.</span> {step}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="section-title">API y endpoints</h2>
        <div className="mt-6 space-y-3">
          {endpoints.map((endpoint) => (
            <article key={endpoint.route} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-brand-300 font-semibold">{endpoint.method}</p>
              <p className="text-white font-mono text-sm mt-1">{endpoint.route}</p>
              <p className="text-sm text-neutral-300 mt-2">{endpoint.purpose}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">Código base MVP (TypeScript)</h2>
        <pre className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-neutral-950/80 p-4 text-xs text-neutral-200">
{`// ejemplo mínimo de verificación WAV
export async function verifyWavFile(buffer: Buffer) {
  const riff = buffer.subarray(0, 4).toString('ascii');
  const wave = buffer.subarray(8, 12).toString('ascii');
  const isWav = riff === 'RIFF' && wave === 'WAVE';

  return {
    isWav,
    detectedMimeType: isWav ? 'audio/wav' : 'application/octet-stream',
    analyzedAt: new Date().toISOString(),
  };
}`}
        </pre>
      </section>

      <section>
        <h2 className="section-title">Plantilla dashboard de trazabilidad</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {['Eventos de hoy', 'Top archivos compartidos', 'Accesos por IP/país', 'Alertas por intentos fallidos'].map((widget) => (
            <div key={widget} className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-neutral-200">
              {widget}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
