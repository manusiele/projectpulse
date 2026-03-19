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
            <div className="sticky top-12 space-y-8">
              {/* Profile Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">FocusLock</h2>
                <p className="text-sm text-slate-400 mb-6">AI Project Ideas</p>

                {/* Stats */}
                <div className="space-y-4 text-left text-sm">
                  <div>
                    <p className="text-slate-500 uppercase text-xs font-semibold mb-1">Total Ideas</p>
                    <p className="text-slate-300 text-lg font-semibold">{ideas.length}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase text-xs font-semibold mb-1">This Month</p>
                    <p className="text-slate-300 text-lg font-semibold">{thisMonth}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase text-xs font-semibold mb-1">Domains</p>
                    <p className="text-slate-300 text-lg font-semibold">15</p>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href="/"
                  className="w-full mt-6 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                >
                  Back Home
                </Link>
              </div>
            </div>
          </div>

          {/* ── Main Content ─────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            {ideas.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-6">
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
                    <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-slate-800">Latest Spark</h2>
                    <IdeaCard idea={latest} featured />
                  </section>
                )}

                {/* ── All previous ideas grid ────────────────────────────────── */}
                {rest.length > 0 && (
                  <section id="ideas">
                    <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-slate-800">Previous Ideas</h2>
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
