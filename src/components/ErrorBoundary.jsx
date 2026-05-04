import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          
          <h2 className="text-2xl font-black text-[var(--color-on-surface)] uppercase tracking-tight mb-2">
            Algo no salió como esperábamos
          </h2>
          
          <p className="text-[var(--color-on-surface-variant)] max-w-md mb-8 font-medium">
            El módulo experimentó un error inesperado durante el renderizado. Esto suele ser temporal y se soluciona recargando la vista.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-[#6B4FD8] text-white font-bold px-6 py-3 rounded-2xl hover:shadow-[0_10px_20px_rgba(107,79,216,0.3)] transition-all active:scale-95"
            >
              <RefreshCcw size={18} />
              Recargar Aplicación
            </button>
            
            <button
              onClick={() => this.setState({ hasError: false })}
              className="flex items-center gap-2 bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] font-bold px-6 py-3 rounded-2xl border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-highest)] transition-all active:scale-95"
            >
              Reintentar Renderizado
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 p-4 bg-black/20 rounded-xl border border-white/5 text-left max-w-2xl overflow-auto">
              <p className="text-xs font-mono text-red-400 break-words">
                {this.state.error?.toString()}
              </p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
