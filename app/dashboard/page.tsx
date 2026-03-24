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
  domain?: string;
  projectName?: string;
  description?: string;
  stack?: string;
  deploy?: string;
  who?: string;
  pain?: string;
  gap?: string;
  impact?: string;
  whyNow?: string;
  potential?: string;
  docs?: string;
  likes?: number;
  shares?: number;
  views?: number;
}

export default function DashboardPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'ideas' | 'domains' | 'allIdeas' | 'thisMonth'>('ideas');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [likedIdeas, setLikedIdeas] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load liked ideas from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('likedIdeas');
    if (saved) {
      setLikedIdeas(new Set(JSON.parse(saved)));
    }
  }, []);

  // Auto-refresh: Poll for new ideas every 30 seconds
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/ideas');
        if (response.ok) {
          const freshIdeas = await response.json();
          // Merge with localStorage counts
          const counts = JSON.parse(localStorage.getItem('ideaCounts') || '{}');
          const mergedIdeas = freshIdeas.map((idea: Idea) => ({
            ...idea,
            likes: (idea.likes || 0) + (counts[idea.id]?.likes || 0),
            shares: (idea.shares || 0) + (counts[idea.id]?.shares || 0),
            views: (idea.views || 0) + (counts[idea.id]?.views || 0),
          }));
          setIdeas(mergedIdeas);
        }
      } catch (error) {
        console.error('Failed to refresh ideas:', error);
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }, []);

  // Check URL for shared idea parameter
  useEffect(() => {
    if (ideas.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const ideaId = params.get('idea');
      if (ideaId) {
        const idea = ideas.find(i => i.id === ideaId);
        if (idea) {
          setSelectedIdea(idea);
        }
      }
    }
  }, [ideas]);

  const handleLike = async (ideaId: string) => {
    const isLiked = likedIdeas.has(ideaId);
    const newLiked = new Set(likedIdeas);
    
    if (isLiked) {
      newLiked.delete(ideaId);
    } else {
      newLiked.add(ideaId);
    }
    
    setLikedIdeas(newLiked);
    localStorage.setItem('likedIdeas', JSON.stringify([...newLiked]));
    
    // Update local counts in localStorage
    const counts = JSON.parse(localStorage.getItem('ideaCounts') || '{}');
    if (!counts[ideaId]) counts[ideaId] = { likes: 0, shares: 0 };
    counts[ideaId].likes += isLiked ? -1 : 1;
    if (counts[ideaId].likes < 0) counts[ideaId].likes = 0;
    localStorage.setItem('ideaCounts', JSON.stringify(counts));
    
    // Update UI immediately
    setIdeas(ideas.map(idea => 
      idea.id === ideaId 
        ? { ...idea, likes: (idea.likes || 0) + (isLiked ? -1 : 1) }
        : idea
    ));
  };

  const closeModal = () => {
    setSelectedIdea(null);
    // Remove idea parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('idea');
    window.history.replaceState({}, '', url.toString());
  };
  const handleShare = async (idea: Idea) => {
    const url = `${window.location.origin}/dashboard?idea=${idea.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: idea.projectName || 'FocusLock Project Idea',
          text: idea.description || 'Check out this project idea!',
          url: url,
        });
        // Show success toast
        setToastMessage('Shared successfully!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (error) {
        // User cancelled or share failed
        if ((error as Error).name !== 'AbortError') {
          setToastMessage('Share cancelled');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2000);
        }
        return; // Don't increment share count if cancelled
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setToastMessage('Link copied to clipboard!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch {
        setToastMessage('Failed to copy link');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    }
    
    // Update local counts in localStorage
    const counts = JSON.parse(localStorage.getItem('ideaCounts') || '{}');
    if (!counts[idea.id]) counts[idea.id] = { likes: 0, shares: 0 };
    counts[idea.id].shares += 1;
    localStorage.setItem('ideaCounts', JSON.stringify(counts));
    
    // Update UI immediately
    setIdeas(ideas.map(i => 
      i.id === idea.id 
        ? { ...i, shares: (i.shares || 0) + 1 }
        : i
    ));
  };

  // Tech stack URL mapping
  const getTechUrl = (tech: string): string => {
    const techMap: Record<string, string> = {
      'next.js': 'https://nextjs.org',
      'nextjs': 'https://nextjs.org',
      'react': 'https://react.dev',
      'vue.js': 'https://vuejs.org',
      'vue': 'https://vuejs.org',
      'angular': 'https://angular.io',
      'svelte': 'https://svelte.dev',
      'node.js': 'https://nodejs.org',
      'nodejs': 'https://nodejs.org',
      'express': 'https://expressjs.com',
      'fastapi': 'https://fastapi.tiangolo.com',
      'django': 'https://www.djangoproject.com',
      'flask': 'https://flask.palletsprojects.com',
      'supabase': 'https://supabase.com',
      'firebase': 'https://firebase.google.com',
      'mongodb': 'https://www.mongodb.com',
      'postgresql': 'https://www.postgresql.org',
      'postgres': 'https://www.postgresql.org',
      'mysql': 'https://www.mysql.com',
      'redis': 'https://redis.io',
      'prisma': 'https://www.prisma.io',
      'tailwind': 'https://tailwindcss.com',
      'tailwind css': 'https://tailwindcss.com',
      'typescript': 'https://www.typescriptlang.org',
      'python': 'https://www.python.org',
      'go': 'https://go.dev',
      'rust': 'https://www.rust-lang.org',
      'stripe': 'https://stripe.com',
      'vercel': 'https://vercel.com',
      'railway': 'https://railway.app',
      'render': 'https://render.com',
      'fly.io': 'https://fly.io',
      'netlify': 'https://www.netlify.com',
      'aws': 'https://aws.amazon.com',
      's3': 'https://aws.amazon.com/s3',
      'docker': 'https://www.docker.com',
      'kubernetes': 'https://kubernetes.io',
      'graphql': 'https://graphql.org',
      'apollo': 'https://www.apollographql.com',
      'trpc': 'https://trpc.io',
      'websockets': 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API',
      'openai': 'https://openai.com',
      'openai api': 'https://platform.openai.com',
      'twilio': 'https://www.twilio.com',
      'sendgrid': 'https://sendgrid.com',
      'shopify': 'https://www.shopify.com',
      'shopify api': 'https://shopify.dev',
      'ffmpeg': 'https://ffmpeg.org',
      'expo': 'https://expo.dev',
      'react native': 'https://reactnative.dev',
      'electron': 'https://www.electronjs.org',
      'tauri': 'https://tauri.app',
    };
    
    const normalized = tech.toLowerCase().trim();
    return techMap[normalized] || `https://www.google.com/search?q=${encodeURIComponent(tech)}`;
  };

  useEffect(() => {
    async function fetchIdeas() {
      try {
        const response = await fetch('/api/ideas');
        const data = await response.json();
        
        // Merge with localStorage counts
        const counts = JSON.parse(localStorage.getItem('ideaCounts') || '{}');
        const mergedData = data.map((idea: Idea) => ({
          ...idea,
          likes: (idea.likes || 0) + (counts[idea.id]?.likes || 0),
          shares: (idea.shares || 0) + (counts[idea.id]?.shares || 0),
        }));
        
        setIdeas(mergedData);
      } catch (err) {
        console.error('Failed to fetch ideas:', err);
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

  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-4 left-4 z-30 lg:hidden w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center hover:bg-[#252525] transition-colors"
          >
            <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Mobile Backdrop */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* ── Left Sidebar ─────────────────────────────────────────────── */}
          <div className={`fixed top-4 left-4 w-80 max-w-[calc(100vw-2rem)] h-[98vh] z-20 transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+1rem)]'
          }`}>
            <div className="h-full overflow-y-auto">
              {/* Single Unified Sidebar */}
              <div className="h-full bg-[#1a1a1a]/20 border border-[#2a2a2a]/30 rounded-3xl backdrop-blur-2xl shadow-2xl shadow-blue-500/10 flex flex-col">
                
                {/* Header with Logo */}
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-12 h-12 rounded-xl bg-[#0f0f0f] border border-[#252525] overflow-hidden flex items-center justify-center flex-shrink-0">
                      <Image 
                        src="/logo.webp" 
                        alt="FocusLock" 
                        width={48} 
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">FocusLock</h2>
                      <p className="text-xs text-slate-500">AI Project Ideas</p>
                    </div>
                    {/* Close button for mobile */}
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="ml-auto lg:hidden w-8 h-8 rounded-lg bg-[#252525] hover:bg-[#2a2a2a] flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
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
                      onClick={(e) => { e.preventDefault(); setActiveView('ideas'); setSidebarOpen(false); }}
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
                      onClick={(e) => { e.preventDefault(); setActiveView('allIdeas'); setSidebarOpen(false); }}
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
                    <div 
                      onClick={() => { setActiveView('allIdeas'); setSidebarOpen(false); }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#0f0f0f] hover:bg-[#151515] transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                          <polyline points="16 7 22 7 22 13" />
                        </svg>
                      </div>
                      <span className="text-sm text-slate-300 flex-1">Total Ideas</span>
                      <span className="text-sm font-bold text-white">{ideas.length}</span>
                    </div>
                    <div 
                      onClick={() => { setActiveView('thisMonth'); setSidebarOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#0f0f0f] hover:bg-[#151515] transition-colors cursor-pointer"
                    >
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
                      onClick={() => { setActiveView('domains'); setSidebarOpen(false); }}
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
          <div className="flex-1 lg:ml-[336px] h-screen overflow-y-auto">
            <div className="px-4 sm:px-6 py-6 sm:py-8 pt-16 lg:pt-8 max-w-6xl">
            {activeView === 'domains' ? (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Problem Domains</h2>
                  <p className="text-sm text-slate-400">25 problem spaces the AI generates ideas from</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {domains.map((domain) => {
                    const domainIdeas = ideas.filter(idea => idea.domain === domain.name);
                    return (
                      <div 
                        key={domain.name}
                        onClick={() => {
                          setSelectedDomain(domain.name);
                          setActiveView('allIdeas');
                        }}
                        className="p-5 rounded-2xl bg-[#1a1a1a]/20 border border-[#2a2a2a]/30 backdrop-blur-2xl hover:border-[#3a3a3a] transition-all hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 cursor-pointer"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-purple-400">{domains.indexOf(domain) + 1}</span>
                          </div>
                          <h3 className="text-base font-semibold text-white leading-tight">{domain.name}</h3>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed mb-3">{domain.description}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                          </svg>
                          <span>{domainIdeas.length} {domainIdeas.length === 1 ? 'idea' : 'ideas'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : activeView === 'allIdeas' ? (
              <div className="space-y-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {selectedDomain ? `${selectedDomain} Ideas` : 'All Ideas'}
                      </h2>
                      <p className="text-sm text-slate-400">
                        {selectedDomain 
                          ? `${ideas.filter(i => i.domain === selectedDomain).length} ideas in this domain`
                          : `${ideas.length} total project ideas`
                        }
                      </p>
                    </div>
                    {selectedDomain && (
                      <button
                        onClick={() => setSelectedDomain(null)}
                        className="px-4 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] border border-[#2a2a2a] text-slate-400 hover:text-white text-sm transition-all flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Clear Filter
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(selectedDomain ? ideas.filter(i => i.domain === selectedDomain) : ideas).map((idea) => (
                    <div 
                      key={idea.id}
                      className="bg-[#1a1a1a]/60 border border-[#2a2a2a]/50 rounded-2xl p-6 backdrop-blur-xl hover:border-[#3a3a3a] transition-all"
                    >
                      {/* Project Title */}
                      <h3 className="text-xl font-bold text-white mb-3">
                        {idea.projectName || "Daily Project Idea"}
                      </h3>

                      {/* Pain/Description */}
                      {(idea.pain || idea.description) && (
                        <p className="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-3">
                          {idea.pain || idea.description}
                        </p>
                      )}

                      {/* Stack badges */}
                      {idea.stack && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {idea.stack.split(/\s*\+\s*/).filter(Boolean).map((item) => (
                            <span
                              key={item}
                              className="px-3 py-1.5 bg-[#252525] text-slate-300 text-sm rounded-lg"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
                        <span className="text-sm text-slate-500">
                          {new Date(idea.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedIdea(idea)}
                            className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-medium transition-all"
                          >
                            View
                          </button>
                          <button className="w-9 h-9 rounded-lg bg-[#252525] hover:bg-[#2a2a2a] flex items-center justify-center transition-colors">
                            <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                          </button>
                          <button className="w-9 h-9 rounded-lg bg-[#252525] hover:bg-[#2a2a2a] flex items-center justify-center transition-colors">
                            <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="18" cy="5" r="3" />
                              <circle cx="6" cy="12" r="3" />
                              <circle cx="18" cy="19" r="3" />
                              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeView === 'thisMonth' ? (
              <div className="space-y-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">This Month</h2>
                    <p className="text-sm text-slate-400">{thisMonth} ideas from {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
                  </div>
                  {/* Week Filter Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedWeek || ''}
                      onChange={(e) => setSelectedWeek(e.target.value ? Number(e.target.value) : null)}
                      className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-slate-300 text-sm focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer hover:bg-[#252525]"
                    >
                      <option value="">All Weeks</option>
                      <option value="1">Week 1</option>
                      <option value="2">Week 2</option>
                      <option value="3">Week 3</option>
                      <option value="4">Week 4</option>
                      <option value="5">Week 5</option>
                    </select>
                  </div>
                </div>
                {thisMonth === 0 ? (
                  <div className="bg-[#1a1a1a]/20 border border-[#2a2a2a]/30 rounded-2xl p-8 text-center backdrop-blur-2xl">
                    <h3 className="text-xl font-bold text-white mb-2">No ideas this month yet</h3>
                    <p className="text-sm text-slate-400">Check back after the next workflow run.</p>
                  </div>
                ) : (
                  (() => {
                    // Group ideas by week
                    const thisMonthIdeas = ideas.filter((idea) => {
                      const d = new Date(idea.date);
                      const now = new Date();
                      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                    });

                    // Get week number of month (1-5)
                    const getWeekOfMonth = (date: Date) => {
                      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                      const dayOfMonth = date.getDate();
                      const firstDayOfWeek = firstDay.getDay();
                      return Math.ceil((dayOfMonth + firstDayOfWeek) / 7);
                    };

                    // Group by week
                    const weekGroups: { [key: number]: typeof thisMonthIdeas } = {};
                    thisMonthIdeas.forEach(idea => {
                      const week = getWeekOfMonth(new Date(idea.date));
                      if (!weekGroups[week]) weekGroups[week] = [];
                      weekGroups[week].push(idea);
                    });

                    // Filter by selected week if any
                    const weeksToShow = selectedWeek 
                      ? [selectedWeek.toString()]
                      : Object.keys(weekGroups).sort((a, b) => Number(b) - Number(a));

                    return weeksToShow.map(weekNum => (
                      <div key={weekNum} className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Week {weekNum}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {(weekGroups[Number(weekNum)] || []).map((idea) => (
                            <div 
                              key={idea.id}
                              className="bg-[#1a1a1a]/60 border border-[#2a2a2a]/50 rounded-2xl p-6 backdrop-blur-xl hover:border-[#3a3a3a] transition-all"
                            >
                              <h3 className="text-xl font-bold text-white mb-3">
                                {idea.projectName || "Daily Project Idea"}
                              </h3>
                              {idea.pain && (
                                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                                  {idea.pain}
                                </p>
                              )}
                              {idea.stack && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {idea.stack.split(/\s*\+\s*/).filter(Boolean).map((item) => (
                                    <span
                                      key={item}
                                      className="px-3 py-1.5 bg-[#252525] text-slate-300 text-sm rounded-lg"
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
                                <span className="text-sm text-slate-500">
                                  {new Date(idea.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setSelectedIdea(idea)}
                                    className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-medium transition-all"
                                  >
                                    View
                                  </button>
                                  <button className="w-9 h-9 rounded-lg bg-[#252525] hover:bg-[#2a2a2a] flex items-center justify-center transition-colors">
                                    <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                  </button>
                                  <button className="w-9 h-9 rounded-lg bg-[#252525] hover:bg-[#2a2a2a] flex items-center justify-center transition-colors">
                                    <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <circle cx="18" cy="5" r="3" />
                                      <circle cx="6" cy="12" r="3" />
                                      <circle cx="18" cy="19" r="3" />
                                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ));
                  })()
                )}
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
                      <p className="text-xs text-slate-500 mt-1">Today&apos;s project idea</p>
                    </div>
                    <IdeaCard 
                      idea={latest} 
                      featured 
                      onView={() => setSelectedIdea(latest)}
                      onLike={handleLike}
                      onShare={handleShare}
                      isLiked={likedIdeas.has(latest.id)}
                    />
                  </section>
                )}

                {/* ── All previous ideas grid ────────────────────────────────── */}
                {rest.length > 0 && (
                  <section id="ideas">
                    <div className="mb-3">
                      <h2 className="text-xl font-bold text-white">Previous Ideas</h2>
                      <p className="text-xs text-slate-500 mt-1">{rest.length} archived ideas</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {rest.map((idea) => (
                        <IdeaCard 
                          key={idea.id} 
                          idea={idea} 
                          onView={() => setSelectedIdea(idea)}
                          onLike={handleLike}
                          onShare={handleShare}
                          isLiked={likedIdeas.has(idea.id)}
                        />
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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 sm:top-5 sm:right-5 w-8 h-8 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] flex items-center justify-center transition-colors z-10"
            >
              <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="p-5 sm:p-8">
              {/* Project Title and Description */}
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 pr-8">
                {selectedIdea.projectName || "Daily Project Idea"}
              </h2>
              
              {selectedIdea.description && (
                <p className="text-slate-400 text-base leading-relaxed mb-6">
                  {selectedIdea.description}
                </p>
              )}

              {/* Date */}
              <div className="flex items-center gap-3 text-xs text-slate-600 mb-8">
                <span>
                  {new Date(selectedIdea.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                {selectedIdea.deploy && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span>{selectedIdea.deploy}</span>
                  </>
                )}
              </div>

              {/* Full Raw Content */}
              <div className="space-y-6 text-[15px] leading-relaxed">
                {selectedIdea.raw.split('\n').map((line, idx) => {
                  const trimmedLine = line.trim();
                  if (!trimmedLine) return null;
                  
                  // Check for section headers (with : or →)
                  const headerMatch = trimmedLine.match(/^(PROBLEM STATEMENT|Project|Stack|Deploy|Docs & Links|Why now|Potential):\s*(.*)$/i) ||
                                     trimmedLine.match(/^(WHO|PAIN|GAP|IMPACT|WHY NOW|POTENTIAL|STACK|DEPLOY|PROJECT)\s*→\s*(.*)$/i);
                  
                  if (headerMatch) {
                    const [, heading, content] = headerMatch;
                    const headingLower = heading.toLowerCase().replace(/\s+/g, ' ');
                    
                    // Color mapping for headings
                    const colorMap: Record<string, string> = {
                      'problem statement': 'text-slate-400',
                      'project': 'text-white',
                      'who': 'text-blue-400',
                      'pain': 'text-cyan-400',
                      'gap': 'text-purple-400',
                      'impact': 'text-red-400',
                      'why now': 'text-yellow-400',
                      'potential': 'text-green-400',
                      'stack': 'text-slate-500',
                      'deploy': 'text-slate-500',
                      'docs & links': 'text-slate-500',
                    };
                    
                    const color = colorMap[headingLower] || 'text-slate-400';
                    
                    // Special handling for Stack with clickable tech
                    if (headingLower === 'stack' && content) {
                      return (
                        <div key={idx}>
                          <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${color}`}>
                            {heading}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {content.split(/\s*\+\s*/).filter(Boolean).map((tech, techIdx) => {
                              const cleanTech = tech.replace(/\|.*$/, '').trim();
                              return (
                                <a
                                  key={techIdx}
                                  href={getTechUrl(cleanTech)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#252525] text-slate-400 hover:text-slate-300 text-sm rounded-lg transition-colors"
                                >
                                  {cleanTech}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={idx}>
                        <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${color}`}>
                          {heading}
                        </h3>
                        <p className="text-slate-300">{content}</p>
                      </div>
                    );
                  }
                  
                  // Handle bullet points (Docs & Links section)
                  if (trimmedLine.startsWith('•')) {
                    const cleanLine = trimmedLine.replace(/^•\s*/, '');
                    
                    // Check for markdown links [text](url)
                    const markdownLinkMatch = cleanLine.match(/\[([^\]]+)\]\(([^)]+)\)/);
                    if (markdownLinkMatch) {
                      const [fullMatch, linkText, url] = markdownLinkMatch;
                      const beforeLink = cleanLine.substring(0, cleanLine.indexOf(fullMatch));
                      const afterLink = cleanLine.substring(cleanLine.indexOf(fullMatch) + fullMatch.length);
                      
                      return (
                        <div key={idx} className="flex items-start gap-2 ml-4 mb-2">
                          <span className="text-slate-600 mt-0.5">•</span>
                          <div className="text-slate-300">
                            {beforeLink}
                            <a 
                              href={url.trim()} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-400 hover:text-blue-300 transition-colors underline"
                            >
                              {linkText}
                            </a>
                            {afterLink}
                          </div>
                        </div>
                      );
                    }
                    
                    // Check for arrow links text → url
                    const arrowMatch = cleanLine.match(/^(.+?)\s*→\s*(.+)$/);
                    if (arrowMatch) {
                      return (
                        <div key={idx} className="flex items-start gap-2 ml-4 mb-2">
                          <span className="text-slate-600 mt-0.5">•</span>
                          <div>
                            <span className="text-slate-400">{arrowMatch[1].trim()}</span>
                            <span className="text-slate-600 mx-2">→</span>
                            <a 
                              href={arrowMatch[2].trim()} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-400 hover:text-blue-300 transition-colors break-all"
                            >
                              {arrowMatch[2].trim()}
                            </a>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={idx} className="flex items-start gap-2 ml-4 mb-2">
                        <span className="text-slate-600 mt-0.5">•</span>
                        <span className="text-slate-300">{cleanLine}</span>
                      </div>
                    );
                  }
                  
                  // Regular content line
                  return (
                    <p key={idx} className="text-slate-300">
                      {trimmedLine}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 animate-slideUp">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 shadow-2xl backdrop-blur-xl flex items-center gap-3">
            <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-sm text-white font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
