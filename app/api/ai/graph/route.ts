import { NextRequest, NextResponse } from 'next/server';
import { GraphService } from '@/lib/services/GraphService';

/**
 * GET /api/ai/graph - Obtener relaciones
 * Query params:
 *   - nodeId: ID del nodo
 *   - direction: outgoing|incoming|both
 *   - type: tipo de relación
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const nodeId = searchParams.get('nodeId');
    const direction = searchParams.get('direction') || 'outgoing';
    const relationType = searchParams.get('type');

    if (!nodeId) {
      return NextResponse.json(
        { success: false, error: 'nodeId is required' },
        { status: 400 }
      );
    }

    let relationships;
    if (direction === 'outgoing') {
      relationships = await GraphService.getOutgoingRelationships(
        nodeId,
        relationType || undefined
      );
    } else if (direction === 'incoming') {
      relationships = await GraphService.getIncomingRelationships(
        nodeId,
        relationType || undefined
      );
    } else {
      const outgoing = await GraphService.getOutgoingRelationships(
        nodeId,
        relationType || undefined
      );
      const incoming = await GraphService.getIncomingRelationships(
        nodeId,
        relationType || undefined
      );
      relationships = [...outgoing, ...incoming];
    }

    return NextResponse.json({
      success: true,
      data: relationships,
      count: relationships.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as any).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai/graph - Crear relación entre nodos
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      sourceNodeId,
      targetNodeId,
      relationshipType,
      weight,
      confidence,
      context,
      bidirectional,
      createdBy,
      metadata,
    } = body;

    if (!sourceNodeId || !targetNodeId || !relationshipType || !createdBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await GraphService.createRelationship({
      sourceNodeId,
      targetNodeId,
      relationshipType,
      weight,
      confidence,
      context,
      bidirectional,
      createdBy,
      metadata,
    });

    if (result.success) {
      return NextResponse.json(
        { success: true, data: result.relationship },
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
