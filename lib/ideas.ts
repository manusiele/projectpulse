export interface Idea {
  id: string;
  createdAt: string;
  domain?: string;
  projectName?: string;
  description?: string;
  stack?: string;
  deploy?: string;
  who?: string;
  pain?: string;
  gap?: string;
  impact?: string;
  whyNow?: string;
  potential?: string;
  docs?: string;
  likes?: number;
  shares?: number;
  views?: number;
}

/**
 * Load ideas from data/ideas.json.
 *
 * Development: reads the local file directly.
 * Production (Vercel): fetches from the raw GitHub URL so deployments don't
 *   need a rebuild — just push a new commit and the page revalidates hourly.
 *
 * Override the URL via IDEAS_SOURCE_URL env var if the repo is private or
 * moved to a different location.
 */
export async function getIdeas(): Promise<Idea[]> {
  try {
    let data: Idea[];

    if (process.env.NODE_ENV === "development") {
      const { readFileSync } = await import("fs");
      const { join } = await import("path");
      const raw = readFileSync(
        join(process.cwd(), "data", "ideas.json"),
        "utf-8"
      );
      data = JSON.parse(raw) as Idea[];
    } else {
      const url =
        process.env.IDEAS_SOURCE_URL ??
        "https://raw.githubusercontent.com/manusiele/focuslock-ai/main/data/ideas.json";
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) return [];
      data = (await res.json()) as Idea[];
    }

    // Return newest-first
    return [...data].reverse();
  } catch (err) {
    console.error("[FocusLock] Failed to load ideas:", err);
    return [];
  }
}
