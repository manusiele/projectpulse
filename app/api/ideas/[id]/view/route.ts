import { NextRequest, NextResponse } from 'next/server';
import { incrementViews } from '@/lib/kv';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ideaId } = await context.params;
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
