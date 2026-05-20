import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Settings } from 'lucide-react';
import DashboardSettingsModal from './DashboardSettingsModal';
import { getAccessibleModules, getOrderedModules } from '../../modulesConfig';

// Import Cards directly from their respective modules
import CrmDashboardCard from '../crm/CrmDashboardCard';
import InventoryDashboardCard from '../inventory/InventoryDashboardCard';
import SalesDashboardCard from '../sales/SalesDashboardCard';
import ProjectsDashboardCard from '../projects/ProjectsDashboardCard';
import CalendarDashboardCard from '../calendar/CalendarDashboardCard';
import FinanceDashboardCard from '../finance/FinanceDashboardCard';
import PurchasesDashboardCard from '../purchases/PurchasesDashboardCard';
import RealEstateDashboardCard from '../realestate/RealEstateDashboardCard';
import PayrollDashboardCard from '../payroll/PayrollDashboardCard';
import HealthDashboardCard from '../health/HealthDashboardCard';

export default function ClientDashboard() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
    payroll: PayrollDashboardCard,
    health: HealthDashboardCard
  };
  const accessibleKeys = getAccessibleModules(user);
  const orderedKeys = getOrderedModules(accessibleKeys, user?.modulesOrder);

  // Filter modules based on user preferences and access, preserving user order
  const visibleModules = orderedKeys.filter(k => 
    user?.dashboardPreferences 
      ? user.dashboardPreferences.includes(k)
      : true // Default to visible if preferences don't exist yet
  );

  return (
    <div className="animate-in fade-in duration-500 space-y-6 md:space-y-10">
      {/* Welcome Header */}
      <section className="relative rounded-3xl overflow-hidden p-5 md:p-8 bg-[var(--color-surface-container-low)] border border-[#6B4FD8]/10">
        <div className="relative z-10 flex flex-row items-center justify-between gap-4 md:gap-8">
          <div className="min-w-0 flex-1 max-w-xl">
            <h2 className="text-xl lg:text-3xl font-black tracking-tighter text-[var(--color-on-surface)] mb-1 leading-tight truncate">
              Hola, <span className="text-[var(--color-primary)]">{user?.name?.split(' ')[0] || 'Usuario'}</span>.
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-[10px] md:text-sm leading-relaxed max-w-sm">
              Este es el resumen centralizado de tus módulos activos.
            </p>
          </div>

          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 md:p-3 bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] rounded-2xl transition-all hover:scale-105 active:scale-95 group"
              title="Personalizar widgets"
            >
              <Settings size={18} className="group-hover:rotate-45 transition-transform md:w-5 md:h-5" />
            </button>
            
            <div className="w-12 h-12 md:w-20 md:h-20 rounded-2xl border border-[#6B4FD8]/20 bg-[var(--color-surface-container)] overflow-hidden flex items-center justify-center font-black text-lg md:text-2xl shrink-0 shadow-sm"
              style={{ 
                color: 'var(--color-primary)',
                backgroundColor: user?.photoUrl ? 'var(--color-surface-container)' : 'color-mix(in srgb, var(--color-primary) 10%, var(--color-surface-container))'
              }}
            >
              {user?.photoUrl ? (
                <img src={user.photoUrl} alt="Avatar de Usuario" className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name?.substring(0, 2).toUpperCase() || 'US'}</span>
              )}
            </div>
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
      </section>

      {/* MODALS */}
      <DashboardSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
      />
    </div>
  );
}
