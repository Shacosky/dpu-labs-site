import { NextRequest, NextResponse } from 'next/server';
import { SubdomainService } from '@/lib/services/SubdomainService';

/**
 * GET /api/ai/subdomains/[id]/stats - Obtener estadísticas
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await SubdomainService.getStats(id);

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
