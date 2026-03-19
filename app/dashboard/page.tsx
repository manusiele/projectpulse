import { getIdeas } from "@/lib/ideas";
import { IdeaCard } from "@/components/IdeaCard";
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
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-gray-800/40 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">FocusLock</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-gray-400">
              {ideas.length} idea{ideas.length !== 1 ? "s" : ""} generated
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
              Daily @ 10 AM EAT
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {ideas.length === 0 ? (
          /* ── Empty state ─────────────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              No ideas yet
            </h2>
            <p className="text-gray-400 max-w-md leading-relaxed mb-8">
              Your first idea will appear here after the GitHub Actions workflow runs — daily at 10:00 AM EAT. No action needed.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white transition-colors"
            >
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* ── Hero section with stats ────────────────────────────────── */}
            <div className="mb-16">
              <div className="mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                  Project Ideas
                </h1>
                <p className="text-gray-400 text-lg">
                  Fresh ideas delivered daily. Real problems. Shippable solutions.
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Total Ideas", value: ideas.length, icon: "📊" },
                  { label: "This Month", value: thisMonth, icon: "📅" },
                  { label: "Problem Domains", value: 15, icon: "🎯" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-6 rounded-xl bg-gray-900/40 border border-gray-800 hover:border-purple-500/40 transition-colors"
                  >
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <p className="text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Latest spark (featured) ────────────────────────────────── */}
            {latest && (
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                    Latest Spark
                  </h2>
                </div>
                <IdeaCard idea={latest} featured />
              </section>
            )}

            {/* ── All previous ideas grid ────────────────────────────────── */}
            {rest.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-gray-600" />
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                    Previous Ideas ({rest.length})
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
      <footer className="border-t border-gray-800/40 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-500 mb-4 sm:mb-0">
              © 2026 FocusLock. Serverless. Open source. Daily ideas.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
              >
                GitHub
              </a>
              <a
                href="/"
                className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
              >
                Home
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
