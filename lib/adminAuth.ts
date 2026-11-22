import crypto from 'crypto';
import type { NextRequest } from 'next/server';
import { kvGet, kvSet } from '@/lib/redis';

const CLAIMED_HASH_KEY = 'sledhaven:admin:passcode_hash';

function hashPasscode(passcode: string, salt?: string): string {
  const useSalt = salt || crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(passcode, useSalt, 64).toString('hex');
  return `${useSalt}:${derived}`;
}

function verifyScryptHash(passcode: string, stored: string): boolean {
  const parts = stored.split(':');
  if (parts.length !== 2) return false;
  const [salt, expectedHex] = parts;
  const derived = crypto.scryptSync(passcode, salt, 64);
  const expected = Buffer.from(expectedHex, 'hex');
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}

function safeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function getAdminAuthStatus(): Promise<{
  configured: boolean;
  mode: 'env' | 'claimed' | 'unclaimed';
}> {
  const envPass = process.env.ADMIN_PASSCODE?.trim();
  if (envPass) {
    return { configured: true, mode: 'env' };
  }
  const claimed = await kvGet(CLAIMED_HASH_KEY);
  if (claimed) {
    return { configured: true, mode: 'claimed' };
  }
  return { configured: false, mode: 'unclaimed' };
}

/**
 * One-time first-run admin claim when ADMIN_PASSCODE env var is not yet configured.
 * Locks itself immediately once claimed or when ADMIN_PASSCODE is set.
 */
export async function claimInitialAdminPasscode(
  passcode: string
): Promise<{ ok: boolean; error?: string }> {
  const status = await getAdminAuthStatus();
  if (status.configured) {
    return { ok: false, error: 'Admin passcode is already configured.' };
  }
  const trimmed = String(passcode || '').trim();
  if (trimmed.length < 8) {
    return { ok: false, error: 'Passcode must be at least 8 characters.' };
  }
  const hashed = hashPasscode(trimmed);
  await kvSet(CLAIMED_HASH_KEY, hashed);
  return { ok: true };
}

export function extractAdminPasscode(request: NextRequest): string {
  const headerPass = request.headers.get('x-admin-passcode');
  if (headerPass) return headerPass.trim();
  const auth = request.headers.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim();
  }
  return '';
}

export async function checkAdminPasscode(request: NextRequest): Promise<boolean> {
  const provided = extractAdminPasscode(request);
  if (!provided) return false;

  // Configured process.env.ADMIN_PASSCODE always takes precedence
  const envPass = process.env.ADMIN_PASSCODE?.trim();
  if (envPass) {
    return safeEqualStrings(provided, envPass);
  }

  // Otherwise verify against claimed first-run scrypt hash
  const claimed = await kvGet(CLAIMED_HASH_KEY);
  if (claimed) {
    return verifyScryptHash(provided, claimed);
  }

  return false;
}
