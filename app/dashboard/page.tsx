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
              {/* Profile Card */}
              <div className="bg-gradient-to-b from-slate-900/60 to-slate-900/40 border border-slate-800/40 rounded-3xl p-8 backdrop-blur-sm">
                {/* Logo/Avatar */}
                <div className="w-48 h-48 mx-auto mb-6 rounded-3xl bg-black border-4 border-slate-800/50 overflow-hidden flex items-center justify-center">
                  <div className="w-40">
                    <FocusLockLogo className="w-full h-auto" />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white text-center mb-2">FocusLock</h2>
                
                {/* Subtitle */}
                <div className="inline-block mx-auto px-4 py-2 bg-slate-800/50 rounded-lg mb-8">
                  <p className="text-sm text-slate-300 text-center">AI Project Ideas</p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-6" />

                {/* Stats */}
                <div className="space-y-4">
                  {/* Total Ideas */}
                  <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Total Ideas</p>
                      <p className="text-xl font-bold text-white">{ideas.length}</p>
                    </div>
                  </div>

                  {/* This Month */}
                  <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">This Month</p>
                      <p className="text-xl font-bold text-white">{thisMonth}</p>
                    </div>
                  </div>

                  {/* Domains */}
                  <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Domains</p>
                      <p className="text-xl font-bold text-white">15</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Card */}
              <div className="bg-gradient-to-b from-slate-900/60 to-slate-900/40 border border-slate-800/40 rounded-3xl p-4 backdrop-blur-sm">
                <div className="space-y-2">
                  <a 
                    href="#latest" 
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-slate-300 hover:text-white hover:bg-slate-800/40 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="font-medium">Latest Spark</span>
                  </a>
                  <a 
                    href="#ideas" 
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-slate-300 hover:text-white hover:bg-slate-800/40 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="font-medium">All Ideas</span>
                  </a>
                  <Link 
                    href="/" 
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-slate-300 hover:text-white hover:bg-slate-800/40 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-700/30 border border-slate-700/50 flex items-center justify-center">
                      <Home className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="font-medium">Home</span>
                  </Link>
                </div>
              </div>
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
