import { Package, TrendingUp, TrendingDown } from 'lucide-react';
import { useWarehouse } from './useWarehouse';
import { useNavigate } from 'react-router-dom';

export default function WarehouseDashboardCard({ orgId }) {
  const { stock, history } = useWarehouse(orgId);
  const navigate = useNavigate();

  // Calcular métricas rápidas
  const totalLotes = stock.length;
  const recentMovements = history.slice(0, 3);

  return (
    <div 
      onClick={() => navigate('/client/warehouse')}
      className="bg-[var(--color-surface-container-low)] p-6 rounded-3xl border border-[var(--color-outline-variant)] hover:border-[#6B4FD8]/40 transition-all cursor-pointer group flex flex-col justify-between min-h-[220px]"
    >
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-container-high)] flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-500">
          <Package size={24} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] bg-[var(--color-surface-variant)] px-2 py-1 rounded">Bodega</span>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-bold text-[var(--color-on-surface-variant)] uppercase tracking-tight">Stock por Lotes</h3>
        <p className="text-3xl font-black text-[var(--color-on-surface)] tracking-tighter">
          {totalLotes} <span className="text-sm font-bold opacity-50">Lotes Activos</span>
        </p>
      </div>

      <div className="mt-4 space-y-2">
        {recentMovements.length > 0 ? recentMovements.map((m, i) => (
          <div key={i} className="flex items-center justify-between text-[10px] font-bold">
            <span className="truncate max-w-[120px] text-[var(--color-on-surface-variant)]">{m.materialName}</span>
            <div className={`flex items-center gap-1 ${m.type === 'IN' ? 'text-green-500' : 'text-amber-500'}`}>
              {m.type === 'IN' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {m.quantity} {m.unit}
            </div>
          </div>
        )) : (
          <p className="text-[10px] text-[var(--color-on-surface-variant)] italic">Sin movimientos recientes</p>
        )}
      </div>
    </div>
  );
}
