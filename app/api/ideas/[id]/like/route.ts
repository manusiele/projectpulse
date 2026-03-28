import { NextResponse } from 'next/server';
import { incrementLikes, decrementLikes } from '@/lib/kv';

// Rate limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }
  
  if (limit.count >= 10) { // Max 10 likes per minute
    return false;
  }
  
  limit.count++;
  return true;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    console.log(`📝 Like request for idea: ${id}`);
    
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    if (!checkRateLimit(ip)) {
      console.warn(`⚠️ Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    
    // Validate ID format
    if (!id || typeof id !== 'string' || !id.startsWith('idea_')) {
      console.error(`❌ Invalid idea ID: ${id}`);
      return NextResponse.json(
        { error: 'Invalid idea ID' },
        { status: 400 }
      );
    }
    
    // Increment likes in KV store
    const likes = await incrementLikes(id);
    console.log(`✅ Like successful for ${id}: ${likes} total likes`);
    
    return NextResponse.json({ 
      success: true, 
      likes 
    });
  } catch (error) {
    console.error('❌ Failed to update likes:', error);
    return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    
    // Validate ID format
    if (!id || typeof id !== 'string' || !id.startsWith('idea_')) {
      return NextResponse.json(
        { error: 'Invalid idea ID' },
        { status: 400 }
      );
    }
    
    // Decrement likes in KV store
    const likes = await decrementLikes(id);
    
    return NextResponse.json({ 
      success: true, 
      likes 
    });
  } catch (error) {
    console.error('Failed to update likes:', error);
    return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 });
  }
}
