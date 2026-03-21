import type { Idea } from "@/lib/ideas";
import { SaveButton } from "./SaveButton";
import { ShareButton } from "./ShareButton";

interface Props {
  idea: Idea;
  featured?: boolean;
  onView?: () => void;
}

export function IdeaCard({ idea, featured = false, onView }: Props) {
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
              <SaveButton idea={idea} />
              <ShareButton idea={idea} />
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

        {/* Pain snippet */}
        {idea.pain && (
          <p className="text-slate-400 text-sm mb-3 line-clamp-3 leading-relaxed">{idea.pain}</p>
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
            <SaveButton idea={idea} />
            <ShareButton idea={idea} />
          </div>
        </div>
      </div>
    </div>
  );
}
