"use client";

import { Zap, Mail, Github, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ── Left Sidebar ─────────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-12 space-y-8">
              {/* Profile Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">FocusLock</h2>
                <p className="text-sm text-slate-400 mb-6">AI Project Ideas</p>

                {/* Contact Info */}
                <div className="space-y-4 text-left text-sm">
                  <div>
                    <p className="text-slate-500 uppercase text-xs font-semibold mb-1">Status</p>
                    <p className="text-slate-300">Active Daily</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase text-xs font-semibold mb-1">Ideas</p>
                    <p className="text-slate-300">365+ Generated</p>
                  </div>
                  <div>
                    <p className="text-slate-500 uppercase text-xs font-semibold mb-1">Domains</p>
                    <p className="text-slate-300">15 Categories</p>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href="/dashboard"
                  className="w-full mt-6 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                >
                  View Ideas
                </Link>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <a href="#about" className="block px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                  About
                </a>
                <a href="#features" className="block px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                  Features
                </a>
                <a href="#how" className="block px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                  How It Works
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                  GitHub
                </a>
              </nav>
            </div>
          </div>

          {/* ── Main Content ─────────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-12">
            {/* ── About Section ────────────────────────────────────────────── */}
            <section id="about" className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6 pb-4 border-b border-slate-800">About</h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  FocusLock is a zero-cost, serverless Telegram bot that delivers one AI-generated project idea per day. It runs entirely on GitHub Actions with no persistent server, using Ollama to run phi3:mini locally on the GitHub-hosted runner.
                </p>
                <p>
                  Every idea includes a brutally honest problem statement, exact tech stack, deployment strategy, and real market potential. No fluff. Just actionable insights for builders who want to ship real products.
                </p>
              </div>
            </section>

            {/* ── Features Section ─────────────────────────────────────────── */}
            <section id="features" className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6 pb-4 border-b border-slate-800">What It Does</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    title: "Daily Delivery",
                    desc: "One fresh idea every day at 10 AM EAT, delivered straight to your Telegram. Consistent, reliable, automated.",
                  },
                  {
                    title: "AI-Powered",
                    desc: "Powered by Ollama and phi3:mini. Runs locally on GitHub Actions—no external API calls, no vendor lock-in.",
                  },
                  {
                    title: "Shippable Ideas",
                    desc: "Every idea includes exact tech stack, deployment strategy, market potential, and why it matters right now.",
                  },
                  {
                    title: "Open Source",
                    desc: "Fully open source and serverless. Fork it, customize it, deploy it. No costs, no subscriptions.",
                  },
                ].map((feature) => (
                  <div key={feature.title}>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── How It Works ─────────────────────────────────────────────── */}
            <section id="how" className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6 pb-4 border-b border-slate-800">How It Works</h2>
              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Pick Domain",
                    desc: "A random problem domain is selected from 15 categories (SaaS, mobile, AI, DevTools, etc.)",
                  },
                  {
                    step: "2",
                    title: "Generate Idea",
                    desc: "AI generates a structured idea with problem statement, target audience, pain points, and market potential.",
                  },
                  {
                    step: "3",
                    title: "Send to Telegram",
                    desc: "The idea is formatted and delivered to your Telegram chat instantly.",
                  },
                  {
                    step: "4",
                    title: "Archive History",
                    desc: "All ideas are saved to git history for future reference and context.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-600 text-white font-semibold">
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Tech Stack ───────────────────────────────────────────────── */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6 pb-4 border-b border-slate-800">Tech Stack</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "Python",
                  "Ollama",
                  "GitHub Actions",
                  "Telegram Bot API",
                  "JSON",
                  "Git",
                  "Next.js",
                  "React",
                  "Tailwind CSS",
                ].map((tech) => (
                  <div key={tech} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-center text-slate-300">
                    {tech}
                  </div>
                ))}
              </div>
            </section>

            {/* ── CTA Section ──────────────────────────────────────────────── */}
            <section className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to explore?</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Start browsing daily project ideas or set up your own Telegram bot to receive ideas directly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
                >
                  View All Ideas
                </Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg border border-white text-white font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <Github className="w-5 h-5" />
                  Fork on GitHub
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
