import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db/mongodb';
import ErrorLog from '@/lib/models/ErrorLog';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rateLimit';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rate = await checkRateLimit(request);
    if (!rate.allowed) return createRateLimitResponse(rate.resetTime);

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    await dbConnect();

    const { id } = await params;

    const updates: any = {};
    if (body.resolved !== undefined) {
      updates.resolved = body.resolved;
      if (body.resolved) {
        updates.resolvedAt = new Date();
        updates.resolvedBy = userId;
      }
    }
    if (body.notes !== undefined) {
      updates.notes = body.notes.substring(0, 1000);
    }

    const doc = await ErrorLog.findByIdAndUpdate(id, { $set: updates }, { new: true });

    if (!doc) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: doc });
  } catch (error) {
    console.error('Error updating error log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update error log' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rate = await checkRateLimit(request);
    if (!rate.allowed) return createRateLimitResponse(rate.resetTime);

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const res = await ErrorLog.deleteOne({ _id: id });
    if (res.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting error log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete error log' },
      { status: 500 }
    );
  }
}
