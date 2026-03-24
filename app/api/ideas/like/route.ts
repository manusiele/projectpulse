import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }
  
  if (limit.count >= 10) { // Max 10 requests per minute
    return false;
  }
  
  limit.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { ideaId, increment } = body;
    
    // Validate input
    if (!ideaId || typeof ideaId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid ideaId' },
        { status: 400 }
      );
    }
    
    if (typeof increment !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid increment value' },
        { status: 400 }
      );
    }
    
    const filePath = path.join(process.cwd(), 'data', 'ideas.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const ideas = JSON.parse(fileContents);
    
    const idea = ideas.find((i: { id: string }) => i.id === ideaId);
    if (!idea) {
      return NextResponse.json(
        { success: false, error: 'Idea not found' },
        { status: 404 }
      );
    }
    
    idea.likes = Math.max(0, (idea.likes || 0) + (increment ? 1 : -1));
    
    fs.writeFileSync(filePath, JSON.stringify(ideas, null, 2));
    
    // Also update public folder
    const publicPath = path.join(process.cwd(), 'public', 'ideas.json');
    fs.writeFileSync(publicPath, JSON.stringify(ideas, null, 2));
    
    return NextResponse.json({ success: true, likes: idea.likes });
  } catch (error) {
    console.error('Failed to update like:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
