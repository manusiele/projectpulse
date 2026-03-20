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
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl overflow-hidden backdrop-blur-sm">
                {/* Logo Section */}
                <div className="p-8 pb-6 text-center border-b border-[#2a2a2a]">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-2xl bg-[#0f0f0f] border-2 border-[#252525] overflow-hidden flex items-center justify-center">
                    <div className="w-24">
                      <FocusLockLogo className="w-full h-auto" />
                    </div>
                  </div>
                  <span className="inline-block px-3 py-1.5 bg-[#252525] rounded-lg text-xs text-slate-400 font-medium">
                    AI Project Ideas
                  </span>
                </div>

                {/* Stats Section */}
                <div className="p-6 space-y-3 border-b border-[#2a2a2a]">
                  <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-xl hover:bg-[#151515] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                          <polyline points="16 7 22 7 22 13" />
                        </svg>
                      </div>
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Total</span>
                    </div>
                    <span className="text-xl font-bold text-white">{ideas.length}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-xl hover:bg-[#151515] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Month</span>
                    </div>
                    <span className="text-xl font-bold text-white">{thisMonth}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-xl hover:bg-[#151515] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Domains</span>
                    </div>
                    <span className="text-xl font-bold text-white">15</span>
                  </div>
                </div>

                {/* Navigation Section */}
                <div className="p-4">
                  <nav className="space-y-1">
                    <a 
                      href="#latest" 
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-[#252525] transition-all group"
                    >
                      <svg className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span className="font-medium">Latest Spark</span>
                    </a>
                    <a 
                      href="#ideas" 
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-[#252525] transition-all group"
                    >
                      <svg className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                      <span className="font-medium">All Ideas</span>
                    </a>
                    <Link 
                      href="/" 
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-[#252525] transition-all group"
                    >
                      <svg className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span className="font-medium">Home</span>
                    </Link>
                  </nav>
                </div>
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
