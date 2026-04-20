import { TrendingUp, Users, Clock, AlertCircle, Sparkles, ArrowRight, Plus, Download, Bell, Package, Briefcase, Activity, CheckCircle, Percent } from 'lucide-react';
import { useAdminAnalytics } from '../../../hooks/useAdminAnalytics';
import { useAuth } from '../../../context/AuthContext';

export default function AdminDashboard() {
  const analytics = useAdminAnalytics();
  const { mockSystemAlerts } = useAuth();
  
  const handleExport = () => {
    const dataStr = JSON.stringify(analytics, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pkt_mrr_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Bento Metric Grid */}
      <div className="grid grid-cols-12 gap-6 mb-12">
        {/* Big Revenue Metric */}
        <div className="col-span-12 lg:col-span-7 bg-[#091328] rounded-xl p-8 flex flex-col justify-between min-h-[320px] relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <p className="text-[#85adff] text-xs font-black uppercase tracking-[0.2em] mb-4">Ingresos MRR</p>
              <button 
                onClick={handleExport}
                className="bg-[#141f38] hover:bg-[#1a264a] text-[#85adff] border border-[#85adff]/20 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#85adff]/5">
                <Download size={14} strokeWidth={3} /> Exportar JSON
              </button>
            </div>
            <h3 className="text-7xl font-extrabold tracking-tighter text-[#dee5ff] mb-2">S/ {analytics?.mrr || 0}</h3>
            <div className="flex items-center gap-2 text-[#fbabff]">
              <TrendingUp size={16} />
              <span className="text-sm font-bold">{analytics.growthMetrics?.mrrGrowth > 0 ? '+' : ''}{analytics.growthMetrics?.mrrGrowth || 0}% vs mes anterior</span>
            </div>
          </div>
          
          <div className="mt-8 flex gap-4 items-end h-24 relative z-10">
            <div className="w-full bg-[#141f38] rounded-t-lg h-[40%] group-hover:h-[60%] transition-all duration-500"></div>
            <div className="w-full bg-[#141f38] rounded-t-lg h-[55%] group-hover:h-[75%] transition-all duration-500"></div>
            <div className="w-full bg-[#141f38] rounded-t-lg h-[45%] group-hover:h-[65%] transition-all duration-500"></div>
            <div className="w-full bg-[#85adff] rounded-t-lg h-[90%] transition-all duration-500"></div>
          </div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#85adff] opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        </div>
        
        {/* Secondary Metrics Stack */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          {/* Total Clients */}
          <div className="bg-[#141f38] rounded-xl p-6 flex items-center justify-between group hover:bg-[#192540] transition-colors">
            <div>
              <p className="text-[#a3aac4] text-sm font-semibold mb-1">Total Organizaciones</p>
              <h4 className="text-4xl font-black text-[#dee5ff]">{analytics?.activeOrganizations?.length || 0}</h4>
            </div>
            <div className="w-14 h-14 rounded-full bg-[#192540] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={28} className="text-[#85adff]" />
            </div>
          </div>
          
          {/* ARPU */}
          <div className="bg-[#141f38] rounded-xl p-6 flex items-center justify-between group hover:bg-[#192540] transition-colors">
            <div>
              <p className="text-[#a3aac4] text-sm font-semibold mb-1">ARPU (Ingreso Promedio)</p>
              <h4 className="text-4xl font-black text-[#dee5ff]">S/ {analytics?.arpu || 0}</h4>
            </div>
            <div className="w-14 h-14 rounded-full bg-[#ff716c]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock size={28} className="text-[#ff716c]" />
            </div>
          </div>
          

        </div>
      </div>

      {/* SaaS Stickiness Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* GMV Global */}
        <div className="bg-[#141f38] border border-white/5 rounded-2xl p-6 hover:translate-y-[-4px] transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#85adff]/10 flex items-center justify-center group-hover:bg-[#85adff]/20 transition-colors">
              <TrendingUp size={20} className="text-[#85adff]" />
            </div>
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">+12.5%</span>
          </div>
          <p className="text-[#a3aac4] text-xs font-bold uppercase tracking-wider mb-1">GMV Transaccional Global</p>
          <h4 className="text-2xl font-black text-[#dee5ff]">S/ {analytics.stickiness?.globalGMV?.toLocaleString() || '0'}</h4>
          <p className="text-[10px] text-[#40485d] mt-2 font-medium">Impacto económico procesado</p>
        </div>

        {/* CRM Contacts */}
        <div className="bg-[#141f38] border border-white/5 rounded-2xl p-6 hover:translate-y-[-4px] transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#fbabff]/10 flex items-center justify-center group-hover:bg-[#fbabff]/20 transition-colors">
              <Users size={20} className="text-[#fbabff]" />
            </div>
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">+8%</span>
          </div>
          <p className="text-[#a3aac4] text-xs font-bold uppercase tracking-wider mb-1">Contactos en CRM</p>
          <h4 className="text-2xl font-black text-[#dee5ff]">{analytics.stickiness?.globalContacts?.toLocaleString() || '0'}</h4>
          <p className="text-[10px] text-[#40485d] mt-2 font-medium">Leads y clientes capturados</p>
        </div>

        {/* Inventory SKUs */}
        <div className="bg-[#141f38] border border-white/5 rounded-2xl p-6 hover:translate-y-[-4px] transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#85adff]/10 flex items-center justify-center group-hover:bg-[#85adff]/20 transition-colors">
              <Package size={20} className="text-[#85adff]" />
            </div>
            <span className="text-[10px] font-black text-[#85adff] bg-[#85adff]/10 px-2 py-0.5 rounded-full">Sano</span>
          </div>
          <p className="text-[#a3aac4] text-xs font-bold uppercase tracking-wider mb-1">SKUs en Inventario</p>
          <h4 className="text-2xl font-black text-[#dee5ff]">{analytics.stickiness?.globalSkus?.toLocaleString() || '0'}</h4>
          <p className="text-[10px] text-[#40485d] mt-2 font-medium">Productos controlados</p>
        </div>

        {/* Seat Utilization */}
        <div className="bg-[#141f38] border border-white/5 rounded-2xl p-6 hover:translate-y-[-4px] transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#ff716c]/10 flex items-center justify-center group-hover:bg-[#ff716c]/20 transition-colors">
              <Activity size={20} className="text-[#ff716c]" />
            </div>
            <span className="text-[10px] font-black text-[#ff716c] bg-[#ff716c]/10 px-2 py-0.5 rounded-full">ALTA</span>
          </div>
          <p className="text-[#a3aac4] text-xs font-bold uppercase tracking-wider mb-1">Utilización de Asientos</p>
          <h4 className="text-2xl font-black text-[#dee5ff]">{analytics.stickiness?.seatUtilization || 0}%</h4>
          <div className="w-full h-1 bg-[#1a264a] mt-3 rounded-full overflow-hidden">
            <div className="h-full bg-[#ff716c]" style={{ width: `${analytics.stickiness?.seatUtilization || 0}%` }}></div>
          </div>
          <p className="text-[10px] text-[#40485d] mt-2 font-medium">{analytics.totalUsers || 0} ocupados de {analytics.stickiness?.totalMaxUsers || 0}</p>
        </div>
      </div>

      {/* Module Popularity List */}
      <div className="bg-[#091328] rounded-2xl p-8 border border-white/5 relative overflow-hidden mb-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-2 bg-[#fbabff] rounded-full animate-pulse"></div>
          <h3 className="text-[#dee5ff] font-black uppercase tracking-tighter text-base">Adopción por Módulo</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {Object.entries(analytics?.modulePopularity || {}).map(([modId, count]) => {
            const maxCount = Math.max(...Object.values(analytics?.modulePopularity || {}), 1);
            const percentage = Math.round((count / maxCount) * 100);
            
            return (
              <div key={modId} className="space-y-3">
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#85adff]"></span>
                    <span className="font-bold text-[#dee5ff] uppercase tracking-[0.15em]">{modId}</span>
                  </div>
                  <span className="text-[#85adff] font-black">{count} organizadores</span>
                </div>
                <div className="w-full h-2 bg-[#141f38] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#85adff] via-[#fbabff] to-[#85adff] rounded-full transition-all duration-1000 bg-[length:200%_100%] animate-gradient-x" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
          <Activity size={200} />
        </div>
      </div>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-[#85adff] text-[#000000] w-14 h-14 rounded-full shadow-[0_0_20px_rgba(133,173,255,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group">
          <Plus size={28} />
          <div className="absolute right-20 bg-[#192540] text-[#dee5ff] px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
            Alta Manual de Cliente
          </div>
        </button>
      </div>
    </div>
  );
}
