"use client";

export function FocusLockLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 60"
      className={`${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>{`
          @keyframes letterSlide {
            0% {
              opacity: 0;
              transform: translateX(-10px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes underlineGrow {
            0% {
              width: 0;
              opacity: 0;
            }
            100% {
              width: 100%;
              opacity: 1;
            }
          }
          
          @keyframes glowPulse {
            0%, 100% {
              filter: drop-shadow(0 0 2px rgba(59, 130, 246, 0.3));
            }
            50% {
              filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
            }
          }
          
          .focus-lock-text {
            font-family: 'Inter', 'Helvetica Neue', sans-serif;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.5px;
            fill: white;
          }
          
          .focus-lock-letter {
            animation: letterSlide 0.6s ease-out forwards;
          }
          
          .focus-lock-letter:nth-child(1) { animation-delay: 0s; }
          .focus-lock-letter:nth-child(2) { animation-delay: 0.05s; }
          .focus-lock-letter:nth-child(3) { animation-delay: 0.1s; }
          .focus-lock-letter:nth-child(4) { animation-delay: 0.15s; }
          .focus-lock-letter:nth-child(5) { animation-delay: 0.2s; }
          .focus-lock-letter:nth-child(6) { animation-delay: 0.25s; }
          .focus-lock-letter:nth-child(7) { animation-delay: 0.3s; }
          .focus-lock-letter:nth-child(8) { animation-delay: 0.35s; }
          .focus-lock-letter:nth-child(9) { animation-delay: 0.4s; }
          
          .focus-lock-underline {
            animation: underlineGrow 0.8s ease-out 0.3s forwards;
            opacity: 0;
          }
          
          .focus-lock-container {
            animation: glowPulse 3s ease-in-out infinite;
          }
        `}</style>
      </defs>

      <g className="focus-lock-container">
        {/* F */}
        <text x="0" y="40" className="focus-lock-text focus-lock-letter">
          F
        </text>

        {/* o */}
        <text x="22" y="40" className="focus-lock-text focus-lock-letter">
          o
        </text>

        {/* c */}
        <text x="40" y="40" className="focus-lock-text focus-lock-letter">
          c
        </text>

        {/* u */}
        <text x="56" y="40" className="focus-lock-text focus-lock-letter">
          u
        </text>

        {/* s */}
        <text x="72" y="40" className="focus-lock-text focus-lock-letter">
          s
        </text>

        {/* L */}
        <text x="92" y="40" className="focus-lock-text focus-lock-letter">
          L
        </text>

        {/* o */}
        <text x="112" y="40" className="focus-lock-text focus-lock-letter">
          o
        </text>

        {/* c */}
        <text x="130" y="40" className="focus-lock-text focus-lock-letter">
          c
        </text>

        {/* k */}
        <text x="146" y="40" className="focus-lock-text focus-lock-letter">
          k
        </text>

        {/* Animated underline */}
        <line
          x1="0"
          y1="48"
          x2="160"
          y2="48"
          stroke="url(#gradientUnderline)"
          strokeWidth="2"
          className="focus-lock-underline"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradientUnderline" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(59, 130, 246)" stopOpacity="1" />
            <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </g>
    </svg>
  );
}
