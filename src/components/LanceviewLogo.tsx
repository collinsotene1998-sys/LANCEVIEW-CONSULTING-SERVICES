import React from 'react';

interface LanceviewLogoProps {
  /**
   * Layout of the logo:
   * - 'icon-only': Just the framed "LV" logo.
   * - 'horizontal': The framed logo with text to the right.
   * - 'vertical': The framed logo with text underneath.
   */
  variant?: 'icon-only' | 'horizontal' | 'vertical';
  /**
   * Height/width scale of the icon portion.
   */
  size?: number | string;
  className?: string;
  iconClassName?: string;
}

export default function LanceviewLogo({
  variant = 'horizontal',
  size = 40,
  className = '',
  iconClassName = '',
}: LanceviewLogoProps) {
  // SVG Icon element
  const icon = (
    <svg
      width={size}
      height={typeof size === 'number' ? size * 0.8 : size}
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${iconClassName}`}
    >
      {/* Outer dark blue rounded container box */}
      <rect
        x="6"
        y="6"
        width="88"
        height="68"
        rx="9"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="7"
      />

      {/* Letter 'L' */}
      <path
        d="M 23,20 H 33 V 49 H 48 V 58 H 23 Z"
        fill="#FFFFFF"
      />

      {/* Left stem of 'V' */}
      <polygon
        points="43,20 52,20 61,58 52,58"
        fill="#FFFFFF"
      />

      {/* Bottom connecting base of 'V' / Navy corner */}
      <polygon
        points="52,58 61,58 67,46 58,46"
        fill="#FFFFFF"
      />

      {/* Golden curved leaf/swoosh right stem on 'V' */}
      {/* Styled to mimic the uploaded shape: elegant curve tapering at the top right */}
      <path
        d="M 58.5,43 C 61,35 68.5,25.5 78,20 C 73.5,27 69,38 64.5,49.5 Z"
        fill="#9333EA"
      />
    </svg>
  );

  if (variant === 'icon-only') {
    return icon;
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {icon}
        <div className="mt-3 select-none">
          <div className="text-xl md:text-2xl font-sans font-black tracking-wider text-editorial-ink leading-none">
            LANCEVIEW
          </div>
          <div className="text-[10px] md:text-xs font-mono font-semibold tracking-widest text-[#9333EA] uppercase mt-1">
            CONSULTING LLC
          </div>
        </div>
      </div>
    );
  }

  // Default 'horizontal'
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {icon}
      <div className="select-none">
        <div className="text-base font-sans font-black tracking-tight text-editorial-ink leading-none">
          LANCEVIEW
        </div>
        <div className="text-[9px] font-sans font-bold tracking-widest text-[#9333EA] uppercase mt-1">
          CONSULTING LLC
        </div>
      </div>
    </div>
  );
}
