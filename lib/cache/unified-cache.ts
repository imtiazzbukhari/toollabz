import { LRUCache } from "lru-cache";

const memory = new LRUCache<string, string>({ max: 500 });

type RedisClient = import("ioredis").default;
let redisClient: RedisClient | null = null;
let redisInitFailed = false;

async function getRedisClient(): Promise<RedisClient | null> {
  const url = process.env.REDIS_URL?.trim();
  if (!url || redisInitFailed) return null;
  if (redisClient) return redisClient;
  try {
    const { default: IORedis } = await import("ioredis");
    redisClient = new IORedis(url, { maxRetriesPerRequest: 2, enableReadyCheck: true });
    return redisClient;
  } catch {
    redisInitFailed = true;
    return null;
  }
}

export async function cacheGet(key: string): Promise<string | null> {
  const r = await getRedisClient();
  if (r) {
    try {
      const v = await r.get(key);
      if (v != null) return v;
    } catch {
      /* LRU fallback */
    }
  }
  return memory.get(key) ?? null;
}

export async function cacheSet(key: string, value: string, ttlSec: number): Promise<void> {
  const r = await getRedisClient();
  if (r) {
    try {
      await r.set(key, value, "EX", ttlSec);
      return;
    } catch {
      /* LRU fallback */
    }
  }
  memory.set(key, value, { ttl: ttlSec * 1000 });
}
