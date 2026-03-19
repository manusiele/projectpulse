"use client";

import { useState } from "react";
import {
  Zap,
  LayoutDashboard,
  Heart,
  History,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true },
  { icon: Heart,           label: "Saved Ideas", href: "#" },
  { icon: History,         label: "History",     href: "#" },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);

  const panel = (
    <div className="flex flex-col h-full">
      {/* ── Brand ───────────────────────────────────────────────── */}
      <div className="relative flex items-center gap-3 h-[57px] px-5 border-b border-zinc-800 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/25 flex-shrink-0">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-zinc-50 leading-none tracking-tight">
            FocusLock
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5 leading-none">
            AI Idea Engine
          </p>
        </div>
        {/* Close button – mobile only */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 md:hidden text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 px-3 pb-2">
          Menu
        </p>
        {NAV_ITEMS.map(({ icon: Icon, label, href, active }) => (
          <a
            key={label}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? "bg-violet-500/10 text-violet-300 border border-violet-500/20"
                : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/70"
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </a>
        ))}
      </nav>

      {/* ── Bottom status ────────────────────────────────────────── */}
      <div className="px-3 pb-5 pt-3 border-t border-zinc-800 space-y-1.5 flex-shrink-0">
        {/* Live status */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/[0.15]">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs text-emerald-400 font-medium truncate">
            Bot active · 10 AM EAT
          </span>
        </div>

        {/* GitHub link */}
        <a
          href="https://github.com/manusiele/focuslock-ai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/70 rounded-lg transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
          View on GitHub
        </a>

        {/* Telegram */}
        <a
          href="https://t.me/focuslock_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/70 rounded-lg transition-colors"
        >
          <Zap className="w-3.5 h-3.5 flex-shrink-0" />
          @focuslock_bot
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger (fixed, shown only on small screens) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-3.5 left-4 z-50 md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
        aria-label="Open sidebar"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-zinc-900 border-r border-zinc-800
          transform transition-transform duration-200 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {panel}
      </aside>
    </>
  );
}
