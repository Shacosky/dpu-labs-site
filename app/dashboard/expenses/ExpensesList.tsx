'use client';

import { useState } from 'react';

interface Expense {
  _id: string;
  description: string;
  supplier: string;
  amount: number;
  tax: number;
  date: string;
  category: string;
  invoiceNumber?: string;
  paymentMethod: string;
  status: 'pending' | 'paid' | 'rejected';
}

export function ExpensesList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    supplier: '',
    amount: '',
    tax: '',
    category: 'other',
    invoiceNumber: '',
    paymentMethod: 'transfer',
  });

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/expenses');
      const result = await response.json();
      if (result.success) {
        setExpenses(result.data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/expenses', {
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
          description: '',
          supplier: '',
          amount: '',
          tax: '',
          category: 'other',
          invoiceNumber: '',
          paymentMethod: 'transfer',
        });
        setShowForm(false);
        await fetchExpenses();
      }
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const categoryLabels: Record<string, string> = {
    materials: 'Materiales',
    services: 'Servicios',
    salaries: 'Salarios',
    utilities: 'Servicios Básicos',
    travel: 'Viajes',
    other: 'Otro',
  };

  const paymentLabels: Record<string, string> = {
    cash: 'Efectivo',
    check: 'Cheque',
    transfer: 'Transferencia',
    credit_card: 'Tarjeta Crédito',
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalTax = expenses.reduce((sum, exp) => sum + exp.tax, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gastos / Compras</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchExpenses}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
          >
            {loading ? 'Cargando...' : 'Cargar'}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium"
          >
            + Nuevo Gasto
          </button>
        </div>
      </div>

      {expenses.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-neutral-400 text-sm mb-1">Total Gastos</p>
            <p className="text-2xl font-bold text-white">${totalExpenses.toLocaleString('es-CL')}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-neutral-400 text-sm mb-1">Total IVA</p>
            <p className="text-2xl font-bold text-white">${totalTax.toLocaleString('es-CL')}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-neutral-400 text-sm mb-1">Total + IVA</p>
            <p className="text-2xl font-bold text-white">${(totalExpenses + totalTax).toLocaleString('es-CL')}</p>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500 col-span-2"
              required
            />
            <input
              type="text"
              placeholder="Proveedor"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500"
              required
            />
            <input
              type="text"
              placeholder="N° Factura (opcional)"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-neutral-500"
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
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
            >
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
            >
              {Object.entries(paymentLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Descripción</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Proveedor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Monto</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Categoría</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-neutral-400">
                  No hay gastos registrados
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense._id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4 text-sm text-white">{expense.description}</td>
                  <td className="px-6 py-4 text-sm text-white">{expense.supplier}</td>
                  <td className="px-6 py-4 text-sm text-white">${expense.amount.toLocaleString('es-CL')}</td>
                  <td className="px-6 py-4 text-sm text-neutral-300">
                    {categoryLabels[expense.category] || expense.category}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        expense.status === 'paid'
                          ? 'bg-green-500/20 text-green-300'
                          : expense.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-400">
                    {new Date(expense.date).toLocaleDateString('es-CL')}
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
