'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function ViewInvoiceContent() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('id');
  const [pdfUrl, setPdfUrl] = useState<string>('');

  useEffect(() => {
    if (invoiceId) {
      setPdfUrl(`/api/invoices/generate-pdf?id=${invoiceId}`);
    }
  }, [invoiceId]);

  if (!invoiceId) {
    return (
      <div className="py-16 text-center">
        <p className="text-neutral-400">No se especificó factura para visualizar</p>
      </div>
    );
  }

  return (
    <div className="py-16 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Visualizar Factura</h1>
        <a
          href={`/api/invoices/generate-pdf?id=${invoiceId}`}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
          download
        >
          ⬇️ Descargar PDF
        </a>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            className="w-full h-screen rounded-lg"
            title="Invoice PDF"
          />
        )}
      </div>
    </div>
  );
}

export default function ViewInvoicePage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-white">Cargando...</div>}>
      <ViewInvoiceContent />
    </Suspense>
  );
}
