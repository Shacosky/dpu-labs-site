import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter for development
// In production, use Redis or a dedicated service
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = {
  requests: 100,
  window: 60 * 1000, // 1 minute
};

export function getRateLimitKey(request: NextRequest): string {
  // Use IP address from x-forwarded-for header (set by Vercel/proxies)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
  return ip;
}

export async function checkRateLimit(request: NextRequest): Promise<{
  allowed: boolean;
  remaining: number;
  resetTime: number;
}> {
  const key = getRateLimitKey(request);
  const now = Date.now();

  let record = requestCounts.get(key);

  // Reset if window expired
  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + RATE_LIMIT.window,
    };
    requestCounts.set(key, record);
    return {
      allowed: true,
      remaining: RATE_LIMIT.requests - 1,
      resetTime: record.resetTime,
    };
  }

  // Increment counter
  record.count++;

  if (record.count > RATE_LIMIT.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: RATE_LIMIT.requests - record.count,
    resetTime: record.resetTime,
  };
}

export function createRateLimitResponse(resetTime: number): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
      },
    }
  );
}

// Clean up old records every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 10 * 60 * 1000);
