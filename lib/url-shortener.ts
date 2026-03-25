/**
 * Shorten a URL using TinyURL API
 * @param url - The long URL to shorten
 * @returns The shortened URL or the original URL if shortening fails
 */
export async function shortenUrl(url: string): Promise<string> {
  try {
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
      return url; // Return original URL on error
    }

    const shortUrl = await response.text();
    
    // Validate the response is a valid URL
    if (shortUrl && shortUrl.startsWith('http')) {
      return shortUrl.trim();
    }

    return url; // Return original URL if response is invalid
  } catch (error) {
    console.error('Failed to shorten URL:', error);
    return url; // Return original URL on error
  }
}
