import Link from 'next/link';
import { ExpensesList } from './ExpensesList';

export default function ExpensesPage() {
  return (
    <div className="py-16 max-w-6xl">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
        >
          ← Volver al dashboard
        </Link>
      </div>
      <ExpensesList />
    </div>
  );
}
