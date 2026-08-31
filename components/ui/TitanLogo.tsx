"use client";

import React from "react";

interface TitanLogoProps {
  variant?: "horizontal" | "stacked" | "mark";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function TitanLogo({
  variant = "horizontal",
  size = "md",
  className = "",
}: TitanLogoProps) {
  if (variant === "mark") {
    const dimensions = {
      sm: { width: 28, height: 26 },
      md: { width: 36, height: 33 },
      lg: { width: 48, height: 44 },
      xl: { width: 64, height: 58 },
    }[size];

    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 120 110"
          width={dimensions.width}
          height={dimensions.height}
          className="filter drop-shadow-[0_2px_8px_rgba(239,68,68,0.25)]"
          aria-label="TITAN CARS Crest"
        >
          <defs>
            <linearGradient id="markRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF3B3B" />
              <stop offset="50%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
            <linearGradient id="markSilverLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#F1F5F9" />
              <stop offset="80%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <linearGradient id="markSilverDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="50%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="markSilverMid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
          </defs>
          <g id="titan-emblem">
            <path d="M 36 12 L 84 12 L 72 32 L 48 32 Z" fill="url(#markRedGrad)" />
            <path d="M 38 14 L 82 14 L 73 28 L 47 28 Z" fill="#FF5252" opacity="0.3" />
            <path d="M 52 34 L 60 34 L 60 98 L 54 80 Z" fill="url(#markSilverLight)" />
            <path d="M 60 34 L 68 34 L 66 80 L 60 98 Z" fill="url(#markSilverDark)" />
            <path d="M 12 20 L 46 32 L 44 40 L 22 32 Z" fill="url(#markSilverLight)" />
            <path d="M 12 20 L 22 32 L 10 36 Z" fill="url(#markSilverDark)" />
            <path d="M 10 36 L 22 32 L 44 40 L 48 76 L 60 104 L 54 104 L 38 72 L 18 50 Z" fill="url(#markSilverLight)" />
            <path d="M 22 32 L 44 40 L 48 76 L 60 104 L 55 98 L 43 73 L 38 40 Z" fill="url(#markSilverDark)" opacity="0.5" />
            <path d="M 108 20 L 74 32 L 76 40 L 98 32 Z" fill="url(#markSilverDark)" />
            <path d="M 108 20 L 98 32 L 110 36 Z" fill="url(#markSilverLight)" />
            <path d="M 110 36 L 98 32 L 76 40 L 72 76 L 60 104 L 66 104 L 82 72 L 102 50 Z" fill="url(#markSilverDark)" />
            <path d="M 98 32 L 76 40 L 72 76 L 60 104 L 65 98 L 77 73 L 82 40 Z" fill="url(#markSilverLight)" opacity="0.4" />
            <path d="M 60 96 L 64 104 L 60 107 L 56 104 Z" fill="#FFFFFF" />
          </g>
        </svg>
      </div>
    );
  }

  if (variant === "stacked") {
    const dimensions = {
      sm: { width: 140, height: 85 },
      md: { width: 190, height: 116 },
      lg: { width: 250, height: 152 },
      xl: { width: 320, height: 195 },
    }[size];

    return (
      <div className={`relative inline-flex flex-col items-center justify-center shrink-0 ${className}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 360 220"
          width={dimensions.width}
          height={dimensions.height}
          aria-label="TITAN CARS Logo"
        >
          <defs>
            <linearGradient id="stkRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF3B3B" />
              <stop offset="50%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
            <linearGradient id="stkSilverLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <linearGradient id="stkSilverDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="60%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="stkSilverText" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="stkRedText" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF4D4D" />
              <stop offset="60%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
          </defs>
          <g id="stk-emblem" transform="translate(120, 10)">
            <path d="M 36 12 L 84 12 L 72 32 L 48 32 Z" fill="url(#stkRedGrad)" />
            <path d="M 38 14 L 82 14 L 73 28 L 47 28 Z" fill="#FF5252" opacity="0.3" />
            <path d="M 52 34 L 60 34 L 60 98 L 54 80 Z" fill="url(#stkSilverLight)" />
            <path d="M 60 34 L 68 34 L 66 80 L 60 98 Z" fill="url(#stkSilverDark)" />
            <path d="M 12 20 L 46 32 L 44 40 L 22 32 Z" fill="url(#stkSilverLight)" />
            <path d="M 12 20 L 22 32 L 10 36 Z" fill="url(#stkSilverDark)" />
            <path d="M 10 36 L 22 32 L 44 40 L 48 76 L 60 104 L 54 104 L 38 72 L 18 50 Z" fill="url(#stkSilverLight)" />
            <path d="M 22 32 L 44 40 L 48 76 L 60 104 L 55 98 L 43 73 L 38 40 Z" fill="url(#stkSilverDark)" opacity="0.5" />
            <path d="M 108 20 L 74 32 L 76 40 L 98 32 Z" fill="url(#stkSilverDark)" />
            <path d="M 108 20 L 98 32 L 110 36 Z" fill="url(#stkSilverLight)" />
            <path d="M 110 36 L 98 32 L 76 40 L 72 76 L 60 104 L 66 104 L 82 72 L 102 50 Z" fill="url(#stkSilverDark)" />
            <path d="M 98 32 L 76 40 L 72 76 L 60 104 L 65 98 L 77 73 L 82 40 Z" fill="url(#stkSilverLight)" opacity="0.4" />
            <path d="M 60 96 L 64 104 L 60 107 L 56 104 Z" fill="#FFFFFF" />
          </g>
          <g id="stk-text" transform="translate(180, 160)" textAnchor="middle">
            <text x="0" y="0" fontFamily="'Plus Jakarta Sans', 'Montserrat', 'Arial Black', sans-serif" fontWeight="900" fontSize="34">
              <tspan fill="url(#stkSilverText)" letterSpacing="2">TITAN </tspan>
              <tspan fill="url(#stkRedText)" letterSpacing="1.5">CARS</tspan>
            </text>
            <g transform="translate(0, 24)">
              <line x1="-155" y1="-4" x2="-100" y2="-4" stroke="url(#stkRedGrad)" strokeWidth="2" strokeLinecap="round" />
              <text x="0" y="0" fontFamily="'Plus Jakarta Sans', 'Montserrat', sans-serif" fontWeight="800" fontSize="11" letterSpacing="4" fill="#E2E8F0">
                DRIVE EXCELLENCE
              </text>
              <line x1="100" y1="-4" x2="155" y2="-4" stroke="url(#stkRedGrad)" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>
        </svg>
      </div>
    );
  }

  // Default "horizontal"
  const dimensions = {
    sm: { width: 145, height: 32 },
    md: { width: 185, height: 40 },
    lg: { width: 230, height: 50 },
    xl: { width: 290, height: 63 },
  }[size];

  return (
    <div className={`relative inline-flex items-center shrink-0 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 460 100"
        width={dimensions.width}
        height={dimensions.height}
        className="filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
        aria-label="TITAN CARS - Drive Excellence Logo"
      >
        <defs>
          <linearGradient id="hzRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF3B3B" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
          <linearGradient id="hzSilverLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
          <linearGradient id="hzSilverDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="60%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <linearGradient id="hzSilverText" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="hzRedText" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF4D4D" />
            <stop offset="60%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
        </defs>

        {/* EMBLEM GRAPHIC */}
        <g id="hz-emblem" transform="translate(5, 0) scale(0.85)">
          <path d="M 36 12 L 84 12 L 72 32 L 48 32 Z" fill="url(#hzRedGrad)" />
          <path d="M 38 14 L 82 14 L 73 28 L 47 28 Z" fill="#FF5252" opacity="0.3" />
          <path d="M 52 34 L 60 34 L 60 98 L 54 80 Z" fill="url(#hzSilverLight)" />
          <path d="M 60 34 L 68 34 L 66 80 L 60 98 Z" fill="url(#hzSilverDark)" />
          <path d="M 12 20 L 46 32 L 44 40 L 22 32 Z" fill="url(#hzSilverLight)" />
          <path d="M 12 20 L 22 32 L 10 36 Z" fill="url(#hzSilverDark)" />
          <path d="M 10 36 L 22 32 L 44 40 L 48 76 L 60 104 L 54 104 L 38 72 L 18 50 Z" fill="url(#hzSilverLight)" />
          <path d="M 22 32 L 44 40 L 48 76 L 60 104 L 55 98 L 43 73 L 38 40 Z" fill="url(#hzSilverDark)" opacity="0.5" />
          <path d="M 108 20 L 74 32 L 76 40 L 98 32 Z" fill="url(#hzSilverDark)" />
          <path d="M 108 20 L 98 32 L 110 36 Z" fill="url(#hzSilverLight)" />
          <path d="M 110 36 L 98 32 L 76 40 L 72 76 L 60 104 L 66 104 L 82 72 L 102 50 Z" fill="url(#hzSilverDark)" />
          <path d="M 98 32 L 76 40 L 72 76 L 60 104 L 65 98 L 77 73 L 82 40 Z" fill="url(#hzSilverLight)" opacity="0.4" />
          <path d="M 60 96 L 64 104 L 60 107 L 56 104 Z" fill="#FFFFFF" />
        </g>

        {/* LOGO TEXT */}
        <g id="hz-text" transform="translate(115, 0)">
          <text x="0" y="58" fontFamily="'Plus Jakarta Sans', 'Montserrat', 'Arial Black', sans-serif" fontWeight="900" fontSize="46" letterSpacing="2" fill="url(#hzSilverText)">
            TITAN
          </text>
          <text x="168" y="58" fontFamily="'Plus Jakarta Sans', 'Montserrat', 'Arial Black', sans-serif" fontWeight="900" fontSize="46" letterSpacing="1.5" fill="url(#hzRedText)">
            CARS
          </text>
          <g transform="translate(0, 78)">
            <line x1="0" y1="-4" x2="45" y2="-4" stroke="url(#hzRedGrad)" strokeWidth="2.5" strokeLinecap="round" />
            <text x="54" y="0" fontFamily="'Plus Jakarta Sans', 'Montserrat', sans-serif" fontWeight="800" fontSize="12" letterSpacing="4.5" fill="#E2E8F0">
              DRIVE EXCELLENCE
            </text>
            <line x1="282" y1="-4" x2="325" y2="-4" stroke="url(#hzRedGrad)" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}
