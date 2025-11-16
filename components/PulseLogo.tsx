'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function PulseLogo({ 
  size = "default", 
  gradientType = "coral"
}: { 
  size?: "small" | "default" | "large";
  gradientType?: "coral" | "red" | "yellow" | "pink" | "amber";
}) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dimensions = {
    small: { width: 120, height: 40 },
    default: { width: 180, height: 60 },
    large: { width: 240, height: 80 }
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
  const gradientId = `pulseGradient-${gradientType}`;
  const textGradientId = `textGradient-${gradientType}`;
  
  // Determine if we're in dark mode
  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');
  
  // Text color based on theme
  const textColor = isDark ? "#ffffff" : `url(#${textGradientId})`;

  return (
    <svg
      width={dim.width}
      height={dim.height}
      viewBox="0 0 180 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pulse line graphic */}
      <path
        d="M2 30 L20 30 L25 15 L30 45 L35 20 L40 35 L45 30 L58 30"
        stroke={`url(#${gradientId})`}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Text: PULSE */}
      <text
        x="65"
        y="42"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="32"
        fontWeight="700"
        fill={textColor}
        letterSpacing="-0.5"
      >
        PULSE
      </text>

      {/* Gradients */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.start} />
          <stop offset="100%" stopColor={colors.end} />
        </linearGradient>
        <linearGradient id={textGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
    </svg>
  );
}