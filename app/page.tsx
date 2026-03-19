"use client";

import { Github, ArrowRight, Sparkles, Rocket, Brain, Zap } from "lucide-react";
import Link from "next/link";
import { FocusLockLogo } from "@/components/FocusLockLogo";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100">
      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-40">
              <FocusLockLogo className="w-full h-auto" />
            </div>
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

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* ── Hero Section ────────────────────────────────────────────────── */}
        <section className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 mb-8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-300">AI-Powered Daily Ideas</span>
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
                <div key={feature.title} className="p-8 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
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
                <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 text-center">
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
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 py-12 mt-20 bg-slate-950/50">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-slate-500">
          © 2026 FocusLock. Serverless. Open source. Daily ideas.
        </div>
      </footer>
    </div>
  );
}
