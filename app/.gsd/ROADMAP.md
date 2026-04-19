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
- [x] Implementar capa de datos `useAppointments` para gestión reactiva
- [x] Desarrollar interfaz `CalendarModule.jsx` y modal de nueva cita
- [x] Integrar citas con clientes de CRM
- [x] Conectar módulo en menú principal de cliente

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
- [x] Implementar visualización de Health Score automático por cliente.
- [x] Desarrollar exportación de métricas financieras para contabilidad del ERP.

**Verification**:
- [x] Los gráficos de MRR muestran datos precisos basados en las suscripciones activas.
- [x] Es posible identificar popularidad de módulos desde el panel admin.
- [x] Health Score renderizado y exportación de JSON funcional en Dashboard.

---

### Phase 13: Centro de Soporte y Diagnóstico (SaaS Ops)
**Status**: ✅ Complete
**Objective**: Herramientas para dar soporte técnico eficiente y seguro a los clientes.
**Depends on**: Phase 10

**Tasks**:
- [x] Implementar sistema de "Impersonación" (Login as tenant) con auditoría.
- [x] Crear visor de Logs de Actividad multi-tenant para resolución de conflictos.
- [x] Desarrollar panel de errores críticos y notificaciones para el Administrador.

**Verification**:
- [x] El administrador puede entrar al portal de un cliente de forma segura para dar soporte.
- [x] Auditoría de logs funcional y panel de alertas operativo en el dashboard.
---

### Phase 14: Onboarding & Self-Service Password
**Status**: ✅ Complete
**Objective**: Permitir que los administradores inviten usuarios y que estos configuren su propia contraseña mediante un link seguro.
**Depends on**: Phase 11

**Tasks**:
- [x] Implementar estados de usuario (Pending/Active) y lógica de tokens en AuthContext.
- [x] Desarrollar la UI de "Copiar Link de Invitación" en el panel de administración.
- [x] Crear la página pública de `/setup-password` con validación de fuerza de contraseña.

**Verification**:
- [x] Al crear un usuario, el admin recibe un link único.
- [x] Acceder al link permite guardar una contraseña y activa la cuenta inmediatamente.

---

## Milestone 3: Admin UX Polish

### Phase 15: Arreglos y Mejoras del Portal Admin
**Status**: ✅ Complete
**Objective**: Corregir gaps de funcionalidad en el portal administrativo: eliminación de organizaciones, módulos adicionales en edición, billing admin independiente, auditoría con filtros por org, y limpieza del sidebar.
**Depends on**: Phase 13, Phase 14

**Tasks**:
- [x] Plan 15.1 — Agregar botón de eliminar org + sección de módulos adicionales en modal editar, y quitar botón Support del sidebar
- [x] Plan 15.2 — Crear `AdminBillingModule` independiente con selector de organización activa, y mejorar Auditoría con filtros por organización y tipo de usuario

**Verification**:
- [x] El modal "Editar Organización" tiene botón "Eliminar" con confirmación.
- [x] El modal "Editar Organización" tiene sección de activación de módulos adicionales.
- [x] `/admin/sales` renderiza un módulo de billing propio (no el `SalesModule` del cliente).
- [x] El nombre del cliente (org) es visible en el módulo de billing admin.
- [x] La vista de Auditoría tiene columna "Organización" y filtros por org y por tipo de actor.
- [x] El botón "Support" no aparece en el sidebar del admin.

---

### Phase 16: Control de Facturación y Documentos (Clientes)
**Status**: ✅ Complete
**Objective**: Implementar panel de control de facturación para clientes con seguimiento de vencimientos (días restantes/retraso), estados de pago y emisión de comprobantes.
**Depends on**: Phase 15

**Tasks**:
- [x] Plan 16.1 — Actualización de capa de datos (useSales)
- [x] Plan 16.2 — Rediseño de interfaz de facturación (SalesModule)

**Verification**:
- [x] Cada documento muestra ID, nombre del cliente, fecha de emisión, fecha de vencimiento y totales.
- [x] El sistema calcula y muestra visualmente los días de retraso o días restantes para el vencimiento.
- [x] Interfaz cuenta con botones para "Emitir Boleta" y "Emitir Factura" según los requerimientos.

---

### Phase 17: Mejoras Avanzadas de Facturación e Integración Contable
**Status**: ✅ Complete
**Objective**: Automatizar la numeración de documentos, gestionar plazos de crédito vinculados al CRM y sincronizar movimientos pagados con el módulo de finanzas.
**Depends on**: Phase 16

**Tasks**:
- [x] **Plan 17.1**: Implementar numeración automática incremental para Boletas (B001-XXXX) y Facturas (F001-XXXX).
- [x] **Plan 17.2**: Actualizar CRM para incluir campos de configuración de crédito (Días de Crédito) por cliente.
- [x] **Plan 17.3**: Lógica de cálculo automático de fecha de vencimiento basada en el perfil de crédito del cliente seleccionado.
- [x] **Plan 17.4**: Implementar estados de flujo de vida: "Pagado" y "Anulado", con botones de acción en SalesModule.
- [x] **Plan 17.5**: Integración con Finanzas: Crear transacciones automáticas en useFinance solo cuando el documento se marque como "Pagado".

**Verification**:
- [x] Cada nueva factura/boleta tiene un correlativo único y secuencial.
- [x] La fecha de vencimiento se ajusta automáticamente según los días de crédito del cliente en el CRM.
- [x] Solo las facturas marcadas como "Pagado" generan entradas en el flujo de caja del módulo financiero.
- [x] Las facturas anuladas mantienen registro pero no afectan saldos.

---

### Phase 18: Rework del Dashboard
**Status**: ✅ Complete
**Objective**: Rediseñar el dashboard para mostrar exclusivamente tarjetas de los módulos activados (una por módulo), incluyendo información clave de cada módulo.
**Depends on**: Phase 17

**Tasks**:
- [x] Refactorizar `ClientDashboard.jsx` para carga dinámica de tarjetas.
- [x] Crear componentes de tarjeta específicos en cada módulo.
- [x] Crear componente base `DashboardCard` reutilizable.

**Verification**:
- [x] Solo se muestran tarjetas de módulos activos.
- [x] Los KPIs están integrados dentro de las tarjetas de cada módulo.
- [x] El código del dashboard es limpio y modular.

---

### Phase 19: Gestión del Logo de la Empresa
**Status**: ✅ Complete
**Objective**: Permitir la carga, procesamiento (redimensionamiento a cuadrado y optimización) y visualización del logo de la empresa en el portal de cliente y documentos.
**Depends on**: Phase 18

**Tasks**:
- [x] Implementar lógica de procesamiento de imagen (recorte y escala) en Canvas.
- [x] Crear componente de carga de logo en configuración de empresa.
- [x] Integrar visualización de logo en Sidebar Header y Client Dashboard.
- [x] Asegurar persistencia base64 en Firestore.

**Verification**:
- [x] Carga de imagen con recorte automático a cuadrado (shortest side).
- [x] Procesamiento de imagen para ligereza (tamaño icono).
- [x] Visualización del logo en el dashboard y sidebar.
- [x] Persistencia del logo en el perfil de la organización.
 
 - - -  
  
 # # #   P h a s e   2 0 :   M e j o r a s   d e   U X / U I   y   F l u j o s  
 * * S t a t u s * * :   +  N o t   S t a r t e d  
 * * O b j e c t i v e * * :   L i m p i a r   l a   i n t e r f a z   ( q u i t a r   t i t u l o s ,   n o t i f i c a c i o n e s   i n n e c e s a r i a s ,   a l i n e a r   m o d a l e s ) ,   o p t i m i z a r   l a   v i s t a   d e   b o t o n e s   e n   e l   C R M   p o r   p e s t a n a s   y   a g r e g a r   u n   m o d a l   b a s i c o   d e   i m p r e s i o n   d e   f a c t u r a s   a l   c o n f i r m a r   u n   p a g o .  
 * * D e p e n d s   o n * * :   P h a s e   1 9  
  
 * * T a s k s * * :  
 -   [   ]   E l i m i n a r   e l   p u n t o   d e   n o t i f i c a c i o n   e n   e l   b o t o n   d e   i n v e n t a r i o   d e l   S i d e b a r .  
 -   [   ]   E n   C R M :   m o v e r   ' N u e v o   c l i e n t e '   a   B a s e   d e   C o n t a c t o s   y   ' I n i c i a r   L e a d '   a   P i p e l i n e .  
 -   [   ]   E l i m i n a r   t i t u l o s   y   s u b t i t u l o s   d e   l o s   m o d u l o s .  
 -   [   ]   A g r e g a r   m o d a l   d e   i m p r e s i o n   ( b a s i c o )   a l   m a r c a r   f a c t u r a   c o m o   P a g a d a   e n   V e n t a s .  
 -   [   ]   C o r r e g i r   l a   v i s u a l i z a c i o n   d e l   m o d a l   e n   I n v e n t a r i o   p a r a   m a n t e n e r   e l   f o n d o   d e   l a   a p l i c a c i o n .  
  
 * * V e r i f i c a t i o n * * :  
 -   [   ]   V a l i d a r   U I   d e   S i d e b a r ,   C R M   ( b o t o n e s   p o r   p e s t a n a ) ,   T i t u l o s   r e m o v i d o s .  
 -   [   ]   P r o b a r   i m p r e s i o n   a l   c a m b i a r   a   P a g a d o   y   M o d a l   d e   I n v e n t a r i o   c o n   f o n d o   c o r r e c t o .  
  
 