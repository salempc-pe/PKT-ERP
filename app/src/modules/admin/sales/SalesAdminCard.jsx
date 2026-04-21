import { TrendingUp } from 'lucide-react';

export default function SalesAdminCard({ analytics }) {
  const gmv = analytics.stickiness?.globalGMV?.toLocaleString() || '0';

  return (
    <div className="bg-[#141f38] border border-white/5 rounded-2xl p-6 hover:translate-y-[-4px] transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center group-hover:bg-emerald-400/20 transition-colors">
          <TrendingUp size={20} className="text-emerald-400" />
        </div>
      </div>
      <p className="text-[#a3aac4] text-xs font-bold uppercase tracking-wider mb-1">GMV Transaccional Global</p>
      <h4 className="text-2xl font-black text-[#dee5ff]">S/ {gmv}</h4>
      <p className="text-[10px] text-[#40485d] mt-2 font-medium">Impacto económico procesado</p>
    </div>
  );
}
