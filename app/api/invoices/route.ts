import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db/mongodb';
import Invoice from '@/lib/models/Invoice';
import { InvoiceSchema } from '@/lib/validations';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rateLimit';

export async function GET(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimit = await checkRateLimit(request);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.resetTime);
    }

    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const invoices = await Invoice.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: invoices },
      {
        headers: {
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimit = await checkRateLimit(request);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.resetTime);
    }

    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = InvoiceSchema.parse(body);

    await dbConnect();
    const invoice = new Invoice(validatedData);
    await invoice.save();

    return NextResponse.json(
      { success: true, data: invoice },
      {
        status: 201,
        headers: {
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error('Error creating invoice:', error);

    // Handle validation errors
    if (error instanceof Error && error.message.includes('ZodError')) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
