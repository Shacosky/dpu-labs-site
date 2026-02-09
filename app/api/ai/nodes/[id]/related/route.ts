import { NextRequest, NextResponse } from 'next/server';
import { NodeService } from '@/lib/services/NodeService';

/**
 * GET /api/ai/nodes/[id]/related - Obtener nodos relacionados
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await NodeService.getRelatedNodes(id, 10);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.relatedNodes,
        count: result.relatedNodes?.length || 0,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as any).message },
      { status: 500 }
    );
  }
}
