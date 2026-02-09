import { NextRequest, NextResponse } from 'next/server';
import { ModelVersionService } from '@/lib/services/ModelVersionService';

/**
 * GET /api/ai/models/[version] - Obtener versión específica
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { version: string } }
) {
  try {
    const modelVersion = await ModelVersionService.getModelVersion(
      params.version
    );

    if (!modelVersion) {
      return NextResponse.json(
        { success: false, error: 'Model version not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: modelVersion });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as any).message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/ai/models/[version] - Actualizar versión
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { version: string } }
) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === 'updateStatus') {
      const result = await ModelVersionService.updateVersionStatus(
        params.version,
        data.status
      );

      if (result.success) {
        return NextResponse.json({ success: true, data: result.modelVersion });
      } else {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }
    } else if (action === 'updatePerformance') {
      const result = await ModelVersionService.updatePerformanceMetrics(
        params.version,
        data
      );

      if (result.success) {
        return NextResponse.json({ success: true, data: result.modelVersion });
      } else {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }
    } else if (action === 'updateInference') {
      const result = await ModelVersionService.updateInferenceStats(
        params.version,
        data
      );

      if (result.success) {
        return NextResponse.json({ success: true, data: result.modelVersion });
      } else {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
        );
      }
    } else if (action === 'promoteToStable') {
      const result = await ModelVersionService.promoteToStable(params.version);

      if (result.success) {
        return NextResponse.json({ success: true, data: result.modelVersion });
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
