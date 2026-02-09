import { NextRequest, NextResponse } from 'next/server';
import { NodeService } from '@/lib/services/NodeService';

/**
 * GET /api/ai/nodes/[id] - Obtener nodo
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const node = await NodeService.getNode(params.id);

    if (!node) {
      return NextResponse.json(
        { success: false, error: 'Node not found' },
        { status: 404 }
      );
    }

    // Registrar visualización
    await NodeService.recordView(params.id);

    return NextResponse.json({ success: true, data: node });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as any).message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/ai/nodes/[id] - Actualizar nodo
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action, ...updates } = body;

    if (action === 'validate') {
      const result = await NodeService.validateNode(params.id, {
        status: updates.status,
        score: updates.score,
        comments: updates.comments,
        validatedBy: updates.validatedBy,
      });

      if (result.success) {
        return NextResponse.json({ success: true, data: result.node });
      } else {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }
    } else if (action === 'addFeedback') {
      const result = await NodeService.addFeedback(params.id, {
        userId: updates.userId,
        rating: updates.rating,
        comment: updates.comment,
      });

      if (result.success) {
        return NextResponse.json({ success: true, data: result.node });
      } else {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
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
 * GET /api/ai/nodes/[id]/related - Obtener nodos relacionados
 */
export async function GET_RELATED(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await NodeService.getRelatedNodes(params.id, 10);

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
