import { getIdeas } from "@/lib/ideas";
import { IdeaCard } from "@/components/IdeaCard";
import { ArrowRight, Home, Sparkles, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";
import { FocusLockLogo } from "@/components/FocusLockLogo";

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
    <div className="min-h-screen bg-black text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ── Left Sidebar ─────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              {/* Logo Section */}
              <div className="bg-slate-900/40 border border-slate-800/30 rounded-xl p-5 backdrop-blur-sm">
                <div className="w-32 mx-auto mb-2">
                  <FocusLockLogo className="w-full h-auto" />
                </div>
                <p className="text-center text-xs text-slate-500">Daily AI Project Ideas</p>
              </div>

              {/* Stats Grid */}
              <div className="space-y-3">
                <div className="bg-slate-900/40 border border-slate-800/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Ideas</span>
                    <TrendingUp className="w-4 h-4 text-blue-400/60" />
                  </div>
                  <p className="text-3xl font-bold text-white">{ideas.length}</p>
                </div>
                
                <div className="bg-slate-900/40 border border-slate-800/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">This Month</span>
                    <Calendar className="w-4 h-4 text-cyan-400/60" />
                  </div>
                  <p className="text-3xl font-bold text-white">{thisMonth}</p>
                </div>
                
                <div className="bg-slate-900/40 border border-slate-800/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Domains</span>
                    <Sparkles className="w-4 h-4 text-purple-400/60" />
                  </div>
                  <p className="text-3xl font-bold text-white">15</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-slate-900/40 border border-slate-800/30 rounded-xl p-2">
                <div className="space-y-1">
                  <a 
                    href="#latest" 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Latest Spark</span>
                  </a>
                  <a 
                    href="#ideas" 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all"
                  >
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>All Ideas</span>
                  </a>
                  <Link 
                    href="/" 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all"
                  >
                    <Home className="w-4 h-4 text-slate-400" />
                    <span>Home</span>
                  </Link>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href="/"
                className="block w-full px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition-all text-sm text-center"
              >
                ← Back to Home
              </Link>
            </div>
          </div>

          {/* ── Main Content ─────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            {ideas.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/30 rounded-xl p-12 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">No ideas yet</h2>
                <p className="text-slate-400 max-w-md leading-relaxed mb-8 mx-auto">
                  Your first idea will appear here after the GitHub Actions workflow runs — daily at 10:00 AM EAT.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700/50 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
                >
                  Back to Home
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {/* ── Latest spark (featured) ────────────────────────────────── */}
                {latest && (
                  <section id="latest">
                    <div className="mb-3">
                      <h2 className="text-xl font-bold text-white">Latest Spark</h2>
                      <p className="text-xs text-slate-500 mt-1">Today's project idea</p>
                    </div>
                    <IdeaCard idea={latest} featured />
                  </section>
                )}

                {/* ── All previous ideas grid ────────────────────────────────── */}
                {rest.length > 0 && (
                  <section id="ideas">
                    <div className="mb-3">
                      <h2 className="text-xl font-bold text-white">Previous Ideas</h2>
                      <p className="text-xs text-slate-500 mt-1">{rest.length} archived ideas</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {rest.map((idea) => (
                        <IdeaCard key={idea.id} idea={idea} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
