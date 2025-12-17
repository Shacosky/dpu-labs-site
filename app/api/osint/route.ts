import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db/mongodb';
import OsintTarget from '@/lib/models/OsintTarget';
import { OsintTargetSchema } from '@/lib/validations';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rateLimit';
import { encryptString, decryptString, sha256Hex } from '@/lib/crypto';

function encOrNull(value: any | undefined) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length === 0) return undefined;
    return encryptString(trimmed);
  }
  // Arrays/objects: si están vacíos, omitimos
  try {
    const serialized = JSON.stringify(value);
    if (serialized === '[]' || serialized === '{}' || serialized === 'null') return undefined;
    return encryptString(serialized);
  } catch {
    return undefined;
  }
}

function decToValue<T = unknown>(payload: any): T | undefined {
  if (!payload) return undefined;
  const text = decryptString(payload);
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export async function GET(request: NextRequest) {
  try {
    const rate = await checkRateLimit(request);
    if (!rate.allowed) return createRateLimitResponse(rate.resetTime);

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const url = new URL(request.url);
    const typeFilter = url.searchParams.get('targetType');
    const query: any = { ownerId: userId };
    if (typeFilter === 'person' || typeFilter === 'company') query.targetType = typeFilter;
    const docs = await OsintTarget.find(query).sort({ updatedAt: -1 });

    const data = docs.map((d: any) => ({
      id: d._id.toString(),
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      targetType: d.targetType,
      name: decToValue<string>(d.nameEnc),
      aliases: decToValue<string[]>(d.aliasesEnc) || [],
      emails: decToValue<string[]>(d.emailsEnc) || [],
      phones: decToValue<string[]>(d.phonesEnc) || [],
      urls: decToValue<string[]>(d.urlsEnc) || [],
      tags: decToValue<string[]>(d.tagsEnc) || [],
      notes: decToValue<string>(d.notesEnc) || '',
      sources: decToValue<any[]>(d.sourcesEnc) || [],
    }));

    return NextResponse.json(
      { success: true, data },
      { headers: { 'X-RateLimit-Remaining': rate.remaining.toString() } }
    );
  } catch (error) {
    const msg =
      (error as any)?.name === 'MongooseServerSelectionError'
        ? 'DB unreachable: IP no autorizada en Atlas o cluster inaccesible'
        : 'Failed to fetch OSINT targets';
    console.error('Error fetching OSINT targets:', error);
    return NextResponse.json({ success: false, error: msg }, { status: (error as any)?.name === 'MongooseServerSelectionError' ? 503 : 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const rate = await checkRateLimit(request);
    if (!rate.allowed) return createRateLimitResponse(rate.resetTime);

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const input = OsintTargetSchema.parse(body);

    await dbConnect();

    const nameHash = sha256Hex(input.name.trim().toLowerCase());

    const doc = await OsintTarget.create({
      targetType: input.targetType,
      ownerId: userId,
      nameHash,
      nameEnc: encryptString(input.name),
      aliasesEnc: encOrNull(input.aliases),
      emailsEnc: encOrNull(input.emails),
      phonesEnc: encOrNull(input.phones),
      urlsEnc: encOrNull(input.urls),
      tagsEnc: encOrNull(input.tags),
      notesEnc: encOrNull(input.notes),
      sourcesEnc: encOrNull(input.sources),
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: doc._id.toString(),
          name: input.name,
          aliases: input.aliases || [],
          emails: input.emails || [],
          phones: input.phones || [],
          urls: input.urls || [],
          tags: input.tags || [],
          notes: input.notes || '',
          sources: input.sources || [],
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        },
      },
      { status: 201, headers: { 'X-RateLimit-Remaining': rate.remaining.toString() } }
    );
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Duplicate target for this owner (name already exists)' },
        { status: 409 }
      );
    }
    const msg =
      error?.name === 'MongooseServerSelectionError'
        ? 'DB unreachable: IP no autorizada en Atlas o cluster inaccesible'
        : 'Failed to create OSINT target';
    console.error('Error creating OSINT target:', error);
    return NextResponse.json({ success: false, error: msg }, { status: error?.name === 'MongooseServerSelectionError' ? 503 : 500 });
  }
}
