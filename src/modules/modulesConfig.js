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

  // Role-based defaults
  if (user.role === 'admin') {
    if (!accessible.includes('payroll')) accessible.push('payroll');
    if (!accessible.includes('health')) accessible.push('health');
  }

  // Safeguard: Deduplicate accessible modules before returning
  return [...new Set(accessible)];
};

/**
 * Takes accessible module keys and rigidly sorts them based strictly on the MODULES_CATALOG order.
 * Ignore any savedOrder argument, ensuring absolute synchronization with configuration.
 */
export const getOrderedModules = (accessibleKeys, savedOrder) => {
  const keys = accessibleKeys || [];
  // Always respect the rigid central catalog sequence
  return MODULES_CATALOG
    .map(m => m.id)
    .filter(id => keys.includes(id));
};

