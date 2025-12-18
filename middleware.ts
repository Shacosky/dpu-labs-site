import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  // No additional work: headers are set via next.config.ts
  return;
});

export const config = {
  // Reducimos el alcance del middleware solo al dashboard
  matcher: ['/dashboard(.*)'],
};
