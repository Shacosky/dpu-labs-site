'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'en' | 'es';
type Translations = Record<string, any>;

interface I18nContextType {
  locale: Locale;
  translations: Translations;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    // Get locale from localStorage or browser
    const savedLocale = localStorage.getItem('locale') as Locale;
    const browserLocale = navigator.language.startsWith('es') ? 'es' : 'en';
    const initialLocale = savedLocale || browserLocale;
    
    loadTranslations(initialLocale);
  }, []);

  const loadTranslations = async (newLocale: Locale) => {
    try {
      const module = await import(`../locales/${newLocale}/common.json`);
      setTranslations(module.default);
      setLocale(newLocale);
      localStorage.setItem('locale', newLocale);
    } catch (error) {
      console.error(`Failed to load translations for locale: ${newLocale}`, error);
    }
  };

  const handleSetLocale = (newLocale: Locale) => {
    loadTranslations(newLocale);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <I18nContext.Provider value={{ locale, translations, setLocale: handleSetLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}