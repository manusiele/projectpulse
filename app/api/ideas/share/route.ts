import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { ideaId } = await request.json();
    
    const filePath = path.join(process.cwd(), 'data', 'ideas.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const ideas = JSON.parse(fileContents);
    
    const idea = ideas.find((i: { id: string }) => i.id === ideaId);
    if (idea) {
      idea.shares = (idea.shares || 0) + 1;
      
      fs.writeFileSync(filePath, JSON.stringify(ideas, null, 2));
      
      // Also update public folder
      const publicPath = path.join(process.cwd(), 'public', 'ideas.json');
      fs.writeFileSync(publicPath, JSON.stringify(ideas, null, 2));
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update share:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
