import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const PLAN_PRICES = {
  startup: 0,
  business: 199,
  enterprise: 499
};

export const calculateHealthScore = (org) => {
  const activeModules = org?.subscription?.activeModules?.length || 0;
  if (activeModules >= 4) return 'Excellent';
  if (activeModules >= 2) return 'Good';
  return 'At Risk';
};

export function useAdminAnalytics() {
  const { mockOrganizations, mockUsers } = useAuth();

  const calculateMRR = useMemo(() => {
    return mockOrganizations.reduce((total, org) => {
      const planId = org.subscription?.planId;
      if (planId && PLAN_PRICES[planId]) {
        return total + PLAN_PRICES[planId];
      }
      return total;
    }, 0);
  }, [mockOrganizations]);

  const getModulePopularity = useMemo(() => {
    const counts = {};
    mockOrganizations.forEach(org => {
      const modules = org.subscription?.activeModules || [];
      modules.forEach(mod => {
        counts[mod] = (counts[mod] || 0) + 1;
      });
    });
    return counts;
  }, [mockOrganizations]);

  const getGrowthMetrics = useMemo(() => {
    // Simulamos un crecimiento del mes pasado
    const totalOrgs = mockOrganizations.length;
    const totalUsers = mockUsers.length;
    
    // Hardcoded past values for simulation
    const pastOrgs = Math.max(1, totalOrgs - 2); 
    const pastUsers = Math.max(1, totalUsers - 5);
    const pastMRR = calculateMRR * 0.8; // Asume 20% growth

    return {
      orgsGrowth: Math.round(((totalOrgs - pastOrgs) / pastOrgs) * 100),
      usersGrowth: Math.round(((totalUsers - pastUsers) / pastUsers) * 100),
      mrrGrowth: Math.round(((calculateMRR - pastMRR) / (pastMRR === 0 ? 1 : pastMRR)) * 100)
    };
  }, [mockOrganizations, mockUsers, calculateMRR]);

  const getActiveCustomersCount = useMemo(() => {
    return mockOrganizations.filter(o => o.status === 'active').length;
  }, [mockOrganizations]);
  
  const getARPU = useMemo(() => {
    if (mockOrganizations.length === 0) return 0;
    return Math.round(calculateMRR / mockOrganizations.length);
  }, [calculateMRR, mockOrganizations]);

  return {
    mrr: calculateMRR,
    arpu: getARPU,
    activeCustomersCount: getActiveCustomersCount,
    modulePopularity: getModulePopularity,
    growthMetrics: getGrowthMetrics,
    totalUsers: mockUsers.length,
    activeOrganizations: mockOrganizations,
  };
}
