"use client";

export function FocusLockLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 100"
      className={`${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>{`
          @keyframes glowPulse {
            0%, 100% {
              filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.4));
            }
            50% {
              filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.8));
            }
          }
          
          @keyframes slideIn {
            0% {
              opacity: 0;
              transform: translateX(-20px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes scaleIn {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes rotatePulse {
            0%, 100% {
              transform: rotate(0deg);
            }
            50% {
              transform: rotate(3deg);
            }
          }
          
          .logo-container {
            animation: glowPulse 3s ease-in-out infinite;
          }
          
          .logo-text {
            animation: slideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
          
          .logo-accent {
            animation: scaleIn 0.6s ease-out forwards;
          }
          
          .logo-icon {
            animation: rotatePulse 4s ease-in-out infinite;
          }
        `}</style>
        
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgb(255, 255, 255)" />
          <stop offset="100%" stopColor="rgb(226, 232, 240)" />
        </linearGradient>
        
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(59, 130, 246)" />
          <stop offset="100%" stopColor="rgb(6, 182, 212)" />
        </linearGradient>
      </defs>

      <g className="logo-container">
        {/* Decorative background circle */}
        <circle cx="35" cy="50" r="32" fill="none" stroke="url(#accentGradient)" strokeWidth="1.5" opacity="0.3" />
        
        {/* Lock icon - stylized */}
        <g className="logo-icon" transform="translate(35, 50)">
          {/* Lock body */}
          <rect x="-12" y="-8" width="24" height="20" rx="3" fill="none" stroke="url(#accentGradient)" strokeWidth="2.5" />
          
          {/* Lock shackle */}
          <path d="M -8 -8 Q -8 -18 0 -18 Q 8 -18 8 -8" fill="none" stroke="url(#accentGradient)" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Lock keyhole */}
          <circle cx="0" cy="2" r="2.5" fill="url(#accentGradient)" />
          <rect x="-1.5" y="5" width="3" height="6" fill="url(#accentGradient)" />
        </g>

        {/* Main text - FocusLock */}
        <g className="logo-text">
          {/* F */}
          <path d="M 75 35 L 75 65 M 75 35 L 95 35 M 75 48 L 92 48" fill="none" stroke="url(#textGradient)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* o */}
          <circle cx="110" cy="50" r="15" fill="none" stroke="url(#textGradient)" strokeWidth="3.5" />
          
          {/* c */}
          <path d="M 140 35 Q 125 35 125 50 Q 125 65 140 65" fill="none" stroke="url(#textGradient)" strokeWidth="3.5" strokeLinecap="round" />
          
          {/* u */}
          <path d="M 155 35 L 155 55 Q 155 65 165 65 L 175 65 L 175 35" fill="none" stroke="url(#textGradient)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* s */}
          <path d="M 200 38 Q 190 38 190 45 Q 190 50 200 52 Q 210 54 210 62 Q 210 65 200 65" fill="none" stroke="url(#textGradient)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* L */}
          <path d="M 225 35 L 225 65 L 245 65" fill="none" stroke="url(#textGradient)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* o */}
          <circle cx="260" cy="50" r="15" fill="none" stroke="url(#textGradient)" strokeWidth="3.5" />
        </g>

        {/* Accent line under logo */}
        <g className="logo-accent" style={{ animationDelay: "0.3s" }}>
          <line x1="75" y1="72" x2="275" y2="72" stroke="url(#accentGradient)" strokeWidth="2" opacity="0.6" />
          <circle cx="75" cy="72" r="3" fill="url(#accentGradient)" />
          <circle cx="275" cy="72" r="3" fill="url(#accentGradient)" />
        </g>
      </g>
    </svg>
  );
}
