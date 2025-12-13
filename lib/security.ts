/**
 * Security Configuration for DPU Labs Site
 * 
 * This file contains security-related configuration and best practices
 */

// Environment validation
export function validateEnvironment() {
  const required = [
    'MONGODB_URI',
    'CLERK_SECRET_KEY',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  ];

  const missing = required.filter((env) => !process.env[env]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Security headers
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

// CORS configuration
export const corsConfig = {
  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    process.env.NEXT_PUBLIC_APP_URL || '',
  ].filter(Boolean),
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Rate limiting configuration
export const rateLimitConfig = {
  requests: 100,
  window: 60 * 1000, // 1 minute
};

// Session configuration
export const sessionConfig = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'strict',
};

// Logging configuration
export const loggingConfig = {
  logSensitiveData: process.env.NODE_ENV === 'development',
  // In production, never log sensitive data like passwords, tokens, etc
};
