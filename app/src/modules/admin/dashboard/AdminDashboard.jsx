import { useMemo, useState } from 'react';
import { useAdminAnalytics } from '../../../hooks/useAdminAnalytics';
import { useAuth } from '../../../context/AuthContext';
import { 
  Users, TrendingUp, 
  Activity, Clock, Download, Globe, Box, Database, Loader2
} from 'lucide-react';

// Registro Modular de Tarjetas de Administrador
import CrmAdminCard from '../crm/CrmAdminCard';
import InventoryAdminCard from '../inventory/InventoryAdminCard';
import SalesAdminCard from '../sales/SalesAdminCard';
import ProjectsAdminCard from '../projects/ProjectsAdminCard';
import CalendarAdminCard from '../calendar/CalendarAdminCard';
import FinanceAdminCard from '../finance/FinanceAdminCard';
import PurchasesAdminCard from '../purchases/PurchasesAdminCard';
import SeatUtilizationCard from '../dashboard/cards/SeatUtilizationCard';

// Mapeo dinámico de módulos a sus componentes de tarjeta de administración
const ADMIN_MODULE_CARDS = {
  crm: CrmAdminCard,
  inventory: InventoryAdminCard,
  sales: SalesAdminCard,
  projects: ProjectsAdminCard,
  calendar: CalendarAdminCard,
  finance: FinanceAdminCard,
  purchases: PurchasesAdminCard
};

// Lista de módulos para los que queremos mostrar analíticas
const ANALYTICS_ENABLED_MODULES = ['sales', 'crm', 'inventory', 'projects', 'calendar', 'finance', 'purchases'];

export default function AdminDashboard() {
  const analytics = useAdminAnalytics();

  const handleExport = () => {
    const dataStr = JSON.stringify(analytics, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `velo_mrr_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 md:space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* 1. SECCIÓN DE INGRESOS (Global SaaS Overview) */}
      <div className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-[var(--color-surface-container-low)] border border-[#6B4FD8]/10 p-6 md:p-12 shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#6B4FD8]/10 rounded-lg">
                <Globe size={18} className="text-[#6B4FD8]" />
              </div>
              <span className="text-xs font-black tracking-[0.2em] text-[#6B4FD8] uppercase">Panorama Global SaaS</span>
            </div>

            <p className="text-[var(--color-on-surface-variant)] text-[10px] md:text-sm font-bold uppercase tracking-wider mb-2">MRR (Ingreso Mensual Recurrente)</p>
            <h3 className="text-4xl md:text-7xl font-extrabold tracking-tighter text-[var(--color-on-surface)] mb-2">S/ {analytics?.mrr || 0}</h3>
            <div className="flex items-center gap-2 text-[#2E8B57]">
              <TrendingUp size={16} />
              <span className="text-sm font-bold">
                {analytics.growthMetrics?.mrrGrowth > 0 ? '+' : ''}{analytics.growthMetrics?.mrrGrowth || 0}% vs mes anterior
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[var(--color-surface-container)] rounded-xl p-6 flex items-center justify-between group hover:bg-[var(--color-surface-container-high)] transition-colors">
              <div>
                <p className="text-[var(--color-on-surface-variant)] text-sm font-semibold mb-1">Total Organizaciones</p>
                <h4 className="text-4xl font-black text-[var(--color-on-surface)]">{analytics?.activeOrganizations?.length || 0}</h4>
              </div>
              <div className="w-14 h-14 rounded-full bg-[var(--color-surface-container-high)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users size={28} className="text-[#6B4FD8]" />
              </div>
            </div>
            
            <div className="bg-[var(--color-surface-container)] rounded-xl p-6 flex items-center justify-between group hover:bg-[var(--color-surface-container-high)] transition-colors">
              <div>
                <p className="text-[var(--color-on-surface-variant)] text-sm font-semibold mb-1">ARPU Promedio</p>
                <h4 className="text-4xl font-black text-[var(--color-on-surface)]">S/ {analytics?.arpu || 0}</h4>
              </div>
              <div className="w-14 h-14 rounded-full bg-[#ff716c]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock size={28} className="text-[#ff716c]" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-[#6B4FD8]/20 to-transparent"></div>
        </div>
      </div>

      {/* 2. GRID DE MÉTRICAS MODULARES (Controlled by each module) */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--color-on-surface)] flex items-center gap-3">
          <Activity size={20} className="text-[#2E8B57]" />
          Salud y Stickiness por Módulo
        </h2>
        <div className="h-px flex-grow mx-6 bg-gradient-to-r from-white/5 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Renderizado dinámico basado en los módulos habilitados para analíticas */}
        {ANALYTICS_ENABLED_MODULES.map(modId => {
          const AdminCard = ADMIN_MODULE_CARDS[modId];
          return AdminCard ? <AdminCard key={modId} analytics={analytics} /> : null;
        })}

        {/* Tarjeta Global de Utilización (Core Metrics) */}
        <SeatUtilizationCard analytics={analytics} />
      </div>

      {/* 3. SECCIÓN DE ADOPCIÓN (Ranking dinámico basado en popularidad real) */}
      <div className="bg-[var(--color-surface-container-low)] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-2xl font-black text-[var(--color-on-surface)] mb-2">Adopción por Módulo</h2>
            <p className="text-sm text-[var(--color-on-surface-variant)]">Distribución de uso real en la base de clientes instalada.</p>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold text-[#6B4FD8] transition-all border border-white/5"
          >
            <Download size={14} strokeWidth={3} /> Exportar Reporte JSON
          </button>
        </div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {Object.entries(analytics?.modulePopularity || {}).map(([modId, count]) => {
            const maxCount = Math.max(...Object.values(analytics?.modulePopularity || {}), 1);
            const percentage = Math.round((count / maxCount) * 100);
            
            return (
              <div key={modId} className="group flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#6B4FD8] group-hover:bg-[#6B4FD8]/10 transition-colors">
                      <Box size={14} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-[var(--color-on-surface)]">{modId.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] bg-white/5 px-2 py-0.5 rounded-full">{count} ORGS</span>
                    <span className="text-[10px] font-black text-[#6B4FD8]">{percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[var(--color-surface-container)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#6B4FD8] to-[#2E8B57] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(133,173,255,0.3)]" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Marca de agua decorativa */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.015] pointer-events-none">
          <Activity size={300} />
        </div>
      </div>

    </div>
  );
}
