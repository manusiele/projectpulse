import { getIdeas } from "@/lib/ideas";
import { IdeaCard } from "@/components/IdeaCard";
import Link from "next/link";
import Image from "next/image";

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
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        <div className="flex">
          {/* ── Left Sidebar ─────────────────────────────────────────────── */}
          <div className="fixed top-4 left-4 w-80 h-[98vh] z-20">
            <div className="h-full overflow-y-auto">
              {/* Single Unified Sidebar */}
              <div className="h-full bg-[#1a1a1a]/20 border border-[#2a2a2a]/30 rounded-3xl backdrop-blur-2xl shadow-2xl shadow-blue-500/10 flex flex-col">
                
                {/* Header with Logo */}
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-12 h-12 rounded-xl bg-[#0f0f0f] border border-[#252525] overflow-hidden flex items-center justify-center flex-shrink-0">
                      <Image 
                        src="/logo.webp" 
                        alt="Nexus" 
                        width={48} 
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Nexus</h2>
                      <p className="text-xs text-slate-500">AI Project Ideas</p>
                    </div>
                  </div>
                </div>

                {/* Menu Section */}
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between mb-3 px-2">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Menu</span>
                    <span className="text-xs text-slate-600 font-bold">{ideas.length}</span>
                  </div>
                  <nav className="space-y-1">
                    <a 
                      href="#latest" 
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white bg-[#252525] transition-all group"
                    >
                      <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span className="font-medium flex-1">Latest Spark</span>
                    </a>
                    <a 
                      href="#ideas" 
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-[#252525] transition-all group"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                      <span className="font-medium flex-1">All Ideas</span>
                    </a>
                    <Link 
                      href="/" 
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-[#252525] transition-all group"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span className="font-medium flex-1">Home</span>
                    </Link>
                  </nav>
                </div>

                {/* Stats Section */}
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between mb-3 px-2">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Stats</span>
                    <span className="text-xs text-slate-600 font-bold">3</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#0f0f0f] hover:bg-[#151515] transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                          <polyline points="16 7 22 7 22 13" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-300 flex-1">Total Ideas</span>
                      <span className="text-sm font-bold text-white">{ideas.length}</span>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#0f0f0f] hover:bg-[#151515] transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-300 flex-1">This Month</span>
                      <span className="text-sm font-bold text-white">{thisMonth}</span>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#0f0f0f] hover:bg-[#151515] transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-300 flex-1">Domains</span>
                      <span className="text-sm font-bold text-white">15</span>
                    </div>
                  </div>
                </div>

                {/* Settings Section */}
                <div className="px-4 pb-6">
                  <div className="flex items-center justify-between mb-3 px-2">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Settings</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 p-3 bg-[#0f0f0f] rounded-xl">
                    <button className="w-9 h-9 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 1v6m0 6v6" />
                        <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24" />
                        <path d="M1 12h6m6 0h6" />
                        <path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24" />
                      </svg>
                    </button>
                    <button className="w-9 h-9 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                      </svg>
                    </button>
                    <button className="w-9 h-9 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ── Main Content ─────────────────────────────────────────────── */}
          <div className="flex-1 ml-[336px] px-6 py-8 max-w-6xl">
            {ideas.length === 0 ? (
              <div className="bg-[#1a1a1a]/20 border border-[#2a2a2a]/30 rounded-2xl p-8 text-center backdrop-blur-2xl shadow-2xl shadow-blue-500/10">
                <h2 className="text-xl font-bold text-white mb-2">No ideas yet</h2>
                <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-5 mx-auto">
                  Your first idea will appear here after the GitHub Actions workflow runs — daily at 10:00 AM EAT.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a]/40 border border-[#2a2a2a]/50 backdrop-blur-xl hover:border-slate-600 text-sm text-slate-300 hover:text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
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
