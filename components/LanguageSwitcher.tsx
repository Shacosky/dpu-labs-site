'use client';

import { useI18n } from '@/contexts/I18nContext';

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 p-1">
      <button
        onClick={() => setLocale('en')}
        className={`px-2 py-1 text-sm rounded transition-colors ${
          locale === 'en' 
            ? 'bg-brand-500 text-white' 
            : 'text-neutral-300 hover:text-white hover:bg-white/5'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('es')}
        className={`px-2 py-1 text-sm rounded transition-colors ${
          locale === 'es' 
            ? 'bg-brand-500 text-white' 
            : 'text-neutral-300 hover:text-white hover:bg-white/5'
        }`}
      >
        ES
      </button>
    </div>
  );
}