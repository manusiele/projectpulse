import { getIdeas } from "@/lib/ideas";
import { IdeaCard } from "@/components/IdeaCard";
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
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ── Left Sidebar ─────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Single Unified Profile Card */}
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl p-6 backdrop-blur-sm">
                {/* Logo/Avatar */}
                <div className="w-40 h-40 mx-auto mb-4 rounded-3xl bg-[#0f0f0f] border-4 border-[#252525] overflow-hidden flex items-center justify-center">
                  <div className="w-32">
                    <FocusLockLogo className="w-full h-auto" />
                  </div>
                </div>
                
                {/* Subtitle */}
                <div className="flex justify-center mb-6">
                  <span className="px-3 py-1 bg-[#252525] rounded-lg text-xs text-slate-400">AI Project Ideas</span>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#2a2a2a] mb-6" />

                {/* Stats */}
                <div className="space-y-3 mb-6">
                  {/* Total Ideas */}
                  <div className="flex items-center gap-3 p-3 bg-[#0f0f0f] rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                        <polyline points="16 7 22 7 22 13" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Total Ideas</p>
                      <p className="text-lg font-bold text-white">{ideas.length}</p>
                    </div>
                  </div>

                  {/* This Month */}
                  <div className="flex items-center gap-3 p-3 bg-[#0f0f0f] rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">This Month</p>
                      <p className="text-lg font-bold text-white">{thisMonth}</p>
                    </div>
                  </div>

                  {/* Domains */}
                  <div className="flex items-center gap-3 p-3 bg-[#0f0f0f] rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Domains</p>
                      <p className="text-lg font-bold text-white">15</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#2a2a2a] mb-6" />

                {/* Navigation */}
                <div className="space-y-2 mb-6">
                  <a 
                    href="#latest" 
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-[#252525] transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <span className="font-medium">Latest Spark</span>
                  </a>
                  <a 
                    href="#ideas" 
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-[#252525] transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                        <polyline points="16 7 22 7 22 13" />
                      </svg>
                    </div>
                    <span className="font-medium">All Ideas</span>
                  </a>
                  <Link 
                    href="/" 
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-[#252525] transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-700/20 border border-slate-700/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <span className="font-medium">Home</span>
                  </Link>
                </div>

                {/* CTA Button */}
                <Link
                  href="/"
                  className="block w-full px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium text-center transition-all"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>

          {/* ── Main Content ─────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            {ideas.length === 0 ? (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-12 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">No ideas yet</h2>
                <p className="text-slate-400 max-w-md leading-relaxed mb-8 mx-auto">
                  Your first idea will appear here after the GitHub Actions workflow runs — daily at 10:00 AM EAT.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2a2a2a] hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
                >
                  Back to Home
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
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
