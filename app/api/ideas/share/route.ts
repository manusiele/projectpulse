import { NextResponse } from 'next/server';
import { incrementShares } from '@/lib/kv';

// Rate limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  
  if (limit.count >= 20) { // Max 20 shares per minute
    return false;
  }
  
  limit.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { ideaId } = body;
    
    // Validate input
    if (!ideaId || typeof ideaId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid ideaId' },
        { status: 400 }
      );
    }
    
    // Increment shares in KV store
    const shares = await incrementShares(ideaId);
    
    return NextResponse.json({ success: true, shares });
  } catch (error) {
    console.error('Failed to update share:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
