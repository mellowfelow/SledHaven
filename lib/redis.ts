import { Redis } from '@upstash/redis';

type HashMap = Map<string, string>;

const globalForStore = globalThis as unknown as {
  __sledhavenMemoryHashes?: Map<string, HashMap>;
  __sledhavenMemoryKV?: Map<string, string>;
  __sledhavenRedis?: Redis | null;
};

if (!globalForStore.__sledhavenMemoryHashes) {
  globalForStore.__sledhavenMemoryHashes = new Map();
}
if (!globalForStore.__sledhavenMemoryKV) {
  globalForStore.__sledhavenMemoryKV = new Map();
}

const CREDENTIAL_PREFIXES = [
  ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
  ['UPSTASH_REDIS_KV_REST_API_URL', 'UPSTASH_REDIS_KV_REST_API_TOKEN'],
  ['KV_REST_API_URL', 'KV_REST_API_TOKEN'],
  ['REDIS_REST_URL', 'REDIS_REST_TOKEN'],
  ['STORAGE_REST_API_URL', 'STORAGE_REST_API_TOKEN'],
  ['VERCEL_KV_REST_API_URL', 'VERCEL_KV_REST_API_TOKEN'],
] as const;

export function getRedisClient(): Redis | null {
  if (globalForStore.__sledhavenRedis !== undefined) {
    return globalForStore.__sledhavenRedis;
  }

  for (const [urlKey, tokenKey] of CREDENTIAL_PREFIXES) {
    const url = process.env[urlKey]?.trim();
    const token = process.env[tokenKey]?.trim();
    if (url && token) {
      globalForStore.__sledhavenRedis = new Redis({ url, token });
      return globalForStore.__sledhavenRedis;
    }
  }

  globalForStore.__sledhavenRedis = null;
  return null;
}

export function isRedisConfigured(): boolean {
  return getRedisClient() !== null;
}

function getMemoryHash(key: string): HashMap {
  const hashes = globalForStore.__sledhavenMemoryHashes!;
  let map = hashes.get(key);
  if (!map) {
    map = new Map();
    hashes.set(key, map);
  }
  return map;
}

export async function hashSet(hashKey: string, field: string, value: unknown): Promise<void> {
  const serialized = JSON.stringify(value);
  const redis = getRedisClient();
  if (redis) {
    await redis.hset(hashKey, { [field]: serialized });
    return;
  }
  getMemoryHash(hashKey).set(field, serialized);
}

export async function hashGet<T>(hashKey: string, field: string): Promise<T | null> {
  const redis = getRedisClient();
  if (redis) {
    const raw = await redis.hget<string | T>(hashKey, field);
    if (raw == null) return null;
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    }
    return raw as T;
  }

  const raw = getMemoryHash(hashKey).get(field);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function hashGetAll<T>(hashKey: string): Promise<T[]> {
  const redis = getRedisClient();
  if (redis) {
    const all = await redis.hgetall<Record<string, string | T>>(hashKey);
    if (!all) return [];
    return Object.values(all)
      .map((val) => {
        if (typeof val === 'string') {
          try {
            return JSON.parse(val) as T;
          } catch {
            return null;
          }
        }
        return val as T;
      })
      .filter((item): item is T => item !== null);
  }

  const results: T[] = [];
  for (const raw of getMemoryHash(hashKey).values()) {
    try {
      results.push(JSON.parse(raw) as T);
    } catch {
      // skip malformed entry
    }
  }
  return results;
}

export async function hashDelete(hashKey: string, field: string): Promise<void> {
  const redis = getRedisClient();
  if (redis) {
    await redis.hdel(hashKey, field);
    return;
  }
  getMemoryHash(hashKey).delete(field);
}

export async function kvGet(key: string): Promise<string | null> {
  const redis = getRedisClient();
  if (redis) {
    const val = await redis.get<string>(key);
    return val ?? null;
  }
  return globalForStore.__sledhavenMemoryKV!.get(key) ?? null;
}

export async function kvSet(key: string, value: string): Promise<void> {
  const redis = getRedisClient();
  if (redis) {
    await redis.set(key, value);
    return;
  }
  globalForStore.__sledhavenMemoryKV!.set(key, value);
}
