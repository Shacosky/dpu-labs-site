import { NextRequest, NextResponse } from 'next/server';
import { ModelVersionService } from '@/lib/services/ModelVersionService';

/**
 * GET /api/ai/models/stable - Obtener versión estable actual
 */
export async function GET(request: NextRequest) {
  try {
    const stableVersion = await ModelVersionService.getStableVersion();

    if (!stableVersion) {
      return NextResponse.json(
        { success: false, error: 'No stable version found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: stableVersion });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as any).message },
      { status: 500 }
    );
  }
}
