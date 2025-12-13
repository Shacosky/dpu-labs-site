'use client';

import { useState } from 'react';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientId: string;
  date: string;
  dueDate: string;
  amount: number;
  tax: number;
  description: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

export function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientId: '',
    amount: '',
    tax: '',
    dueDate: '',
    description: '',
  });

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/invoices');
      const result = await response.json();
      if (result.success) {
        setInvoices(result.data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          tax: parseFloat(formData.tax),
        }),
      });

      if (response.ok) {
        setFormData({
          invoiceNumber: '',
          clientId: '',
          amount: '',
          tax: '',
          dueDate: '',
          description: '',
        });
        setShowForm(false);
        await fetchInvoices();
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const downloadPDF = async (invoiceId: string, invoiceNumber: string) => {
    try {
      const response = await fetch(`/api/invoices/generate-pdf?id=${invoiceId}`);
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `factura-${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Facturas</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchInvoices}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
          >
            {loading ? 'Cargando...' : 'Cargar'}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium"
          >
            + Nueva Factura
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Número de Factura"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500"
              required
            />
            <input
              type="text"
              placeholder="ID Cliente"
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500"
              required
            />
            <input
              type="number"
              placeholder="Monto"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500"
              required
            />
            <input
              type="number"
              placeholder="IVA"
              step="0.01"
              value={formData.tax}
              onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500"
            />
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500 col-span-2"
              required
            />
          </div>
          <textarea
            placeholder="Descripción"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500"
            rows={3}
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Número</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Cliente</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Monto</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-neutral-400">
                  No hay facturas registradas
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice._id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4 text-sm text-white">{invoice.invoiceNumber}</td>
                  <td className="px-6 py-4 text-sm text-white">{invoice.clientId}</td>
                  <td className="px-6 py-4 text-sm text-white">${invoice.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid'
                          ? 'bg-green-500/20 text-green-300'
                          : invoice.status === 'sent'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-400">
                    {new Date(invoice.date).toLocaleDateString('es-CL')}
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => downloadPDF(invoice._id, invoice.invoiceNumber)}
                      className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
                    >
                      📄 PDF
                    </button>
                    <a
                      href={`/dashboard/invoices/view?id=${invoice._id}`}
                      className="px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium inline-block"
                    >
                      👁️ Ver
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
