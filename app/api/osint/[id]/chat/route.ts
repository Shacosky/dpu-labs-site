import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db/mongodb';
import OsintTarget from '@/lib/models/OsintTarget';
import { checkRateLimit, createRateLimitResponse } from '@/lib/rateLimit';
import { decryptString } from '@/lib/crypto';
import {
  sanitizeTargetForChat,
  buildSystemPrompt,
  formatChatHistory,
  ChatMessage,
  hashTargetForAudit,
} from '@/lib/osint/chatContext';
import { callChatProvider } from '@/lib/osint/chatClient';

// Types
interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

interface ChatApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    response: string;
    tokensUsed: number;
    model: string;
    provider: string;
  };
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

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rate = await checkRateLimit(request);
    if (!rate.allowed) return createRateLimitResponse(rate.resetTime);

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get target
  const { id: targetId } = await params;
    const target = await OsintTarget.findById(targetId);

    if (!target) {
      return NextResponse.json(
        { success: false, error: 'Target OSINT no encontrado' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (target.ownerId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Acceso denegado a este target' },
        { status: 403 }
      );
    }

    // Parse request
    const body = (await request.json()) as ChatRequest;
    const userMessage = body.message?.trim();
    const history = body.history || [];

    if (!userMessage || userMessage.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Mensaje vacío' },
        { status: 400 }
      );
    }

    if (userMessage.length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Mensaje muy largo (máx 2000 caracteres)' },
        { status: 400 }
      );
    }

    // Decrypt target data
    const decryptedTarget = {
      id: target._id.toString(),
      name: decToValue<string>(target.nameEnc) || 'Unknown',
      targetType: target.targetType,
      aliases: decToValue<string[]>(target.aliasesEnc) || [],
      emails: decToValue<string[]>(target.emailsEnc) || [],
      phones: decToValue<string[]>(target.phonesEnc) || [],
      urls: decToValue<string[]>(target.urlsEnc) || [],
      tags: decToValue<string[]>(target.tagsEnc) || [],
      notes: decToValue<string>(target.notesEnc) || '',
      sources: decToValue<any[]>(target.sourcesEnc) || [],
      createdAt: target.createdAt,
      updatedAt: target.updatedAt,
    };

    // Sanitize for chat
    const sanitized = sanitizeTargetForChat(decryptedTarget);
    const systemPrompt = buildSystemPrompt(sanitized);

    // Validate history
    const validHistory = Array.isArray(history)
      ? history.slice(-10).filter((m) => m.role && m.content)
      : [];

    // Get chat provider from env (default: mock for dev)
    const provider = process.env.CHAT_PROVIDER || 'mock';

    // Call AI provider
    const chatResponse = await callChatProvider(
      userMessage,
      systemPrompt,
      validHistory,
      provider
    );

    // Audit log (hash target to not expose full ID)
    const auditHash = hashTargetForAudit(targetId);
    console.info('[OSINT_CHAT]', {
      timestamp: new Date().toISOString(),
      userId,
      targetHash: auditHash,
      messageLength: userMessage.length,
      provider: chatResponse.provider,
      model: chatResponse.model,
      tokensUsed: chatResponse.tokensUsed,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          response: chatResponse.message,
          tokensUsed: chatResponse.tokensUsed,
          model: chatResponse.model,
          provider: chatResponse.provider,
        },
      },
      {
        status: 200,
        headers: { 'X-RateLimit-Remaining': rate.remaining.toString() },
      }
    );
  } catch (error: any) {
    console.error('[OSINT_CHAT_ERROR]', error);

    const msg =
      error?.message?.includes('API error')
        ? 'Error en servicio de IA: ' + error.message.slice(0, 50)
        : error?.message || 'Error al procesar chat';

    return NextResponse.json(
      { success: false, error: msg },
      { status: error?.status || 500 }
    );
  }
}
