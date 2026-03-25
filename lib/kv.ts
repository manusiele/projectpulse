import { kv } from '@vercel/kv';

export async function incrementLikes(ideaId: string): Promise<number> {
  const key = `idea:${ideaId}:likes`;
  const likes = await kv.incr(key);
  return likes;
}

export async function decrementLikes(ideaId: string): Promise<number> {
  const key = `idea:${ideaId}:likes`;
  const likes = await kv.decr(key);
  return Math.max(0, likes); // Don't go below 0
}

export async function incrementShares(ideaId: string): Promise<number> {
  const key = `idea:${ideaId}:shares`;
  const shares = await kv.incr(key);
  return shares;
}

export async function getLikes(ideaId: string): Promise<number> {
  const key = `idea:${ideaId}:likes`;
  const likes = await kv.get<number>(key);
  return likes || 0;
}

export async function getShares(ideaId: string): Promise<number> {
  const key = `idea:${ideaId}:shares`;
  const shares = await kv.get<number>(key);
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
