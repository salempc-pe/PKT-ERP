import { Package } from 'lucide-react';

export default function InventoryAdminCard({ analytics }) {
  const skus = analytics.stickiness?.globalSkus?.toLocaleString() || '0';

  return (
    <div className="bg-[var(--color-surface-container)] border border-white/5 rounded-2xl p-6 hover:translate-y-[-4px] transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#6B4FD8]/10 flex items-center justify-center group-hover:bg-[#6B4FD8]/20 transition-colors">
          <Package size={20} className="text-[#6B4FD8]" />
        </div>
      </div>
      <p className="text-[var(--color-on-surface-variant)] text-xs font-bold uppercase tracking-wider mb-1">SKUs en Inventario</p>
      <h4 className="text-2xl font-black text-[var(--color-on-surface)]">{skus}</h4>
      <p className="text-[10px] text-[#40485d] mt-2 font-medium">Productos controlados</p>
    </div>
  );
}
