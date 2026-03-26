import { Redis } from '@upstash/redis';

// Initialize Redis client with environment variables
// Vercel uses KV_ prefix for Upstash Redis environment variables
let redis: Redis | null = null;

try {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
  }
} catch (err) {
  console.warn('Redis not configured for local development', err);
}

export async function incrementLikes(ideaId: string): Promise<number> {
  if (!redis) return 0;
  
  try {
    const key = `idea:${ideaId}:likes`;
    const likes = await redis.incr(key);
    return likes;
  } catch (error) {
    console.error('Redis error:', error);
    return 0;
  }
}

export async function decrementLikes(ideaId: string): Promise<number> {
  if (!redis) return 0;
  
  try {
    const key = `idea:${ideaId}:likes`;
    const likes = await redis.decr(key);
    return Math.max(0, likes); // Don't go below 0
  } catch (error) {
    console.error('Redis error:', error);
    return 0;
  }
}

export async function incrementShares(ideaId: string): Promise<number> {
  if (!redis) return 0;
  
  try {
    const key = `idea:${ideaId}:shares`;
    const shares = await redis.incr(key);
    return shares;
  } catch (error) {
    console.error('Redis error:', error);
    return 0;
  }
}

export async function incrementViews(ideaId: string): Promise<number> {
  if (!redis) return 0;
  
  try {
    const key = `idea:${ideaId}:views`;
    const views = await redis.incr(key);
    return views;
  } catch (error) {
    console.error('Redis error:', error);
    return 0;
  }
}

export async function getLikes(ideaId: string): Promise<number> {
  if (!redis) return 0;
  
  try {
    const key = `idea:${ideaId}:likes`;
    const likes = await redis.get<number>(key);
    return likes || 0;
  } catch (error) {
    console.error('Redis error:', error);
    return 0;
  }
}

export async function getShares(ideaId: string): Promise<number> {
  if (!redis) return 0;
  
  try {
    const key = `idea:${ideaId}:shares`;
    const shares = await redis.get<number>(key);
    return shares || 0;
  } catch (error) {
    console.error('Redis error:', error);
    return 0;
  }
}

export async function getViews(ideaId: string): Promise<number> {
  if (!redis) return 0;
  
  try {
    const key = `idea:${ideaId}:views`;
    const views = await redis.get<number>(key);
    return views || 0;
  } catch (error) {
    console.error('Redis error:', error);
    return 0;
  }
}

export async function getAllCounts(ideaIds: string[]): Promise<Record<string, { likes: number; shares: number; views: number }>> {
  const counts: Record<string, { likes: number; shares: number; views: number }> = {};
  
  if (!redis) {
    // Return default counts for local development
    for (const ideaId of ideaIds) {
      counts[ideaId] = { likes: 0, shares: 0, views: 0 };
    }
    return counts;
  }
  
  try {
    for (const ideaId of ideaIds) {
      const [likes, shares, views] = await Promise.all([
        getLikes(ideaId),
        getShares(ideaId),
        getViews(ideaId)
      ]);
      counts[ideaId] = { likes, shares, views };
    }
  } catch (error) {
    console.error('Redis error:', error);
    // Return default counts on error
    for (const ideaId of ideaIds) {
      counts[ideaId] = { likes: 0, shares: 0, views: 0 };
    }
  }
  
  return counts;
}
