"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Brain, Zap, Rocket, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [stats, setStats] = useState({
    totalIdeas: "27",
    domains: "15",
    delivery: "Daily"
  });

  useEffect(() => {
    // Capture the install prompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Check if already installed
      if (window.matchMedia('(display-mode: standalone)').matches) {
        alert('App is already installed!');
      } else {
        alert('Install not available. Try visiting from your browser menu (Add to Home Screen).');
      }
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
  };

  useEffect(() => {
    // Fetch actual stats from API
    async function fetchStats() {
      try {
        const response = await fetch('/api/ideas');
        if (response.ok) {
          const ideas = await response.json();
          const uniqueDomains = new Set(ideas.map((idea: { domain: string }) => idea.domain).filter(Boolean));
          setStats({
            totalIdeas: ideas.length.toString(),
            domains: uniqueDomains.size.toString(),
            delivery: "Daily"
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    }
    fetchStats();
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ProjectPulse",
    "description": "Daily AI-powered project idea engine for developers. Get one shippable project idea with problem statement, tech stack, and deployment guide every day.",
    "url": "https://projectpulse-dev.vercel.app",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "ProjectPulse"
    },
    "featureList": [
      "Daily AI-generated project ideas",
      "Problem statements with real pain points",
      "Complete tech stack recommendations",
      "Deployment guides",
      "Project inspiration for developers"
    ]
  };

  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] text-slate-100 relative overflow-hidden">
      {/* Refined animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[100px] animate-float-reverse" />
        
        {/* Minimal grid */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="border-b border-white/5 bg-black/20 backdrop-blur-2xl sticky top-0 z-40 relative">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
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
          </Link>
          <div className="flex items-center gap-3">
            <a href="https://github.com/manusiele/projectpulse" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors duration-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <button
              onClick={handleInstall}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-xl text-slate-300 hover:text-white text-sm font-medium transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Install</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        {/* ── Hero Section ────────────────────────────────────────────────── */}
        <section className="text-center max-w-4xl mx-auto mb-24 pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8">
            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              <path d="M5 3v4" />
              <path d="M19 17v4" />
              <path d="M3 5h4" />
              <path d="M17 19h4" />
            </svg>
            <span className="text-sm text-slate-400 font-medium">AI-Powered Daily Ideas</span>
          </div>

          <h1 className="text-6xl sm:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            One Idea.
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Every Day.
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            Get a fresh project idea delivered daily. Real problems. Shippable solutions. Exact tech stack. No fluff.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold transition-all duration-200 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.02] flex items-center gap-2"
            >
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </svg>
              Explore Ideas
            </Link>
            <a
              href="https://github.com/manusiele/projectpulse"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 backdrop-blur-xl text-slate-300 hover:text-white font-semibold transition-all duration-200 hover:bg-white/10 flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-3 gap-8 mb-32 max-w-3xl mx-auto">
          {[
            { value: stats.totalIdeas, label: "Ideas", sublabel: "Generated" },
            { value: stats.domains, label: "Domains", sublabel: "Covered" },
            { value: stats.delivery, label: "Delivery", sublabel: "Schedule" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200">
              <p className={`text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent ${
                stat.label === "Delivery" 
                  ? "font-['Brush_Script_MT','Segoe_Script','Lucida_Handwriting','cursive'] tracking-wide" 
                  : ""
              }`}>{stat.value}</p>
              <p className="text-sm font-semibold text-white mb-1">{stat.label}</p>
              <p className="text-xs text-slate-500">{stat.sublabel}</p>
            </div>
          ))}
        </section>

        {/* ── Features ────────────────────────────────────────────────────── */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why ProjectPulse?</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Everything you need to turn inspiration into action</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Brain,
                title: "AI-Powered",
                description: "Powered by Ollama and phi3:mini. Runs locally on GitHub Actions—no external API calls.",
                gradient: "from-blue-500/10 to-blue-600/5",
                iconColor: "text-blue-400",
                borderColor: "border-blue-500/20"
              },
              {
                icon: Zap,
                title: "Daily Delivery",
                description: "One fresh idea every day at 10 AM EAT, delivered straight to your Telegram.",
                gradient: "from-cyan-500/10 to-cyan-600/5",
                iconColor: "text-cyan-400",
                borderColor: "border-cyan-500/20"
              },
              {
                icon: Rocket,
                title: "Shippable",
                description: "Every idea includes exact tech stack, deployment strategy, and market potential.",
                gradient: "from-purple-500/10 to-purple-600/5",
                iconColor: "text-purple-400",
                borderColor: "border-purple-500/20"
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title} 
                  className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} border ${feature.borderColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} strokeWidth={2} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── How It Works ────────────────────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-16 text-center">How It Works</h2>
          <div className="max-w-5xl mx-auto px-4">
            <div className="relative">
              {/* Connecting line with dots - desktop only */}
              <div className="hidden md:block absolute top-[35px] left-0 right-0 h-[2px] pointer-events-none" style={{ zIndex: 0 }}>
                {/* Gradient line */}
                <div className="absolute left-[12.5%] right-[12.5%] h-full bg-gradient-to-r from-blue-500/50 via-cyan-500/50 via-purple-500/50 to-pink-500/50" />
                {/* Dots */}
                <div className="absolute left-[12.5%] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
                <div className="absolute left-[37.5%] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-500" />
                <div className="absolute left-[62.5%] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-500" />
                <div className="absolute left-[87.5%] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-pink-500" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative" style={{ zIndex: 1 }}>
                {[
                  { 
                    title: "GitHub Actions", 
                    desc: "Workflow triggers daily at 10 AM EAT",
                    icon: (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                    ),
                    bgColor: "from-blue-900/40 to-blue-950/40",
                    borderColor: "border-blue-500/30",
                    iconColor: "text-blue-400"
                  },
                  { 
                    title: "AI Generation", 
                    desc: "Ollama creates idea from random domain",
                    icon: (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                      </svg>
                    ),
                    bgColor: "from-cyan-900/40 to-cyan-950/40",
                    borderColor: "border-cyan-500/30",
                    iconColor: "text-cyan-400"
                  },
                  { 
                    title: "Telegram Send", 
                    desc: "Formatted message delivered instantly",
                    icon: (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                      </svg>
                    ),
                    bgColor: "from-purple-900/40 to-purple-950/40",
                    borderColor: "border-purple-500/30",
                    iconColor: "text-purple-400"
                  },
                  { 
                    title: "Git Archive", 
                    desc: "Saved to repo as permanent history",
                    icon: (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    ),
                    bgColor: "from-pink-900/40 to-pink-950/40",
                    borderColor: "border-pink-500/30",
                    iconColor: "text-pink-400"
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center">
                    {/* Icon box */}
                    <div className={`w-[70px] h-[70px] rounded-2xl bg-gradient-to-br ${item.bgColor} border ${item.borderColor} backdrop-blur-xl flex items-center justify-center mb-6 transition-transform hover:scale-105`}>
                      <div className={item.iconColor}>
                        {item.icon}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-white mb-2 text-base">{item.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to get inspired?</h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Start exploring ideas or set up your own Telegram bot to receive ideas directly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30"
            >
              View All Ideas
            </Link>
            <a
              href="https://github.com/manusiele/projectpulse"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-xl border border-[#2a2a2a]/30 hover:border-slate-600 bg-[#1a1a1a]/20 backdrop-blur-xl text-slate-300 hover:text-white font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/20"
            >
              Fork on GitHub
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 mt-32 bg-black/20 backdrop-blur-2xl relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-slate-500 mb-3">
                © 2026 ProjectPulse. Serverless. Open source. Daily ideas.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-500">
                <Link href="/privacy" className="hover:text-blue-400 transition-colors duration-200">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-blue-400 transition-colors duration-200">
                  Terms of Service
                </Link>
                <span>•</span>
                <Link href="/about" className="hover:text-blue-400 transition-colors duration-200">
                  About
                </Link>
                <span>•</span>
                <a 
                  href="https://manusiele-4efb8.web.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Developer
                </a>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a 
                href="https://github.com/manusiele/projectpulse" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Install Prompt */}
      <InstallPrompt />
    </div>
    </>
  );
}
