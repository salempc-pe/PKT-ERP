import { Landmark } from 'lucide-react';

export default function FinanceAdminCard({ analytics }) {
  const receipts = '0';

  return (
    <div className="bg-[var(--color-surface-container)] border border-white/5 rounded-2xl p-6 hover:translate-y-[-4px] transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center group-hover:bg-amber-400/20 transition-colors">
          <Landmark size={20} className="text-amber-400" />
        </div>
      </div>
      <p className="text-[var(--color-on-surface-variant)] text-xs font-bold uppercase tracking-wider mb-1">Comprobantes Emitidos</p>
      <h4 className="text-2xl font-black text-[var(--color-on-surface)]">{receipts}</h4>
      <p className="text-[10px] text-[#40485d] mt-2 font-medium">Facturación y contabilidad centralizada</p>
    </div>
  );
}
