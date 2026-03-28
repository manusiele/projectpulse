import { NextResponse } from 'next/server';
import { incrementViews } from '@/lib/kv';

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ideaId } = await context.params;
    console.log(`👁️ View request for idea: ${ideaId}`);
    
    const views = await incrementViews(ideaId);
    console.log(`✅ View tracked for ${ideaId}: ${views} total views`);
    
    return NextResponse.json({ views });
  } catch (err) {
    console.error('❌ Failed to increment views:', err);
    return NextResponse.json(
      { error: 'Failed to increment views' },
      { status: 500 }
    );
  }
}
