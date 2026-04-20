import { TrendingUp, Users, Clock, AlertCircle, Sparkles, ArrowRight, Plus, Download, Bell } from 'lucide-react';
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
            <h3 className="text-7xl font-extrabold tracking-tighter text-[#dee5ff] mb-2">S/ {analytics.mrr}</h3>
            <div className="flex items-center gap-2 text-[#fbabff]">
              <TrendingUp size={16} />
              <span className="text-sm font-bold">{analytics.growthMetrics.mrrGrowth > 0 ? '+' : ''}{analytics.growthMetrics.mrrGrowth}% vs mes anterior</span>
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
              <h4 className="text-4xl font-black text-[#dee5ff]">{analytics.activeOrganizations.length}</h4>
            </div>
            <div className="w-14 h-14 rounded-full bg-[#192540] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={28} className="text-[#85adff]" />
            </div>
          </div>
          
          {/* ARPU */}
          <div className="bg-[#141f38] rounded-xl p-6 flex items-center justify-between group hover:bg-[#192540] transition-colors">
            <div>
              <p className="text-[#a3aac4] text-sm font-semibold mb-1">ARPU (Ingreso Promedio)</p>
              <h4 className="text-4xl font-black text-[#dee5ff]">S/ {analytics.arpu}</h4>
            </div>
            <div className="w-14 h-14 rounded-full bg-[#ff716c]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock size={28} className="text-[#ff716c]" />
            </div>
          </div>
          

        </div>
      </div>

      {/* Recent Activity & Featured Projects */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12">
          
          <div className="bg-[#091328] rounded-2xl p-8 space-y-6">
            {Object.entries(analytics.modulePopularity).map(([modId, count]) => {
              const maxCount = Math.max(...Object.values(analytics.modulePopularity), 1);
              const percentage = Math.round((count / maxCount) * 100);
              
              return (
                <div key={modId} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-[#dee5ff] uppercase tracking-wider">{modId}</span>
                    <span className="text-[#85adff] font-black">{count} activaciones</span>
                  </div>
                  <div className="w-full h-3 bg-[#141f38] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#85adff] to-[#fbabff] rounded-full transition-all duration-1000" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
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
