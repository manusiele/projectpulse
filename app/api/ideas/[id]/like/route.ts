import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'ideas.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const ideas = JSON.parse(fileContents);
    
    // Find the idea and increment likes
    const ideaIndex = ideas.findIndex((idea: any) => idea.id === params.id);
    
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
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'ideas.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const ideas = JSON.parse(fileContents);
    
    // Find the idea and decrement likes
    const ideaIndex = ideas.findIndex((idea: any) => idea.id === params.id);
    
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
