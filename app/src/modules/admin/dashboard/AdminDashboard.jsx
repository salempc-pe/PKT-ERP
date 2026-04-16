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
                className="bg-[#141f38] hover:bg-[#192540] text-[#a3aac4] hover:text-[#dee5ff] border border-[#40485d]/30 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all relative z-20">
                <Download size={14} /> Exportar JSON
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
          
          {/* System Alerts */}
          <div className="bg-[#000000] border border-[#40485d]/10 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#fbabff]">Alertas del Sistema</span>
              <Bell size={16} className="text-[#fbabff]" />
            </div>
            <div className="space-y-4 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
              {mockSystemAlerts.map(alert => (
                <div key={alert.id} className="flex gap-3 text-xs">
                  <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${alert.type === 'error' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                  <div>
                    <p className="text-[#dee5ff] font-semibold">{alert.message}</p>
                    <p className="text-[#a3aac4] text-[10px]">{new Date(alert.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {mockSystemAlerts.length === 0 && <p className="text-[10px] text-[#a3aac4] italic">No hay alertas activas.</p>}
            </div>
          </div>

          {/* System Integrity */}
          <div className="bg-[#000000] border border-[#40485d]/10 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#a3aac4]">Firebase Status</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#fbabff] animate-pulse"></span>
                <span className="text-xs font-bold text-[#fbabff] uppercase">Operacional</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-[#a3aac4]">Infraestructura Cloud</span>
                <span className="text-[#dee5ff]">99.9%</span>
              </div>
              <div className="w-full h-1 bg-[#141f38] rounded-full overflow-hidden">
                <div className="w-[99%] h-full bg-[#85adff]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Featured Projects */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 xl:col-span-8">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-xl font-bold tracking-tight text-[#dee5ff]">Adopción de Módulos</h3>
          </div>
          
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
        
        {/* Focus Action Card */}
        <div className="col-span-12 xl:col-span-4">
          <div className="bg-[#192540]/40 architectural-glass rounded-2xl p-8 h-full flex flex-col justify-between border border-white/5 relative group">
            <div>
              <div className="w-12 h-12 bg-[#85adff]/20 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="text-[#85adff]" size={24} />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-[#dee5ff]">Asistente IA (Mock)</h4>
              <p className="text-[#a3aac4] leading-relaxed text-sm">
                Hemos detectado que 5 clientes están próximos a cancelar por bajo uso del módulo de <strong className="text-white">Inventario</strong>. ¿Deseas enviarles un correo de reactivación/onboarding automatizado?
              </p>
            </div>
            
            <button className="w-full bg-gradient-to-br from-[#85adff] to-[#6e9fff] text-[#002150] font-black py-4 rounded-full mt-8 flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(133,173,255,0.3)] transition-all">
              Ejecutar Campaña de Rescate
              <ArrowRight size={16} />
            </button>
            
            {/* Decorative architectural lines */}
            <div className="absolute right-4 bottom-24 opacity-10 pointer-events-none">
              <svg fill="none" height="100" viewBox="0 0 100 100" width="100" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H100V100" stroke="white" strokeWidth="0.5"></path>
                <path d="M0 20H80V100" stroke="white" strokeWidth="0.5"></path>
                <path d="M0 40H60V100" stroke="white" strokeWidth="0.5"></path>
              </svg>
            </div>
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
