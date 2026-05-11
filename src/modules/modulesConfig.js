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

// Direct mapping of module definitions to centralize source of truth
export const MODULES_CATALOG = [
  { id: 'crm', label: 'CRM y Ventas', icon: Users, path: '/client/crm' },
  { id: 'inventory', label: 'Inventario', icon: Box, path: '/client/inventory' },
  { id: 'warehouse', label: 'Bodega', icon: Package, path: '/client/warehouse' },
  { id: 'sales', label: 'Ventas y Facturas', icon: FileText, path: '/client/sales' },
  { id: 'finance', label: 'Contabilidad', icon: Calculator, path: '/client/finance' },
  { id: 'projects', label: 'Proyectos', icon: Briefcase, path: '/client/projects' },
  { id: 'purchases', label: 'Compras y Proveedores', icon: ShoppingCart, path: '/client/purchases' },
  { id: 'calendar', label: 'Agenda', icon: Calendar, path: '/client/calendar' },
  { id: 'realestate', label: 'Terrenos Inmobiliarios', icon: Building, path: '/client/realestate' },
  { id: 'payroll', label: 'Nóminas', icon: Wallet, path: '/client/payroll', requiresAdminAccess: true },
  { id: 'health', label: 'Salud', icon: Activity, path: '/client/salud', requiresAdminAccess: true },
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

  // Implicit: Warehouse is granted if Inventory is present
  if (baseActive.includes('inventory') && !accessible.includes('warehouse')) {
    accessible.push('warehouse');
  }

  // Role-based defaults
  if (user.role === 'admin') {
    if (!accessible.includes('payroll')) accessible.push('payroll');
    if (!accessible.includes('health')) accessible.push('health');
  }

  return accessible;
};

/**
 * Takes accessible module keys and sorts them based on user's modulesOrder preferences.
 */
export const getOrderedModules = (accessibleKeys, savedOrder) => {
  if (!savedOrder || !Array.isArray(savedOrder)) {
    // Fallback to default CATALOG order among accessible keys
    return MODULES_CATALOG
      .map(m => m.id)
      .filter(id => accessibleKeys.includes(id));
  }

  // Filter saved order to only contain currently accessible keys
  const sortedValid = savedOrder.filter(id => accessibleKeys.includes(id));
  
  // Find any new accessible modules not yet in user's saved order
  const missing = accessibleKeys.filter(id => !sortedValid.includes(id));

  // Merge, keeping missing ones at the end (or ordered by catalog)
  const orderedMissing = MODULES_CATALOG
    .map(m => m.id)
    .filter(id => missing.includes(id));

  return [...sortedValid, ...orderedMissing];
};
