"use client";

import { Zap, Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-mono" style={{
      backgroundImage: `
        radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.08) 0%, transparent 50%)
      `
    }}>
      {/* CRT Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px)',
      }} />

      {/* Animated grid background */}
      <div className="fixed inset-0 -z-10 opacity-5" style={{
        backgroundImage: `
          linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent)
        `,
        backgroundSize: '60px 60px'
      }} />

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 border-b border-cyan-500/30 bg-black/60 backdrop-blur-xl" style={{
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.2), inset 0 1px 0 rgba(0, 255, 255, 0.1)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center relative" style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 255, 255, 0.1))',
              border: '2px solid rgba(0, 255, 255, 0.6)',
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.8), inset 0 0 10px rgba(0, 255, 255, 0.3)'
            }}>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="font-bold text-lg tracking-widest text-cyan-400" style={{
              textShadow: '0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.4)'
            }}>
              FOCUSLOCK
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-cyan-300/70 hover:text-cyan-400 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <Link href="/dashboard" className="px-4 py-2 text-cyan-400 font-bold uppercase tracking-widest text-sm" style={{
              border: '1px solid rgba(0, 255, 255, 0.6)',
              background: 'rgba(0, 255, 255, 0.05)',
              boxShadow: '0 0 10px rgba(0, 255, 255, 0.3), inset 0 0 5px rgba(0, 255, 255, 0.1)',
              textShadow: '0 0 8px rgba(0, 255, 255, 0.6)'
            }} className="rounded-sm hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
              DASHBOARD
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* ── Hero Section ────────────────────────────────────────────────── */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center py-20">
          {/* Logo/Icon */}
          <div className="mb-12 animate-pulse" style={{
            animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}>
            <div className="w-24 h-24 flex items-center justify-center mx-auto" style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 255, 255, 0.1))',
              border: '2px solid rgba(0, 255, 255, 0.6)',
              boxShadow: '0 0 30px rgba(0, 255, 255, 0.8), inset 0 0 20px rgba(0, 255, 255, 0.3)'
            }} className="rounded-sm">
              <Zap className="w-12 h-12 text-cyan-400" style={{filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))'}} />
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-7xl sm:text-8xl font-bold text-cyan-400 mb-6 tracking-widest uppercase max-w-4xl" style={{
            textShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4)'
          }}>
            FOCUSLOCK
          </h1>

          {/* Subheading */}
          <p className="text-cyan-300/70 text-lg sm:text-xl mb-4 font-mono max-w-2xl">
            &gt; Futuristic Sci-Fi Project Idea Engine
          </p>

          {/* Description */}
          <p className="text-cyan-200/60 text-base sm:text-lg mb-12 font-mono max-w-3xl leading-relaxed">
            One AI-generated project idea delivered daily. Real problems. Shippable solutions. Exact tech stack. Zero fluff.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Link href="/dashboard" className="px-8 py-3 text-cyan-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2" style={{
              border: '2px solid rgba(0, 255, 255, 0.6)',
              background: 'rgba(0, 255, 255, 0.05)',
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.4), inset 0 0 10px rgba(0, 255, 255, 0.1)',
              textShadow: '0 0 8px rgba(0, 255, 255, 0.6)'
            }} className="rounded-sm hover:shadow-lg hover:shadow-cyan-500/60 transition-all">
              EXPLORE IDEAS
              <ExternalLink className="w-4 h-4" />
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="px-8 py-3 text-pink-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2" style={{
              border: '2px solid rgba(255, 0, 255, 0.6)',
              background: 'rgba(255, 0, 255, 0.05)',
              boxShadow: '0 0 15px rgba(255, 0, 255, 0.4), inset 0 0 10px rgba(255, 0, 255, 0.1)',
              textShadow: '0 0 8px rgba(255, 0, 255, 0.6)'
            }} className="rounded-sm hover:shadow-lg hover:shadow-pink-500/60 transition-all">
              GITHUB
              <Github className="w-4 h-4" />
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl">
            {[
              { value: "365+", label: "IDEAS" },
              { value: "15", label: "DOMAINS" },
              { value: "DAILY", label: "DELIVERY" },
            ].map((stat) => (
              <div key={stat.label} style={{
                border: '1px solid rgba(0, 255, 255, 0.4)',
                background: 'rgba(0, 255, 255, 0.03)',
                boxShadow: '0 0 15px rgba(0, 255, 255, 0.2), inset 0 0 10px rgba(0, 255, 255, 0.05)'
              }} className="p-6 rounded-sm">
                <p className="text-2xl font-bold text-cyan-400 mb-1" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.8)'}}>
                  {stat.value}
                </p>
                <p className="text-xs text-cyan-300/60 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features Section ────────────────────────────────────────────── */}
        <section className="py-20 border-t border-cyan-500/30" style={{
          boxShadow: 'inset 0 1px 0 rgba(0, 255, 255, 0.1)'
        }}>
          <div className="mb-16 text-center" style={{borderLeft: '3px solid rgba(0, 255, 255, 0.6)', paddingLeft: '20px', marginLeft: 'auto', marginRight: 'auto', maxWidth: '600px'}}>
            <h2 className="text-4xl font-bold text-cyan-400 mb-4 tracking-widest uppercase" style={{
              textShadow: '0 0 20px rgba(0, 255, 255, 0.8)'
            }}>
              FEATURES
            </h2>
            <p className="text-cyan-300/70 font-mono text-sm">
              &gt; Serverless. AI-Powered. Open Source.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-POWERED",
                desc: "Powered by Ollama and phi3:mini. Runs locally on GitHub Actions—no external API calls."
              },
              {
                title: "DAILY DELIVERY",
                desc: "One fresh idea every day at 10 AM EAT, delivered straight to your Telegram."
              },
              {
                title: "SHIPPABLE",
                desc: "Every idea includes exact tech stack, deployment strategy, and market potential."
              },
            ].map((feature) => (
              <div
                key={feature.title}
                style={{
                  border: '2px solid rgba(0, 255, 255, 0.4)',
                  background: 'rgba(0, 255, 255, 0.03)',
                  boxShadow: '0 0 15px rgba(0, 255, 255, 0.2), inset 0 0 10px rgba(0, 255, 255, 0.05)'
                }}
                className="p-8 rounded-sm hover:shadow-lg hover:shadow-cyan-500/40 transition-all group"
              >
                <h3 className="text-lg font-bold text-cyan-400 mb-3 uppercase tracking-widest group-hover:text-cyan-300 transition-all" style={{textShadow: '0 0 8px rgba(0, 255, 255, 0.6)'}}>
                  {feature.title}
                </h3>
                <p className="text-cyan-200/70 text-sm leading-relaxed font-mono">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works ────────────────────────────────────────────────── */}
        <section className="py-20 border-t border-cyan-500/30" style={{
          boxShadow: 'inset 0 1px 0 rgba(0, 255, 255, 0.1)'
        }}>
          <div className="mb-16 text-center" style={{borderLeft: '3px solid rgba(0, 255, 255, 0.6)', paddingLeft: '20px', marginLeft: 'auto', marginRight: 'auto', maxWidth: '600px'}}>
            <h2 className="text-4xl font-bold text-cyan-400 mb-4 tracking-widest uppercase" style={{
              textShadow: '0 0 20px rgba(0, 255, 255, 0.8)'
            }}>
              HOW IT WORKS
            </h2>
            <p className="text-cyan-300/70 font-mono text-sm">
              &gt; Simple. Automated. Serverless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "01", title: "PICK DOMAIN", desc: "Random problem domain selected" },
              { step: "02", title: "GENERATE", desc: "AI creates idea with context" },
              { step: "03", title: "SEND", desc: "Delivered to Telegram instantly" },
              { step: "04", title: "ARCHIVE", desc: "Saved to git history" },
            ].map((item) => (
              <div key={item.step} style={{
                border: '1px solid rgba(0, 255, 255, 0.4)',
                background: 'rgba(0, 255, 255, 0.03)',
                boxShadow: '0 0 10px rgba(0, 255, 255, 0.15), inset 0 0 8px rgba(0, 255, 255, 0.03)'
              }} className="p-6 rounded-sm text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-3" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.8)'}}>
                  {item.step}
                </div>
                <h3 className="font-bold text-cyan-400 mb-2 uppercase tracking-widest text-sm">{item.title}</h3>
                <p className="text-xs text-cyan-300/60 font-mono">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Section ─────────────────────────────────────────────────── */}
        <section className="py-20 border-t border-cyan-500/30 text-center" style={{
          boxShadow: 'inset 0 1px 0 rgba(0, 255, 255, 0.1)'
        }}>
          <h2 className="text-4xl font-bold text-cyan-400 mb-6 tracking-widest uppercase" style={{
            textShadow: '0 0 20px rgba(0, 255, 255, 0.8)'
          }}>
            READY TO EXPLORE?
          </h2>
          <p className="text-cyan-300/70 text-lg mb-8 font-mono max-w-2xl mx-auto">
            &gt; Start exploring ideas or set up your own Telegram bot.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/dashboard" className="px-8 py-3 text-cyan-400 font-bold uppercase tracking-widest text-sm" style={{
              border: '2px solid rgba(0, 255, 255, 0.6)',
              background: 'rgba(0, 255, 255, 0.05)',
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.4), inset 0 0 10px rgba(0, 255, 255, 0.1)',
              textShadow: '0 0 8px rgba(0, 255, 255, 0.6)'
            }} className="rounded-sm hover:shadow-lg hover:shadow-cyan-500/60 transition-all">
              VIEW ALL IDEAS
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="px-8 py-3 text-pink-400 font-bold uppercase tracking-widest text-sm" style={{
              border: '2px solid rgba(255, 0, 255, 0.6)',
              background: 'rgba(255, 0, 255, 0.05)',
              boxShadow: '0 0 15px rgba(255, 0, 255, 0.4), inset 0 0 10px rgba(255, 0, 255, 0.1)',
              textShadow: '0 0 8px rgba(255, 0, 255, 0.6)'
            }} className="rounded-sm hover:shadow-lg hover:shadow-pink-500/60 transition-all">
              FORK ON GITHUB
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-cyan-500/30 py-8 relative z-10 bg-black/40" style={{
        boxShadow: 'inset 0 1px 0 rgba(0, 255, 255, 0.1)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between font-mono text-xs">
            <p className="text-cyan-300/50 mb-4 sm:mb-0">
              &copy; 2026 FOCUSLOCK | SERVERLESS | OPEN SOURCE
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-cyan-300/50 hover:text-cyan-400 transition-colors">
                [GITHUB]
              </a>
              <a href="/dashboard" className="text-cyan-300/50 hover:text-cyan-400 transition-colors">
                [DASHBOARD]
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
