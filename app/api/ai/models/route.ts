import { NextRequest, NextResponse } from 'next/server';
import { ModelVersionService } from '@/lib/services/ModelVersionService';

/**
 * GET /api/ai/models - Listar versiones de modelos
 * Query params:
 *   - status: development|beta|stable|deprecated|retired
 *   - limit: cantidad de registros
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    const versions = await ModelVersionService.listModelVersions({
      status: status || undefined,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: versions,
      count: versions.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as any).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai/models - Crear versión de modelo
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      versionNumber,
      name,
      description,
      domains,
      trainingStats,
      parameters,
      trainedBy,
    } = body;

    if (!versionNumber || !domains || !trainedBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await ModelVersionService.createModelVersion({
      versionNumber,
      name,
      description,
      domains,
      trainingStats,
      parameters,
      trainedBy,
    });

    if (result.success) {
      return NextResponse.json(
        { success: true, data: result.modelVersion },
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
 * GET /api/ai/models/stable - Obtener versión estable actual
 */
export async function GET_STABLE(request: NextRequest) {
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
