import React from 'react';

export default function VeloLogo({ variant = 'horizontal', mode = 'light', size = 'auto', className = '' }) {
  const isDark = mode === 'dark';

  // Colors from brand guide
  const purpleMain = "#6B4FD8";
  const purpleMedium = "#9E8AEB";
  const purpleLight = "#C4B9F0";
  const purpleSoft = "#EDE9FB";
  const white = "#ffffff";

  if (variant === 'symbol') {
    const widthValue = size === 'auto' ? undefined : size;
    const heightValue = size === 'auto' ? undefined : (parseInt(size) * 1.4);

    return (
      <svg
        viewBox="0 0 100 140"
        width={widthValue}
        height={heightValue}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" y="40" width="26" height="100" rx="5" fill={isDark ? purpleMedium : purpleMain} />
        <rect x="33" y="20" width="26" height="120" rx="5" fill={isDark ? purpleLight : purpleMedium} />
        <rect x="66" y="0" width="26" height="140" rx="5" fill={purpleSoft} stroke={!isDark ? purpleLight : 'none'} strokeWidth={!isDark ? "1" : "0"} />
      </svg>
    );
  }

  // Horizontal variant
  const widthValue = size === 'auto' ? undefined : size;
  const heightValue = size === 'auto' ? undefined : (parseInt(size) * 0.33);

  return (
    <svg
      viewBox="0 0 180 60"
      width={widthValue}
      height={heightValue}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="17" width="11" height="43" rx="2.5" fill={isDark ? purpleMedium : purpleMain} />
      <rect x="14" y="8" width="11" height="52" rx="2.5" fill={isDark ? purpleLight : purpleMedium} />
      <rect x="28" y="0" width="11" height="60" rx="2.5" fill={purpleSoft} stroke={!isDark ? purpleLight : 'none'} strokeWidth={!isDark ? "0.5" : "0"} />
      <text
        x="54"
        y="46"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="46"
        fontWeight="500"
        letterSpacing="-1.5"
        fill={isDark ? white : purpleMain}
      >
        Veló
      </text>
    </svg>
  );
}
