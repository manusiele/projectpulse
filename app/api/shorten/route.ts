import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;
    
    // Validate input
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      );
    }
    
    // Call TinyURL API
    const response = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
        },
      }
    );
    
    if (!response.ok) {
      console.error('TinyURL API error:', response.status);
      return NextResponse.json(
        { shortUrl: url }, // Return original URL on error
        { status: 200 }
      );
    }
    
    const shortUrl = await response.text();
    
    // Validate the response is a valid URL
    if (shortUrl && shortUrl.trim().startsWith('http')) {
      return NextResponse.json({ shortUrl: shortUrl.trim() });
    }
    
    // Return original URL if response is invalid
    return NextResponse.json({ shortUrl: url });
  } catch (error) {
    console.error('Failed to shorten URL:', error);
    // Return original URL on error
    const body = await request.json();
    return NextResponse.json(
      { shortUrl: body.url },
      { status: 200 }
    );
  }
}
