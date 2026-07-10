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
    <img
      src="/favicon.jpg"
      alt="Lanceview Logo"
      style={{ width: size, height: typeof size === 'number' ? size * 1.0 : size, objectFit: 'contain' }}
      className={`inline-block select-none rounded-md overflow-hidden ${iconClassName}`}
    />
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
          <div className="text-[10px] md:text-xs font-mono font-semibold tracking-widest text-[#BCA374] uppercase mt-1">
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
        <div className="text-[9px] font-sans font-bold tracking-widest text-[#BCA374] uppercase mt-1">
          CONSULTING LLC
        </div>
      </div>
    </div>
  );
}
