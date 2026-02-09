import { NextRequest, NextResponse } from 'next/server';
import { NodeService } from '@/lib/services/NodeService';

/**
 * GET /api/ai/nodes - Listar nodos
 * Query params:
 *   - subdomainId: ID del subdominio
 *   - status: pending|approved|rejected|needs_review
 *   - category: categoría del nodo
 *   - search: búsqueda de keywords
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const subdomainId = searchParams.get('subdomainId');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    if (!subdomainId) {
      return NextResponse.json(
        { success: false, error: 'subdomainId is required' },
        { status: 400 }
      );
    }

    let nodes;
    if (search) {
      const keywords = search.split(' ');
      nodes = await NodeService.searchNodesByKeywords(keywords, 20);
    } else {
      nodes = await NodeService.listNodesBySubdomain(subdomainId, {
        status: status || undefined,
        category: category || undefined,
      });
    }

    return NextResponse.json({
      success: true,
      data: nodes,
      count: nodes.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as any).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai/nodes - Crear nodo
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      subdomainId,
      category,
      title,
      content,
      summary,
      keywords,
      examples,
      source,
      contentType,
      createdBy,
    } = body;

    if (!subdomainId || !category || !title || !content || !summary || !createdBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await NodeService.createNode({
      subdomainId,
      category,
      title,
      content,
      summary,
      keywords,
      examples,
      contentType,
      source,
      createdBy,
    });

    if (result.success) {
      return NextResponse.json(
        { success: true, data: result.node },
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
