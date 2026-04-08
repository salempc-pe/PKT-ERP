import { ArrowRight, Users, Box, Calculator, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientDashboard() {
  return (
    <div className="animate-in fade-in duration-500 space-y-10">
      {/* Welcome Header */}
      <section className="relative rounded-3xl overflow-hidden p-6 lg:p-10 bg-[#091328]">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[#85adff] font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Estado del sistema: Operativo</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-[#dee5ff] mb-6 leading-tight">
            Bienvenido al <span className="text-[#85adff]">Panel de Control</span>.
          </h2>
          <p className="text-[#a3aac4] text-sm lg:text-lg leading-relaxed mb-8">
            Tienes 2 módulos activos en el Plan Pro. Revisa el estado de tu negocio y módulos desde aquí.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/client/crm" className="bg-gradient-to-br from-[#85adff] to-[#6e9fff] px-8 py-3 rounded-full text-[#002150] font-bold text-sm shadow-xl shadow-[#85adff]/20">
              Ir a CRM
            </Link>
            <Link to="/client/marketplace" className="bg-[#192540]/50 border border-[#40485d]/20 px-8 py-3 rounded-full text-[#dee5ff] font-bold text-sm hover:bg-[#192540] transition-colors">
              Explorar Módulos
            </Link>
          </div>
        </div>
        
        {/* Abstract Architectural Background Elements */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-l from-[#85adff]/40 to-transparent"></div>
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 border-2 border-[#85adff]/30 rounded-full"></div>
          <div className="absolute right-20 top-1/3 -translate-y-1/2 w-48 h-48 border border-[#85adff]/20 rotate-45"></div>
        </div>
      </section>

      {/* Modular Trial Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* CRM Module (Active) */}
        <div className="border border-[#85adff]/20 bg-[#141f38] p-6 rounded-2xl group hover:bg-[#1f2b49] transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-[#85adff]/20 flex items-center justify-center mb-6 text-[#85adff] group-hover:scale-110 transition-transform">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-[#dee5ff] mb-2">CRM y Ventas</h3>
          <p className="text-sm text-[#a3aac4] mb-6 line-clamp-2">Gestiona clientes, prospectos y embudos de venta de manera visual.</p>
          <div className="bg-[#85adff]/10 text-center py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-[#85adff] flex items-center justify-center gap-2">
            <CheckCircle2 size={14} /> Módulo Activo
          </div>
        </div>

        {/* Inventory Module (Active) */}
        <div className="border border-[#e28ce9]/20 bg-[#141f38] p-6 rounded-2xl group hover:bg-[#1f2b49] transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-[#e28ce9]/20 flex items-center justify-center mb-6 text-[#e28ce9] group-hover:scale-110 transition-transform">
            <Box size={24} />
          </div>
          <h3 className="text-xl font-bold text-[#dee5ff] mb-2">Inventario</h3>
          <p className="text-sm text-[#a3aac4] mb-6 line-clamp-2">Control de existencias y alertas de reabastecimiento en tiempo real.</p>
          <div className="bg-[#e28ce9]/10 text-center py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-[#e28ce9] flex items-center justify-center gap-2">
            <CheckCircle2 size={14} /> Módulo Activo
          </div>
        </div>

        {/* Finance Module (Inactive) */}
        <div className="bg-[#091328] border border-[#40485d]/20 p-6 rounded-2xl group hover:bg-[#141f38] transition-all duration-300 opacity-60">
          <div className="w-12 h-12 rounded-xl bg-[#40485d]/50 flex items-center justify-center mb-6 text-[#a3aac4] group-hover:scale-110 transition-transform">
            <Calculator size={24} />
          </div>
          <h3 className="text-xl font-bold text-[#a3aac4] mb-2">Contabilidad</h3>
          <p className="text-sm text-[#a3aac4] mb-6 line-clamp-2">Contabilidad básica, P&L, reportes y finanzas para tu empresa.</p>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#a3aac4]">
            <span>No Activo</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </section>

      {/* Content Row: CRM Quick Stats & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0f1930] p-6 lg:p-8 rounded-3xl h-full border border-[#40485d]/10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-2xl font-extrabold text-[#dee5ff] tracking-tight">Cierre de Ventas CRM</h3>
                <p className="text-[#a3aac4] text-sm">Resumen de proyecciones basadas en Oportunidades Ganadas.</p>
              </div>
            </div>
            
            {/* Faux Chart Visual */}
            <div className="h-48 flex items-end gap-2 px-2">
              <div className="bg-[#192540] w-full rounded-t-lg transition-all hover:bg-[#85adff]/50" style={{ height: '40%' }}></div>
              <div className="bg-[#192540] w-full rounded-t-lg transition-all hover:bg-[#85adff]/50" style={{ height: '25%' }}></div>
              <div className="bg-[#85adff]/80 w-full rounded-t-lg transition-all" style={{ height: '85%' }}></div>
              <div className="bg-[#192540] w-full rounded-t-lg transition-all hover:bg-[#85adff]/50" style={{ height: '55%' }}></div>
              <div className="bg-[#192540] w-full rounded-t-lg transition-all hover:bg-[#85adff]/50" style={{ height: '60%' }}></div>
              <div className="bg-[#85adff]/80 w-full rounded-t-lg transition-all" style={{ height: '100%' }}></div>
            </div>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#091328] p-4 rounded-2xl border border-[#40485d]/10">
                <p className="text-[10px] uppercase font-bold text-[#a3aac4] tracking-widest mb-1">Leads</p>
                <p className="text-2xl font-black text-[#dee5ff]">240</p>
              </div>
              <div className="bg-[#091328] p-4 rounded-2xl border border-[#40485d]/10">
                <p className="text-[10px] uppercase font-bold text-[#a3aac4] tracking-widest mb-1">Cierre %</p>
                <p className="text-2xl font-black text-[#85adff]">12%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-[#091328] p-6 lg:p-8 rounded-3xl h-full border border-[#40485d]/10">
          <h3 className="text-xl font-extrabold text-[#dee5ff] mb-6">Actividad Interna</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#141f38] flex items-center justify-center shrink-0">
                <Users className="text-[#85adff] w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#dee5ff]">Nuevo lead: Zapatilas XR</p>
                <p className="text-xs text-[#a3aac4] mb-1">Ingresado por Landing Page</p>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#192540] text-[#a3aac4]">Hace 1 hora</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#141f38] flex items-center justify-center shrink-0">
                <Box className="text-[#e28ce9] w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#dee5ff]">Alerta de inventario</p>
                <p className="text-xs text-[#a3aac4] mb-1">Stock mínimo alcanzado para SKU-012</p>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#192540] text-[#a3aac4]">Hace 3 horas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
