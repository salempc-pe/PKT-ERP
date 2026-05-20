/**
 * Centralización de Nombres de Módulos e IDs para el ERP.
 * Define la lista oficial de 10 módulos en su formato canónico.
 * 
 * Módulos oficiales:
 * 1. CRM
 * 2. Inventario
 * 3. Facturación
 * 4. Contabilidad
 * 5. Proyectos
 * 6. Compras
 * 7. Agenda
 * 8. Nóminas
 * 9. Inmobiliaria
 * 10. Salud
 */

export const MODULE_IDS = {
  CRM: 'crm',
  INVENTORY: 'inventory',
  SALES: 'sales', // Técnico para Facturación
  FINANCE: 'finance', // Técnico para Contabilidad
  PROJECTS: 'projects',
  PURCHASES: 'purchases',
  CALENDAR: 'calendar',
  PAYROLL: 'payroll',
  REALESTATE: 'realestate',
  HEALTH: 'health'
};

export const MODULE_NAMES = {
  [MODULE_IDS.CRM]: 'CRM',
  [MODULE_IDS.INVENTORY]: 'Inventario',
  [MODULE_IDS.SALES]: 'Facturación',
  [MODULE_IDS.FINANCE]: 'Contabilidad',
  [MODULE_IDS.PROJECTS]: 'Proyectos',
  [MODULE_IDS.PURCHASES]: 'Compras',
  [MODULE_IDS.CALENDAR]: 'Agenda',
  [MODULE_IDS.PAYROLL]: 'Nóminas',
  [MODULE_IDS.REALESTATE]: 'Inmobiliaria',
  [MODULE_IDS.HEALTH]: 'Salud'
};

export const MODULE_SLUGS = {
  [MODULE_IDS.CRM]: 'crm',
  [MODULE_IDS.INVENTORY]: 'inventario',
  [MODULE_IDS.SALES]: 'facturacion',
  [MODULE_IDS.FINANCE]: 'contabilidad',
  [MODULE_IDS.PROJECTS]: 'proyectos',
  [MODULE_IDS.PURCHASES]: 'compras',
  [MODULE_IDS.CALENDAR]: 'agenda',
  [MODULE_IDS.PAYROLL]: 'nominas',
  [MODULE_IDS.REALESTATE]: 'inmobiliaria',
  [MODULE_IDS.HEALTH]: 'salud'
};
