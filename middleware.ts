import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/osint(.*)',
  '/api/invoices(.*)',
  '/api/expenses(.*)',
  '/api/errors(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  // No additional work: headers are set via next.config.ts
  return;
});

export const config = {
  // Incluir dashboard y APIs protegidas
  matcher: [
    '/dashboard(.*)',
    '/api/osint(.*)',
    '/api/invoices(.*)',
    '/api/expenses(.*)',
    '/api/errors(.*)',
  ],
};
