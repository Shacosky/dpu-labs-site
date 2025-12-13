'use client';

import Link from 'next/link';
import { useI18n } from '@/contexts/I18nContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { UserButton } from './UserButton';

export function Navbar() {
  const { t } = useI18n();
  
  const nav = [
    { href: '#services', label: t('navbar.services') },
    { href: '#cases', label: t('navbar.cases') },
    { href: '#stack', label: t('navbar.stack') },
    { href: '#contact', label: t('navbar.contact') },
  ];
  return (
    <header aria-label="Primary" className="sticky top-0 z-40 border-b border-white/5 backdrop-blur bg-black/40">
      <div className="container flex h-14 items-center justify-between">
        <Link href="#" className="inline-flex items-center gap-2 text-white font-semibold">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-brand-500 shadow-[0_0_20px_#8b5cf6]"></span>
          <span className="tracking-tight">DPU Labs SpA</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="text-sm text-neutral-300 hover:text-white">
                {n.label}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher />
          <UserButton />
          <div className="md:hidden text-neutral-400 text-sm">Menu</div>
        </div>
      </div>
    </header>
  );
}

