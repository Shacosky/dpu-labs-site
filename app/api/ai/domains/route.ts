import { NextRequest, NextResponse } from 'next/server';
import { DomainService } from '@/lib/services/DomainService';

/**
 * GET /api/ai/domains - Listar dominios
 * Query params:
 *   - status: active|inactive|beta|development
 *   - priority: 1-10
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    const filters: any = {};
    if (status) filters.status = status;
    if (priority) filters.priority = parseInt(priority);

    const domains = await DomainService.listDomains(filters);

    return NextResponse.json({
      success: true,
      data: domains,
      count: domains.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as any).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai/domains - Crear dominio
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, description, icon, color, priority, metadata } = body;

    if (!name || !description) {
      return NextResponse.json(
        { success: false, error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const result = await DomainService.createDomain({
      name,
      description,
      icon,
      color,
      priority,
      metadata,
    });

    if (result.success) {
      return NextResponse.json(
        { success: true, data: result.domain },
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
