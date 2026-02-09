import { NextRequest, NextResponse } from 'next/server';
import { IngestionService } from '@/lib/services/IngestionService';

/**
 * POST /api/ai/ingestion/[id]/batch - Procesar lote de nodos
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const { nodes, executedBy } = body;

    if (!nodes || !Array.isArray(nodes) || !executedBy) {
      return NextResponse.json(
        { success: false, error: 'nodes array and executedBy are required' },
        { status: 400 }
      );
    }

    const result = await IngestionService.processBatch(
      params.id,
      nodes,
      executedBy
    );

    if (result.success) {
      return NextResponse.json({ success: true, data: result.results });
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
 * PATCH /api/ai/ingestion/[id]/complete - Completar ingesta
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'complete') {
      const result = await IngestionService.completeIngestion(params.id);

      if (result.success) {
        return NextResponse.json({ success: true, data: result.ingestion });
      } else {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }
    } else if (action === 'fail') {
      const result = await IngestionService.failIngestion(
        params.id,
        body.errorMessage
      );

      if (result.success) {
        return NextResponse.json({ success: true, data: result.ingestion });
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
 * GET /api/ai/ingestion/[id]/stats - Obtener estadísticas de ingesta
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await IngestionService.getIngestionStats(params.id);

    if (result.success) {
      return NextResponse.json({ success: true, data: result.stats });
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
