import { NextRequest, NextResponse } from 'next/server';
import { incrementViews } from '@/lib/kv';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ideaId = params.id;
    const views = await incrementViews(ideaId);
    
    return NextResponse.json({ views });
  } catch (error) {
    console.error('Failed to increment views:', error);
    return NextResponse.json(
      { error: 'Failed to increment views' },
      { status: 500 }
    );
  }
}
