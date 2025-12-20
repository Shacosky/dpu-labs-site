'use client';

import { useEffect } from 'react';

/**
 * Hook para monitorear errores automáticamente y enviarlos a /api/errors
 */
export function useErrorMonitoring() {
  useEffect(() => {
    // Capturar errores no manejados
    const handleError = (event: ErrorEvent) => {
      const errorData = {
        type: 'react_error',
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
      };

      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData),
      }).catch((err) => console.error('Failed to log error:', err));
    };

    // Capturar rechazos de promesas no manejados
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorData = {
        type: 'react_error',
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
      };

      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData),
      }).catch((err) => console.error('Failed to log error:', err));
    };

    // Interceptar console.error
    const originalError = console.error;
    console.error = (...args: any[]) => {
      originalError.apply(console, args);

      // Solo loggear errores significativos (evitar ruido)
      const message = args.map((arg) => String(arg)).join(' ');
      if (message.length > 10) {
        const errorData = {
          type: 'react_error',
          message: message.substring(0, 500), // Limitar tamaño
          url: window.location.href,
        };

        fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorData),
        }).catch(() => {
          // Silenciar errores de logging para evitar loops
        });
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      console.error = originalError;
    };
  }, []);
}
