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
  const stackItems = idea.stack
    ? idea.stack.split(/\s*\+\s*/).filter(Boolean)
    : [];

  // Remove brackets from project name (all brackets, not just at start/end)
  const displayName = (idea.projectName || "Daily Project Idea").replace(/[\[\]]/g, '');

  const formattedDate = new Date(idea.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  /* ── Featured (latest spark) card ──────────────────────────────────── */
  if (featured) {
    return (
      <div className="relative bg-[#1a1a1a]/20 border border-[#2a2a2a]/30 rounded-2xl overflow-hidden backdrop-blur-2xl shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all">
        <div className="p-6">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium uppercase tracking-wide mb-4">
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
                  className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs rounded-md"
                >
                  {item}
                </span>
              ))}
              {stackItems.length > 5 && (
                <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-md">
                  +{stackItems.length - 5} more
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
            <span className="text-xs text-slate-500">{formattedDate}</span>
            <div className="flex items-center gap-2">
              {onView && (
                <button
                  onClick={onView}
                  className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-sm font-medium transition-all"
                >
                  View
                </button>
              )}
              <button
                onClick={() => onLike?.(idea.id)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  isLiked ? 'bg-pink-500/20 text-pink-400' : 'bg-[#252525] text-slate-400 hover:text-pink-400'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
              <button
                onClick={() => onShare?.(idea)}
                className="w-9 h-9 rounded-lg bg-[#252525] hover:bg-[#2a2a2a] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
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
        <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">{displayName}</h3>

        {/* Description - truncated to 3 lines */}
        <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">
          {idea.description || idea.pain || "A new project idea to explore"}
        </p>

        {/* Footer with date and actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
          <span className="text-xs text-slate-500">{formattedDate}</span>
          <div className="flex items-center gap-1.5">
            {onView && (
              <button
                onClick={onView}
                className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-xs font-medium transition-all"
              >
                View
              </button>
            )}
            <button
              onClick={() => onLike?.(idea.id)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isLiked ? 'bg-pink-500/20 text-pink-400' : 'bg-[#252525] text-slate-400 hover:text-pink-400'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <button
              onClick={() => onShare?.(idea)}
              className="w-8 h-8 rounded-lg bg-[#252525] hover:bg-[#2a2a2a] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
