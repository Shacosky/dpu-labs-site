"use client";

import Link from 'next/link';

type WhatsAppButtonProps = {
  label?: string;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const PHONE = '56942867168';

export function WhatsAppButton({
  label = 'Chat on WhatsApp',
  message = 'Hola DPU Labs, me gustaría conversar sobre un proyecto. ',
  size = 'md',
  className = '',
}: WhatsAppButtonProps) {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
  const sizes = {
    sm: 'text-sm px-3 py-2',
    md: 'text-sm sm:text-base px-4 py-2.5',
    lg: 'text-base sm:text-lg px-5 py-3',
  } as const;

  return (
    <Link
      href={href}
      aria-label="Open WhatsApp chat"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-md bg-emerald-500/90 hover:bg-emerald-500 text-neutral-900 font-medium transition-colors ${sizes[size]} ${className}`}
    >
      <svg
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
      >
        <path d="M20.52 3.48A11.94 11.94 0 0 0 12 0C5.38 0 .01 5.37.01 12c0 2.11.55 4.07 1.5 5.77L0 24l6.4-1.67A11.94 11.94 0 0 0 12 23.99c6.62 0 12-5.37 12-11.99 0-3.21-1.3-6.18-3.48-8.52ZM12 21.88c-1.85 0-3.58-.5-5.08-1.36l-.36-.21-3.79.99 1.01-3.68-.24-.38A9.85 9.85 0 0 1 2.12 12C2.12 6.56 6.55 2.13 12 2.13c2.63 0 5.02 1.03 6.77 2.7a9.82 9.82 0 0 1 3 7.16c0 5.44-4.42 9.88-9.88 9.88Zm5.66-7.41c-.31-.16-1.82-.9-2.1-1-.28-.12-.48-.16-.67.16-.2.31-.77 1-.95 1.21-.17.2-.35.23-.65.08-.31-.16-1.31-.48-2.5-1.52-.92-.8-1.54-1.78-1.72-2.1-.18-.31 0-.48.14-.64.15-.15.31-.39.47-.58.16-.19.2-.31.31-.52.1-.2.06-.39-.02-.55-.08-.16-.67-1.63-.92-2.23-.24-.58-.5-.5-.67-.5-.17 0-.39-.03-.6-.03-.2 0-.55.08-.83.39-.28.31-1.09 1.06-1.09 2.59 0 1.52 1.12 2.98 1.27 3.18.16.2 2.21 3.37 5.34 4.73.75.33 1.33.53 1.78.68.75.24 1.44.21 1.98.13.61-.09 1.82-.74 2.08-1.45.26-.71.26-1.31.18-1.45-.08-.13-.28-.21-.6-.37Z" />
      </svg>
      {label}
    </Link>
  );
}

