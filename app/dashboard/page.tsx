import { getIdeas } from "@/lib/ideas";
import { IdeaCard } from "@/components/IdeaCard";
import { AnimatedNav } from "@/components/AnimatedNav";
import { Zap } from "lucide-react";
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
    <div className="min-h-screen bg-black relative overflow-hidden font-mono" style={{
      backgroundImage: `
        radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.05) 0%, transparent 50%)
      `
    }}>
      {/* CRT Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px)',
      }} />

      {/* Animated grid background */}
      <div className="fixed inset-0 -z-10 opacity-5" style={{
        backgroundImage: `
          linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent)
        `,
        backgroundSize: '60px 60px'
      }} />

      <AnimatedNav />

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 border-b border-cyan-500/30 bg-black/60 backdrop-blur-xl" style={{
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.2), inset 0 1px 0 rgba(0, 255, 255, 0.1)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 flex items-center justify-center relative" style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 255, 255, 0.1))',
              border: '2px solid rgba(0, 255, 255, 0.6)',
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.8), inset 0 0 10px rgba(0, 255, 255, 0.3)'
            }}>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="font-bold text-lg tracking-widest text-cyan-400" style={{
              textShadow: '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.4)'
            }}>
              FOCUSLOCK
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-cyan-300/70 font-mono" style={{textShadow: '0 0 5px rgba(0, 255, 255, 0.5)'}}>
              [{ideas.length}] IDEAS
            </span>
            <div style={{
              border: '1px solid rgba(0, 255, 255, 0.4)',
              padding: '4px 12px',
              background: 'rgba(0, 255, 255, 0.05)',
              boxShadow: '0 0 10px rgba(0, 255, 255, 0.3), inset 0 0 5px rgba(0, 255, 255, 0.1)'
            }} className="rounded-sm">
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest" style={{textShadow: '0 0 8px rgba(0, 255, 255, 0.6)'}}>
                ▸ 10 AM EAT
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        {ideas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div style={{
              width: '80px',
              height: '80px',
              border: '2px solid rgba(0, 255, 255, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              background: 'rgba(0, 255, 255, 0.05)',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.4), inset 0 0 10px rgba(0, 255, 255, 0.1)'
            }} className="rounded-sm">
              <Zap className="w-10 h-10 text-cyan-400" style={{filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.8))'}} />
            </div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-3 tracking-widest uppercase" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.6)'}}>
              NO IDEAS YET
            </h2>
            <p className="text-cyan-300/60 max-w-md leading-relaxed mb-8 font-mono text-sm">
              &gt; Awaiting first idea from GitHub Actions workflow...
            </p>
            <Link href="/" className="px-4 py-2 text-cyan-400 font-bold uppercase tracking-widest text-sm" style={{
              border: '1px solid rgba(0, 255, 255, 0.6)',
              background: 'rgba(0, 255, 255, 0.05)',
              boxShadow: '0 0 10px rgba(0, 255, 255, 0.3), inset 0 0 5px rgba(0, 255, 255, 0.1)',
              textShadow: '0 0 8px rgba(0, 255, 255, 0.6)'
            }} className="rounded-sm hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
              ◀ BACK
            </Link>
          </div>
        ) : (
          <>
            {/* ── Hero section ────────────────────────────────────────────── */}
            <div className="mb-16" id="stats">
              <div className="mb-12" style={{
                borderLeft: '3px solid rgba(0, 255, 255, 0.6)',
                paddingLeft: '20px'
              }}>
                <h1 className="text-6xl sm:text-7xl font-bold text-cyan-400 mb-2 tracking-widest uppercase" style={{
                  textShadow: '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4)'
                }}>
                  PROJECT IDEAS
                </h1>
                <p className="text-cyan-300/70 text-sm font-mono">
                  &gt; Real problems. Shippable solutions. Daily delivery.
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: "Total Ideas", value: ideas.length },
                  { label: "This Month", value: thisMonth },
                  { label: "Domains", value: 15 },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      border: '2px solid rgba(0, 255, 255, 0.4)',
                      background: 'rgba(0, 255, 255, 0.03)',
                      boxShadow: '0 0 15px rgba(0, 255, 255, 0.2), inset 0 0 10px rgba(0, 255, 255, 0.05)'
                    }}
                    className="p-6 rounded-sm hover:shadow-lg hover:shadow-cyan-500/40 transition-all group cursor-pointer"
                  >
                    <p className="text-4xl font-bold text-cyan-400 mb-2 font-mono group-hover:scale-110 transition-transform" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.8)'}}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-cyan-300/60 font-mono uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Latest spark ────────────────────────────────────────────── */}
            {latest && (
              <section className="mb-16" id="latest">
                <div className="flex items-center gap-3 mb-6" style={{borderLeft: '3px solid rgba(255, 0, 255, 0.6)', paddingLeft: '20px'}}>
                  <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" style={{boxShadow: '0 0 8px rgba(255, 0, 255, 0.8)'}} />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-pink-400" style={{textShadow: '0 0 8px rgba(255, 0, 255, 0.6)'}}>
                    ▸ LATEST SPARK
                  </h2>
                </div>
                <IdeaCard idea={latest} featured />
              </section>
            )}

            {/* ── Archive ────────────────────────────────────────────────── */}
            {rest.length > 0 && (
              <section id="ideas">
                <div className="flex items-center gap-3 mb-6" style={{borderLeft: '3px solid rgba(168, 85, 247, 0.6)', paddingLeft: '20px'}}>
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400" style={{textShadow: '0 0 8px rgba(168, 85, 247, 0.6)'}}>
                    ▸ ARCHIVE ({rest.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <footer className="border-t border-cyan-500/30 py-8 mt-16 relative z-10 bg-black/40" style={{
        boxShadow: 'inset 0 1px 0 rgba(0, 255, 255, 0.1)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between font-mono text-xs">
            <p className="text-cyan-300/50 mb-4 sm:mb-0">
              &copy; 2026 FOCUSLOCK | SERVERLESS | OPEN SOURCE
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-cyan-300/50 hover:text-cyan-400 transition-colors">
                [GITHUB]
              </a>
              <a href="/" className="text-cyan-300/50 hover:text-cyan-400 transition-colors">
                [HOME]
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
