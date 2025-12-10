import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { I18nProvider } from '@/contexts/I18nContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://dpulabs.is-a.dev'),
  title: {
    default: 'DPU Labs SpA — Purple-Team Cybersecurity, AI Automation, AWS Cloud',
    template: '%s • DPU Labs SpA',
  },
  description:
    'DPU Labs SpA: purple-team cybersecurity, AI-driven automation, AWS cloud/DevOps, and data integration. We deliver in Peru and Mexico with regional expertise.',
  applicationName: 'DPU Labs SpA',
  keywords: [
    'DPU Labs',
    'Cybersecurity',
    'Purple Team',
    'AI Automation',
    'AWS',
    'DevOps',
    'Data Integration',
    'Peru',
    'Mexico',
    'LatAm',
  ],
  openGraph: {
    type: 'website',
    url: 'https://dpulabs.is-a.dev',
    title: 'DPU Labs SpA — Purple-Team Cybersecurity, AI Automation, AWS Cloud',
    description:
      'Purple-team cybersecurity with AI automation, AWS cloud/DevOps, and modern data integration. Regional delivery: Peru & Mexico.',
    siteName: 'DPU Labs SpA',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'DPU Labs SpA — Purple-Team Cybersecurity and AI Automation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DPU Labs SpA — Purple-Team Cybersecurity, AI Automation, AWS Cloud',
    description:
      'Security-first automation and cloud outcomes for Peru & Mexico.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
  category: 'technology',
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
    <html lang="en" className="dark">
      <body>
        <I18nProvider>
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
        </I18nProvider>
      </body>
    </html>
  );
}

