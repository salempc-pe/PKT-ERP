import { Link } from 'react-router-dom';
import { ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-[#060e20] flex items-center justify-center p-6 relative overflow-hidden font-body">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#85adff]/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#fbabff]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-5xl w-full z-10">
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl lg:text-7xl font-black text-[#dee5ff] tracking-tighter mb-4">
            PKT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#85adff] to-[#fbabff]">ERP</span>
          </h1>
          <p className="text-[#a3aac4] text-lg font-medium max-w-2xl mx-auto">
            Bienvenido al ecosistema modular de gestión empresarial. Seleccione su portal para comenzar.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Admin Card */}
          <Link 
            to="/admin/dashboard"
            className="group relative bg-[#091328]/60 border border-[#40485d]/30 backdrop-blur-xl p-8 rounded-3xl transition-all duration-500 hover:border-[#85adff]/50 hover:shadow-[0_0_40px_rgba(133,173,255,0.15)] flex flex-col items-center text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#85adff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="w-20 h-20 bg-[#85adff]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-[#85adff]/20">
              <ShieldCheck className="text-[#85adff]" size={40} />
            </div>
            
            <h2 className="text-3xl font-black text-[#dee5ff] mb-4 tracking-tight">Portal Admin</h2>
            <p className="text-[#a3aac4] mb-8 font-medium">
              Gestión global, configuración de módulos, control de infraestructuras y métricas de plataforma.
            </p>
            
            <div className="flex items-center gap-2 text-[#85adff] font-bold group-hover:translate-x-2 transition-transform duration-300">
              Acceder a Administración <ArrowRight size={18} />
            </div>
          </Link>

          {/* Client Card */}
          <Link 
            to="/client/dashboard"
            className="group relative bg-[#091328]/60 border border-[#40485d]/30 backdrop-blur-xl p-8 rounded-3xl transition-all duration-500 hover:border-[#fbabff]/50 hover:shadow-[0_0_40px_rgba(251,171,255,0.15)] flex flex-col items-center text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#fbabff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="w-20 h-20 bg-[#fbabff]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 border border-[#fbabff]/20">
              <UserCheck className="text-[#fbabff]" size={40} />
            </div>
            
            <h2 className="text-3xl font-black text-[#dee5ff] mb-4 tracking-tight">Portal Cliente</h2>
            <p className="text-[#a3aac4] mb-8 font-medium">
              Visualización de métricas de negocio, gestión de inventarios, CRM y herramientas específicas de inquilino.
            </p>
            
            <div className="flex items-center gap-2 text-[#fbabff] font-bold group-hover:translate-x-2 transition-transform duration-300">
              Acceder al Portal <ArrowRight size={18} />
            </div>
          </Link>
        </div>

        <footer className="mt-16 text-center text-[#40485d] font-bold text-sm tracking-widest uppercase">
          &copy; 2026 ARCHITECTOS SYSTEM &bull; VERSION 1.0.0
        </footer>
      </div>
    </div>
  );
}
