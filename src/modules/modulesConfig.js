import { 
  Users, 
  Building, 
  Briefcase, 
  Box, 
  Calculator, 
  FileText, 
  ShoppingCart, 
  Calendar, 
  Wallet, 
  Activity, 
  Package 
} from 'lucide-react';

import { MODULE_IDS, MODULE_NAMES, MODULE_SLUGS } from './moduleNames';

// Direct mapping of module definitions to centralize source of truth
export const MODULES_CATALOG = [
  { id: MODULE_IDS.CRM, label: MODULE_NAMES[MODULE_IDS.CRM], icon: Users, path: `/client/${MODULE_SLUGS[MODULE_IDS.CRM]}` },
  { id: MODULE_IDS.INVENTORY, label: MODULE_NAMES[MODULE_IDS.INVENTORY], icon: Box, path: `/client/${MODULE_SLUGS[MODULE_IDS.INVENTORY]}` },
  { id: MODULE_IDS.SALES, label: MODULE_NAMES[MODULE_IDS.SALES], icon: FileText, path: `/client/${MODULE_SLUGS[MODULE_IDS.SALES]}` },
  { id: MODULE_IDS.FINANCE, label: MODULE_NAMES[MODULE_IDS.FINANCE], icon: Calculator, path: `/client/${MODULE_SLUGS[MODULE_IDS.FINANCE]}` },
  { id: MODULE_IDS.PROJECTS, label: MODULE_NAMES[MODULE_IDS.PROJECTS], icon: Briefcase, path: `/client/${MODULE_SLUGS[MODULE_IDS.PROJECTS]}` },
  { id: MODULE_IDS.PURCHASES, label: MODULE_NAMES[MODULE_IDS.PURCHASES], icon: ShoppingCart, path: `/client/${MODULE_SLUGS[MODULE_IDS.PURCHASES]}` },
  { id: MODULE_IDS.CALENDAR, label: MODULE_NAMES[MODULE_IDS.CALENDAR], icon: Calendar, path: `/client/${MODULE_SLUGS[MODULE_IDS.CALENDAR]}` },
  { id: MODULE_IDS.REALESTATE, label: MODULE_NAMES[MODULE_IDS.REALESTATE], icon: Building, path: `/client/${MODULE_SLUGS[MODULE_IDS.REALESTATE]}` },
  { id: MODULE_IDS.PAYROLL, label: MODULE_NAMES[MODULE_IDS.PAYROLL], icon: Wallet, path: `/client/${MODULE_SLUGS[MODULE_IDS.PAYROLL]}`, requiresAdminAccess: true },
  { id: MODULE_IDS.HEALTH, label: MODULE_NAMES[MODULE_IDS.HEALTH], icon: Activity, path: `/client/${MODULE_SLUGS[MODULE_IDS.HEALTH]}`, requiresAdminAccess: true },
];

/**
 * Gets the base list of modules the user has actual access to.
 * Handles implicit modules like warehouse (derived from inventory) 
 * and role-based modules like payroll/health.
 */
export const getAccessibleModules = (user) => {
  if (!user) return [];
  const baseActive = user?.subscription?.activeModules || [];
  
  // Create a complete list of keys accessible to this user
  const accessible = [...baseActive];

  // Role-based defaults
  if (user.role === 'admin') {
    if (!accessible.includes('payroll')) accessible.push('payroll');
    if (!accessible.includes('health')) accessible.push('health');
  }

  // Safeguard: Deduplicate accessible modules before returning
  return [...new Set(accessible)];
};

export const getOrderedModules = (accessibleKeys, savedOrder) => {
  const keys = accessibleKeys || [];
  
  // Deduplicate inputs first for consistency
  const uniqueKeys = [...new Set(keys)];

  if (!savedOrder || !Array.isArray(savedOrder)) {
    // Fallback to default CATALOG order
    return MODULES_CATALOG
      .map(m => m.id)
      .filter(id => uniqueKeys.includes(id));
  }

  // Filter saved order to ensure it only contains existing and accessible keys
  const sortedValid = savedOrder.filter(id => uniqueKeys.includes(id));
  
  // Find keys accessible but not explicitly stored in savedOrder
  const missing = uniqueKeys.filter(id => !sortedValid.includes(id));

  // Order missing keys based on native CATALOG order
  const orderedMissing = MODULES_CATALOG
    .map(m => m.id)
    .filter(id => missing.includes(id));

  // Deduplicate the combined result just in case to ensure 100% visual integrity
  return [...new Set([...sortedValid, ...orderedMissing])];
};


