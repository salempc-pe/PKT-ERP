import { Link } from 'react-router-dom';
import { ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import VeloLogo from '../components/VeloLogo';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6 relative overflow-hidden font-body">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)]/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-secondary)]/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-5xl w-full z-10">
        <header className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <VeloLogo variant="horizontal" mode="light" size="240" />
          </div>
          <p className="text-[var(--color-on-surface-variant)] text-lg font-bold max-w-2xl mx-auto">
            Bienvenido al ecosistema modular de gestión empresarial. Seleccione su portal para comenzar.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Admin Card */}
          <Link 
            to="/admin/dashboard"
            className="group relative bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] backdrop-blur-xl p-8 rounded-[2.5rem] transition-all duration-500 hover:border-[var(--color-primary)]/50 hover:shadow-[0_20px_50px_rgba(107,79,216,0.1)] flex flex-col items-center text-center overflow-hidden shadow-xl shadow-black/5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-[var(--color-primary)]/20">
              <ShieldCheck className="text-[var(--color-primary)]" size={40} />
            </div>
            
            <h2 className="text-3xl font-black text-[var(--color-on-surface)] mb-4 tracking-tight">Portal Admin</h2>
            <p className="text-[var(--color-on-surface-variant)] mb-8 font-bold text-sm">
              Gestión global, configuración de módulos, control de infraestructuras y métricas de plataforma.
            </p>
            
            <div className="flex items-center gap-2 text-[var(--color-primary)] font-black group-hover:translate-x-2 transition-transform duration-300 uppercase text-xs tracking-widest">
              Acceder a Administración <ArrowRight size={18} />
            </div>
          </Link>

          {/* Client Card */}
          <Link 
            to="/client/dashboard"
            className="group relative bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] backdrop-blur-xl p-8 rounded-[2.5rem] transition-all duration-500 hover:border-[var(--color-secondary)]/50 hover:shadow-[0_20px_50px_rgba(46,139,87,0.1)] flex flex-col items-center text-center overflow-hidden shadow-xl shadow-black/5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-secondary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="w-20 h-20 bg-[var(--color-secondary)]/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-[var(--color-secondary)]/20">
              <UserCheck className="text-[var(--color-secondary)]" size={40} />
            </div>
            
            <h2 className="text-3xl font-black text-[var(--color-on-surface)] mb-4 tracking-tight">Portal Cliente</h2>
            <p className="text-[var(--color-on-surface-variant)] mb-8 font-bold text-sm">
              Visualización de métricas de negocio, gestión de inventarios, CRM y herramientas específicas de inquilino.
            </p>
            
            <div className="flex items-center gap-2 text-[var(--color-secondary)] font-black group-hover:translate-x-2 transition-transform duration-300 uppercase text-xs tracking-widest">
              Acceder al Portal <ArrowRight size={18} />
            </div>
          </Link>
        </div>

        <footer className="mt-16 text-center text-[var(--color-on-surface-variant)]/40 font-black text-[10px] tracking-[0.3em] uppercase">
          &copy; 2026 ARCHITECTOS SYSTEM &bull; VERSION 1.0.0
        </footer>
      </div>
    </div>
  );
}
