import { Redis } from '@upstash/redis';

// Initialize Redis client with environment variables
// Vercel uses KV_ prefix for Upstash Redis environment variables
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function incrementLikes(ideaId: string): Promise<number> {
  const key = `idea:${ideaId}:likes`;
  const likes = await redis.incr(key);
  return likes;
}

export async function decrementLikes(ideaId: string): Promise<number> {
  const key = `idea:${ideaId}:likes`;
  const likes = await redis.decr(key);
  return Math.max(0, likes); // Don't go below 0
}

export async function incrementShares(ideaId: string): Promise<number> {
  const key = `idea:${ideaId}:shares`;
  const shares = await redis.incr(key);
  return shares;
}

export async function getLikes(ideaId: string): Promise<number> {
  const key = `idea:${ideaId}:likes`;
  const likes = await redis.get<number>(key);
  return likes || 0;
}

export async function getShares(ideaId: string): Promise<number> {
  const key = `idea:${ideaId}:shares`;
  const shares = await redis.get<number>(key);
  return shares || 0;
}

export async function getAllCounts(ideaIds: string[]): Promise<Record<string, { likes: number; shares: number }>> {
  const counts: Record<string, { likes: number; shares: number }> = {};
  
  for (const ideaId of ideaIds) {
    const [likes, shares] = await Promise.all([
      getLikes(ideaId),
      getShares(ideaId)
    ]);
    counts[ideaId] = { likes, shares };
  }
  
  return counts;
}
