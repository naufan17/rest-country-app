import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const GET = async () => {
  try {
    const lastSync = await prisma.syncLog.findFirst({
      orderBy: { syncedAt: 'desc' },
    });
    return NextResponse.json(lastSync ?? null);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
