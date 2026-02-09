import { NextRequest, NextResponse } from 'next/server';
import { SubdomainService } from '@/lib/services/SubdomainService';

/**
 * GET /api/ai/domains/[domainId]/subdomains - Listar subdominios
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { domainId: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const subdomains = await SubdomainService.listSubdomainsByDomain(
      params.domainId,
      { status: status || undefined }
    );

    return NextResponse.json({
      success: true,
      data: subdomains,
      count: subdomains.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as any).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai/domains/[domainId]/subdomains - Crear subdominio
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { domainId: string } }
) {
  try {
    const body = await request.json();

    const { name, description, slug, icon, order, metadata } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const result = await SubdomainService.createSubdomain({
      domainId: params.domainId,
      name,
      description,
      slug,
      icon,
      order,
      metadata,
    });

    if (result.success) {
      return NextResponse.json(
        { success: true, data: result.subdomain },
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
