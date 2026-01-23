import { currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="py-16 space-y-8">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-4">
          Portal de Clientes - DPU Labs
        </h1>
        <p className="text-neutral-300">
          Bienvenido, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Facturas */}
        <a href="/dashboard/invoices" className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
          <h2 className="text-xl font-semibold text-white mb-2">Facturas</h2>
          <p className="text-sm text-neutral-300 mb-4">
            Crea y gestiona tus facturas
          </p>
          <div className="text-sm text-brand-400 hover:text-brand-300">
            Ir a Facturas →
          </div>
        </a>

        {/* Card 2: Gastos */}
        <a href="/dashboard/expenses" className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
          <h2 className="text-xl font-semibold text-white mb-2">Gastos / Compras</h2>
          <p className="text-sm text-neutral-300 mb-4">
            Registra gastos y compras
          </p>
          <div className="text-sm text-brand-400 hover:text-brand-300">
            Ir a Gastos →
          </div>
        </a>

        {/* Card 3: Proyectos */}
        <a href="/dashboard/projects" className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
          <h2 className="text-xl font-semibold text-white mb-2">Proyectos</h2>
          <p className="text-sm text-neutral-300 mb-4">
            Gestiona tus proyectos de pentesting y auditorías
          </p>
          <div className="text-sm text-brand-400 hover:text-brand-300">
            Ir a Proyectos →
          </div>
        </a>

        {/* Card 4: Soporte */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white mb-2">Soporte</h2>
          <p className="text-sm text-neutral-300 mb-4">
            Contacta con nuestro equipo
          </p>
          <a
            href="https://wa.me/56942867168"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-brand-400 hover:text-brand-300 underline"
          >
            Abrir WhatsApp
          </a>
        </div>

        {/* Card 5: OSINT */}
        <a href="/dashboard/osint" className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
          <h2 className="text-xl font-semibold text-white mb-2">OSINT</h2>
          <p className="text-sm text-neutral-300 mb-4">
            Gestiona objetivos OSINT con cifrado de datos
          </p>
          <div className="text-sm text-brand-400 hover:text-brand-300">
            Ir a OSINT →
          </div>
        </a>

        {/* Card 6: Errores del Sistema */}
        <a href="/dashboard/errors" className="rounded-xl border border-red-500/10 bg-red-500/5 p-6 hover:bg-red-500/10 transition-colors">
          <h2 className="text-xl font-semibold text-white mb-2">Errores</h2>
          <p className="text-sm text-neutral-300 mb-4">
            Monitorea errores del sistema
          </p>
          <div className="text-sm text-red-400 hover:text-red-300">
            Ver Errores →
          </div>
        </a>
      </div>

      {/* Información del usuario */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Información de la cuenta
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="text-neutral-400">Email:</span>
            <span className="text-white">{user?.emailAddresses[0]?.emailAddress}</span>
          </div>
          {user?.firstName && (
            <div className="flex gap-2">
              <span className="text-neutral-400">Nombre:</span>
              <span className="text-white">{user.firstName} {user.lastName}</span>
            </div>
          )}
          <div className="flex gap-2">
            <span className="text-neutral-400">ID:</span>
            <span className="text-white font-mono text-xs">{user?.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
