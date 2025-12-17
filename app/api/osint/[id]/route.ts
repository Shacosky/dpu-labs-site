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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rate = await checkRateLimit(request);
    if (!rate.allowed) return createRateLimitResponse(rate.resetTime);

    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
  const { id } = await params;
  const doc = await OsintTarget.findOne({ _id: id, ownerId: userId });
    if (!doc) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    const data = {
      targetType: doc.targetType,
      id: doc._id.toString(),
      name: decToValue<string>(doc.nameEnc),
      aliases: decToValue<string[]>(doc.aliasesEnc) || [],
      emails: decToValue<string[]>(doc.emailsEnc) || [],
      phones: decToValue<string[]>(doc.phonesEnc) || [],
      urls: decToValue<string[]>(doc.urlsEnc) || [],
      tags: decToValue<string[]>(doc.tagsEnc) || [],
      notes: decToValue<string>(doc.notesEnc) || '',
      sources: decToValue<any[]>(doc.sourcesEnc) || [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };

    return NextResponse.json({ success: true, data }, { headers: { 'X-RateLimit-Remaining': rate.remaining.toString() } });
  } catch (e) {
    const err: any = e;
    const msg = err?.name === 'MongooseServerSelectionError'
      ? 'DB unreachable: IP no autorizada en Atlas o cluster inaccesible'
      : 'Failed to fetch OSINT target';
    console.error('Error fetching OSINT target:', e);
    return NextResponse.json({ success: false, error: msg }, { status: err?.name === 'MongooseServerSelectionError' ? 503 : 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rate = await checkRateLimit(request);
    if (!rate.allowed) return createRateLimitResponse(rate.resetTime);

    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const input = OsintTargetSchema.partial().parse(body);

    await dbConnect();

    const updates: any = {};
    if (input.targetType) updates.targetType = input.targetType;
    if (input.name) {
      updates.nameEnc = encryptString(input.name);
      updates.nameHash = sha256Hex(input.name.trim().toLowerCase());
    }
    if (input.aliases !== undefined) updates.aliasesEnc = encOrNull(input.aliases);
    if (input.emails !== undefined) updates.emailsEnc = encOrNull(input.emails);
    if (input.phones !== undefined) updates.phonesEnc = encOrNull(input.phones);
    if (input.urls !== undefined) updates.urlsEnc = encOrNull(input.urls);
    if (input.tags !== undefined) updates.tagsEnc = encOrNull(input.tags);
    if (input.notes !== undefined) updates.notesEnc = encOrNull(input.notes);
    if (input.sources !== undefined) updates.sourcesEnc = encOrNull(input.sources);

    const { id } = await params;
    const doc = await OsintTarget.findOneAndUpdate(
      { _id: id, ownerId: userId },
      { $set: updates },
      { new: true }
    );

    if (!doc) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    const data = {
      targetType: doc.targetType,
      id: doc._id.toString(),
      name: decToValue<string>(doc.nameEnc),
      aliases: decToValue<string[]>(doc.aliasesEnc) || [],
      emails: decToValue<string[]>(doc.emailsEnc) || [],
      phones: decToValue<string[]>(doc.phonesEnc) || [],
      urls: decToValue<string[]>(doc.urlsEnc) || [],
      tags: decToValue<string[]>(doc.tagsEnc) || [],
      notes: decToValue<string>(doc.notesEnc) || '',
      sources: decToValue<any[]>(doc.sourcesEnc) || [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };

    return NextResponse.json({ success: true, data }, { headers: { 'X-RateLimit-Remaining': rate.remaining.toString() } });
  } catch (e: any) {
    if (e?.code === 11000) {
      return NextResponse.json({ success: false, error: 'Duplicate target (name)' }, { status: 409 });
    }
    const msg = e?.name === 'MongooseServerSelectionError'
      ? 'DB unreachable: IP no autorizada en Atlas o cluster inaccesible'
      : 'Failed to update OSINT target';
    console.error('Error updating OSINT target:', e);
    return NextResponse.json({ success: false, error: msg }, { status: e?.name === 'MongooseServerSelectionError' ? 503 : 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rate = await checkRateLimit(request);
    if (!rate.allowed) return createRateLimitResponse(rate.resetTime);

    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
  const { id } = await params;
  const res = await OsintTarget.deleteOne({ _id: id, ownerId: userId });
    if (res.deletedCount === 0) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    const msg = e?.name === 'MongooseServerSelectionError'
      ? 'DB unreachable: IP no autorizada en Atlas o cluster inaccesible'
      : 'Failed to delete OSINT target';
    console.error('Error deleting OSINT target:', e);
    return NextResponse.json({ success: false, error: msg }, { status: e?.name === 'MongooseServerSelectionError' ? 503 : 500 });
  }
}
