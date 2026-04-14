# ROADMAP

## Milestone 1: Core Modules & Data Persistence

### Phase 1: Foundation & Auth (ArchitectOS)
**Status**: ✅ Complete
**Objective**: Establecer el diseño base, sistema de ruteo y autenticación mock con Tailwind v4.
**Depends on**: None

**Tasks**:
- [x] Configurar Vite + React + Tailwind v4
- [x] Implementar sistema de diseño ArchitectOS (Glassmorphism)
- [x] Crear Layouts de Administración y Cliente
- [x] Implementar flujo de Login Mock y AuthContext

**Verification**:
- [x] Login con usuarios `admin@pkt.com` / `client@pkt.com` funcional.
- [x] Navegación entre portales correcta.

---

### Phase 2: CRM Module — Gestión de Clientes
**Status**: ✅ Complete
**Objective**: Implementar la gestión real de contactos, leads y pipeline comercial con persistencia.
**Depends on**: Phase 1

**Tasks**:
- [x] Configurar Firebase SDK y Firestore
- [x] Implementar hook reactivo `useCrm`
- [x] Refactorizar UI CRM (Kanban y Listado de Contactos)
- [x] Desarrollar formularios modales para CRUD en tiempo real

**Verification**:
- [x] Datos persistidos en Firestore vinculados a `orgId`.
- [x] Tablero Kanban funcional con cambios de estado reactivos.

---

### Phase 3: Inventory Module — Control de Stock
**Status**: ✅ Complete
**Objective**: Sistema de inventario con categorías, alertas de stock mínimo y trazabilidad básica.
**Depends on**: Phase 1

**Tasks**:
- [x] Configuración de Firebase y `useInventory`
- [x] Refactorización Reactiva de InventoryModule
- [x] Agregar formulario/Modal de creación de Productos

**Verification**:
- [x] Datos leídos y almacenados mediante Firestore (o en mock estático si la clave falta)
- [x] Formulario operativo con visualización de estado de carga
- [x] Alertas de Stock dinámicas


---

### Phase 4: Ventas y Facturación
**Status**: ✅ Complete
**Objective**: Emisión de cotizaciones y facturas básicas ligadas al inventario y CRM.
**Depends on**: Phase 2, Phase 3

**Tasks**:
- [x] Crear capa de datos (hook `useSales`) compatible con Firebase y Mock Mode
- [x] Desarrollar UI `SalesModule.jsx` y KPIs agregados interactivos
- [x] Crear Modal interactivo e integrarlo con clientes (`useCrm`) y productos (`useInventory`)
- [x] Integrar enlace a Ventas en navegación y rutas principal

**Verification**:
- [x] La pestaña de Ventas (Sales) está disponible en la app Client y redirige exitosamente.
- [x] Se pueden consultar, registrar y visualizar ventas e interactuar con el stock.

---

### Phase 5: Dashboard Central & Configuración de Empresa
**Status**: ✅ Complete
**Objective**: Implementar un dashboard unificado con KPIs de todos los módulos activos y la gestión del perfil empresarial.
**Depends on**: Phase 2, Phase 3, Phase 4

**Tasks**:
- [x] Implementar DashboardModule con KPIs agregados (CRM, Inventario, Ventas)
- [x] Crear SettingsModule para gestión de Perfil de Empresa
- [x] Integrar navegación y rutas para Dashboard y Settings

**Verification**:
- [x] Dashboard muestra datos reales de los módulos activos.
- [x] El perfil de empresa se persiste correctamente en Firestore.
- [x] El nombre de la empresa es dinámico en la interfaz.

---

### Phase 6: Contabilidad y Finanzas
**Status**: ✅ Complete
**Objective**: Registro de ingresos y gastos, flujo de caja y reportes financieros básicos (P&L).
**Depends on**: Phase 4

**Tasks**:
- [x] Implementar capa de persistencia `useFinance` para transacciones
- [x] Construir y enlazar `FinanceModule` (UI, KPIs, tabla interactiva)

**Verification**:
- [x] Transacciones correctamente registradas en Firestore asociadas al orgId.
- [x] Dashboard de Finanzas muestra los agregados correctos (Ingresos/Gastos/Balance) según las transacciones.

---

### Phase 7: Agenda y Citas (Módulo Plus)
**Status**: ✅ Complete
**Objective**: Sistema de calendario para reservas de clientes y recordatorios automatizados.
**Depends on**: Phase 2

**Tasks**:
- [ ] Implementar capa de datos `useAppointments` para gestión reactiva
- [ ] Desarrollar interfaz `CalendarModule.jsx` y modal de nueva cita
- [ ] Integrar citas con clientes de CRM
- [ ] Conectar módulo en menú principal de cliente

**Verification**:
- [x] Es posible agendar una junta/cita enlazando al cliente existente.
- [x] Las citas se muestran en el entorno (calendario visual o lista).

---

### Phase 8: Gestión de Proyectos (Módulo Plus)
**Status**: ✅ Complete
**Objective**: Tableros Kanban y seguimiento de tareas para equipos y freelancers.
**Depends on**: Phase 2

**Tasks**:
- [x] Implementar hook `useProjects` y persistencia en Firestore
- [x] Desarrollar interfaz `ProjectModule.jsx` (Listado y Gestión)
- [x] Construir `ProjectKanban.jsx` con tareas reactivas
- [x] Integrar KPIs en el Dashboard y navegación global

**Verification**:
- [x] Creación y listado de proyectos funcional (Mock/Firebase).
- [x] Tablero Kanban operativo con cambio de estado de tareas.
- [x] Acceso desde el menú lateral y visualización de métricas en Dashboard.


---

### Phase 9: Marketplace y Sistema de Suscripciones
**Status**: ✅ Complete
**Objective**: Implementar la pasarela de pagos para el SaaS y la activación/desactivación dinámica de módulos.
**Depends on**: Phase 1, Phase 4

**Tasks**:
- [x] Implementar estado global de módulos activos en AuthContext
- [x] Crear componente ModuleRoute para protección de acceso
- [x] Desarrollar interfaz de Marketplace con tarjetas de productos
- [x] Integrar flujo de Checkout simulado y persistencia local/mock

**Verification**:
- [x] Los módulos se activan dinámicamente tras el pago simulado.
- [x] El sidebar y el ruteo respetan los permisos del tenant.

---

### Phase 10: Arreglos y Mejoras de Admin
**Status**: ✅ Complete
**Objective**: Hacer funcionar la creación de organizaciones, equiparar módulo de facturación admin con clientes, y remover cabeceras redundantes ("Architect OS").
**Depends on**: Phase 9

**Tasks**:
- [x] Hacer funcional el botón "Nueva Organización" en el listado de clientes del Admin.
- [x] Asegurar que los módulos de facturación (Sales) del lado de Admin sean iguales a los del lado Cliente.
- [x] Eliminar la cabecera "Architect OS" de los módulos de la parte de Admin (ya que las opciones están en el sidebar).

**Verification**:
- [x] Creación de nueva organización funcional operando sobre la base mock/firebase.
- [x] Las interfaces de facturación son consistentes entre admin y cliente.
---

## Milestone 2: Platform Growth & SaaS Operations

### Phase 11: Sistema de Suscripciones y Entitlements
**Status**: ✅ Complete
**Objective**: Evolucionar la activación manual de módulos a un sistema de Planes (Basic, Pro, Enterprise) con límites técnicos.
**Depends on**: Phase 9, Phase 10

**Tasks**:
- [x] Definir lógica de "Planes" que agrupen módulos automáticamente.
- [x] Implementar gestión de Cuotas de Uso (ej. límite de usuarios, almacenamiento o documentos).
- [x] Integrar visualización de estado de suscripción en el Portal de Cliente.
- [x] Crear panel de control de "Billing" en Admin para gestionar facturas del SaaS.

**Verification**:
- [x] El sistema bloquea acciones si se supera la cuota del plan.
- [x] Los usuarios solo ven los módulos incluidos en su Tier seleccionado.

---

### Phase 12: Business Intelligence & SaaS Metrics (Admin)
**Status**: ✅ Complete
**Objective**: Proporcionar al dueño del ERP visibilidad total sobre los ingresos y el comportamiento del cliente.
**Depends on**: Phase 11

**Tasks**:
- [x] Implementar dashboard de métricas SaaS: MRR, ARR y Churn Rate.
- [x] Crear reportes de popularidad de módulos (Usage Analytics).
- [ ] Implementar visualización de Health Score automático por cliente.
- [ ] Desarrollar exportación de métricas financieras para contabilidad del ERP.

**Verification**:
- [x] Los gráficos de MRR muestran datos precisos basados en las suscripciones activas.
- [x] Es posible identificar popularidad de módulos desde el panel admin.

---

### Phase 13: Centro de Soporte y Diagnóstico (SaaS Ops)
**Status**: ✅ Complete
**Objective**: Herramientas para dar soporte técnico eficiente y seguro a los clientes.
**Depends on**: Phase 10

**Tasks**:
- [x] Implementar sistema de "Impersonación" (Login as tenant) con auditoría.
- [ ] Crear visor de Logs de Actividad multi-tenant para resolución de conflictos.
- [ ] Desarrollar panel de errores críticos y notificaciones para el Administrador.

**Verification**:
- [x] El administrador puede entrar al portal de un cliente de forma segura para dar soporte.
---

### Phase 14: Onboarding & Self-Service Password
**Status**: ✅ Complete
**Objective**: Permitir que los administradores inviten usuarios y que estos configuren su propia contraseña mediante un link seguro.
**Depends on**: Phase 11

**Tasks**:
- [ ] Implementar estados de usuario (Pending/Active) y lógica de tokens en AuthContext.
- [ ] Desarrollar la UI de "Copiar Link de Invitación" en el panel de administración.
- [ ] Crear la página pública de `/setup-password` con validación de fuerza de contraseña.

**Verification**:
- [ ] Al crear un usuario, el admin recibe un link único.
- [ ] Acceder al link permite guardar una contraseña y activa la cuenta inmediatamente.
