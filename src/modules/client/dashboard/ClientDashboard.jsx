import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { Settings } from 'lucide-react';
import DashboardSettingsModal from './DashboardSettingsModal';

// Import Cards directly from their respective modules
import CrmDashboardCard from '../crm/CrmDashboardCard';
import InventoryDashboardCard from '../inventory/InventoryDashboardCard';
import SalesDashboardCard from '../sales/SalesDashboardCard';
import ProjectsDashboardCard from '../projects/ProjectsDashboardCard';
import CalendarDashboardCard from '../calendar/CalendarDashboardCard';
import FinanceDashboardCard from '../finance/FinanceDashboardCard';
import PurchasesDashboardCard from '../purchases/PurchasesDashboardCard';
import RealEstateDashboardCard from '../realestate/RealEstateDashboardCard';
import WarehouseDashboardCard from '../warehouse/WarehouseDashboardCard';
import PayrollDashboardCard from '../payroll/PayrollDashboardCard';

export default function ClientDashboard() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  const activeModules = user?.subscription?.activeModules || [];
  const [logoUrl, setLogoUrl] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
    finance: FinanceDashboardCard,
    purchases: PurchasesDashboardCard,
    realestate: RealEstateDashboardCard,
    warehouse: WarehouseDashboardCard,
    payroll: PayrollDashboardCard
  };

  // Filter modules based on user preferences
  const visibleModules = user?.dashboardPreferences && Array.isArray(user.dashboardPreferences)
    ? activeModules.filter(m => user.dashboardPreferences.includes(m))
    : activeModules;

  return (
    <div className="animate-in fade-in duration-500 space-y-6 md:space-y-10">
      {/* Welcome Header */}
      <section className="relative rounded-3xl overflow-hidden p-5 md:p-8 bg-[var(--color-surface-container-low)] border border-[#6B4FD8]/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
          <div className="max-w-xl">
            <h2 className="text-2xl lg:text-3xl font-black tracking-tighter text-[var(--color-on-surface)] mb-1 md:mb-2 leading-tight">
              Hola, <span className="text-[var(--color-primary)]">{user?.name?.split(' ')[0] || 'Usuario'}</span>.
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-[10px] md:text-sm leading-relaxed max-w-sm">
              Este es el resumen centralizado de tus módulos activos.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {logoUrl && (
              <div className="hidden md:block shrink-0">
                <div className="w-20 h-20 rounded-2xl border border-[#6B4FD8]/10 bg-[var(--color-surface-container)] overflow-hidden">
                  <img src={logoUrl} alt="Logo Empresa" className="w-full h-full object-contain p-2" />
                </div>
              </div>
            )}
            
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] rounded-2xl transition-all hover:scale-105 active:scale-95 group"
              title="Personalizar widgets"
            >
              <Settings size={20} className="group-hover:rotate-45 transition-transform" />
            </button>
          </div>
        </div>
        
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-l from-[#6B4FD8]/20 to-transparent"></div>
          <div className="absolute right-[-20%] top-1/2 -translate-y-1/2 w-64 h-64 border-[1px] border-[#6B4FD8]/20 rounded-full"></div>
        </div>
      </section>

      {/* Main Modules Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {visibleModules.map((modKey) => {
          const CardComponent = moduleCards[modKey];
          if (!CardComponent) return null;

          return <CardComponent key={modKey} orgId={orgId} />;
        })}
        {visibleModules.includes('inventory') && <WarehouseDashboardCard orgId={orgId} />}
        {(user?.role === 'admin' && visibleModules.includes('payroll')) && <PayrollDashboardCard orgId={orgId} />}
      </section>

      {/* MODALS */}
      <DashboardSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        activeModules={activeModules}
      />
    </div>
  );
}
