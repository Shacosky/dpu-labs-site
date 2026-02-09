import { NextRequest, NextResponse } from 'next/server';
import { IngestionService } from '@/lib/services/IngestionService';

/**
 * POST /api/ai/ingestion - Crear registro de ingesta
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { domainId, subdomainId, ingestionType, source, executedBy } = body;

    if (!domainId || !ingestionType || !executedBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await IngestionService.createIngestionRecord({
      domainId,
      subdomainId,
      ingestionType,
      source,
      executedBy,
    });

    if (result.success) {
      return NextResponse.json(
        { success: true, data: result.ingestion },
        { status: 201 }
      );
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
 * GET /api/ai/ingestion - Obtener historial de ingestas
 * Query params:
 *   - domainId: ID del dominio
 *   - limit: cantidad de registros
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const domainId = searchParams.get('domainId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!domainId) {
      return NextResponse.json(
        { success: false, error: 'domainId is required' },
        { status: 400 }
      );
    }

    const result = await IngestionService.getIngestionHistory(domainId, limit);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.ingestiones,
        count: result.ingestiones?.length || 0,
      });
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
