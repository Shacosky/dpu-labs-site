'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const CONSENT_KEY = 'dpuxlabs_consent';

function getPath(pathname: string, searchParams: URLSearchParams | null) {
  if (!searchParams || searchParams.toString().length === 0) {
    return pathname;
  }
  return `${pathname}?${searchParams.toString()}`;
}

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const consent = window.localStorage.getItem(CONSENT_KEY);
    if (consent !== 'accepted') return;

    const path = getPath(pathname, searchParams);
    const referrer = document.referrer || '';

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, referrer, title: document.title }),
      keepalive: true,
    }).catch(() => {
      // Best-effort tracking only
    });
  }, [pathname, searchParams]);

  return null;
}
