import { Package } from 'lucide-react';

export default function InventoryAdminCard({ analytics }) {
  const skus = analytics.stickiness?.globalSkus?.toLocaleString() || '0';

  return (
    <div className="bg-[#141f38] border border-white/5 rounded-2xl p-6 hover:translate-y-[-4px] transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#85adff]/10 flex items-center justify-center group-hover:bg-[#85adff]/20 transition-colors">
          <Package size={20} className="text-[#85adff]" />
        </div>
        <span className="text-[10px] font-black text-[#85adff] bg-[#85adff]/10 px-2 py-0.5 rounded-full">Sano</span>
      </div>
      <p className="text-[#a3aac4] text-xs font-bold uppercase tracking-wider mb-1">SKUs en Inventario</p>
      <h4 className="text-2xl font-black text-[#dee5ff]">{skus}</h4>
      <p className="text-[10px] text-[#40485d] mt-2 font-medium">Productos controlados</p>
    </div>
  );
}
