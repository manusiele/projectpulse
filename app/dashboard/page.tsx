import { getIdeas } from "@/lib/ideas";
import { IdeaCard } from "@/components/IdeaCard";
import { Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ── Left Sidebar ─────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-12 space-y-6">
              {/* Profile Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white mb-1">FocusLock</h2>
                <p className="text-xs text-slate-400 mb-6">AI Project Ideas</p>

                {/* Stats */}
                <div className="space-y-3 text-left text-sm mb-6">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-slate-500 uppercase text-xs font-semibold mb-1">Total</p>
                    <p className="text-white font-bold text-lg">{ideas.length}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-slate-500 uppercase text-xs font-semibold mb-1">This Month</p>
                    <p className="text-white font-bold text-lg">{thisMonth}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-slate-500 uppercase text-xs font-semibold mb-1">Domains</p>
                    <p className="text-white font-bold text-lg">15</p>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href="/"
                  className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors text-sm"
                >
                  Back Home
                </Link>
              </div>

              {/* Quick Links */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Navigate</p>
                <div className="space-y-2">
                  <a href="#latest" className="block px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                    Latest Spark
                  </a>
                  <a href="#ideas" className="block px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                    All Ideas
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Main Content ─────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            {ideas.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">No ideas yet</h2>
                <p className="text-slate-400 max-w-md leading-relaxed mb-8 mx-auto">
                  Your first idea will appear here after the GitHub Actions workflow runs — daily at 10:00 AM EAT.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
                >
                  Back to Home
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {/* ── Latest spark (featured) ────────────────────────────────── */}
                {latest && (
                  <section id="latest">
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-white">Latest Spark</h2>
                      <p className="text-sm text-slate-400 mt-1">Today's project idea</p>
                    </div>
                    <IdeaCard idea={latest} featured />
                  </section>
                )}

                {/* ── All previous ideas grid ────────────────────────────────── */}
                {rest.length > 0 && (
                  <section id="ideas">
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-white">Previous Ideas</h2>
                      <p className="text-sm text-slate-400 mt-1">{rest.length} archived ideas</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
