import { NextRequest, NextResponse } from 'next/server';
import { SubdomainService } from '@/lib/services/SubdomainService';

/**
 * GET /api/ai/subdomains/[id] - Obtener subdominio
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subdomain = await SubdomainService.getSubdomain(params.id);

    if (!subdomain) {
      return NextResponse.json(
        { success: false, error: 'Subdomain not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: subdomain });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as any).message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/subdomains/[id]/stats - Obtener estadísticas
 */
export async function GET_STATS(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await SubdomainService.getStats(params.id);

    if (result.success) {
      return NextResponse.json({ success: true, data: result.stats });
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

/**
 * PATCH /api/ai/subdomains/[id] - Actualizar subdominio
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const result = await SubdomainService.updateSubdomain(params.id, body);

    if (result.success) {
      return NextResponse.json({ success: true, data: result.subdomain });
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
