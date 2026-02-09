import { NextRequest, NextResponse } from 'next/server';
import { DomainService } from '@/lib/services/DomainService';
import { Types } from 'mongoose';

/**
 * GET /api/ai/domains/[domainId] - Obtener dominio
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domainId: string }> }
) {
  try {
    const { domainId } = await params;
    const domain = await DomainService.getDomain(domainId);

    if (!domain) {
      return NextResponse.json(
        { success: false, error: 'Domain not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: domain });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as any).message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/ai/domains/[domainId] - Actualizar dominio
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ domainId: string }> }
) {
  try {
    const { domainId } = await params;
    const body = await request.json();

    const result = await DomainService.updateDomain(domainId, body);

    if (result.success) {
      return NextResponse.json({ success: true, data: result.domain });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as any).message },
      { status: 500 }
    );
  }
}
