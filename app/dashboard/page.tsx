"use client";

import { useEffect, useState } from "react";
import { IdeaCard } from "@/components/IdeaCard";
import Link from "next/link";
import Image from "next/image";
import { Loader } from "@/components/Loader";

interface Idea {
  id: string;
  date: string;
  raw: string;
  projectName?: string;
  stack?: string;
  deploy?: string;
  who?: string;
  pain?: string;
  gap?: string;
  impact?: string;
  whyNow?: string;
  potential?: string;
}

export default function DashboardPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'ideas' | 'domains' | 'allIdeas'>('ideas');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  useEffect(() => {
    async function fetchIdeas() {
      try {
        const response = await fetch('/ideas.json');
        const data = await response.json();
        setIdeas(data);
      } catch (error) {
        console.error('Failed to fetch ideas:', error);
      } finally {
        // Minimum loading time for smooth animation
        setTimeout(() => setLoading(false), 1500);
      }
    }
    fetchIdeas();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const [latest, ...rest] = ideas;

  const thisMonth = ideas.filter((idea) => {
    const d = new Date(idea.date);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  const domains = [
    { name: "Business Management", description: "Small business owners, freelancers, and solopreneurs" },
    { name: "Career Development", description: "Students, job seekers, and career switchers" },
    { name: "Content Creation", description: "Content creators, influencers, and digital entrepreneurs" },
    { name: "Remote Collaboration", description: "Remote teams and distributed startups" },
    { name: "Health & Wellness", description: "Health-conscious individuals improving fitness and wellbeing" },
    { name: "Family Management", description: "Parents managing family schedules and children's development" },
    { name: "Local Services", description: "Service providers like plumbers, electricians, tutors" },
    { name: "Knowledge Management", description: "Researchers, writers, and knowledge workers" },
    { name: "E-commerce", description: "E-commerce sellers managing inventory and orders" },
    { name: "Event Management", description: "Event organizers managing registrations and logistics" },
    { name: "Nonprofit Management", description: "Nonprofit organizations managing donors and volunteers" },
    { name: "Property Management", description: "Landlords and property managers" },
    { name: "Personal Finance", description: "Finance enthusiasts achieving financial independence" },
    { name: "Agriculture Tech", description: "Agritech innovators and smallholder farmers" },
    { name: "Mental Health", description: "Mental health professionals managing practices" },
    { name: "Podcast Production", description: "Podcast creators and audio content producers" },
    { name: "Game Development", description: "Independent game developers and small studios" },
    { name: "Legal Services", description: "Legal professionals and small law firms" },
    { name: "Real Estate", description: "Real estate agents managing listings and clients" },
    { name: "Restaurant Operations", description: "Restaurant owners and food service managers" },
    { name: "Fitness Training", description: "Fitness trainers and gym owners" },
    { name: "Photography & Video", description: "Photographers and videographers" },
    { name: "Music Education", description: "Music teachers and performing arts instructors" },
    { name: "Consulting & Coaching", description: "Consultants and coaches delivering services" },
    { name: "Pet Care Services", description: "Pet care providers including groomers and sitters" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 relative overflow-hidden animate-fadeIn">
      {/* Animated background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 h-screen overflow-hidden">
        <div className="flex h-full">
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
                      onClick={(e) => { e.preventDefault(); setActiveView('ideas'); }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                        activeView === 'ideas' ? 'text-white bg-[#252525]' : 'text-slate-400 hover:text-white hover:bg-[#252525]'
                      }`}
                    >
                      <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span className="font-medium flex-1">Latest Spark</span>
                    </a>
                    <a 
                      href="#ideas" 
                      onClick={(e) => { e.preventDefault(); setActiveView('allIdeas'); }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                        activeView === 'allIdeas' ? 'text-white bg-[#252525]' : 'text-slate-400 hover:text-white hover:bg-[#252525]'
                      }`}
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
                    <button 
                      onClick={() => setActiveView('domains')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#0f0f0f] hover:bg-[#151515] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-300 flex-1">Domains</span>
                      <span className="text-sm font-bold text-white">25</span>
                    </button>
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
          <div className="flex-1 ml-[336px] h-screen overflow-y-auto">
            <div className="px-6 py-8 max-w-6xl">
            {activeView === 'domains' ? (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Problem Domains</h2>
                  <p className="text-sm text-slate-400">25 problem spaces the AI generates ideas from</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {domains.map((domain, index) => (
                    <div 
                      key={index}
                      className="p-5 rounded-2xl bg-[#1a1a1a]/20 border border-[#2a2a2a]/30 backdrop-blur-2xl hover:border-[#3a3a3a] transition-all hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-purple-400">{index + 1}</span>
                        </div>
                        <h3 className="text-base font-semibold text-white leading-tight">{domain.name}</h3>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">{domain.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeView === 'allIdeas' ? (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">All Ideas</h2>
                  <p className="text-sm text-slate-400">{ideas.length} total project ideas</p>
                </div>
                <div className="space-y-4">
                  {ideas.map((idea, index) => (
                    <div 
                      key={idea.id}
                      className="bg-[#1a1a1a]/40 border border-[#2a2a2a]/50 rounded-2xl overflow-hidden backdrop-blur-xl hover:border-[#3a3a3a] transition-all hover:shadow-xl hover:shadow-blue-500/5"
                    >
                      {/* Gradient top bar */}
                      <div className="h-1 bg-gradient-to-r from-blue-500/60 via-cyan-500/60 to-blue-400/60" />
                      
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-lg font-bold text-blue-400">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                                {idea.projectName || "Daily Project Idea"}
                              </h3>
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5">
                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                  </svg>
                                  {new Date(idea.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                                {idea.deploy && (
                                  <span className="px-2 py-1 bg-[#252525] rounded-md text-slate-400">
                                    {idea.deploy}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedIdea(idea)}
                            className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/30 text-blue-400 text-sm font-medium transition-all hover:scale-105 flex items-center gap-2 flex-shrink-0"
                          >
                            <span>Expand</span>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="15 3 21 3 21 9" />
                              <polyline points="9 21 3 21 3 15" />
                              <line x1="21" y1="3" x2="14" y2="10" />
                              <line x1="3" y1="21" x2="10" y2="14" />
                            </svg>
                          </button>
                        </div>

                        {/* Problem Statement Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                          {idea.who && (
                            <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#252525]">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                  <svg className="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                  </svg>
                                </div>
                                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Who</span>
                              </div>
                              <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">{idea.who}</p>
                            </div>
                          )}
                          {idea.pain && (
                            <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#252525]">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                  <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                  </svg>
                                </div>
                                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">Pain</span>
                              </div>
                              <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">{idea.pain}</p>
                            </div>
                          )}
                          {idea.gap && (
                            <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#252525]">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                  <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2v20M2 12h20" />
                                  </svg>
                                </div>
                                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wide">Gap</span>
                              </div>
                              <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">{idea.gap}</p>
                            </div>
                          )}
                          {idea.impact && (
                            <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#252525]">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center">
                                  <svg className="w-3.5 h-3.5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                  </svg>
                                </div>
                                <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">Impact</span>
                              </div>
                              <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">{idea.impact}</p>
                            </div>
                          )}
                        </div>

                        {/* Bottom Section */}
                        <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
                          {/* Stack */}
                          {idea.stack && (
                            <div className="flex flex-wrap gap-2 flex-1">
                              {idea.stack.split(/\s*\+\s*/).filter(Boolean).slice(0, 4).map((item) => (
                                <span
                                  key={item}
                                  className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs rounded-md"
                                >
                                  {item}
                                </span>
                              ))}
                              {idea.stack.split(/\s*\+\s*/).filter(Boolean).length > 4 && (
                                <span className="px-2.5 py-1 bg-[#252525] text-slate-500 text-xs rounded-md">
                                  +{idea.stack.split(/\s*\+\s*/).filter(Boolean).length - 4}
                                </span>
                              )}
                            </div>
                          )}
                          
                          {/* Potential Badge */}
                          {idea.potential && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg flex-shrink-0 ml-3">
                              <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                <polyline points="16 7 22 7 22 13" />
                              </svg>
                              <span className="text-xs font-medium text-green-400">High Potential</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : ideas.length === 0 ? (
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
                        <IdeaCard key={idea.id} idea={idea} onView={() => setSelectedIdea(idea)} />
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

      {/* Modal Popup */}
      {selectedIdea && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedIdea(null)}
        >
          <div 
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a]/95 border border-[#2a2a2a] rounded-3xl shadow-2xl shadow-blue-500/20 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedIdea(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-[#252525] hover:bg-[#2a2a2a] flex items-center justify-center transition-colors z-10"
            >
              <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Gradient top bar */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400" />

            <div className="p-8">
              {/* Date badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {new Date(selectedIdea.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Project name */}
              <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                {selectedIdea.projectName || "Daily Project Idea"}
              </h2>

              {/* Problem statement */}
              <div className="space-y-4 mb-6">
                {selectedIdea.who && (
                  <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#252525]">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Who</span>
                    <p className="text-slate-300 mt-2 text-sm leading-relaxed">{selectedIdea.who}</p>
                  </div>
                )}
                {selectedIdea.pain && (
                  <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#252525]">
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">Pain</span>
                    <p className="text-slate-300 mt-2 text-sm leading-relaxed">{selectedIdea.pain}</p>
                  </div>
                )}
                {selectedIdea.gap && (
                  <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#252525]">
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-wide">Gap</span>
                    <p className="text-slate-300 mt-2 text-sm leading-relaxed">{selectedIdea.gap}</p>
                  </div>
                )}
                {selectedIdea.impact && (
                  <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#252525]">
                    <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">Impact</span>
                    <p className="text-slate-300 mt-2 text-sm leading-relaxed">{selectedIdea.impact}</p>
                  </div>
                )}
                {selectedIdea.whyNow && (
                  <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#252525]">
                    <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wide">Why Now</span>
                    <p className="text-slate-300 mt-2 text-sm leading-relaxed">{selectedIdea.whyNow}</p>
                  </div>
                )}
                {selectedIdea.potential && (
                  <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#252525]">
                    <span className="text-xs font-semibold text-green-400 uppercase tracking-wide">Potential</span>
                    <p className="text-slate-300 mt-2 text-sm leading-relaxed">{selectedIdea.potential}</p>
                  </div>
                )}
              </div>

              {/* Stack */}
              {selectedIdea.stack && (
                <div className="mb-6">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 block">Tech Stack</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedIdea.stack.split(/\s*\+\s*/).filter(Boolean).map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm rounded-lg"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Deploy */}
              {selectedIdea.deploy && (
                <div className="mb-6">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 block">Deploy Platform</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#252525] border border-[#2a2a2a] text-slate-300 text-sm rounded-lg">
                    <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {selectedIdea.deploy}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
