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

  const displayName = idea.projectName || "Daily Project Idea";

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
          <h2 className="text-2xl font-bold text-white mb-5 leading-tight">
            {displayName}
          </h2>

          {/* Problem statement */}
          <div className="space-y-3 mb-5">
            {idea.who && (
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Who</span>
                <p className="text-slate-300 mt-1 text-sm leading-relaxed">{idea.who}</p>
              </div>
            )}
            {idea.pain && (
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Pain</span>
                <p className="text-slate-300 mt-1 text-sm leading-relaxed">{idea.pain}</p>
              </div>
            )}
            {idea.gap && (
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Gap</span>
                <p className="text-slate-300 mt-1 text-sm leading-relaxed">{idea.gap}</p>
              </div>
            )}
            {idea.whyNow && (
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Why Now</span>
                <p className="text-slate-300 mt-1 text-sm leading-relaxed">{idea.whyNow}</p>
              </div>
            )}
            {idea.potential && (
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Potential</span>
                <p className="text-slate-300 mt-1 text-sm leading-relaxed">{idea.potential}</p>
              </div>
            )}
          </div>

          {/* Stack badges */}
          {stackItems.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {stackItems.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs rounded-md"
                >
                  {item}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{formattedDate}</span>
              {idea.deploy && (
                <span className="ml-2 px-2 py-0.5 bg-[#252525] rounded text-xs text-slate-400">
                  {idea.deploy}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onLike?.(idea.id)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors relative ${
                  isLiked ? 'bg-pink-500/20 hover:bg-pink-500/30' : 'bg-[#252525] hover:bg-[#2a2a2a]'
                }`}
              >
                <svg className={`w-4 h-4 ${isLiked ? 'text-pink-400' : 'text-pink-400'}`} viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {(idea.likes || 0) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {idea.likes}
                  </span>
                )}
              </button>
              <button
                onClick={() => onShare?.(idea)}
                className="w-9 h-9 rounded-lg bg-[#252525] hover:bg-[#2a2a2a] flex items-center justify-center transition-colors relative"
              >
                <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                {(idea.shares || 0) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {idea.shares}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Regular (grid) card ────────────────────────────────────────────── */
  return (
    <div className="group bg-[#1a1a1a]/40 border border-[#2a2a2a]/50 rounded-2xl overflow-hidden hover:border-[#3a3a3a] backdrop-blur-xl transition-all hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1">
      <div className="p-4">
        {/* Project name */}
        <h3 className="text-base font-semibold text-white mb-2 line-clamp-1">{displayName}</h3>

        {/* Description snippet - show pain if available, otherwise description */}
        {(idea.pain || idea.description) && (
          <p className="text-slate-400 text-sm mb-3 line-clamp-3 leading-relaxed">
            {idea.pain || idea.description}
          </p>
        )}

        {/* Stack badges (max 3 + overflow count) */}
        {stackItems.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {stackItems.slice(0, 3).map((item) => (
              <span
                key={item}
                className="px-2 py-0.5 bg-[#252525] text-slate-300 text-xs rounded-md"
              >
                {item}
              </span>
            ))}
            {stackItems.length > 3 && (
              <span className="px-2 py-0.5 bg-[#252525] text-slate-500 text-xs rounded-md">
                +{stackItems.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#2a2a2a]">
          <span className="text-xs text-slate-600">{formattedDate}</span>
          <div className="flex items-center gap-1">
            {onView && (
              <button
                onClick={onView}
                className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/30 text-blue-400 text-xs font-medium transition-all hover:scale-105"
              >
                View
              </button>
            )}
            <button
              onClick={() => onLike?.(idea.id)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors relative ${
                isLiked ? 'bg-pink-500/20 hover:bg-pink-500/30' : 'bg-[#252525] hover:bg-[#2a2a2a]'
              }`}
            >
              <svg className={`w-4 h-4 ${isLiked ? 'text-pink-400' : 'text-pink-400'}`} viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {(idea.likes || 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {idea.likes}
                </span>
              )}
            </button>
            <button
              onClick={() => onShare?.(idea)}
              className="w-9 h-9 rounded-lg bg-[#252525] hover:bg-[#2a2a2a] flex items-center justify-center transition-colors relative"
            >
              <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              {(idea.shares || 0) > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {idea.shares}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
