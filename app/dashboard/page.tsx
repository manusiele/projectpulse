import { getIdeas } from "@/lib/ideas";
import { IdeaCard } from "@/components/IdeaCard";
import { AnimatedNav } from "@/components/AnimatedNav";
import { Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

// Revalidate the page at most once per hour on Vercel
export const revalidate = 3600;

export default async function DashboardPage() {
  const ideas = await getIdeas();
  const [latest, ...rest] = ideas;

  const thisMonth = ideas.filter((idea) => {
    const d = new Date(idea.date);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-mono">
      {/* Animated background with scanlines */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/5 via-black to-pink-900/5" />
        {/* Scanlines effect */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px)',
          pointerEvents: 'none'
        }} />
      </div>

      <AnimatedNav />

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b-2 border-cyan-500/50 bg-black/80 backdrop-blur-xl shadow-lg shadow-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
            <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center shadow-lg shadow-cyan-500/80 border border-cyan-400/50 group-hover:shadow-cyan-400/100 transition-all">
              <Zap className="w-4 h-4 text-black font-bold" />
            </div>
            <span className="font-bold text-lg tracking-widest text-cyan-400 drop-shadow-lg" style={{textShadow: '0 0 10px rgba(34, 211, 238, 0.8)'}}>
              FOCUSLOCK
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-cyan-300/80 font-mono" style={{textShadow: '0 0 5px rgba(34, 211, 238, 0.5)'}}>
              [{ideas.length}] IDEAS
            </span>
            <span className="px-3 py-1 rounded-sm bg-black border-2 border-cyan-500/60 text-cyan-400 text-xs font-bold uppercase tracking-widest shadow-lg shadow-cyan-500/30" style={{textShadow: '0 0 8px rgba(34, 211, 238, 0.6)'}}>
              ▸ 10 AM EAT
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        {ideas.length === 0 ? (
          /* ── Empty state ─────────────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-sm bg-black border-2 border-cyan-500/60 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/40">
              <Zap className="w-8 h-8 text-cyan-400" style={{filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.8))'}} />
            </div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-3 tracking-widest" style={{textShadow: '0 0 10px rgba(34, 211, 238, 0.6)'}}>
              NO IDEAS YET
            </h2>
            <p className="text-cyan-300/60 max-w-md leading-relaxed mb-8 font-mono">
              &gt; Awaiting first idea from GitHub Actions workflow...
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border-2 border-cyan-500/60 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 transition-all hover:shadow-lg hover:shadow-cyan-500/40 font-mono font-bold uppercase tracking-widest"
            >
              ◀ Back
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* ── Hero section with stats ────────────────────────────────── */}
            <div className="mb-16" id="stats">
              <div className="mb-8 border-l-4 border-cyan-500 pl-4">
                <h1 className="text-5xl sm:text-6xl font-bold text-cyan-400 mb-2 tracking-widest" style={{textShadow: '0 0 20px rgba(34, 211, 238, 0.8)'}}>
                  PROJECT IDEAS
                </h1>
                <p className="text-cyan-300/70 text-lg font-mono">
                  &gt; Real problems. Shippable solutions. Daily delivery.
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Total Ideas", value: ideas.length, color: "cyan" },
                  { label: "This Month", value: thisMonth, color: "pink" },
                  { label: "Domains", value: 15, color: "purple" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`p-6 rounded-sm bg-black border-2 border-${stat.color}-500/60 hover:border-${stat.color}-400 transition-all hover:shadow-lg hover:shadow-${stat.color}-500/40 group cursor-pointer`}
                  >
                    <p className={`text-4xl font-bold text-${stat.color}-400 mb-1 font-mono group-hover:scale-110 transition-transform`} style={{textShadow: `0 0 10px rgba(${stat.color === 'cyan' ? '34, 211, 238' : stat.color === 'pink' ? '236, 72, 153' : '168, 85, 247'}, 0.8)`}}>
                      {stat.value}
                    </p>
                    <p className={`text-sm text-${stat.color}-300/60 font-mono uppercase tracking-widest`}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Latest spark (featured) ────────────────────────────────── */}
            {latest && (
              <section className="mb-16" id="latest">
                <div className="flex items-center gap-3 mb-6 border-l-4 border-pink-500 pl-4">
                  <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" style={{boxShadow: '0 0 8px rgba(236, 72, 153, 0.8)'}} />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-pink-400" style={{textShadow: '0 0 8px rgba(236, 72, 153, 0.6)'}}>
                    ▸ Latest Spark
                  </h2>
                </div>
                <IdeaCard idea={latest} featured />
              </section>
            )}

            {/* ── All previous ideas grid ────────────────────────────────── */}
            {rest.length > 0 && (
              <section id="ideas">
                <div className="flex items-center gap-3 mb-6 border-l-4 border-purple-500 pl-4">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-purple-400" style={{textShadow: '0 0 8px rgba(168, 85, 247, 0.6)'}}>
                    ▸ Archive ({rest.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rest.map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t-2 border-cyan-500/50 py-12 mt-16 relative z-10 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between font-mono text-xs">
            <p className="text-cyan-300/50 mb-4 sm:mb-0">
              &copy; 2026 FOCUSLOCK | SERVERLESS | OPEN SOURCE
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300/50 hover:text-cyan-400 transition-colors"
              >
                [GITHUB]
              </a>
              <a
                href="/"
                className="text-cyan-300/50 hover:text-cyan-400 transition-colors"
              >
                [HOME]
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
