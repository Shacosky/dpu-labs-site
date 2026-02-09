'use client';

import { useEffect, useState } from 'react';

const CONSENT_KEY = 'dpuxlabs_consent';
const COOKIE_NAME = 'dpuxlabs_consent';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function setConsentCookie() {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE_NAME}=accepted; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setOpen(true);
    }
  }, []);

  const accept = () => {
    setConsentCookie();
    window.localStorage.setItem(CONSENT_KEY, 'accepted');
    setOpen(false);
  };

  const decline = () => {
    window.localStorage.setItem(CONSENT_KEY, 'declined');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-neutral-950/95 border-t border-white/10">
      <div className="container flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-300">
          Usamos cookies solo si aceptas. Sirven para registrar visitas con IP, user agent y paginas vistas
          para auditorias de seguridad.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={decline}
            className="rounded-md border border-white/10 px-4 py-2 text-sm text-neutral-200 hover:bg-white/5"
          >
            Rechazar
          </button>
          <button
            onClick={accept}
            className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
