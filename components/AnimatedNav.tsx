"use client";

import { useEffect, useState } from "react";

interface NavItem {
  id: string;
  label: string;
  color: string;
}

const navItems: NavItem[] = [
  { id: "stats", label: "Stats", color: "#a78bfa" },
  { id: "latest", label: "Latest", color: "#60a5fa" },
  { id: "ideas", label: "Ideas", color: "#34d399" },
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
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-6">
      {navItems.map((item) => {
        const isActive = activeSection === item.id;

        return (
          <div key={item.id} className="relative group">
            {/* Animated SVG - smaller and cleaner */}
            <button
              onClick={() => scrollToSection(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/50 shadow-lg shadow-purple-500/20"
                  : "bg-gray-900/40 border border-gray-800 hover:border-gray-700"
              }`}
              title={item.label}
            >
              {/* Animated SVG inside button */}
              <svg
                className="w-5 h-5"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer rotating ring */}
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke={item.color}
                  strokeWidth="1"
                  opacity={isActive ? 1 : 0.4}
                  className={`transition-all duration-300 ${
                    isActive ? "animate-spin" : ""
                  }`}
                  style={{
                    animationDuration: "4s",
                    transformOrigin: "20px 20px",
                  }}
                />

                {/* Inner pulsing circle */}
                <circle
                  cx="20"
                  cy="20"
                  r="8"
                  stroke={item.color}
                  strokeWidth="1"
                  fill="none"
                  opacity={isActive ? 0.8 : 0.3}
                  className={`transition-all duration-300 ${
                    isActive ? "animate-pulse" : ""
                  }`}
                />

                {/* Center dot */}
                <circle
                  cx="20"
                  cy="20"
                  r="2"
                  fill={item.color}
                  opacity={isActive ? 1 : 0.5}
                  className="transition-all duration-300"
                />

                {/* Animated orbiting dots */}
                {isActive &&
                  [0, 120, 240].map((angle) => {
                    const rad = (angle * Math.PI) / 180;
                    const x = 20 + 10 * Math.cos(rad);
                    const y = 20 + 10 * Math.sin(rad);
                    return (
                      <circle
                        key={angle}
                        cx={x}
                        cy={y}
                        r="1"
                        fill={item.color}
                        className="animate-pulse"
                        style={{
                          animationDelay: `${(angle / 120) * 0.3}s`,
                        }}
                      />
                    );
                  })}
              </svg>

              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-2 py-1 rounded-lg bg-gray-900 border border-gray-800 text-xs text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {item.label}
              </div>
            </button>

            {/* Connection line to active section */}
            {isActive && (
              <div
                className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b transition-all duration-300"
                style={{
                  top: "100%",
                  height: index < navItems.length - 1 ? "24px" : "0px",
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
