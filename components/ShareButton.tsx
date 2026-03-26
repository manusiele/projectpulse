"use client";

import { Share2 } from "lucide-react";
import type { Idea } from "@/lib/ideas";
import { shortenUrl } from "@/lib/url-shortener";

export function ShareButton({ idea }: { idea: Idea }) {
  const handleShare = async () => {
    const fullUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/dashboard`
        : "https://projectpulse-dev.vercel.app/dashboard";

    try {
      // Shorten the URL first
      const shortUrl = await shortenUrl(fullUrl);

      if (typeof navigator !== "undefined" && navigator.share) {
        // Use native share with just the shortened URL
        await navigator.share({ 
          text: shortUrl
        });
      } else {
        // Copy to clipboard as fallback
        await navigator.clipboard.writeText(shortUrl);
        
        // Optional: Show a brief success indicator
        const button = document.activeElement as HTMLElement;
        if (button) {
          const originalTitle = button.title;
          button.title = "Copied!";
          setTimeout(() => {
            button.title = originalTitle;
          }, 1000);
        }
      }
    } catch (error) {
      // Fallback: copy the original URL if shortening fails
      try {
        await navigator.clipboard.writeText(fullUrl);
      } catch {
        // If clipboard also fails, silently ignore
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      title="Share link"
      className="p-1.5 rounded-full text-gray-600 hover:text-gray-400 transition-colors"
    >
      <Share2 className="w-4 h-4" />
    </button>
  );
}
