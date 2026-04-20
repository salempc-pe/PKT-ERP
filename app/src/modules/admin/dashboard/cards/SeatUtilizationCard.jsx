import { Activity } from 'lucide-react';

export default function SeatUtilizationCard({ analytics }) {
  const utilization = analytics.stickiness?.seatUtilization || 0;
  const occupied = analytics.totalUsers || 0;
  const total = analytics.stickiness?.totalMaxUsers || 0;

  return (
    <div className="bg-[#141f38] border border-white/5 rounded-2xl p-6 hover:translate-y-[-4px] transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#ff716c]/10 flex items-center justify-center group-hover:bg-[#ff716c]/20 transition-colors">
          <Activity size={20} className="text-[#ff716c]" />
        </div>
        <span className="text-[10px] font-black text-[#ff716c] bg-[#ff716c]/10 px-2 py-0.5 rounded-full">ALTA</span>
      </div>
      <p className="text-[#a3aac4] text-xs font-bold uppercase tracking-wider mb-1">Utilización de Asientos</p>
      <h4 className="text-2xl font-black text-[#dee5ff]">{utilization}%</h4>
      <div className="w-full h-1 bg-[#1a264a] mt-3 rounded-full overflow-hidden">
        <div className="h-full bg-[#ff716c]" style={{ width: `${utilization}%` }}></div>
      </div>
      <p className="text-[10px] text-[#40485d] mt-2 font-medium">{occupied} ocupados de {total}</p>
    </div>
  );
}
