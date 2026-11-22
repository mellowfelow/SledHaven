import { NextRequest, NextResponse } from 'next/server';
import { claimInitialAdminPasscode, getAdminAuthStatus } from '@/lib/adminAuth';
import { isMailerConfigured } from '@/lib/mailer';
import { isRedisConfigured } from '@/lib/redis';

export async function GET() {
  const status = await getAdminAuthStatus();
  return NextResponse.json({
    configured: status.configured,
    mode: status.mode,
    mailerConfigured: isMailerConfigured(),
    redisConfigured: isRedisConfigured(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const passcode = String(body?.passcode || '');
    const result = await claimInitialAdminPasscode(passcode);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true, mode: 'claimed' });
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }
}
