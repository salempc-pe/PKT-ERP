import React from 'react';
import VeloLogo from './VeloLogo';
import { useTheme } from '../context/ThemeContext';

export default function LoadingScreen({ fullScreen = true, message = null }) {
  const { isDark } = useTheme();

  const content = (
    <div className={`flex flex-col items-center justify-center gap-8 ${fullScreen ? 'min-h-screen' : 'h-64'}`}>
      <div className="animate-logo-pulse">
        <VeloLogo 
          variant="symbol" 
          mode={isDark ? 'dark' : 'light'} 
          size="80" 
        />
      </div>
      {message && (
        <p className="text-[var(--color-primary)] font-black tracking-widest text-[10px] uppercase animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--color-background)]">
        {content}
      </div>
    );
  }

  return content;
}
