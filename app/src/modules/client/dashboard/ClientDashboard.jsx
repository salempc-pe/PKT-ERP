import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../services/firebase';

// Import Cards directly from their respective modules
import CrmDashboardCard from '../crm/CrmDashboardCard';
import InventoryDashboardCard from '../inventory/InventoryDashboardCard';
import SalesDashboardCard from '../sales/SalesDashboardCard';
import ProjectsDashboardCard from '../projects/ProjectsDashboardCard';
import CalendarDashboardCard from '../calendar/CalendarDashboardCard';
import FinanceDashboardCard from '../finance/FinanceDashboardCard';

export default function ClientDashboard() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  const activeModules = user?.subscription?.activeModules || [];
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    if (!orgId || orgId === "default_org") return;
    const unsub = onSnapshot(doc(db, 'organizations', orgId), (docSnap) => {
      if (docSnap.exists() && docSnap.data().logoUrl) {
        setLogoUrl(docSnap.data().logoUrl);
      }
    });
    return () => unsub();
  }, [orgId]);

  // Mapping active module keys to their respective Card Component
  const moduleCards = {
    crm: CrmDashboardCard,
    inventory: InventoryDashboardCard,
    sales: SalesDashboardCard,
    projects: ProjectsDashboardCard,
    calendar: CalendarDashboardCard,
    finance: FinanceDashboardCard
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-10">
      {/* Welcome Header */}
      <section className="relative rounded-3xl overflow-hidden p-6 lg:p-10 bg-[#091328] border border-[#85adff]/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">

            <h2 className="text-3xl lg:text-5xl font-black tracking-tighter text-[#dee5ff] mb-4 leading-tight">
              Hola, <span className="text-[#85adff]">{user?.name?.split(' ')[0] || 'Usuario'}</span>.
            </h2>
            <p className="text-[#a3aac4] text-sm lg:text-base leading-relaxed max-w-md">
              Este es el resumen centralizado de tus módulos activos.
            </p>
          </div>

          {logoUrl && (
            <div className="hidden md:block shrink-0">
              <div className="w-32 h-32 rounded-2xl border border-[#85adff]/10 bg-[#141f38] overflow-hidden">
                <img src={logoUrl} alt="Logo Empresa" className="w-full h-full object-contain" />
              </div>
            </div>
          )}
        </div>
        
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-l from-[#85adff]/20 to-transparent"></div>
          <div className="absolute right-[-20%] top-1/2 -translate-y-1/2 w-64 h-64 border-[1px] border-[#85adff]/20 rounded-full"></div>
        </div>
      </section>

      {/* Main Modules Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeModules.map((modKey) => {
          const CardComponent = moduleCards[modKey];
          if (!CardComponent) return null;

          return <CardComponent key={modKey} orgId={orgId} />;
        })}
      </section>
    </div>
  );
}
