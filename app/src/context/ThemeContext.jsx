import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Recupera preferencia guardada; si no hay, usa oscuro por defecto
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('pkt_theme');
    if (stored !== null) return stored === 'dark';
    return false; // Claro por defecto
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('light');
    } else {
      root.classList.add('light');
    }
    localStorage.setItem('pkt_theme', isDark ? 'dark' : 'light');
    
    // Actualizar theme-color para la barra de estado (Android/Safari)
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = "theme-color";
      document.getElementsByTagName('head')[0].appendChild(metaThemeColor);
    }
    metaThemeColor.content = isDark ? '#060e20' : '#f0f4ff';
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
