"use client";

import { useEffect, useState } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  color: string;
}

const navItems: NavItem[] = [
  { id: "stats", label: "Stats", icon: "📊", color: "#a78bfa" },
  { id: "latest", label: "Latest", icon: "✨", color: "#60a5fa" },
  { id: "ideas", label: "Ideas", icon: "💡", color: "#34d399" },
];

export function AnimatedNav() {
  const [activeSection, setActiveSection] = useState("stats");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => {
        const element = document.getElementById(item.id);
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return {
          id: item.id,
          distance: Math.abs(rect.top - window.innerHeight / 2),
        };
      });

      const closest = sections
        .filter((s) => s !== null)
        .reduce((prev, current) =>
          current && prev && current.distance < prev.distance ? current : prev
        );

      if (closest) {
        setActiveSection(closest.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-8">
      {navItems.map((item, index) => {
        const isActive = activeSection === item.id;
        const isHovered = hoveredItem === item.id;

        return (
          <div key={item.id} className="relative group">
            {/* Animated SVG background */}
            <svg
              className="absolute inset-0 w-16 h-16 -z-10"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer ring - animated */}
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke={item.color}
                strokeWidth="1.5"
                opacity={isActive ? 1 : 0.3}
                className={`transition-all duration-300 ${
                  isActive ? "animate-pulse" : ""
                }`}
                style={{
                  filter: isActive ? `drop-shadow(0 0 8px ${item.color})` : "",
                }}
              />

              {/* Inner animated hexagon */}
              <g
                className={`transition-all duration-300 ${
                  isHovered ? "animate-spin" : ""
                }`}
                style={{
                  animationDuration: isHovered ? "3s" : "0s",
                  transformOrigin: "32px 32px",
                }}
              >
                <path
                  d="M 32 8 L 48 16 L 48 40 L 32 48 L 16 40 L 16 16 Z"
                  stroke={item.color}
                  strokeWidth="1.5"
                  fill="none"
                  opacity={isActive ? 0.8 : 0.4}
                  className="transition-all duration-300"
                />
              </g>

              {/* Center glow circle */}
              <circle
                cx="32"
                cy="32"
                r="12"
                fill={item.color}
                opacity={isActive ? 0.2 : 0.05}
                className="transition-all duration-300"
              />

              {/* Animated dots */}
              {[0, 120, 240].map((angle) => {
                const rad = (angle * Math.PI) / 180;
                const x = 32 + 20 * Math.cos(rad);
                const y = 32 + 20 * Math.sin(rad);
                return (
                  <circle
                    key={angle}
                    cx={x}
                    cy={y}
                    r="1.5"
                    fill={item.color}
                    opacity={isActive ? 0.8 : 0.3}
                    className={`transition-all duration-300 ${
                      isActive ? "animate-pulse" : ""
                    }`}
                    style={{
                      animationDelay: `${angle / 120 * 0.3}s`,
                    }}
                  />
                );
              })}
            </svg>

            {/* Button */}
            <button
              onClick={() => scrollToSection(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/50 shadow-lg shadow-purple-500/20"
                  : "bg-gray-900/40 border border-gray-800 hover:border-gray-700"
              }`}
              title={item.label}
            >
              <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </span>

              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {item.label}
              </div>
            </button>

            {/* Connection line to active section */}
            {isActive && (
              <div
                className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b transition-all duration-300"
                style={{
                  top: "100%",
                  height: index < navItems.length - 1 ? "32px" : "0px",
                  background: `linear-gradient(to bottom, ${item.color}, transparent)`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
