"use client";

import { Share2 } from "lucide-react";
import type { Idea } from "@/lib/ideas";

export function ShareButton({ idea }: { idea: Idea }) {
  const handleShare = async () => {
    const title = idea.projectName || "FocusLock Daily Idea";
    const text = [
      title,
      idea.stack ? `Stack: ${idea.stack}` : null,
      idea.pain || null,
      "\nvia @focuslock_bot",
    ]
      .filter(Boolean)
      .join("\n\n");

    const url =
      typeof window !== "undefined"
        ? window.location.origin + "/dashboard"
        : "https://focuslock.vercel.app/dashboard";

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        const tweet = encodeURIComponent(`${title}\n\nStack: ${idea.stack}\n\n${url}`);
        window.open(
          `https://x.com/intent/tweet?text=${tweet}`,
          "_blank",
          "noopener,noreferrer"
        );
      }
    } catch {
      // User cancelled or share not supported — silently ignore
    }
  };

  return (
    <button
      onClick={handleShare}
      title="Share idea"
      className="p-1.5 rounded-full text-gray-600 hover:text-gray-400 transition-colors"
    >
      <Share2 className="w-4 h-4" />
    </button>
  );
}
