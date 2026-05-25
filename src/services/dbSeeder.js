/**
 * Servicio de inicialización (seeding) de base de datos para pruebas.
 * Extraído fuera de AuthContext para reducir el tamaño del archivo y el acoplamiento.
 */
export const seedDatabase = async (user, adminCreateOrg, addLog) => {
  if (user?.role !== 'superadmin') {
    console.warn("⚠️ Acción restringida a SuperAdmin.");
    return;
  }
  
  try {
    console.log("🌱 Iniciando seeding de base de datos...");
    
    // 1. Crear algunas organizaciones de prueba
    const demoOrgs = [
      { name: 'Empresa Alpha S.A.C.', ruc: '20123456789', planId: 'business', modules: ['crm', 'inventory', 'sales', 'projects'], users: 3 },
      { name: 'Beta Tech Solutions', ruc: '20987654321', planId: 'startup', modules: ['crm', 'calendar'], users: 1 },
      { name: 'Gamarra Fashion ERP', ruc: '20555555555', planId: 'business', modules: ['crm', 'inventory', 'sales', 'finance', 'purchases'], users: 5 }
    ];

    for (const org of demoOrgs) {
      await adminCreateOrg({
        name: org.name,
        ruc: org.ruc,
        planId: org.planId,
        activeModules: org.modules,
        maxUsers: 10
      });
    }

    // 2. Crear algunos logs de prueba
    const demoLogs = [
      { action: 'Configuración Inicial', details: 'Se activaron módulos base para la organización Alpha', type: 'info' },
      { action: 'Alerta de Inventario', details: 'Stock crítico detectado en Almacén Central', type: 'warning' },
      { action: 'Nueva Venta', details: 'Factura F001-0005 generada satisfactoriamente', type: 'success' }
    ];

    for (const log of demoLogs) {
      await addLog(log.action, log.details, log.type);
    }

    console.log("✅ Seeding completado.");
    window.location.reload(); // Recargar para ver los cambios
  } catch (error) {
    console.error("Error durante el seeding:", error);
  }
};
