import { NextRequest, NextResponse } from 'next/server';
import { DomainService } from '@/lib/services/DomainService';

/**
 * GET /api/ai/domains/[id]/stats - Obtener estadísticas
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { total, approved } = await DomainService.countNodesByDomain(
      id
    );
    const { qualityScore } = await DomainService.updateQualityScore(id);

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
