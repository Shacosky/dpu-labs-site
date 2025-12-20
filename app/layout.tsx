import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { I18nProvider } from '@/contexts/I18nContext';
import { AuthProvider } from './providers';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorMonitor } from '@/components/ErrorMonitor';
import { ToastProvider } from '@/contexts/ToastContext';
import organizationSchema from './organization-schema.json';

export const metadata: Metadata = {
  metadataBase: new URL('https://dpulabs.is-a.dev'),
  title: {
    default: 'DPU Labs SpA — Ciberseguridad Purple-Team, Automatización IA, AWS Cloud',
    template: '%s • DPU Labs SpA',
  },
  description:
    'DPU Labs SpA: ciberseguridad purple-team, automatización impulsada por IA, AWS cloud/DevOps, e integración de datos moderna. Entregamos en Perú, México y toda LATAM con experiencia regional.',
  applicationName: 'DPU Labs SpA',
  authors: [{ name: 'DPU Labs SpA', url: 'https://dpulabs.is-a.dev' }],
  keywords: [
    'DPU Labs',
    'DPU Labs SpA',
    'Ciberseguridad',
    'Purple Team',
    'Automatización IA',
    'AWS',
    'DevOps',
    'Integración de Datos',
    'Desarrollo de Software',
    'Transformación Digital',
    'Perú',
    'México',
    'Chile',
    'LatAm',
    'Latinoamérica',
    'Consultoría Tecnológica',
    'Seguridad Empresarial',
    'Cloud Computing',
    'CI/CD',
    'Mejora Continua',
    'Kaizen Digital',
  ],
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    alternateLocale: ['es_PE', 'es_MX', 'en_US'],
    url: 'https://dpulabs.is-a.dev',
    title: 'DPU Labs SpA — Ciberseguridad Purple-Team, Automatización IA, AWS Cloud',
    description:
      'Ciberseguridad purple-team con automatización IA, AWS cloud/DevOps, e integración de datos moderna. Entrega regional: Perú, México y toda LATAM.',
    siteName: 'DPU Labs SpA',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'DPU Labs SpA — Ciberseguridad Purple-Team y Automatización IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DPU Labs SpA — Ciberseguridad Purple-Team, Automatización IA',
    description:
      'Automatización con seguridad primero y resultados cloud para Perú, México y LATAM.',
    images: ['/opengraph-image'],
    creator: '@dpulabs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://dpulabs.is-a.dev',
    languages: {
      'es-CL': 'https://dpulabs.is-a.dev',
      'en-US': 'https://dpulabs.is-a.dev/en',
    },
  },
  category: 'technology',
  verification: {
    // Agregar después: google, yandex, etc.
  },
  other: {
    'contact:email': 'contacto@dpulabs.cl',
    'contact:phone': '+56942867168',
    'geo.region': 'CL-LI',
    'geo.placename': 'Rancagua, Chile',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>
              <I18nProvider>
                <ErrorMonitor />
                <a
                  href="#content"
                  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-neutral-900 focus:text-white focus:px-3 focus:py-2 focus:rounded-md"
                >
                  Skip to content
                </a>
                <Navbar />
                <main id="content" className="container">
                  {children}
                </main>
                <Footer />
                <SpeedInsights />
              </I18nProvider>
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

