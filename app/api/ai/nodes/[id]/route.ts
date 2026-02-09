import { NextRequest, NextResponse } from 'next/server';
import { NodeService } from '@/lib/services/NodeService';

/**
 * GET /api/ai/nodes/[id] - Obtener nodo
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const node = await NodeService.getNode(id);

    if (!node) {
      return NextResponse.json(
        { success: false, error: 'Node not found' },
        { status: 404 }
      );
    }

    // Registrar visualización
    await NodeService.recordView(id);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    const { action, ...updates } = body;

    if (action === 'validate') {
      const result = await NodeService.validateNode(id, {
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
      const result = await NodeService.addFeedback(id, {
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

