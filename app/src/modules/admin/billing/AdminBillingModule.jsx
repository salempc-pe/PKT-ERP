import { useState } from 'react';
import { Building2, CreditCard, TrendingUp, DollarSign, Filter } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function AdminBillingModule() {
  const { allOrganizations, SUBSCRIPTION_PLANS } = useAuth();
  const [selectedOrgId, setSelectedOrgId] = useState('all');

  // Calcular métricas
  const activeOrgs = allOrganizations.filter(org => org.status === 'active');
  const totalMRR = activeOrgs.reduce((total, org) => {
    const planPrice = SUBSCRIPTION_PLANS[org.subscription?.planId]?.price;
    // Fallbacks si no hay precio definido en el plan
    const fallbackPrice = org.subscription?.planId === 'enterprise' ? 299 : org.subscription?.planId === 'business' ? 99 : 0;
    return total + (planPrice ?? fallbackPrice);
  }, 0);

  // Calcular plan más común
  const planCounts = activeOrgs.reduce((acc, org) => {
    const planId = org.subscription?.planId || 'startup';
    acc[planId] = (acc[planId] || 0) + 1;
    return acc;
  }, {});
  let mostCommonPlan = 'N/A';
  let maxCount = 0;
  for (const [plan, count] of Object.entries(planCounts)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommonPlan = plan;
    }
  }

  const filteredOrgs = selectedOrgId === 'all' 
    ? activeOrgs 
    : activeOrgs.filter(org => org.id === selectedOrgId);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" size={18} />
            <select
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              className="bg-[var(--color-surface-container-low)] border border-[#40485d]/30 text-[var(--color-on-surface)] rounded-xl pl-10 pr-8 py-2 text-sm focus:outline-none focus:border-[#6B4FD8]/50 transition-all appearance-none"
            >
              <option value="all">Todas las organizaciones</option>
              {allOrganizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-surface-container-low)]/60 border border-[#40485d]/30 rounded-3xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-md flex items-center gap-1">
              <TrendingUp size={12} /> +12%
            </span>
          </div>
          <div>
            <p className="text-[var(--color-on-surface-variant)] text-xs font-bold uppercase tracking-wider">MRR Total</p>
            <h3 className="text-2xl font-black text-[var(--color-on-surface)]">S/ {totalMRR}</h3>
          </div>
        </div>

        <div className="bg-[var(--color-surface-container-low)]/60 border border-[#40485d]/30 rounded-3xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#6B4FD8]/10 flex items-center justify-center text-[#6B4FD8]">
              <Building2 size={20} />
            </div>
          </div>
          <div>
            <p className="text-[var(--color-on-surface-variant)] text-xs font-bold uppercase tracking-wider">Orgs Activas</p>
            <h3 className="text-2xl font-black text-[var(--color-on-surface)]">{activeOrgs.length}</h3>
          </div>
        </div>

        <div className="bg-[var(--color-surface-container-low)]/60 border border-[#40485d]/30 rounded-3xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#2E8B57]/10 flex items-center justify-center text-[#2E8B57]">
              <CreditCard size={20} />
            </div>
          </div>
          <div>
            <p className="text-[var(--color-on-surface-variant)] text-xs font-bold uppercase tracking-wider">Plan Más Común</p>
            <h3 className="text-2xl font-black text-[var(--color-on-surface)] capitalize">{mostCommonPlan}</h3>
          </div>
        </div>
      </div>

      {/* Tabla de Suscripciones */}
      <div className="bg-[var(--color-surface-container-low)]/60 border border-[#40485d]/30 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="p-5 border-b border-[#40485d]/30 flex justify-between items-center bg-[#0a0a0a]">
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0a0a] border-b border-[#40485d]/30 text-[10px] uppercase font-bold tracking-widest text-[var(--color-on-surface-variant)]">
                <th className="px-6 py-4">Organización</th>
                <th className="px-6 py-4">Plan Actual</th>
                <th className="px-6 py-4">MRR</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#40485d]/10">
              {filteredOrgs.map((org) => {
                const planId = org.subscription?.planId || 'startup';
                const planPrice = SUBSCRIPTION_PLANS[planId]?.price;
                const fallbackPrice = planId === 'enterprise' ? 299 : planId === 'business' ? 99 : 0;
                
                return (
                  <tr key={org.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[var(--color-on-surface)]">{org.name}</div>
                      <div className="text-xs text-[var(--color-on-surface-variant)]">ID: {org.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-[#6B4FD8] uppercase tracking-wider">
                        {SUBSCRIPTION_PLANS[planId]?.name || planId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[var(--color-on-surface)]">S/ {planPrice ?? fallbackPrice}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-[#4ADE80]/10 text-[#4ADE80] text-[10px] uppercase font-bold">
                        {org.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredOrgs.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[var(--color-on-surface-variant)] italic text-sm">
                    No se encontraron organizaciones para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
