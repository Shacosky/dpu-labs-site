import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import VisitorLog from '@/lib/models/VisitorLog';

function getIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  return realIp || 'unknown';
}

export async function POST(request: NextRequest) {
  const consent = request.cookies.get('dpuxlabs_consent')?.value;
  if (consent !== 'accepted') {
    return new NextResponse(null, { status: 204 });
  }

  let payload: { path?: string; referrer?: string; title?: string } = {};
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  if (!payload.path) {
    return NextResponse.json({ success: false, error: 'Missing path' }, { status: 400 });
  }

  const city = request.headers.get('x-vercel-ip-city') || '';
  const region = request.headers.get('x-vercel-ip-region') || '';
  const country = request.headers.get('x-vercel-ip-country') || '';

  await dbConnect();
  await VisitorLog.create({
    path: payload.path,
    referrer: payload.referrer || request.headers.get('referer') || '',
    title: payload.title || '',
    ip: getIp(request),
    userAgent: request.headers.get('user-agent') || '',
    city,
    region,
    country,
  });

  return new NextResponse(null, { status: 204 });
}
