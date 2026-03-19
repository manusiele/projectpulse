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
      <div className="relative bg-black font-mono overflow-hidden group" style={{
        border: '2px solid rgba(255, 0, 255, 0.5)',
        boxShadow: '0 0 30px rgba(255, 0, 255, 0.3), inset 0 0 20px rgba(255, 0, 255, 0.05)',
        background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.03) 0%, rgba(255, 0, 255, 0.02) 100%)'
      }}>
        {/* Animated top bar */}
        <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 animate-pulse" style={{boxShadow: '0 0 10px rgba(255, 0, 255, 0.8)'}} />

        <div className="p-6 sm:p-8">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-sm mb-5" style={{
            border: '1px solid rgba(255, 0, 255, 0.6)',
            background: 'rgba(255, 0, 255, 0.05)',
            boxShadow: '0 0 10px rgba(255, 0, 255, 0.3), inset 0 0 5px rgba(255, 0, 255, 0.1)'
          }}>
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
            <span className="text-pink-400 text-xs font-bold uppercase tracking-widest" style={{textShadow: '0 0 8px rgba(255, 0, 255, 0.6)'}}>
              TODAY'S SPARK
            </span>
          </span>

          {/* Project name */}
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-6 leading-tight uppercase tracking-widest group-hover:text-cyan-300 transition-all" style={{textShadow: '0 0 15px rgba(0, 255, 255, 0.8)'}}>
            {displayName}
          </h2>

          {/* Problem statement */}
          <div className="space-y-4 mb-6" style={{borderLeft: '2px solid rgba(0, 255, 255, 0.4)', paddingLeft: '16px'}}>
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
                  className="px-3 py-1 rounded-sm font-bold uppercase tracking-widest text-xs hover:shadow-lg transition-all"
                  style={{
                    border: '1px solid rgba(0, 255, 255, 0.4)',
                    background: 'rgba(0, 255, 255, 0.05)',
                    color: 'rgba(0, 255, 255, 0.9)',
                    boxShadow: '0 0 8px rgba(0, 255, 255, 0.3), inset 0 0 5px rgba(0, 255, 255, 0.1)',
                    textShadow: '0 0 5px rgba(0, 255, 255, 0.5)'
                  }}
                >
                  [{item}]
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4" style={{borderTop: '1px solid rgba(0, 255, 255, 0.3)'}}>
            <div className="flex items-center gap-2 text-cyan-300/60 text-xs font-mono">
              <span>◆</span>
              <span>{formattedDate}</span>
              {idea.deploy && (
                <span className="ml-2 px-2 py-0.5 rounded-sm text-xs text-cyan-300/70 font-bold" style={{
                  border: '1px solid rgba(0, 255, 255, 0.3)',
                  background: 'rgba(0, 255, 255, 0.05)',
                  boxShadow: '0 0 5px rgba(0, 255, 255, 0.2)'
                }}>
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
    <div className="group bg-black font-mono rounded-sm overflow-hidden hover:shadow-lg transition-all" style={{
      border: '2px solid rgba(0, 255, 255, 0.4)',
      boxShadow: '0 0 15px rgba(0, 255, 255, 0.15), inset 0 0 10px rgba(0, 255, 255, 0.03)',
      background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.02) 0%, rgba(0, 255, 255, 0.01) 100%)'
    }}>
      {/* Thin gradient bar */}
      <div className="h-0.5 bg-gradient-to-r from-cyan-500/60 to-pink-500/60" />

      <div className="p-5">
        {/* Project name */}
        <h3 className="text-base font-bold text-cyan-400 mb-2 line-clamp-1 uppercase tracking-widest group-hover:text-cyan-300 transition-all" style={{textShadow: '0 0 8px rgba(0, 255, 255, 0.6)'}}>
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
                className="px-2 py-0.5 rounded-sm text-cyan-300 text-xs rounded-sm font-bold uppercase tracking-widest"
                style={{
                  border: '1px solid rgba(0, 255, 255, 0.3)',
                  background: 'rgba(0, 255, 255, 0.05)',
                  boxShadow: '0 0 5px rgba(0, 255, 255, 0.2)'
                }}
              >
                {item}
              </span>
            ))}
            {stackItems.length > 3 && (
              <span className="px-2 py-0.5 rounded-sm text-cyan-400/60 text-xs font-bold" style={{
                border: '1px solid rgba(0, 255, 255, 0.2)',
                background: 'rgba(0, 255, 255, 0.03)'
              }}>
                +{stackItems.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3" style={{borderTop: '1px solid rgba(0, 255, 255, 0.2)'}}>
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
