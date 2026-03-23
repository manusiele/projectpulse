import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'ideas.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const ideas = JSON.parse(fileContents);
    
    // Sort by date descending (newest first)
    const sortedIdeas = ideas.sort((a: { date: string }, b: { date: string }) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return NextResponse.json(sortedIdeas, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Failed to read ideas:', error);
    return NextResponse.json([], { status: 500 });
  }
}
