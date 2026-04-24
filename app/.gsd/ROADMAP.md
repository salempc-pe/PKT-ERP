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
- [x] Integrar navegación y rutas para Dashboard and Settings

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

---

### Phase 20: Refinamiento UI y UX Flows
**Status**: ✅ Complete
**Objective**: Limpiar la interfaz eliminando notificaciones redundantes, títulos de módulos y optimizar flujos de CRM y Facturación.
**Depends on**: Phase 19

**Tasks**:
- [x] Eliminar punto de notificación de Inventario en el Sidebar.
- [x] Quitar títulos y subtítulos de cabecera en todos los módulos.
- [x] Reubicación de botones de acción en CRM según pestaña activa.
- [x] Corregir backdrop del modal en Inventario (transparencia).
- [x] Implementar modal de impresión rápida al marcar factura como "Pagada" en Ventas.

**Verification**:
- [x] Validar UI de Sidebar, CRM (botones por pestaña), Títulos removidos.
- [x] Probar impresión al cambiar a Pagado y Modal de Inventario con fondo correcto.

---

### Phase 21: Estandarización de Botones de Acción ✅
**Status**: Complete
**Objective**: Homogeneizar el estilo y posición de los botones principales en la parte superior de cada módulo.
**Depends on**: Phase 20

**Tasks**:
- [x] Cambiar el color de los botones principales a azul (predominante #85adff) en todos los módulos.
- [x] Alinear los botones siempre al lado derecho de la pantalla en la cabecera del módulo.
- [x] Asegurar coherencia visual en (Ventas, Inventario, CRM, Proyectos, Finanzas, Agenda).

**Verification**:
- [x] Revisar visualmente cada módulo en modo dark/light.
- [x] Confirmar alineación `justify-end` o `ml-auto`.

---

### Phase 22: Optimización del Módulo de Proyectos ✅
**Status**: Complete
**Objective**: Pulir la gestión de proyectos y tareas: añadir eliminación de proyectos, corregir reactividad de tareas, mejorar UI del Kanban y añadir edición de tareas.
**Depends on**: Phase 21

**Tasks**:
- [x] Reemplazar tres puntos en tarjetas de proyecto por un botón de eliminar (X) con confirmación.
- [x] Corregir reactividad al agregar y actualizar estado de tareas (usando Date() para instantaneidad).
- [x] Estandarizar botón "Nueva Tarea" (azul #85adff, estilo premium).
- [x] Mejorar visibilidad de botones de avance/retroceso en tareas (colores intensos y flechas).
- [x] Implementar modal de edición para títulos y descripciones de tareas.

**Verification**:
- [x] Probar eliminación de proyecto con confirmación.
- [x] Verificar que nuevas tareas aparezcan sin recargar.
- [x] Comprobar flujo de estados en Kanban con feedback visual inmediato.
- [x] Validar modal de edición de tarea.

---

### Phase 23: Enterprise Security & Multi-Tenant User Management
**Status**: ✅ Complete
**Objective**: Implementar un sistema de autenticación multi-inquilino con aislamiento estricto, invitaciones por correo, roles definidos (Admin/User) y límites de usuarios contratados gestionados desde el panel admin.
**Depends on**: Phase 22

**Tasks**:
- [x] **Plan 23.1**: Actualizar `AdminOrganizations` para permitir definir el `maxUsers` (límite contratado) de cada empresa.
- [x] **Plan 23.2**: Refactorizar Firebase Security Rules para aplicar aislamiento estricto por `organizationId` (Multi-tenancy).
- [x] **Plan 23.3**: Implementar el módulo de "Gestión de Equipo" dentro del portal de Cliente (solo para usuarios con rol `Admin`).
- [x] **Plan 23.4**: Desarrollar la lógica de validación de cuotas antes de generar una nueva invitación.
- [x] **Plan 23.5**: Ajustar `AuthContext` para persistir y validar el rol del usuario (`admin` vs `user`) dentro de su organización.

**Verification**:
- [x] Acceso multi-tenant aislado verificado (UID-based rules).
- [x] Límite de usuarios (`maxUsers`) respetado en creación de cuentas.
- [x] Flujo de invitación y activación de contraseña funcional en producción.

---

### Phase 24: SuperAdmin Portal UX & Production Flow
**Status**: 🚧 In Progress
**Objective**: Consolidar la gestión de inquilinos con guardado unificado, corrección de límites de cuota y feedback de invitaciones profesional.
**Depends on**: Phase 23

**Tasks**:
- [x] Implementar `adminUpdateFullOrg` para guardado atómico (Plan/Módulos/Límite/Datos).
- [x] Refactorizar modal de edición en `AdminClients.jsx` con estado local y botón único de "Guardar".
- [x] Corregir bug de persistencia en `maxUsers` (sobrescritura por cambios de plan).
- [x] Añadir feedback visual de envío de correo en el flujo de invitación.
- [x] Eliminar avisos de "Credenciales de prueba" del portal de Login.

**Verification**:
- [x] Validar que al cambiar el plan el límite de usuarios manual se mantenga.
- [x] Confirmar que los módulos no se activen/desactiven hasta presionar "Guardar".
- [x] Verificar que el botón único de guardado cierra el modal tras éxito en Firestore.

---

### Phase 25: Roles Esenciales y UX Refinamiento
**Status**: ✅ Complete
**Objective**: Simplificar el sistema de roles de los clientes a solo `admin` y `user`, descartando por ahora el envío real de correos, y mejorar la visualización de permisos.
**Depends on**: Phase 24

**Tasks**:
- [x] **Plan 25.1**: Modificar el modal de `AdminClients.jsx` para que las invitaciones hechas por el SuperAdmin sean fijadas como rol `admin`.
- [x] **Plan 25.2**: Actualizar la visualización de la lista de usuarios en `AdminClients.jsx` para que sea muy evidente si un miembro tiene rol `admin` o `user`.
- [x] **Plan 25.3**: Ajustar `TeamModule.jsx` del cliente para que los administradores puedan invitar explícitamente a `user` (y eliminar opciones como accountant/sales por el momento).
- [x] **Plan 25.4**: Implementar sistema consistente de estados de carga (Loading) para las transacciones con Firestore.
- [x] **Plan 25.5**: Eliminar botón de suplantación de cliente del SuperAdmin.

**Verification**:
- [ ] En el panel de SuperAdmin se distingue claramente con un indicador visual quién es `admin` y quién `user`.
- [x] El SuperAdmin invita con rol predeterminado o forzado de `admin`.
- [x] El administrador del cliente invita con opciones limitadas a `user`/`admin` (o solo `user`).

---

### Phase 26: Rediseño Analítico del SuperAdmin Dashboard
**Status**: ✅ Complete
**Objective**: Transformar el Dashboard del SuperAdmin en un panel de inteligencia de producto SaaS. Implementar tarjetas de estado por módulo y métricas de "stickiness" basadas en utilización real.
**Depends on**: Phase 25

**Tasks**:
- [x] Refactorizar useAdminAnalytics para métricas stickiness.
- [x] Implementar grid de tarjetas KPI SaaS en AdminDashboard.
- [x] Rediseñar lista de adopción de módulos.

**Verification**:
- [x] Los KPIs muestran datos reales de uso por módulo.

---

### Phase 27: Auditoría Integral de Seguridad (Skill: cc-skill-security-review)
**Status**: ✅ Complete
**Objective**: Realizar una revisión profunda de seguridad en todos los módulos (Finance, Admin, CRM, Inventory, etc.) utilizando la skill de revisión de seguridad para mitigar riesgos de multi-tenancy, inyección y acceso no autorizado.
**Depends on**: Phase 26

**Tasks**:
- [x] Plan 27.1: Auditoría de Cimientos y Multi-tenancy
- [x] Plan 27.2: Auditoría de Módulos de Cliente y Inputs
- [x] Plan 27.3: Auditoría del Portal SuperAdmin y Secretos

**Verification**:
- [x] VERIFICATION.md (PASS)

---

### Phase 28: Módulo de Compras (Gestión de Proveedores)
**Status**: ✅ Complete
**Objective**: Implementar la gestión de proveedores y órdenes de compra integradas con el inventario.
**Depends on**: Phase 3

**Tasks**:
- [x] Plan 28.1: Maestros de Proveedores (Hook y CRUD)
- [x] Plan 28.2: Órdenes de Compra e Integración con Inventario
- [x] Plan 28.3: Registro del Módulo y UI Integration

**Verification**:
- [x] VERIFICATION.md (PASS)

---

### Phase 29: Refinamiento de Jerarquía, Roles y Persistencia de Usuarios
**Status**: ✅ Complete
**Objective**: Asegurar que todos los usuarios invitados (por SuperAdmin o Administradores de Empresa) se persistan correctamente en Firestore y que la jerarquía de roles (Admin/User) se respete en la navegación y acceso a módulos.
**Depends on**: Phase 28

**Tasks**:
- [x] Corregir nombres de variables en `AuthContext.jsx` (remanentes de `mock`).
- [x] Asegurar persistencia de usuarios `pending` y su posterior activación con UID en Firestore.
- [x] Implementar ocultación dinámica del módulo "Mi Equipo" para usuarios con rol `user`.
- [x] Sincronizar permisos de módulos de usuarios con los de su organización.
- [x] Verificar visibilidad de usuarios en el portal SuperAdmin.

**Verification**:
- [x] Los usuarios creados por administradores de empresa aparecen en la colección `users` de Firestore.
- [x] Los usuarios con rol `user` no ven el módulo "Mi Equipo" en el sidebar.
- [x] Los usuarios invitados heredan correctamente los módulos activados para su organización.

---

### Phase 30: Rediseño Móvil y UX
**Status**: ✅ Complete
**Objective**: Optimizar la experiencia en dispositivos móviles mediante la reubicación del menú, la eliminación de tarjetas de resumen redundantes y el rediseño de listas para scroll bidireccional.
**Depends on**: Phase 29

**Tasks**:
- [x] Plan 30.1: Ajustar Menú Hamburguesa en Móvil y eliminar subtítulo "Empresa Verificada".
- [x] Plan 30.2: Rediseño del Módulo de Inventario (Mobile) — Quitar tarjetas y habilitar scroll.
- [x] Plan 30.3: Rediseño Móvil en Contabilidad y Ventas — Quitar tarjetas y habilitar scroll.

**Verification**:
- [x] El menú hamburguesa no tapa los títulos de los módulos.
- [x] Los módulos de Inventario, Contabilidad y Ventas no muestran tarjetas de resumen en móvil.
- [x] Las listas en móvil ocupan todo el ancho y permiten scroll horizontal/vertical cómodo.
- [x] El subtítulo "Empresa Verificada" ha sido eliminado del menú.