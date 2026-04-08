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
- [ ] TBD (run /plan 4 to create)

**Verification**:
- TBD

---

### Phase 6: Contabilidad y Finanzas
**Status**: ⬜ Not Started
**Objective**: Registro de ingresos y gastos, flujo de caja y reportes financieros básicos (P&L).
**Depends on**: Phase 4

**Tasks**:
- [ ] TBD (run /plan 6 to create)

**Verification**:
- TBD

---

### Phase 7: Agenda y Citas (Módulo Plus)
**Status**: ⬜ Not Started
**Objective**: Sistema de calendario para reservas de clientes y recordatorios automatizados.
**Depends on**: Phase 2

**Tasks**:
- [ ] TBD (run /plan 7 to create)

**Verification**:
- TBD

---

### Phase 8: Gestión de Proyectos (Módulo Plus)
**Status**: ⬜ Not Started
**Objective**: Tableros Kanban y seguimiento de tareas para equipos y freelancers.
**Depends on**: Phase 2

**Tasks**:
- [ ] TBD (run /plan 8 to create)

**Verification**:
- TBD

---

### Phase 9: Marketplace y Sistema de Suscripciones
**Status**: ⬜ Not Started
**Objective**: Implementar la pasarela de pagos para el SaaS y la activación/desactivación dinámica de módulos.
**Depends on**: Phase 1, Phase 4

**Tasks**:
- [ ] TBD (run /plan 9 to create)

**Verification**:
- TBD
