"use client";

export function FocusLockLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 50"
      className={`${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          .logo-icon {
            animation: pulse 2s ease-in-out infinite;
          }
          
          .logo-text {
            animation: slideIn 0.6s ease-out;
          }
        `}</style>
      </defs>

      {/* Lock Icon */}
      <g className="logo-icon" transform="translate(15, 25)">
        <rect x="-8" y="-5" width="16" height="14" rx="2" 
              fill="none" stroke="url(#logoGradient)" strokeWidth="2" filter="url(#glow)" />
        <path d="M -5 -5 L -5 -10 A 5 5 0 0 1 5 -10 L 5 -5" 
              fill="none" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="0" cy="2" r="2" fill="url(#logoGradient)" />
      </g>

      {/* Text */}
      <text x="35" y="32" className="logo-text" 
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontSize="24" 
            fontWeight="700" 
            fill="white"
            letterSpacing="-0.5">
        FocusLock
      </text>
      
      {/* Accent dot */}
      <circle cx="185" cy="28" r="2.5" fill="url(#logoGradient)" className="logo-icon" />
    </svg>
  );
}
