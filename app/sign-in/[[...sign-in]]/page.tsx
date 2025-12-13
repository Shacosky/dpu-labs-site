import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-center text-3xl font-bold text-white">
            DPU Labs SpA
          </h1>
          <p className="mt-2 text-center text-neutral-300">
            Portal de Clientes - Ciberseguridad & Automatización
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-white/5 border border-white/10 rounded-xl',
              headerTitle: 'text-white',
              headerSubtitle: 'text-neutral-300',
              socialButtonsBlockButton: 'bg-white/10 hover:bg-white/20 text-white border border-white/10',
              formFieldLabel: 'text-neutral-300',
              formFieldInput: 'bg-neutral-900 border-white/10 text-white',
              footerActionLink: 'text-brand-400 hover:text-brand-300',
              dividerLine: 'bg-white/10',
              dividerText: 'text-neutral-400',
              pageScrollBox: 'w-full',
            },
          }}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
