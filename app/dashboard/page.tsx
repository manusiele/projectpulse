"use client";

import { useEffect, useState } from "react";
import { IdeaCard } from "@/components/IdeaCard";
import Link from "next/link";
import { Loader } from "@/components/Loader";
import type { Idea } from "@/lib/ideas";

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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);

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
        setIsCheckingUpdates(true);
        const response = await fetch('/api/ideas');
        if (response.ok) {
          const freshIdeas = await response.json();
          
          // Check if there's a new idea (compare first idea ID)
          if (ideas.length > 0 && freshIdeas.length > 0) {
            const latestOldId = ideas[0].id;
            const latestNewId = freshIdeas[0].id;
            
            if (latestOldId !== latestNewId) {
              // New idea detected!
              const newIdea = freshIdeas[0];
              
              // Show notification if permission granted
              if ('Notification' in window && Notification.permission === 'granted') {
                const notification = new Notification('🚀 New ProjectPulse Idea!', {
                  body: newIdea.projectName || 'A fresh project idea just arrived',
                  icon: '/icon-192.png',
                  badge: '/icon-192.png',
                  tag: 'new-idea',
                  requireInteraction: false,
                  data: { ideaId: newIdea.id }
                });
                
                notification.onclick = () => {
                  window.focus();
                  setSelectedIdea(newIdea);
                  notification.close();
                };
              }
              
              // Show toast notification
              setToastMessage('🎉 New idea available!');
              setShowToast(true);
              setTimeout(() => setShowToast(false), 5000);
            }
          }
          
          // Update with fresh data (includes global counts from KV)
          setIdeas(freshIdeas);
        }
      } catch (error) {
        console.error('Failed to refresh ideas:', error);
      } finally {
        setIsCheckingUpdates(false);
      }
    }, 60000); // Poll every 60 seconds

    return () => clearInterval(pollInterval);
  }, [ideas]);

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
    
    // Update liked state
    const newLiked = new Set(likedIdeas);
    if (isLiked) {
      newLiked.delete(ideaId);
    } else {
      newLiked.add(ideaId);
    }
    setLikedIdeas(newLiked);
    localStorage.setItem('likedIdeas', JSON.stringify([...newLiked]));
    
    // Optimistically update UI
    setIdeas(prevIdeas => prevIdeas.map(idea => 
      idea.id === ideaId 
        ? { ...idea, likes: (idea.likes || 0) + (isLiked ? -1 : 1) }
        : idea
    ));
    
    // Call API to update global count
    try {
      const response = await fetch(`/api/ideas/${ideaId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update with actual count from server
        setIdeas(prevIdeas => prevIdeas.map(idea => 
          idea.id === ideaId 
            ? { ...idea, likes: data.likes }
            : idea
        ));
      }
    } catch (error) {
      console.error('Failed to update like:', error);
      // Revert optimistic update on error
      setIdeas(prevIdeas => prevIdeas.map(idea => 
        idea.id === ideaId 
          ? { ...idea, likes: (idea.likes || 0) + (isLiked ? 1 : -1) }
          : idea
      ));
    }
  };

  const closeModal = () => {
    setSelectedIdea(null);
    // Remove idea parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('idea');
    window.history.replaceState({}, '', url.toString());
  };
  const handleShare = async (idea: Idea) => {
    const longUrl = `https://projectpulse-dev.vercel.app/dashboard?idea=${idea.id}`;
    
    if (!navigator.share) {
      setToastMessage('Share not supported on this device');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    try {
      // Show loading toast while shortening URL
      setToastMessage('Preparing share link...');
      setShowToast(true);
      
      // Shorten the URL
      const shortenResponse = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: longUrl })
      });
      
      let url = longUrl; // Fallback to long URL
      if (shortenResponse.ok) {
        const data = await shortenResponse.json();
        url = data.shortUrl || longUrl;
      }
      
      await navigator.share({
        title: idea.projectName || 'Project Idea',
        url: url,
      });
      
      // Show success toast
      setToastMessage('Shared successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
      // Optimistically update share count
      setIdeas(prevIdeas => prevIdeas.map(i => 
        i.id === idea.id 
          ? { ...i, shares: (i.shares || 0) + 1 }
          : i
      ));
      
      // Call API to update global count
      try {
        const response = await fetch('/api/ideas/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ideaId: idea.id })
        });
        
        if (response.ok) {
          const data = await response.json();
          // Update with actual count from server
          setIdeas(prevIdeas => prevIdeas.map(i => 
            i.id === idea.id 
              ? { ...i, shares: data.shares }
              : i
          ));
        }
      } catch (error) {
        console.error('Failed to update share count:', error);
      }
    } catch (error) {
      // User cancelled share
      if ((error as Error).name === 'AbortError') {
        setShowToast(false);
        return; // Silent cancel
      }
      
      setToastMessage('Share cancelled');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
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
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setIdeas(data);
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
    const d = new Date(idea.createdAt || idea.date || Date.now());
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
      {/* LeetCode-inspired animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient base layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f1a] to-[#0a0a0a] animate-gradient" />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-purple-500/15 to-blue-500/10 rounded-full blur-3xl animate-float-reverse" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
        
        {/* Accent lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/15 to-transparent" />
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slideUp">
          <div className="bg-[#1a1a1a]/95 border border-[#2a2a2a] rounded-xl backdrop-blur-xl shadow-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <span className="text-sm text-white font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 h-screen overflow-hidden">
        <div className="flex h-full">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center hover:bg-[#252525] transition-colors"
          >
            {isCheckingUpdates ? (
              <svg className="w-5 h-5 text-blue-400 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>

          {/* Mobile Bottom Navigation */}
          {mobileNavOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
                onClick={() => setMobileNavOpen(false)}
              />
              
              {/* Floating Nav Card */}
              <div className="fixed inset-x-4 bottom-4 z-40 lg:hidden animate-slideUp">
                <div className="bg-[#1a1a1a]/95 border border-[#2a2a2a] rounded-xl backdrop-blur-xl shadow-2xl p-2 max-w-sm mx-auto">
                  <div className="grid grid-cols-4 gap-1">
                    <button
                      onClick={() => { setActiveView('ideas'); setMobileNavOpen(false); }}
                      className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all ${
                        activeView === 'ideas' ? 'text-blue-400 bg-gradient-to-r from-blue-500/10 to-cyan-500/10' : 'text-slate-400 hover:bg-[#252525]'
                      }`}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span className="text-[9px] font-medium">Latest</span>
                    </button>
                    
                    <button
                      onClick={() => { setActiveView('allIdeas'); setMobileNavOpen(false); }}
                      className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all ${
                        activeView === 'allIdeas' ? 'text-blue-400 bg-gradient-to-r from-blue-500/10 to-cyan-500/10' : 'text-slate-400 hover:bg-[#252525]'
                      }`}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                      <span className="text-[9px] font-medium">All</span>
                    </button>
                    
                    <button
                      onClick={() => { setActiveView('domains'); setMobileNavOpen(false); }}
                      className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all ${
                        activeView === 'domains' ? 'text-blue-400 bg-gradient-to-r from-blue-500/10 to-cyan-500/10' : 'text-slate-400 hover:bg-[#252525]'
                      }`}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                      <span className="text-[9px] font-medium">Domains</span>
                    </button>
                    
                    <button
                      onClick={() => { setActiveView('thisMonth'); setMobileNavOpen(false); }}
                      className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all ${
                        activeView === 'thisMonth' ? 'text-blue-400 bg-gradient-to-r from-blue-500/10 to-cyan-500/10' : 'text-slate-400 hover:bg-[#252525]'
                      }`}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className="text-[9px] font-medium">Month</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Mobile Backdrop */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* ── Left Sidebar (Desktop Only) ─────────────────────────────────────────────── */}
          <div className="hidden lg:block fixed top-4 left-4 w-80 h-[98vh] z-40">
            <div className="h-full overflow-y-auto">
              {/* Single Unified Sidebar */}
              <div className="h-full bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f] border border-[#1a1a1a] rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col p-6">
                
                {/* Header with Logo */}
                <div className="mb-8">
                  <div className="flex items-center justify-center">
                    <svg width="180" height="45" viewBox="0 0 180 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <text x="5" y="30" className="font-black" style={{ fontSize: '24px', fill: 'url(#textGradient)', letterSpacing: '-0.02em' }}>
                        ProjectPulse
                      </text>
                      <defs>
                        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#22d3ee', stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <p className="text-xs text-slate-500 text-center mt-1">AI Project Ideas</p>
                </div>

                {/* Ideas Section */}
                <div className="mb-6">
                  <h3 className="text-xs text-slate-600 uppercase tracking-wider font-bold mb-3 px-4">Ideas</h3>
                  <nav className="space-y-1">
                    <button 
                      onClick={() => setActiveView('ideas')}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                        activeView === 'ideas' 
                          ? 'text-white bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30' 
                          : 'text-slate-400 hover:text-white hover:bg-[#1a1a1a]/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span className="font-medium">Latest Spark</span>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setActiveView('allIdeas')}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                        activeView === 'allIdeas' 
                          ? 'text-white bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30' 
                          : 'text-slate-400 hover:text-white hover:bg-[#1a1a1a]/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                        <span className="font-medium">All Ideas</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 text-xs font-bold">{ideas.length}</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveView('thisMonth')}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                        activeView === 'thisMonth' 
                          ? 'text-white bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30' 
                          : 'text-slate-400 hover:text-white hover:bg-[#1a1a1a]/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span className="font-medium">This Month</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 text-xs font-bold">{thisMonth}</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveView('domains')}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                        activeView === 'domains' 
                          ? 'text-white bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30' 
                          : 'text-slate-400 hover:text-white hover:bg-[#1a1a1a]/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        <span className="font-medium">Domains</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 text-xs font-bold">25</span>
                    </button>
                  </nav>
                </div>

                {/* Navigation Section */}
                <div>
                  <h3 className="text-xs text-slate-600 uppercase tracking-wider font-bold mb-3 px-4">Navigation</h3>
                  <nav className="space-y-1">
                    <Link 
                      href="/" 
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-[#1a1a1a]/80 transition-all"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span className="font-medium">Home</span>
                    </Link>
                    
                    <a 
                      href="https://github.com/manusiele/projectpulse" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-[#1a1a1a]/80 transition-all"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span className="font-medium">GitHub</span>
                    </a>
                  </nav>
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
                  <div className="flex items-center justify-between gap-3">
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
                        onClick={() => {
                          setSelectedDomain(null);
                          setActiveView('domains');
                        }}
                        className="w-10 h-10 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] border border-[#2a2a2a] text-slate-400 hover:text-white transition-all flex items-center justify-center flex-shrink-0"
                        title="Back to domains"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(selectedDomain ? ideas.filter(i => i.domain === selectedDomain) : ideas).length === 0 ? (
                    <div className="col-span-full bg-[#1a1a1a]/20 border border-[#2a2a2a]/30 rounded-2xl p-8 text-center backdrop-blur-2xl">
                      <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <h3 className="text-xl font-bold text-white mb-2">No ideas found</h3>
                      <p className="text-sm text-slate-400">
                        {selectedDomain 
                          ? `No ideas in the "${selectedDomain}" domain yet.`
                          : 'No ideas available yet. Check back after the workflow runs.'
                        }
                      </p>
                    </div>
                  ) : (
                    (selectedDomain ? ideas.filter(i => i.domain === selectedDomain) : ideas).map((idea) => (
                      <div 
                        key={idea.id}
                        className="bg-[#1a1a1a]/60 border border-[#2a2a2a]/50 rounded-2xl p-6 backdrop-blur-xl hover:border-[#3a3a3a] transition-all"
                      >
                        {/* Project Title */}
                        <h3 className="text-sm font-bold text-white mb-3 line-clamp-2 leading-tight">
                          {(idea.projectName || "Daily Project Idea").replace(/[\[\]]/g, '')}
                        </h3>

                        {/* Pain/Description */}
                        {(idea.pain || idea.description) && (
                          <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-3">
                            {idea.pain || idea.description}
                          </p>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
                          <span className="text-sm text-slate-500">
                            {new Date(idea.createdAt || idea.date || Date.now()).toLocaleDateString("en-US", {
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
                            <button 
                              onClick={() => handleLike(idea.id)}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                                likedIdeas.has(idea.id) 
                                  ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' 
                                  : 'bg-[#252525] hover:bg-[#2a2a2a] text-slate-400'
                              }`}
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill={likedIdeas.has(idea.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                              </svg>
                              <span className="text-xs font-medium">{idea.likes || 0}</span>
                            </button>
                            <button 
                              onClick={() => handleShare(idea)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#252525] hover:bg-[#2a2a2a] text-slate-400 transition-colors"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="18" cy="5" r="3" />
                                <circle cx="6" cy="12" r="3" />
                                <circle cx="18" cy="19" r="3" />
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                              </svg>
                              <span className="text-xs font-medium">{idea.shares || 0}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
                      const d = new Date(idea.createdAt || idea.date || Date.now());
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
                      const week = getWeekOfMonth(new Date(idea.createdAt || idea.date || Date.now()));
                      if (!weekGroups[week]) weekGroups[week] = [];
                      weekGroups[week].push(idea);
                    });

                    // Filter by selected week if any
                    const weeksToShow = selectedWeek 
                      ? [selectedWeek.toString()]
                      : Object.keys(weekGroups).sort((a, b) => Number(b) - Number(a));

                    return weeksToShow.map(weekNum => {
                      const weekIdeas = weekGroups[Number(weekNum)] || [];
                      return (
                        <div key={weekNum} className="space-y-4">
                          <h3 className="text-lg font-semibold text-white">Week {weekNum}</h3>
                          {weekIdeas.length === 0 ? (
                            <div className="bg-[#1a1a1a]/20 border border-[#2a2a2a]/30 rounded-2xl p-8 text-center backdrop-blur-2xl">
                              <svg className="w-12 h-12 mx-auto mb-3 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                              </svg>
                              <h4 className="text-base font-bold text-white mb-1">No ideas this week</h4>
                              <p className="text-sm text-slate-400">Check back after the workflow runs.</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {(weekGroups[Number(weekNum)] || []).map((idea) => (
                            <div 
                              key={idea.id}
                              className="bg-[#1a1a1a]/60 border border-[#2a2a2a]/50 rounded-2xl p-6 backdrop-blur-xl hover:border-[#3a3a3a] transition-all"
                            >
                              <h3 className="text-sm font-bold text-white mb-3 line-clamp-2 leading-tight">
                                {(idea.projectName || "Daily Project Idea").replace(/[\[\]]/g, '')}
                              </h3>
                              {(idea.pain || idea.description) && (
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-3">
                                  {idea.pain || idea.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
                                <span className="text-sm text-slate-500">
                                  {new Date(idea.createdAt || idea.date || Date.now()).toLocaleDateString("en-US", {
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
                                  <button 
                                    onClick={() => handleLike(idea.id)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                                      likedIdeas.has(idea.id) 
                                        ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' 
                                        : 'bg-[#252525] hover:bg-[#2a2a2a] text-slate-400'
                                    }`}
                                  >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill={likedIdeas.has(idea.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                    </svg>
                                    <span className="text-xs font-medium">{idea.likes || 0}</span>
                                  </button>
                                  <button 
                                    onClick={() => handleShare(idea)}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#252525] hover:bg-[#2a2a2a] text-slate-400 transition-colors"
                                  >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <circle cx="18" cy="5" r="3" />
                                      <circle cx="6" cy="12" r="3" />
                                      <circle cx="18" cy="19" r="3" />
                                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                    </svg>
                                    <span className="text-xs font-medium">{idea.shares || 0}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                          )}
                        </div>
                      );
                    });
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
                {(selectedIdea.projectName || "Daily Project Idea").replace(/[\[\]]/g, '')}
              </h2>
              
              {selectedIdea.description && (
                <p className="text-slate-400 text-base leading-relaxed mb-6">
                  {selectedIdea.description}
                </p>
              )}

              {/* Domain and Date */}
              <div className="flex items-center gap-3 text-xs text-slate-600 mb-8">
                {selectedIdea.domain && (
                  <>
                    <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 font-medium">
                      {selectedIdea.domain}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                  </>
                )}
                <span>
                  {new Date(selectedIdea.createdAt || selectedIdea.date || Date.now()).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Key Details - Reordered for developer flow */}
              <div className="space-y-5">
                {/* Problem Statement - Combined Who/Pain/Gap */}
                {(selectedIdea.who || selectedIdea.pain || selectedIdea.gap) && (
                  <div>
                    <span className="inline-block px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                      Problem Statement
                    </span>
                    <div className="space-y-3 mt-3">
                      {selectedIdea.who && (
                        <div className="flex gap-3">
                          <span className="text-purple-400 font-bold text-sm flex-shrink-0">Who:</span>
                          <p className="text-slate-300 leading-relaxed">{selectedIdea.who}</p>
                        </div>
                      )}
                      {selectedIdea.pain && (
                        <div className="flex gap-3">
                          <span className="text-red-400 font-bold text-sm flex-shrink-0">Pain:</span>
                          <p className="text-slate-300 leading-relaxed">{selectedIdea.pain}</p>
                        </div>
                      )}
                      {selectedIdea.gap && (
                        <div className="flex gap-3">
                          <span className="text-orange-400 font-bold text-sm flex-shrink-0">Gap:</span>
                          <p className="text-slate-300 leading-relaxed">{selectedIdea.gap}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Why Now */}
                {selectedIdea.whyNow && (
                  <div>
                    <span className="inline-block px-3 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider mb-2">
                      Why Now
                    </span>
                    <p className="text-slate-300 leading-relaxed mt-2">{selectedIdea.whyNow}</p>
                  </div>
                )}

                {/* Potential */}
                {selectedIdea.potential && (
                  <div>
                    <span className="inline-block px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                      Potential
                    </span>
                    <p className="text-slate-300 leading-relaxed mt-2">{selectedIdea.potential}</p>
                  </div>
                )}

                {/* Impact */}
                {selectedIdea.impact && (
                  <div>
                    <span className="inline-block px-3 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2">
                      Impact
                    </span>
                    <p className="text-slate-300 leading-relaxed mt-2">{selectedIdea.impact}</p>
                  </div>
                )}

                {/* Stack */}
                {selectedIdea.stack && (
                  <div>
                    <span className="inline-block px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                      Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedIdea.stack.split(/[,+]/).filter(Boolean).map((tech, techIdx) => {
                        const cleanTech = tech.replace(/\|.*$/, '').trim();
                        return (
                          <a
                            key={techIdx}
                            href={getTechUrl(cleanTech)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#252525] text-slate-400 hover:text-slate-300 text-sm rounded-lg transition-colors border border-[#2a2a2a]"
                          >
                            {cleanTech}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Deploy */}
                {selectedIdea.deploy && (
                  <div>
                    <span className="inline-block px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                      Deployment
                    </span>
                    <p className="text-slate-300 leading-relaxed mt-2">{selectedIdea.deploy}</p>
                  </div>
                )}

                {/* Docs & Links */}
                {selectedIdea.docs && (
                  <div>
                    <span className="inline-block px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                      Docs & Links
                    </span>
                    <div className="flex flex-col gap-2 mt-3">
                      {selectedIdea.docs.split('•').filter(Boolean).map((doc, idx) => {
                        const title = doc.split('-')[0]?.trim() || `Resource ${idx + 1}`;
                        const urlMatch = doc.match(/https?:\/\/[^\s]+/);
                        let url = urlMatch ? urlMatch[0] : null;
                        
                        if (!url) {
                          const searchTerm = title.replace(/Documentation|Guide|Docs/gi, '').trim();
                          url = `https://www.google.com/search?q=${encodeURIComponent(searchTerm + ' documentation')}`;
                        }
                        
                        return (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] hover:bg-[#252525] text-slate-400 hover:text-blue-400 text-sm rounded-lg transition-colors border border-[#2a2a2a] group"
                          >
                            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            <span className="flex-1">{title}</span>
                            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
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
