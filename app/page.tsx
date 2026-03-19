"use client";

import { Zap, Github, ArrowRight, Sparkles, Rocket, Brain } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">FocusLock</span>
          </Link>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero Section ────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 py-20 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 mb-8">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">AI-Powered Project Ideas</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              One Idea.
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Every Day.
              </span>
            </h1>

            <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto">
              Get a fresh project idea delivered daily. Real problems. Shippable solutions. Exact tech stack. No fluff.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/dashboard"
                className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                Explore Ideas
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-semibold transition-colors flex items-center gap-2"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {[
                { value: "365+", label: "Ideas Generated" },
                { value: "15", label: "Problem Domains" },
                { value: "Daily", label: "Fresh Ideas" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Section ────────────────────────────────────────────── */}
        <section className="border-t border-slate-800 py-20 sm:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Why FocusLock?</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Designed for builders who want real problems to solve, not generic prompts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "AI-Powered",
                  description: "Powered by Ollama and phi3:mini. Runs locally on GitHub Actions—no external API calls.",
                },
                {
                  icon: Zap,
                  title: "Daily Delivery",
                  description: "One fresh idea every day at 10 AM EAT, delivered straight to your Telegram.",
                },
                {
                  icon: Rocket,
                  title: "Shippable",
                  description: "Every idea includes exact tech stack, deployment strategy, and market potential.",
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="p-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── How It Works ────────────────────────────────────────────────── */}
        <section className="border-t border-slate-800 py-20 sm:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-slate-400 text-lg">Simple, automated, and serverless.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Pick Domain", desc: "Random problem domain selected" },
                { step: "2", title: "Generate", desc: "AI creates idea with context" },
                { step: "3", title: "Send", desc: "Delivered to Telegram instantly" },
                { step: "4", title: "Archive", desc: "Saved to git history" },
              ].map((item) => (
                <div key={item.step} className="relative">
                  <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-4">
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
          </div>
        </section>

        {/* ── CTA Section ─────────────────────────────────────────────────── */}
        <section className="border-t border-slate-800 py-20 sm:py-32">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to get inspired?</h2>
            <p className="text-slate-400 text-lg mb-8">Start exploring ideas or set up your own Telegram bot.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
              >
                View All Ideas
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-semibold transition-colors"
              >
                Fork on GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 py-12 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-slate-500 mb-4 sm:mb-0">
              © 2026 FocusLock. Serverless. Open source. Daily ideas.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors text-sm">
                GitHub
              </a>
              <a href="/dashboard" className="text-slate-500 hover:text-slate-300 transition-colors text-sm">
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
