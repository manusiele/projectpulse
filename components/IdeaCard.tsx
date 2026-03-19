import { Calendar } from "lucide-react";
import type { Idea } from "@/lib/ideas";
import { SaveButton } from "./SaveButton";
import { ShareButton } from "./ShareButton";

interface Props {
  idea: Idea;
  featured?: boolean;
}

export function IdeaCard({ idea, featured = false }: Props) {
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
      <div className="relative bg-black border-2 border-pink-500/60 rounded-sm overflow-hidden shadow-2xl shadow-pink-500/40 group hover:shadow-pink-500/60 transition-all hover:border-pink-400 font-mono">
        {/* Animated top bar */}
        <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 animate-pulse" style={{boxShadow: '0 0 10px rgba(236, 72, 153, 0.8)'}} />

        <div className="p-6 sm:p-8">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-black border border-pink-500/60 text-pink-400 text-xs font-bold uppercase tracking-widest mb-5" style={{textShadow: '0 0 8px rgba(236, 72, 153, 0.6)'}}>
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
            TODAY'S SPARK
          </span>

          {/* Project name */}
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-6 leading-tight group-hover:text-cyan-300 transition-all uppercase tracking-widest" style={{textShadow: '0 0 15px rgba(34, 211, 238, 0.8)'}}>
            {displayName}
          </h2>

          {/* Problem statement */}
          <div className="space-y-4 mb-6 border-l-2 border-cyan-500/40 pl-4">
            {idea.who && (
              <div>
                <span className="text-xs font-bold text-cyan-400/70 uppercase tracking-wider">
                  &gt; WHO
                </span>
                <p className="text-cyan-200/80 mt-1 text-sm leading-relaxed">
                  {idea.who}
                </p>
              </div>
            )}
            {idea.pain && (
              <div>
                <span className="text-xs font-bold text-pink-400/70 uppercase tracking-wider">
                  &gt; PAIN
                </span>
                <p className="text-cyan-200/80 mt-1 text-sm leading-relaxed">
                  {idea.pain}
                </p>
              </div>
            )}
            {idea.gap && (
              <div>
                <span className="text-xs font-bold text-purple-400/70 uppercase tracking-wider">
                  &gt; GAP
                </span>
                <p className="text-cyan-200/80 mt-1 text-sm leading-relaxed">
                  {idea.gap}
                </p>
              </div>
            )}
            {idea.whyNow && (
              <div>
                <span className="text-xs font-bold text-cyan-400/70 uppercase tracking-wider">
                  &gt; WHY NOW
                </span>
                <p className="text-cyan-200/80 mt-1 text-sm leading-relaxed">
                  {idea.whyNow}
                </p>
              </div>
            )}
            {idea.potential && (
              <div>
                <span className="text-xs font-bold text-pink-400/70 uppercase tracking-wider">
                  &gt; POTENTIAL
                </span>
                <p className="text-cyan-200/80 mt-1 text-sm leading-relaxed">
                  {idea.potential}
                </p>
              </div>
            )}
          </div>

          {/* Stack badges */}
          {stackItems.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {stackItems.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 bg-black border border-cyan-500/40 text-cyan-400 text-xs rounded-sm font-bold uppercase tracking-widest hover:border-cyan-400 transition-all"
                  style={{textShadow: '0 0 5px rgba(34, 211, 238, 0.5)'}}
                >
                  [{item}]
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-cyan-500/30">
            <div className="flex items-center gap-2 text-cyan-300/60 text-xs font-mono">
              <span>◆</span>
              <span>{formattedDate}</span>
              {idea.deploy && (
                <span className="ml-2 px-2 py-0.5 bg-black border border-cyan-500/30 rounded-sm text-xs text-cyan-300/70 font-bold">
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
    <div className="group bg-black border-2 border-cyan-500/40 rounded-sm overflow-hidden hover:border-cyan-400 transition-all hover:shadow-lg hover:shadow-cyan-500/40 font-mono">
      {/* Thin gradient bar */}
      <div className="h-0.5 bg-gradient-to-r from-cyan-500/60 to-pink-500/60" />

      <div className="p-5">
        {/* Project name */}
        <h3 className="text-base font-bold text-cyan-400 mb-2 line-clamp-1 uppercase tracking-widest" style={{textShadow: '0 0 8px rgba(34, 211, 238, 0.6)'}}>
          {displayName}
        </h3>

        {/* Pain snippet */}
        {idea.pain && (
          <p className="text-cyan-200/70 text-sm mb-4 line-clamp-3 leading-relaxed">
            {idea.pain}
          </p>
        )}

        {/* Stack badges (max 3 + overflow count) */}
        {stackItems.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {stackItems.slice(0, 3).map((item) => (
              <span
                key={item}
                className="px-2 py-0.5 bg-black border border-cyan-500/30 text-cyan-300 text-xs rounded-sm font-bold uppercase tracking-widest"
              >
                {item}
              </span>
            ))}
            {stackItems.length > 3 && (
              <span className="px-2 py-0.5 bg-black border border-cyan-500/20 text-cyan-400/60 text-xs rounded-sm font-bold">
                +{stackItems.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-cyan-500/20">
          <span className="text-xs text-cyan-300/50 font-mono">◆ {formattedDate}</span>
          <div className="flex items-center gap-1">
            <SaveButton idea={idea} />
            <ShareButton idea={idea} />
          </div>
        </div>
      </div>
    </div>
  );
}
