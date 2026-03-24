import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
    
    const filePath = path.join(process.cwd(), 'data', 'ideas.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const ideas = JSON.parse(fileContents);
    
    // Find the idea and increment likes
    const ideaIndex = ideas.findIndex((idea: { id: string }) => idea.id === id);
    
    if (ideaIndex === -1) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }
    
    // Initialize likes if not present
    if (!ideas[ideaIndex].likes) {
      ideas[ideaIndex].likes = 0;
    }
    
    // Increment likes
    ideas[ideaIndex].likes += 1;
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(ideas, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      likes: ideas[ideaIndex].likes 
    });
  } catch (error) {
    console.error('Failed to update likes:', error);
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
    
    const filePath = path.join(process.cwd(), 'data', 'ideas.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const ideas = JSON.parse(fileContents);
    
    // Find the idea and decrement likes
    const ideaIndex = ideas.findIndex((idea: { id: string }) => idea.id === id);
    
    if (ideaIndex === -1) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }
    
    // Initialize likes if not present
    if (!ideas[ideaIndex].likes) {
      ideas[ideaIndex].likes = 0;
    }
    
    // Decrement likes (don't go below 0)
    ideas[ideaIndex].likes = Math.max(0, ideas[ideaIndex].likes - 1);
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(ideas, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      likes: ideas[ideaIndex].likes 
    });
  } catch (error) {
    console.error('Failed to update likes:', error);
    return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 });
  }
}
