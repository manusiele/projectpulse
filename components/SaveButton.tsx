"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import type { Idea } from "@/lib/ideas";

const STORAGE_KEY = "focuslock_favorites";

function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function SaveButton({ idea }: { idea: Idea }) {
  const [saved, setSaved] = useState(false);

  // Sync with localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setSaved(getFavorites().includes(idea.id));
  }, [idea.id]);

  const toggle = () => {
    const favs = getFavorites();
    const next = saved
      ? favs.filter((id) => id !== idea.id)
      : [...favs, idea.id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(!saved);
  };

  return (
    <button
      onClick={toggle}
      title={saved ? "Remove from favorites" : "Save idea"}
      className={`p-1.5 rounded-full transition-colors ${
        saved
          ? "text-pink-500 hover:text-pink-400"
          : "text-gray-600 hover:text-gray-400"
      }`}
    >
      <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}
