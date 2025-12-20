'use client';

import { useErrorMonitoring } from '@/hooks/useErrorMonitoring';

/**
 * Componente que activa el monitoreo de errores automáticamente
 */
export function ErrorMonitor() {
  useErrorMonitoring();
  return null;
}
