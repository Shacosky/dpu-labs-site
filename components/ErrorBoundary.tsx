'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({ error, errorInfo });

    // Log to backend if available
    if (typeof window !== 'undefined') {
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'react_error',
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      }).catch(() => {
        // Silent fail if backend unavailable
      });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full rounded-xl border border-red-500/20 bg-red-500/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-red-400 text-xl">⚠️</span>
              </div>
              <h2 className="text-xl font-bold text-red-400">Error en la aplicación</h2>
            </div>
            <p className="text-neutral-300 mb-4">
              Ha ocurrido un error inesperado. Intenta recargar la página.
            </p>
            {this.state.error && (
              <details className="mb-4">
                <summary className="text-sm text-neutral-400 cursor-pointer hover:text-neutral-300">
                  Detalles técnicos
                </summary>
                <div className="mt-2 p-3 rounded-lg bg-black/30 text-xs text-neutral-400 font-mono overflow-auto max-h-40">
                  <div className="mb-2 text-red-400">{this.state.error.message}</div>
                  <div className="whitespace-pre-wrap">{this.state.error.stack}</div>
                </div>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
