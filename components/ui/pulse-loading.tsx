'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function PulseLoading({ 
  size = "default",
  gradientType = "coral",
  showText = true,
  text = "Loading..."
}: { 
  size?: "small" | "default" | "large";
  gradientType?: "coral" | "red" | "yellow" | "pink" | "amber";
  showText?: boolean;
  text?: string;
}) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dimensions = {
    small: { width: 80, height: 40, fontSize: "text-sm" },
    default: { width: 120, height: 60, fontSize: "text-base" },
    large: { width: 160, height: 80, fontSize: "text-lg" }
  };

  const gradients = {
    coral: { start: "#f97316", end: "#fb923c" },
    red: { start: "#f97316", end: "#ef4444" },
    yellow: { start: "#f97316", end: "#fbbf24" },
    pink: { start: "#f97316", end: "#ec4899" },
    amber: { start: "#f97316", end: "#d97706" }
  };

  const dim = dimensions[size];
  const colors = gradients[gradientType];
  const gradientId = `loadingGradient-${gradientType}`;
  
  // Determine if we're in dark mode
  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');
  const textColor = isDark ? "#ffffff" : "#1e293b";

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg
        width={dim.width}
        height={dim.height}
        viewBox="0 0 120 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="pulse-animation"
      >
        {/* Animated pulse line */}
        <g className="pulse-line">
          <path
            d="M5 30 L20 30 L25 15 L30 45 L35 20 L40 35 L45 30 L60 30 L65 15 L70 45 L75 20 L80 35 L85 30 L115 30"
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray="200"
            strokeDashoffset="200"
          />
        </g>

        {/* Pulsing dots at key points */}
        <circle cx="25" cy="15" r="2" fill={colors.start} className="pulse-dot" style={{ animationDelay: '0s' }} />
        <circle cx="30" cy="45" r="2" fill={colors.end} className="pulse-dot" style={{ animationDelay: '0.1s' }} />
        <circle cx="35" cy="20" r="2" fill={colors.start} className="pulse-dot" style={{ animationDelay: '0.2s' }} />
        <circle cx="65" cy="15" r="2" fill={colors.start} className="pulse-dot" style={{ animationDelay: '0.3s' }} />
        <circle cx="70" cy="45" r="2" fill={colors.end} className="pulse-dot" style={{ animationDelay: '0.4s' }} />
        <circle cx="75" cy="20" r="2" fill={colors.start} className="pulse-dot" style={{ animationDelay: '0.5s' }} />

        {/* Gradients */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <div className={`${dim.fontSize} font-medium animate-pulse`} style={{ color: textColor }}>
          {text}
        </div>
      )}

      <style jsx>{`
        .pulse-animation {
          animation: fadeIn 0.3s ease-in;
        }

        .pulse-line path {
          animation: drawLine 2s ease-in-out infinite;
        }

        .pulse-dot {
          animation: pulseDot 1.5s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes drawLine {
          0% {
            stroke-dashoffset: 200;
            opacity: 0.3;
          }
          50% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: -200;
            opacity: 0.3;
          }
        }

        @keyframes pulseDot {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
