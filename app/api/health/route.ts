import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';

export async function GET() {
  const start = Date.now();
  const env = {
    MONGODB_URI: !!process.env.MONGODB_URI,
    OSINT_ENCRYPTION_KEY: !!process.env.OSINT_ENCRYPTION_KEY,
    CLERK_SECRET_KEY: !!process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CHAT_PROVIDER: process.env.CHAT_PROVIDER || 'unset',
  };

  let db = { ok: false, error: undefined as string | undefined, elapsedMs: 0 };
  try {
    const t0 = Date.now();
    await dbConnect();
    db.ok = true;
    db.elapsedMs = Date.now() - t0;
  } catch (e: any) {
    db.ok = false;
    db.error = e?.name === 'MongooseServerSelectionError' ? 'MongooseServerSelectionError (posible IP no autorizada en Atlas)' : (e?.message || 'unknown error');
  }

  return NextResponse.json({
    success: true,
    uptime: process.uptime(),
    env,
    db,
    buildTime: process.env.VERCEL ? 'vercel' : 'local',
    now: new Date().toISOString(),
    elapsedMs: Date.now() - start,
  }, { status: db.ok ? 200 : 503 });
}
