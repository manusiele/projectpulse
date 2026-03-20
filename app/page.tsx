"use client";

import Link from "next/link";
import { FocusLockLogo } from "@/components/FocusLockLogo";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="border-b border-[#2a2a2a]/50 bg-[#1a1a1a]/30 backdrop-blur-xl sticky top-0 z-40 relative">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-40">
              <FocusLockLogo className="w-full h-auto" />
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-blue-600/90 hover:bg-blue-600 backdrop-blur-xl text-white font-medium transition-all hover:shadow-lg hover:shadow-blue-500/30">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        {/* ── Hero Section ────────────────────────────────────────────────── */}
        <section className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a]/20 border border-[#2a2a2a]/30 backdrop-blur-2xl mb-8 shadow-lg shadow-blue-500/10">
            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              <path d="M5 3v4" />
              <path d="M19 17v4" />
              <path d="M3 5h4" />
              <path d="M17 19h4" />
            </svg>
            <span className="text-sm text-slate-400">AI-Powered Daily Ideas</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            One Idea.
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Every Day.
            </span>
          </h1>

          <p className="text-lg text-slate-400 mb-10 leading-relaxed">
            Get a fresh project idea delivered daily. Real problems. Shippable solutions. Exact tech stack. No fluff.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3 rounded-xl bg-blue-600/90 hover:bg-blue-600 backdrop-blur-xl text-white font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </svg>
              Explore Ideas
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-xl border border-[#2a2a2a]/30 hover:border-slate-600 bg-[#1a1a1a]/20 backdrop-blur-2xl text-slate-300 hover:text-white font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/20 flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-3 gap-6 mb-20 max-w-2xl mx-auto">
          {[
            { value: "365+", label: "Ideas" },
            { value: "15", label: "Domains" },
            { value: "Daily", label: "Delivery" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* ── Features ────────────────────────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Why FocusLock?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
                  </svg>
                ),
                title: "AI-Powered",
                description: "Powered by Ollama and phi3:mini. Runs locally on GitHub Actions—no external API calls.",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                ),
                title: "Daily Delivery",
                description: "One fresh idea every day at 10 AM EAT, delivered straight to your Telegram.",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                  </svg>
                ),
                title: "Shippable",
                description: "Every idea includes exact tech stack, deployment strategy, and market potential.",
              },
            ].map((feature) => (
                <div key={feature.title} className="p-8 rounded-2xl bg-[#1a1a1a]/20 border border-[#2a2a2a]/30 hover:border-[#3a3a3a] backdrop-blur-2xl transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 group">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
          </div>
        </section>

        {/* ── How It Works ────────────────────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Pick Domain", desc: "Random problem domain selected" },
              { step: "2", title: "Generate", desc: "AI creates idea with context" },
              { step: "3", title: "Send", desc: "Delivered to Telegram instantly" },
              { step: "4", title: "Archive", desc: "Saved to git history" },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="p-6 rounded-2xl bg-[#1a1a1a]/20 border border-[#2a2a2a]/30 backdrop-blur-2xl text-center hover:shadow-lg hover:shadow-blue-500/10 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/90 backdrop-blur-xl text-white font-bold flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
                {item.step !== "4" && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-blue-500/40 to-transparent" />
                )}
              </div>
            ))}
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
              className="px-8 py-3 rounded-lg bg-blue-600/90 hover:bg-blue-600 backdrop-blur-xl text-white font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30"
            >
              View All Ideas
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg border border-[#2a2a2a]/30 hover:border-slate-600 bg-[#1a1a1a]/20 backdrop-blur-2xl text-slate-300 hover:text-white font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/20"
            >
              Fork on GitHub
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#2a2a2a]/30 py-12 mt-20 bg-[#1a1a1a]/20 backdrop-blur-2xl relative">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-slate-500">
          © 2026 FocusLock. Serverless. Open source. Daily ideas.
        </div>
      </footer>
    </div>
  );
}
