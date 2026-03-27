import { useState, useEffect } from "react";
import type { Idea } from "@/lib/ideas";

interface Props {
  idea: Idea;
  featured?: boolean;
  onView?: () => void;
  onLike?: (ideaId: string) => void;
  onShare?: (idea: Idea) => void;
  isLiked?: boolean;
}

export function IdeaCard({ idea, featured = false, onView, onLike, onShare, isLiked = false }: Props) {
  const [animateLike, setAnimateLike] = useState(false);
  const [animateButton, setAnimateButton] = useState(false);
  const [prevLikes, setPrevLikes] = useState(idea.likes || 0);

  // Trigger animation when like count changes
  useEffect(() => {
    if ((idea.likes || 0) !== prevLikes) {
      setAnimateLike(true);
      setPrevLikes(idea.likes || 0);
      const timer = setTimeout(() => setAnimateLike(false), 300);
      return () => clearTimeout(timer);
    }
  }, [idea.likes, prevLikes]);

  const handleLikeClick = () => {
    setAnimateButton(true);
    setTimeout(() => setAnimateButton(false), 400);
    onLike?.(idea.id);
  };

  const stackItems = idea.stack
    ? idea.stack.split(/\s*\+\s*/).filter(Boolean)
    : [];

  // Remove brackets from project name (all brackets, not just at start/end)
  const displayName = (idea.projectName || "Daily Project Idea").replace(/[\[\]]/g, '');

  const formattedDate = new Date(idea.createdAt || idea.date || Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Difficulty colors
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500";
      case "intermediate": return "bg-yellow-500";
      case "expert": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner": return "Beginner";
      case "intermediate": return "Intermediate";
      case "expert": return "Expert";
      default: return "Unknown";
    }
  };

  /* ── Featured (latest spark) card ──────────────────────────────────── */
  if (featured) {
    return (
      <div className="relative bg-[#1a1a1a]/20 border border-[#2a2a2a]/30 rounded-2xl overflow-hidden backdrop-blur-2xl shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all">
        <div className="p-6">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium uppercase tracking-wide mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Today&apos;s Spark
          </span>

          {/* Project name */}
          <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
            {displayName}
          </h2>

          {/* Description - truncated */}
          {idea.description && (
            <p className="text-slate-300 text-base leading-relaxed mb-6 line-clamp-4">
              {idea.description}
            </p>
          )}

          {/* Stack badges - show first 5 */}
          {stackItems.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {stackItems.slice(0, 5).map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-1 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-300 text-xs rounded-md"
                >
                  {item}
                </span>
              ))}
              {stackItems.length > 5 && (
                <span className="px-2.5 py-1 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-md">
                  +{stackItems.length - 5} more
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">{formattedDate}</span>
              {idea.difficulty && (
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${getDifficultyColor(idea.difficulty)}`} />
                  <span className="text-[10px] font-medium text-slate-300">{getDifficultyLabel(idea.difficulty)}</span>
                </div>
              )}
              {(idea.views || 0) > 0 && (
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span className="text-xs text-slate-500">{idea.views}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {onView && (
                <button
                  onClick={onView}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-500/20 text-blue-400 text-sm font-medium transition-all"
                >
                  View
                </button>
              )}
              <button
                onClick={handleLikeClick}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                  isLiked ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400' : 'bg-[#252525] text-slate-400 hover:text-blue-400'
                } ${animateButton ? 'animate-like-bounce' : 'hover:scale-105'}`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                <span className={`text-xs font-medium ${animateLike ? 'animate-like-count' : ''}`}>{idea.likes || 0}</span>
              </button>
              <button
                onClick={() => onShare?.(idea)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#252525] hover:bg-[#2a2a2a] text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span className="text-xs font-medium">{idea.shares || 0}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Regular (grid) card ────────────────────────────────────────────── */
  return (
    <div className="group bg-[#1a1a1a]/40 border border-[#2a2a2a]/50 rounded-2xl overflow-hidden hover:border-[#3a3a3a] backdrop-blur-xl transition-all hover:shadow-xl hover:shadow-blue-500/5">
      <div className="p-5">
        {/* Project name */}
        <h3 className="text-sm font-semibold text-white mb-3 line-clamp-2 leading-tight">{displayName}</h3>

        {/* Description - truncated to 3 lines */}
        <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
          {idea.description || idea.pain || "A new project idea to explore"}
        </p>

        {/* Footer with date and actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{formattedDate}</span>
            {idea.difficulty && (
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${getDifficultyColor(idea.difficulty)}`} />
                <span className="text-[9px] font-medium text-slate-300">{getDifficultyLabel(idea.difficulty)}</span>
              </div>
            )}
            {(idea.views || 0) > 0 && (
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="text-xs text-slate-500">{idea.views}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {onView && (
              <button
                onClick={onView}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-500/20 text-blue-400 text-xs font-medium transition-all"
              >
                View
              </button>
            )}
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all ${
                isLiked ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400' : 'bg-[#252525] text-slate-400 hover:text-blue-400'
              } ${animateButton ? 'animate-like-bounce' : 'hover:scale-105'}`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
              <span className={`text-xs font-medium ${animateLike ? 'animate-like-count' : ''}`}>{idea.likes || 0}</span>
            </button>
            <button
              onClick={() => onShare?.(idea)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#252525] hover:bg-[#2a2a2a] text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span className="text-xs font-medium">{idea.shares || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
