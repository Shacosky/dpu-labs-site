import { NextRequest, NextResponse } from 'next/server';
import { DomainService } from '@/lib/services/DomainService';
import { Types } from 'mongoose';

/**
 * GET /api/ai/domains/[id] - Obtener dominio
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const domain = await DomainService.getDomain(params.id);

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
 * PATCH /api/ai/domains/[id] - Actualizar dominio
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const result = await DomainService.updateDomain(params.id, body);

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

/**
 * GET /api/ai/domains/[id]/stats - Obtener estadísticas
 */
export async function GET_STATS(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { total, approved } = await DomainService.countNodesByDomain(
      params.id
    );
    const { qualityScore } = await DomainService.updateQualityScore(params.id);

    return NextResponse.json({
      success: true,
      data: {
        totalNodes: total,
        approvedNodes: approved,
        qualityScore,
        approvalRate:
          total > 0 ? ((approved / total) * 100).toFixed(2) : 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as any).message },
      { status: 500 }
    );
  }
}
