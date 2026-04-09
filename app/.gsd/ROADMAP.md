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
**Status**: ⬜ Not Started
**Objective**: Tableros Kanban y seguimiento de tareas para equipos y freelancers.
**Depends on**: Phase 2

**Tasks**:
- [ ] Implementar hook `useProjects` y persistencia en Firestore
- [ ] Desarrollar interfaz `ProjectModule.jsx` (Listado y Gestión)
- [ ] Construir `ProjectKanban.jsx` con tareas reactivas
- [ ] Integrar KPIs en el Dashboard y navegación global

**Verification**:
- [ ] Creación y listado de proyectos funcional (Mock/Firebase).
- [ ] Tablero Kanban operativo con cambio de estado de tareas.
- [ ] Acceso desde el menú lateral y visualización de métricas en Dashboard.


---

### Phase 9: Marketplace y Sistema de Suscripciones
**Status**: ⬜ Not Started
**Objective**: Implementar la pasarela de pagos para el SaaS y la activación/desactivación dinámica de módulos.
**Depends on**: Phase 1, Phase 4

**Tasks**:
- [ ] TBD (run /plan 9 to create)

**Verification**:
- TBD
