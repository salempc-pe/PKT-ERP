import { ShoppingCart, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../../../services/firebase';

export default function PurchasesDashboardCard({ orgId }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ pending: 0, received: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId) return;

    const fetchStats = async () => {
      try {
        const purchasesRef = collection(db, 'organizations', orgId, 'purchases');
        const q = query(purchasesRef);
        const querySnapshot = await getDocs(q);
        
        const docs = querySnapshot.docs.map(d => d.data());
        const pending = docs.filter(d => d.status === 'pending').length;
        const received = docs.filter(d => d.status === 'received').length;
        
        setStats({
          pending,
          received,
          total: docs.length
        });
      } catch (error) {
        console.error("Error fetching purchase stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [orgId]);

  return (
    <div className="group relative bg-[#091328]/60 border border-[#85adff]/10 rounded-3xl p-6 transition-all duration-500 hover:border-[#85adff]/30 hover:shadow-[0_0_40px_rgba(133,173,255,0.05)] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#85adff]/5 blur-[80px] group-hover:bg-[#85adff]/10 transition-all duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#85adff]/20 to-[#fbabff]/20 rounded-2xl flex items-center justify-center border border-[#85adff]/20 group-hover:scale-110 transition-transform duration-500">
            <ShoppingCart className="text-[#85adff]" size={24} />
          </div>
          <div className="flex items-center gap-1 text-[#4ADE80] bg-[#4ADE80]/10 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
            Activo
          </div>
        </div>

        <h3 className="text-xl font-black text-[#dee5ff] mb-2 tracking-tight">Compras</h3>
        <p className="text-[#a3aac4] text-xs mb-6 leading-relaxed">Gestión de proveedores y órdenes de compra.</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#060e20]/40 rounded-2xl p-3 border border-[#85adff]/5">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={12} className="text-amber-400" />
              <span className="text-[10px] font-bold text-[#a3aac4] uppercase tracking-widest">Pendientes</span>
            </div>
            <p className="text-lg font-black text-[#dee5ff]">{loading ? '...' : stats.pending}</p>
          </div>
          <div className="bg-[#060e20]/40 rounded-2xl p-3 border border-[#85adff]/5">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={12} className="text-[#4ADE80]" />
              <span className="text-[10px] font-bold text-[#a3aac4] uppercase tracking-widest">Recibidas</span>
            </div>
            <p className="text-lg font-black text-[#dee5ff]">{loading ? '...' : stats.received}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#85adff]/5 flex items-center justify-between group-hover:translate-x-1 transition-transform duration-500">
          <span className="text-[10px] font-bold text-[#85adff] uppercase tracking-[0.2em]">Ver detalles</span>
          <ArrowUpRight size={16} className="text-[#85adff]" />
        </div>
      </div>
    </div>
  );
}
