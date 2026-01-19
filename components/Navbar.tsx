'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { UserButton } from './UserButton';

export function Navbar() {
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const nav = [
    { href: '#services', label: t('navbar.services') },
    { href: '#cases', label: t('navbar.cases') },
    { href: '#stack', label: t('navbar.stack') },
    { href: '#contact', label: t('navbar.contact') },
  ];
  
  return (
    <header aria-label="Primary" className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-md bg-black/60 shadow-lg shadow-black/20">
      <div className="container flex h-16 items-center justify-between">
        <Link href="#" className="inline-flex items-center gap-2 font-black group">
          <img
            src="/Aguila.svg"
            alt="Logo Águila"
            className="h-12 w-auto"
            style={{ minWidth: 40, maxHeight: 48 }}
            draggable={false}
          />
          <span
            className="font-black select-none"
            style={{
              fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
              fontSize: '2.25rem',
              color: '#fff',
              lineHeight: 1,
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            DPUX
            <span style={{ color: '#2B8CFF' }}>L</span>
            ABS
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0" aria-label="Main navigation">
            {nav.map((n, i) => (
              <span key={n.href + '-wrap'} className="flex items-center">
                <Link
                  href={n.href}
                  className="text-sm text-neutral-300 hover:text-white transition-colors relative group py-1 px-4"
                >
                  {n.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                {i < nav.length - 1 && (
                  <span key={n.href + '-sep'} className="h-5 w-px bg-white/10 mx-1" aria-hidden="true"></span>
                )}
              </span>
            ))}
          </nav>
          
          <LanguageSwitcher />
          <UserButton />
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-neutral-300 hover:text-white p-2 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-md animate-slide-down">
          <nav className="container py-4 flex flex-col gap-2" aria-label="Mobile navigation">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-neutral-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-md transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

