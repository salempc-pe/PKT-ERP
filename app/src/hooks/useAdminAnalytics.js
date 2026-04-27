import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';


export const calculateHealthScore = (org) => {
  const activeModules = org?.subscription?.activeModules?.length || 0;
  if (activeModules >= 4) return 'Excellent';
  if (activeModules >= 2) return 'Good';
  return 'At Risk';
};

export function useAdminAnalytics() {
  const { allOrganizations, allUsers } = useAuth();

  const calculateMRR = useMemo(() => {
    return allOrganizations.reduce((total, org) => {
      const fee = org.subscription?.monthlyFee || 0;
      return total + Number(fee);
    }, 0);
  }, [allOrganizations]);

  // Métricas de Stickiness Basadas en Datos Reales
  const stickinessMetrics = useMemo(() => {
    // Seat Utilization Real
    const totalMaxUsers = allOrganizations.reduce((acc, org) => 
      acc + (org.subscription?.maxUsers || org.maxUsers || 0), 0
    );
    const activeUsersCount = allUsers.filter(u => u.organizationId).length;
    const seatUtilization = totalMaxUsers > 0 ? Math.round((activeUsersCount / totalMaxUsers) * 100) : 0;

    return {
      // NOTA: Para obtener métricas globales reales de contactos/SKUs/etc 
      // se requiere agregación en el servidor (Cloud Functions). 
      // Por ahora se muestran en 0 para integridad.
      globalGMV: 0, 
      globalContacts: 0,
      globalSkus: 0,
      globalTasks: 0,
      globalPurchases: 0,
      seatUtilization,
      totalMaxUsers
    };
  }, [allOrganizations, allUsers]);

  const getModulePopularity = useMemo(() => {
    const counts = {};
    allOrganizations.forEach(org => {
      const modules = org.subscription?.activeModules || [];
      modules.forEach(mod => {
        counts[mod] = (counts[mod] || 0) + 1;
      });
    });
    return counts;
  }, [allOrganizations]);

  const getGrowthMetrics = useMemo(() => {
    // Sin historial previo real, el crecimiento es 0%
    return {
      orgsGrowth: 0,
      usersGrowth: 0,
      mrrGrowth: 0
    };
  }, []);

  const getActiveCustomersCount = useMemo(() => {
    return allOrganizations.filter(o => o.status === 'active').length;
  }, [allOrganizations]);
  
  const getARPU = useMemo(() => {
    if (allOrganizations.length === 0) return 0;
    return Math.round(calculateMRR / allOrganizations.length);
  }, [calculateMRR, allOrganizations]);

  return {
    mrr: calculateMRR,
    arpu: getARPU,
    activeCustomersCount: getActiveCustomersCount,
    modulePopularity: getModulePopularity,
    growthMetrics: getGrowthMetrics,
    stickiness: stickinessMetrics,
    totalUsers: allUsers.length,
    activeOrganizations: allOrganizations,
  };
}
