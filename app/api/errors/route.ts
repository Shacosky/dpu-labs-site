import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db/mongodb';
import ErrorLog from '@/lib/models/ErrorLog';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rateLimit';

export async function GET(request: NextRequest) {
  try {
    const rate = await checkRateLimit(request);
    if (!rate.allowed) return createRateLimitResponse(rate.resetTime);

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const resolved = searchParams.get('resolved');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);

    await dbConnect();

    const filter: any = {};
    if (type) filter.type = type;
    if (resolved !== null) filter.resolved = resolved === 'true';

    const errors = await ErrorLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(
      { success: true, data: errors },
      { headers: { 'X-RateLimit-Remaining': rate.remaining.toString() } }
    );
  } catch (error) {
    console.error('Error fetching error logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch error logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const rate = await checkRateLimit(request);
    if (!rate.allowed) return createRateLimitResponse(rate.resetTime);

    const { userId } = await auth();
    let body = {};
    try {
      body = await request.json();
    } catch (jsonError) {
      // Si el body está vacío o malformado, registrar como error especial
      console.warn('POST /api/errors recibió body vacío o malformado:', jsonError);
      return NextResponse.json(
        { success: false, error: 'Invalid or empty JSON body' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Sanitize and validate input
    const errorLog = await ErrorLog.create({
      userId: userId || 'anonymous',
      type: body.type || 'unknown',
      message: body.message?.substring(0, 1000) || 'No message',
      stack: body.stack?.substring(0, 5000),
      componentStack: body.componentStack?.substring(0, 5000),
      url: body.url?.substring(0, 500),
      method: body.method,
      statusCode: body.statusCode,
      userAgent: body.userAgent?.substring(0, 500),
      metadata: body.metadata,
    });

    return NextResponse.json(
      { success: true, data: { id: errorLog._id } },
      { status: 201, headers: { 'X-RateLimit-Remaining': rate.remaining.toString() } }
    );
  } catch (error) {
    console.error('Error logging error (meta!):', error);
    // Don't fail loudly - errors logging errors would be inception
    return NextResponse.json(
      { success: false, error: 'Failed to log error' },
      { status: 500 }
    );
  }
}
