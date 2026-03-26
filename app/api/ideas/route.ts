import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAllCounts } from '@/lib/kv';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'ideas.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const ideas = JSON.parse(fileContents);
    
    // Get all idea IDs
    const ideaIds = ideas.map((idea: { id: string }) => idea.id);
    
    // Fetch counts from KV store
    const counts = await getAllCounts(ideaIds);
    
    // Merge counts with ideas
    const ideasWithCounts = ideas.map((idea: { id: string; likes?: number; shares?: number }) => ({
      ...idea,
      likes: counts[idea.id]?.likes || 0,
      shares: counts[idea.id]?.shares || 0
    }));
    
    // Sort by createdAt descending (newest first)
    const sortedIdeas = ideasWithCounts.sort((a: { createdAt?: string; date?: string }, b: { createdAt?: string; date?: string }) => {
      const dateA = a.createdAt || a.date || '';
      const dateB = b.createdAt || b.date || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    
    return NextResponse.json(sortedIdeas, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Failed to read ideas:', error);
    return NextResponse.json([], { status: 500 });
  }
}
