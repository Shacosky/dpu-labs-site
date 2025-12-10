'use client';

import { useI18n } from '@/contexts/I18nContext';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-16 border-t border-white/5">
      <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-neutral-400">
          © {new Date().getFullYear()} {t('footer.company')}. {t('footer.rights')}
        </p>
        <p className="text-sm text-neutral-500">
          {t('footer.regions')}
        </p>
      </div>
    </footer>
  );
}

