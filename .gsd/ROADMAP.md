# ROADMAP

## Milestone 1: Core Modules & Data Persistence

### Phase 1: Foundation & Auth (ArchitectOS)
**Status**: âœ… Complete
**Objective**: Establecer el diseÃ±o base, sistema de ruteo y autenticaciÃ³n mock con Tailwind v4.
**Depends on**: None

**Tasks**:
- [x] Configurar Vite + React + Tailwind v4
- [x] Implementar sistema de diseÃ±o ArchitectOS (Glassmorphism)
- [x] Crear Layouts de AdministraciÃ³n y Cliente
- [x] Implementar flujo de Login Mock y AuthContext

**Verification**:
- [x] Login con usuarios `admin@pkt.com` / `client@pkt.com` funcional.
- [x] NavegaciÃ³n entre portales correcta.

---

### Phase 2: CRM Module â€” GestiÃ³n de Clientes
**Status**: âœ… Complete
**Objective**: Implementar la gestiÃ³n real de contactos, leads y pipeline comercial con persistencia.
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

### Phase 3: Inventory Module â€” Control de Stock
**Status**: âœ… Complete
**Objective**: Sistema de inventario con categorÃ­as, alertas de stock mÃ­nimo y trazabilidad bÃ¡sica.
**Depends on**: Phase 1

**Tasks**:
- [x] ConfiguraciÃ³n de Firebase y `useInventory`
- [x] RefactorizaciÃ³n Reactiva de InventoryModule
- [x] Agregar formulario/Modal de creaciÃ³n de Productos

**Verification**:
- [x] Datos leÃ­dos y almacenados mediante Firestore (o en mock estÃ¡tico si la clave falta)
- [x] Formulario operativo con visualizaciÃ³n de estado de carga
- [x] Alertas de Stock dinÃ¡micas


---

### Phase 4: Ventas y FacturaciÃ³n
**Status**: âœ… Complete
**Objective**: EmisiÃ³n de cotizaciones y facturas bÃ¡sicas ligadas al inventario y CRM.
**Depends on**: Phase 2, Phase 3

**Tasks**:
- [x] Crear capa de datos (hook `useSales`) compatible con Firebase y Mock Mode
- [x] Desarrollar UI `SalesModule.jsx` y KPIs agregados interactivos
- [x] Crear Modal interactivo e integrarlo con clientes (`useCrm`) y productos (`useInventory`)
- [x] Integrar enlace a Ventas en navegaciÃ³n y rutas principal

**Verification**:
- [x] La pestaÃ±a de Ventas (Sales) estÃ¡ disponible en la app Client y redirige exitosamente.
- [x] Se pueden consultar, registrar y visualizar ventas e interactuar con el stock.

---

### Phase 5: Dashboard Central & ConfiguraciÃ³n de Empresa
**Status**: âœ… Complete
**Objective**: Implementar un dashboard unificado con KPIs de todos los mÃ³dulos activos y la gestiÃ³n del perfil empresarial.
**Depends on**: Phase 2, Phase 3, Phase 4

**Tasks**:
- [x] Implementar DashboardModule con KPIs agregados (CRM, Inventario, Ventas)
- [x] Crear SettingsModule para gestiÃ³n de Perfil de Empresa
- [x] Integrar navegaciÃ³n y rutas para Dashboard and Settings

**Verification**:
- [x] Dashboard muestra datos reales de los mÃ³dulos activos.
- [x] El perfil de empresa se persiste correctamente en Firestore.
- [x] El nombre de la empresa es dinÃ¡mico en la interfaz.

---

### Phase 6: Contabilidad y Finanzas
**Status**: âœ… Complete
**Objective**: Registro de ingresos y gastos, flujo de caja y reportes financieros bÃ¡sicos (P&L).
**Depends on**: Phase 4

**Tasks**:
- [x] Implementar capa de persistencia `useFinance` para transacciones
- [x] Construir y enlazar `FinanceModule` (UI, KPIs, tabla interactiva)

**Verification**:
- [x] Transacciones correctamente registradas en Firestore asociadas al orgId.
- [x] Dashboard de Finanzas muestra los agregados correctos (Ingresos/Gastos/Balance) segÃºn las transacciones.

---

### Phase 7: Agenda y Citas (MÃ³dulo Plus)
**Status**: âœ… Complete
**Objective**: Sistema de calendario para reservas de clientes y recordatorios automatizados.
**Depends on**: Phase 2

**Tasks**:
- [x] Implementar capa de datos `useAppointments` para gestiÃ³n reactiva
- [x] Desarrollar interfaz `CalendarModule.jsx` y modal de nueva cita
- [x] Integrar citas con clientes de CRM
- [x] Conectar mÃ³dulo en menÃº principal de cliente

**Verification**:
- [x] Es posible agendar una junta/cita enlazando al cliente existente.
- [x] Las citas se muestran en el entorno (calendario visual o lista).

---

### Phase 8: GestiÃ³n de Proyectos (MÃ³dulo Plus)
**Status**: âœ… Complete
**Objective**: Tableros Kanban y seguimiento de tareas para equipos y freelancers.
**Depends on**: Phase 2

**Tasks**:
- [x] Implementar hook `useProjects` y persistencia en Firestore
- [x] Desarrollar interfaz `ProjectModule.jsx` (Listado y GestiÃ³n)
- [x] Construir `ProjectKanban.jsx` con tareas reactivas
- [x] Integrar KPIs en el Dashboard y navegaciÃ³n global

**Verification**:
- [x] CreaciÃ³n y listado de proyectos funcional (Mock/Firebase).
- [x] Tablero Kanban operativo con cambio de estado de tareas.
- [x] Acceso desde el menÃº lateral y visualizaciÃ³n de mÃ©tricas en Dashboard.


---

### Phase 9: Marketplace y Sistema de Suscripciones
**Status**: âœ… Complete
**Objective**: Implementar la pasarela de pagos para el SaaS y la activaciÃ³n/desactivaciÃ³n dinÃ¡mica de mÃ³dulos.
**Depends on**: Phase 1, Phase 4

**Tasks**:
- [x] Implementar estado global de mÃ³dulos activos en AuthContext
- [x] Crear componente ModuleRoute para protecciÃ³n de acceso
- [x] Desarrollar interfaz de Marketplace con tarjetas de productos
- [x] Integrar flujo de Checkout simulado y persistencia local/mock

**Verification**:
- [x] Los mÃ³dulos se activan dinÃ¡micamente tras el pago simulado.
- [x] El sidebar y el ruteo respetan los permisos del tenant.

---

### Phase 10: Arreglos y Mejoras de Admin
**Status**: âœ… Complete
**Objective**: Hacer funcionar la creaciÃ³n de organizaciones, equiparar mÃ³dulo de facturaciÃ³n admin con clientes, y remover cabeceras redundantes ("Architect OS").
**Depends on**: Phase 9

**Tasks**:
- [x] Hacer funcional el botÃ³n "Nueva OrganizaciÃ³n" en el listado de clientes del Admin.
- [x] Asegurar que los mÃ³dulos de facturaciÃ³n (Sales) del lado de Admin sean iguales a los del lado Cliente.
- [x] Eliminar la cabecera "Architect OS" de los mÃ³dulos de la parte de Admin (ya que las opciones estÃ¡n en el sidebar).

**Verification**:
- [x] CreaciÃ³n de nueva organizaciÃ³n funcional operando sobre la base mock/firebase.
- [x] Las interfaces de facturaciÃ³n son consistentes entre admin y cliente.
---

## Milestone 2: Platform Growth & SaaS Operations

### Phase 11: Sistema de Suscripciones y Entitlements
**Status**: âœ… Complete
**Objective**: Evolucionar la activaciÃ³n manual de mÃ³dulos a un sistema de Planes (Basic, Pro, Enterprise) con lÃ­mites tÃ©cnicos.
**Depends on**: Phase 9, Phase 10

**Tasks**:
- [x] Definir lÃ³gica de "Planes" que agrupen mÃ³dulos automÃ¡ticamente.
- [x] Implementar gestiÃ³n de Cuotas de Uso (ej. lÃ­mite de usuarios, almacenamiento o documentos).
- [x] Integrar visualizaciÃ³n de estado de suscripciÃ³n en el Portal de Cliente.
- [x] Crear panel de control de "Billing" en Admin para gestionar facturas del SaaS.

**Verification**:
- [x] El sistema bloquea acciones si se supera la cuota del plan.
- [x] Los usuarios solo ven los mÃ³dulos incluidos en su Tier seleccionado.

---

### Phase 12: Business Intelligence & SaaS Metrics (Admin)
**Status**: âœ… Complete
**Objective**: Proporcionar al dueÃ±o del ERP visibilidad total sobre los ingresos y el comportamiento del cliente.
**Depends on**: Phase 11

**Tasks**:
- [x] Implementar dashboard de mÃ©tricas SaaS: MRR, ARR y Churn Rate.
- [x] Crear reportes de popularidad de mÃ³dulos (Usage Analytics).
- [x] Implementar visualizaciÃ³n de Health Score automÃ¡tico por cliente.
- [x] Desarrollar exportaciÃ³n de mÃ©tricas financieras para contabilidad del ERP.

**Verification**:
- [x] Los grÃ¡ficos de MRR muestran datos precisos basados en las suscripciones activas.
- [x] Es posible identificar popularidad de mÃ³dulos desde el panel admin.
- [x] Health Score renderizado y exportaciÃ³n de JSON funcional en Dashboard.

---

### Phase 13: Centro de Soporte y DiagnÃ³stico (SaaS Ops)
**Status**: âœ… Complete
**Objective**: Herramientas para dar soporte tÃ©cnico eficiente y seguro a los clientes.
**Depends on**: Phase 10

**Tasks**:
- [x] Implementar sistema de "ImpersonaciÃ³n" (Login as tenant) con auditorÃ­a.
- [x] Crear visor de Logs de Actividad multi-tenant para resoluciÃ³n de conflictos.
- [x] Desarrollar panel de errores crÃ­ticos y notificaciones para el Administrador.

**Verification**:
- [x] El administrador puede entrar al portal de un cliente de forma segura para dar soporte.
- [x] AuditorÃ­a de logs funcional y panel de alertas operativo en el dashboard.
---

### Phase 14: Onboarding & Self-Service Password
**Status**: âœ… Complete
**Objective**: Permitir que los administradores inviten usuarios y que estos configuren su propia contraseÃ±a mediante un link seguro.
**Depends on**: Phase 11

**Tasks**:
- [x] Implementar estados de usuario (Pending/Active) y lÃ³gica de tokens en AuthContext.
- [x] Desarrollar la UI de "Copiar Link de InvitaciÃ³n" en el panel de administraciÃ³n.
- [x] Crear la pÃ¡gina pÃºblica de `/setup-password` con validaciÃ³n de fuerza de contraseÃ±a.

**Verification**:
- [x] Al crear un usuario, el admin recibe un link Ãºnico.
- [x] Acceder al link permite guardar una contraseÃ±a y activa la cuenta inmediatamente.

---

## Milestone 3: Admin UX Polish

### Phase 15: Arreglos y Mejoras del Portal Admin
**Status**: âœ… Complete
**Objective**: Corregir gaps de funcionalidad en el portal administrativo: eliminaciÃ³n de organizaciones, mÃ³dulos adicionales en ediciÃ³n, billing admin independiente, auditorÃ­a con filtros por org, y limpieza del sidebar.
**Depends on**: Phase 13, Phase 14

**Tasks**:
- [x] Plan 15.1 â€” Agregar botÃ³n de eliminar org + secciÃ³n de mÃ³dulos adicionales en modal editar, y quitar botÃ³n Support del sidebar
- [x] Plan 15.2 â€” Crear `AdminBillingModule` independiente con selector de organizaciÃ³n activa, y mejorar AuditorÃ­a con filtros por organizaciÃ³n y tipo de usuario

**Verification**:
- [x] El modal "Editar OrganizaciÃ³n" tiene botÃ³n "Eliminar" con confirmaciÃ³n.
- [x] El modal "Editar OrganizaciÃ³n" tiene secciÃ³n de activaciÃ³n de mÃ³dulos adicionales.
- [x] `/admin/sales` renderiza un mÃ³dulo de billing propio (no el `SalesModule` del cliente).
- [x] El nombre del cliente (org) es visible en el mÃ³dulo de billing admin.
- [x] La vista de AuditorÃ­a tiene columna "OrganizaciÃ³n" y filtros por org y por tipo de actor.
- [x] El botÃ³n "Support" no aparece en el sidebar del admin.

---

### Phase 16: Control de FacturaciÃ³n y Documentos (Clientes)
**Status**: âœ… Complete
**Objective**: Implementar panel de control de facturaciÃ³n para clientes con seguimiento de vencimientos (dÃ­as restantes/retraso), estados de pago y emisiÃ³n de comprobantes.
**Depends on**: Phase 15

**Tasks**:
- [x] Plan 16.1 â€” ActualizaciÃ³n de capa de datos (useSales)
- [x] Plan 16.2 â€” RediseÃ±o de interfaz de facturaciÃ³n (SalesModule)

**Verification**:
- [x] Cada documento muestra ID, nombre del cliente, fecha de emisiÃ³n, fecha de vencimiento y totales.
- [x] El sistema calcula y muestra visualmente los dÃ­as de retraso o dÃ­as restantes para el vencimiento.
- [x] Interfaz cuenta con botones para "Emitir Boleta" y "Emitir Factura" segÃºn los requerimientos.

---

### Phase 17: Mejoras Avanzadas de FacturaciÃ³n e IntegraciÃ³n Contable
**Status**: âœ… Complete
**Objective**: Automatizar la numeraciÃ³n de documentos, gestionar plazos de crÃ©dito vinculados al CRM y sincronizar movimientos pagados con el mÃ³dulo de finanzas.
**Depends on**: Phase 16

**Tasks**:
- [x] **Plan 17.1**: Implementar numeraciÃ³n automÃ¡tica incremental para Boletas (B001-XXXX) y Facturas (F001-XXXX).
- [x] **Plan 17.2**: Actualizar CRM para incluir campos de configuraciÃ³n de crÃ©dito (DÃ­as de CrÃ©dito) por cliente.
- [x] **Plan 17.3**: LÃ³gica de cÃ¡lculo automÃ¡tico de fecha de vencimiento basada en el perfil de crÃ©dito del cliente seleccionado.
- [x] **Plan 17.4**: Implementar estados de flujo de vida: "Pagado" y "Anulado", con botones de acciÃ³n en SalesModule.
- [x] **Plan 17.5**: IntegraciÃ³n con Finanzas: Crear transacciones automÃ¡ticas en useFinance solo cuando el documento se marque como "Pagado".

**Verification**:
- [x] Cada nueva factura/boleta tiene un correlativo Ãºnico y secuencial.
- [x] La fecha de vencimiento se ajusta automÃ¡ticamente segÃºn los dÃ­as de crÃ©dito del cliente en el CRM.
- [x] Solo las facturas marcadas como "Pagado" generan entradas en el flujo de caja del mÃ³dulo financiero.
- [x] Las facturas anuladas mantienen registro pero no afectan saldos.

---

### Phase 18: Rework del Dashboard
**Status**: âœ… Complete
**Objective**: RediseÃ±ar el dashboard para mostrar exclusivamente tarjetas de los mÃ³dulos activados (una por mÃ³dulo), incluyendo informaciÃ³n clave de cada mÃ³dulo.
**Depends on**: Phase 17

**Tasks**:
- [x] Refactorizar `ClientDashboard.jsx` para carga dinÃ¡mica de tarjetas.
- [x] Crear componentes de tarjeta especÃ­ficos en cada mÃ³dulo.
- [x] Crear componente base `DashboardCard` reutilizable.

**Verification**:
- [x] Solo se muestran tarjetas de mÃ³dulos activos.
- [x] Los KPIs estÃ¡n integrados dentro de las tarjetas de cada mÃ³dulo.
- [x] El cÃ³digo del dashboard es limpio y modular.

---

### Phase 19: GestiÃ³n del Logo de la Empresa
**Status**: âœ… Complete
**Objective**: Permitir la carga, procesamiento (redimensionamiento a cuadrado y optimizaciÃ³n) y visualizaciÃ³n del logo de la empresa en el portal de cliente y documentos.
**Depends on**: Phase 18

**Tasks**:
- [x] Implementar lÃ³gica de procesamiento de imagen (recorte y escala) en Canvas.
- [x] Crear componente de carga de logo en configuraciÃ³n de empresa.
- [x] Integrar visualizaciÃ³n de logo en Sidebar Header y Client Dashboard.
- [x] Asegurar persistencia base64 en Firestore.

**Verification**:
- [x] Carga de imagen con recorte automÃ¡tico a cuadrado (shortest side).
- [x] Procesamiento de imagen para ligereza (tamaÃ±o icono).
- [x] VisualizaciÃ³n del logo en el dashboard y sidebar.
- [x] Persistencia del logo en el perfil de la organizaciÃ³n.

---

### Phase 20: Refinamiento UI y UX Flows
**Status**: âœ… Complete
**Objective**: Limpiar la interfaz eliminando notificaciones redundantes, tÃ­tulos de mÃ³dulos y optimizar flujos de CRM y FacturaciÃ³n.
**Depends on**: Phase 19

**Tasks**:
- [x] Eliminar punto de notificaciÃ³n de Inventario en el Sidebar.
- [x] Quitar tÃ­tulos y subtÃ­tulos de cabecera en todos los mÃ³dulos.
- [x] ReubicaciÃ³n de botones de acciÃ³n en CRM segÃºn pestaÃ±a activa.
- [x] Corregir backdrop del modal en Inventario (transparencia).
- [x] Implementar modal de impresiÃ³n rÃ¡pida al marcar factura como "Pagada" en Ventas.

**Verification**:
- [x] Validar UI de Sidebar, CRM (botones por pestaÃ±a), TÃ­tulos removidos.
- [x] Probar impresiÃ³n al cambiar a Pagado y Modal de Inventario con fondo correcto.

---

### Phase 21: EstandarizaciÃ³n de Botones de AcciÃ³n âœ…
**Status**: Complete
**Objective**: Homogeneizar el estilo y posiciÃ³n de los botones principales en la parte superior de cada mÃ³dulo.
**Depends on**: Phase 20

**Tasks**:
- [x] Cambiar el color de los botones principales a azul (predominante #85adff) en todos los mÃ³dulos.
- [x] Alinear los botones siempre al lado derecho de la pantalla en la cabecera del mÃ³dulo.
- [x] Asegurar coherencia visual en (Ventas, Inventario, CRM, Proyectos, Finanzas, Agenda).

**Verification**:
- [x] Revisar visualmente cada mÃ³dulo en modo dark/light.
- [x] Confirmar alineaciÃ³n `justify-end` o `ml-auto`.

---

### Phase 22: OptimizaciÃ³n del MÃ³dulo de Proyectos âœ…
**Status**: Complete
**Objective**: Pulir la gestiÃ³n de proyectos y tareas: aÃ±adir eliminaciÃ³n de proyectos, corregir reactividad de tareas, mejorar UI del Kanban y aÃ±adir ediciÃ³n de tareas.
**Depends on**: Phase 21

**Tasks**:
- [x] Reemplazar tres puntos en tarjetas de proyecto por un botÃ³n de eliminar (X) con confirmaciÃ³n.
- [x] Corregir reactividad al agregar y actualizar estado de tareas (usando Date() para instantaneidad).
- [x] Estandarizar botÃ³n "Nueva Tarea" (azul #85adff, estilo premium).
- [x] Mejorar visibilidad de botones de avance/retroceso en tareas (colores intensos y flechas).
- [x] Implementar modal de ediciÃ³n para tÃ­tulos y descripciones de tareas.

**Verification**:
- [x] Probar eliminaciÃ³n de proyecto con confirmaciÃ³n.
- [x] Verificar que nuevas tareas aparezcan sin recargar.
- [x] Comprobar flujo de estados en Kanban con feedback visual inmediato.
- [x] Validar modal de ediciÃ³n de tarea.

---

### Phase 23: Enterprise Security & Multi-Tenant User Management
**Status**: âœ… Complete
**Objective**: Implementar un sistema de autenticaciÃ³n multi-inquilino con aislamiento estricto, invitaciones por correo, roles definidos (Admin/User) y lÃ­mites de usuarios contratados gestionados desde el panel admin.
**Depends on**: Phase 22

**Tasks**:
- [x] **Plan 23.1**: Actualizar `AdminOrganizations` para permitir definir el `maxUsers` (lÃ­mite contratado) de cada empresa.
- [x] **Plan 23.2**: Refactorizar Firebase Security Rules para aplicar aislamiento estricto por `organizationId` (Multi-tenancy).
- [x] **Plan 23.3**: Implementar el mÃ³dulo de "GestiÃ³n de Equipo" dentro del portal de Cliente (solo para usuarios con rol `Admin`).
- [x] **Plan 23.4**: Desarrollar la lÃ³gica de validaciÃ³n de cuotas antes de generar una nueva invitaciÃ³n.
- [x] **Plan 23.5**: Ajustar `AuthContext` para persistir y validar el rol del usuario (`admin` vs `user`) dentro de su organizaciÃ³n.

**Verification**:
- [x] Acceso multi-tenant aislado verificado (UID-based rules).
- [x] LÃ­mite de usuarios (`maxUsers`) respetado en creaciÃ³n de cuentas.
- [x] Flujo de invitaciÃ³n y activaciÃ³n de contraseÃ±a funcional en producciÃ³n.

---

### Phase 24: SuperAdmin Portal UX & Production Flow
**Status**: ðŸš§ In Progress
**Objective**: Consolidar la gestiÃ³n de inquilinos con guardado unificado, correcciÃ³n de lÃ­mites de cuota y feedback de invitaciones profesional.
**Depends on**: Phase 23

**Tasks**:
- [x] Implementar `adminUpdateFullOrg` para guardado atÃ³mico (Plan/MÃ³dulos/LÃ­mite/Datos).
- [x] Refactorizar modal de ediciÃ³n en `AdminClients.jsx` con estado local y botÃ³n Ãºnico de "Guardar".
- [x] Corregir bug de persistencia en `maxUsers` (sobrescritura por cambios de plan).
- [x] AÃ±adir feedback visual de envÃ­o de correo en el flujo de invitaciÃ³n.
- [x] Eliminar avisos de "Credenciales de prueba" del portal de Login.

**Verification**:
- [x] Validar que al cambiar el plan el lÃ­mite de usuarios manual se mantenga.
- [x] Confirmar que los mÃ³dulos no se activen/desactiven hasta presionar "Guardar".
- [x] Verificar que el botÃ³n Ãºnico de guardado cierra el modal tras Ã©xito en Firestore.

---

### Phase 25: Roles Esenciales y UX Refinamiento
**Status**: âœ… Complete
**Objective**: Simplificar el sistema de roles de los clientes a solo `admin` y `user`, descartando por ahora el envÃ­o real de correos, y mejorar la visualizaciÃ³n de permisos.
**Depends on**: Phase 24

**Tasks**:
- [x] **Plan 25.1**: Modificar el modal de `AdminClients.jsx` para que las invitaciones hechas por el SuperAdmin sean fijadas como rol `admin`.
- [x] **Plan 25.2**: Actualizar la visualizaciÃ³n de la lista de usuarios en `AdminClients.jsx` para que sea muy evidente si un miembro tiene rol `admin` o `user`.
- [x] **Plan 25.3**: Ajustar `TeamModule.jsx` del cliente para que los administradores puedan invitar explÃ­citamente a `user` (y eliminar opciones como accountant/sales por el momento).
- [x] **Plan 25.4**: Implementar sistema consistente de estados de carga (Loading) para las transacciones con Firestore.
- [x] **Plan 25.5**: Eliminar botÃ³n de suplantaciÃ³n de cliente del SuperAdmin.

**Verification**:
- [ ] En el panel de SuperAdmin se distingue claramente con un indicador visual quiÃ©n es `admin` y quiÃ©n `user`.
- [x] El SuperAdmin invita con rol predeterminado o forzado de `admin`.
- [x] El administrador del cliente invita con opciones limitadas a `user`/`admin` (o solo `user`).

---

### Phase 26: RediseÃ±o AnalÃ­tico del SuperAdmin Dashboard
**Status**: âœ… Complete
**Objective**: Transformar el Dashboard del SuperAdmin en un panel de inteligencia de producto SaaS. Implementar tarjetas de estado por mÃ³dulo y mÃ©tricas de "stickiness" basadas en utilizaciÃ³n real.
**Depends on**: Phase 25

**Tasks**:
- [x] Refactorizar useAdminAnalytics para mÃ©tricas stickiness.
- [x] Implementar grid de tarjetas KPI SaaS en AdminDashboard.
- [x] RediseÃ±ar lista de adopciÃ³n de mÃ³dulos.

**Verification**:
- [x] Los KPIs muestran datos reales de uso por mÃ³dulo.

---

### Phase 27: AuditorÃ­a Integral de Seguridad (Skill: cc-skill-security-review)
**Status**: âœ… Complete
**Objective**: Realizar una revisiÃ³n profunda de seguridad en todos los mÃ³dulos (Finance, Admin, CRM, Inventory, etc.) utilizando la skill de revisiÃ³n de seguridad para mitigar riesgos de multi-tenancy, inyecciÃ³n y acceso no autorizado.
**Depends on**: Phase 26

**Tasks**:
- [x] Plan 27.1: AuditorÃ­a de Cimientos y Multi-tenancy
- [x] Plan 27.2: AuditorÃ­a de MÃ³dulos de Cliente y Inputs
- [x] Plan 27.3: AuditorÃ­a del Portal SuperAdmin y Secretos

**Verification**:
- [x] VERIFICATION.md (PASS)

---

### Phase 28: MÃ³dulo de Compras (GestiÃ³n de Proveedores)
**Status**: âœ… Complete
**Objective**: Implementar la gestiÃ³n de proveedores y Ã³rdenes de compra integradas con el inventario.
**Depends on**: Phase 3

**Tasks**:
- [x] Plan 28.1: Maestros de Proveedores (Hook y CRUD)
- [x] Plan 28.2: Ã“rdenes de Compra e IntegraciÃ³n con Inventario
- [x] Plan 28.3: Registro del MÃ³dulo y UI Integration

**Verification**:
- [x] VERIFICATION.md (PASS)

---

### Phase 29: Refinamiento de JerarquÃ­a, Roles y Persistencia de Usuarios
**Status**: âœ… Complete
**Objective**: Asegurar que todos los usuarios invitados (por SuperAdmin o Administradores de Empresa) se persistan correctamente en Firestore y que la jerarquÃ­a de roles (Admin/User) se respete en la navegaciÃ³n y acceso a mÃ³dulos.
**Depends on**: Phase 28

**Tasks**:
- [x] Corregir nombres de variables en `AuthContext.jsx` (remanentes de `mock`).
- [x] Asegurar persistencia de usuarios `pending` y su posterior activaciÃ³n con UID en Firestore.
- [x] Implementar ocultaciÃ³n dinÃ¡mica del mÃ³dulo "Mi Equipo" para usuarios con rol `user`.
- [x] Sincronizar permisos de mÃ³dulos de usuarios con los de su organizaciÃ³n.
- [x] Verificar visibilidad de usuarios en el portal SuperAdmin.

**Verification**:
- [x] Los usuarios creados por administradores de empresa aparecen en la colecciÃ³n `users` de Firestore.
- [x] Los usuarios con rol `user` no ven el mÃ³dulo "Mi Equipo" en el sidebar.
- [x] Los usuarios invitados heredan correctamente los mÃ³dulos activados para su organizaciÃ³n.

---

### Phase 30: RediseÃ±o MÃ³vil y UX
**Status**: âœ… Complete
**Objective**: Optimizar la experiencia en dispositivos mÃ³viles mediante la reubicaciÃ³n del menÃº, la eliminaciÃ³n de tarjetas de resumen redundantes y el rediseÃ±o de listas para scroll bidireccional.
**Depends on**: Phase 29

**Tasks**:
- [x] Plan 30.1: Ajustar MenÃº Hamburguesa en MÃ³vil y eliminar subtÃ­tulo "Empresa Verificada".
- [x] Plan 30.2: RediseÃ±o del MÃ³dulo de Inventario (Mobile) â€” Quitar tarjetas y habilitar scroll.
- [x] Plan 30.3: RediseÃ±o MÃ³vil en Contabilidad y Ventas â€” Quitar tarjetas y habilitar scroll.

**Verification**:
- [x] El menÃº hamburguesa no tapa los tÃ­tulos de los mÃ³dulos.
- [x] Los mÃ³dulos de Inventario, Contabilidad y Ventas no muestran tarjetas de resumen en mÃ³vil.
- [x] Las listas en mÃ³vil ocupan todo el ancho y permiten scroll horizontal/vertical cÃ³modo.
- [x] El subtÃ­tulo "Empresa Verificada" ha sido eliminado del menÃº.

---

### Phase 31: ConversiÃ³n a PWA y Experiencia Nativa
**Status**: âœ… Complete
**Objective**: Transformar la aplicaciÃ³n en una PWA funcional con estÃ©tica de aplicaciÃ³n nativa, eliminando comportamientos web como el "pull-to-refresh" y la selecciÃ³n accidental de texto.
**Depends on**: Phase 30

**Tasks**:
- [x] Plan 31.1: Ajustes CSS para Experiencia Nativa (overscroll y user-select).
- [x] Plan 31.2: ImplementaciÃ³n de PWA y Logo Provisional.

**Verification**:
- [x] La aplicaciÃ³n es instalable como PWA (Manifest & Service Worker bÃ¡sico).
- [x] No ocurre refresco de pÃ¡gina al arrastrar hacia abajo en el mÃ³vil.
- [x] El texto no se selecciona ni aparece el menÃº contextual de bÃºsqueda al mantener presionado.
- [x] Se incluye un logo provisional para el icono de la aplicaciÃ³n.


---

### Phase 32: Real Estate — Módulo de Terrenos y Pipeline Comercial
**Status**: ✅ Complete
**Objective**: Implementar un módulo especializado para la gestión de base de datos de terrenos y un pipeline comercial tipo Kanban para prospectos/compradores.
**Depends on**: Phase 2, Phase 8, Phase 18

**Tasks**:
- [x] Implementar CRUD de terrenos funcional con persistencia en Firestore.
- [x] Desarrollar Calculadora de precios reactiva operativa.
- [x] Crear Tablero Kanban de negociación funcional con asignación de compradores.
- [x] Integrar Tarjeta de resumen visible en el Dashboard principal.
- [x] Corrección técnica y activación del módulo de Compras (Purchases).

**Verification**:
- [x] Los terrenos se crean, editan y eliminan correctamente.
- [x] El pipeline permite mover prospectos entre etapas (Presentación, Negociación, Aprobado).
- [x] La tarjeta del dashboard muestra el conteo correcto de terrenos activos.

---

### Phase 33: Migración de Identidad Visual — Veló ERP
**Status**: ✅ Complete
**Objective**: Transformar la identidad visual de PKT ERP a Veló ERP, implementando la nueva paleta de colores (Púrpura, Verde, Blanco Hueso) y tipografía de sistema.
**Depends on**: Phase 31

**Tasks**:
- [x] Plan 33.1: Actualización de constantes de color y fuentes en `index.css`.
- [x] Plan 33.2: Reemplazo masivo de hexágonos hardcodeados por variables CSS.
- [x] Plan 33.3: Ajuste de legibilidad en botones y estados de hover.
- [x] Plan 33.4: Sincronización de PWA y Meta Tags con la nueva marca.

**Verification**:
- [x] El logo de Veló es visible y consistente en todos los layouts.
- [x] El fondo en modo claro es Blanco Hueso (#F7F7F5).
- [x] El fondo en modo oscuro es Negro Neutro (#1A1A1A).
- [x] Los botones primarios tienen texto blanco para máxima legibilidad.
- [x] La animación de carga muestra el logo de Veló palpitando.

---

### Phase 34: Optimización Compacta de Tarjetas en Móvil
**Status**: ✅ Complete
**Objective**: Rediseñar las tarjetas de los módulos del dashboard para que sean sustancialmente más compactas en resoluciones móviles, optimizando el uso del espacio vertical para mostrar más información sin necesidad de hacer tanto scroll.
**Depends on**: Phase 33

**Tasks**:
- [x] Plan 34.1: Compact Mobile Dashboard Cards

**Verification**:
- [x] Dashboard cards are significantly more compact on mobile view.

---

### Phase 35: Inventario de Bodega
**Status**: ✅ Complete
**Objective**: Implementar la gestión de materia prima diferenciada por precio de compra, con registro de ingresos, egresos a destinos específicos (Producción, Venta, Merma) e historial de movimientos.
**Depends on**: Phase 3, Phase 34

**Tasks**:
- [x] Implementar hook de persistencia `useWarehouse` para stock y movimientos.
- [x] Desarrollar interfaz `WarehouseModule.jsx` con diseño plano y buscador/dropdown editable de materiales.
- [x] Implementar flujo de ingresos y egresos (con validación de stock).
- [x] Crear pestaña de "Historial de Movimientos" para auditoría.
- [x] Integrar tarjeta de resumen en el Dashboard principal.

**Verification**:
- [x] Registro de ingresos con distintos precios genera ítems separados.
- [x] Egresos descuentan correctamente del lote seleccionado.
- [x] Historial muestra fecha, cantidad y destino correctamente.

---

### Phase 36: Refinamiento de Diseño Móvil (Títulos y Listas)
**Status**: ✅ Completed
**Objective**: Mejorar la visualización en dispositivos móviles reduciendo el tamaño de los títulos de los módulos y expandiendo las tablas/listas al ancho completo de la pantalla.
**Depends on**: Phase 35

**Tasks**:
- [x] Refactorizar títulos de módulos en `ClientLayout.jsx` para una tipografía más delicada en móvil.
- [x] Ajustar el padding del contenedor principal (`main`) en móvil para maximizar el espacio de las listas.
- [x] Eliminar contenedores de tarjetas (border, rounded, bg) en vistas de listas para dispositivos móviles en todos los módulos (Inventario, Ventas, Finanzas, etc.).
- [x] Estandarizar el diseño de tablas "full-width" para que se vean premium sin el encajonamiento de tarjetas.

**Verification**:
- [x] Los títulos en móvil son más pequeños y elegantes (ej. text-2xl en lugar de text-4xl).
- [x] Las tablas de información ocupan el 100% del ancho del viewport en móvil (sin márgenes laterales excesivos).
- [x] El diseño se mantiene premium y limpio en ambas orientaciones.

---

### Phase 37: Módulo de Nóminas y Recursos Humanos
**Status**: ✅ Complete
**Objective**: Implementar la gestión de colaboradores con registro detallado (DNI, sueldos fijos/variables, métodos de pago) y seguimiento de remuneraciones adicionales (Gratificaciones, CTS, Utilidades), con vista a su futura integración contable como gasto.
**Depends on**: Phase 36

**Tasks**:
- [x] Plan 37.1 - GestiÃ³n de Colaboradores (CRUD y Persistencia)
- [x] Plan 37.2 - Seguimiento de Remuneraciones y MÃ©todos de Pago

**Verification**:
- TBD

---

### Phase 38: Remediación de Seguridad (Security Audit)
**Status**: ✅ Complete
**Objective**: Resolver todos los hallazgos del Security Audit ejecutado el 2026-04-30. Incluye la eliminación de secretos expuestos, fortalecimiento de autenticación, implementación de rate limiting y granularización de reglas de Firestore.
**Depends on**: Phase 37

**Tasks**:
- [x] **Plan 38.1** — 🔴 Mover API de Resend al backend (Firebase Cloud Function) para eliminar `VITE_RESEND_API_KEY` del bundle del cliente.
- [x] **Plan 38.2** — 🔴 Limpiar historial de Git (eliminar `app/.env` del historial con `git filter-repo`) y rotar la API key de Resend.
- [x] **Plan 38.3** — 🔴 Reemplazar `Math.random()` por `crypto.randomUUID()` en la generación de tokens de invitación (`AuthContext.jsx:526`).
- [x] **Plan 38.4** — 🟡 Fortalecer política de contraseñas: mínimo 8 caracteres, 1 mayúscula, 1 número (`SetupPassword.jsx`).
- [x] **Plan 38.5** — 🟡 Implementar rate limiting en Login y SetupPassword (contador de intentos + lockout temporal).
- [x] **Plan 38.6** — 🟡 Granularizar reglas de Firestore: reemplazar wildcard `{allSubcollections=**}` por reglas específicas por subcolección.
- [x] **Plan 38.7** — 🟡 Eliminar email de SuperAdmin hardcodeado (`admin@admin.com`) y migrar a Firebase Custom Claims.
- [x] **Plan 38.8** — 🟢 Sanitizar variables de usuario en template HTML de emails (`mailer.js`) para prevenir XSS.
- [x] **Plan 38.9** — 🟢 Crear archivo `.env.example` con estructura sin valores reales.

**Verification**:
- [x] `VITE_RESEND_API_KEY` no existe en el bundle de producción (`dist/`).
- [x] Documentación de limpieza de Git creada en `GIT_CLEANUP.md`.
- [x] Los tokens de invitación usan `crypto.randomUUID()`.
- [x] El formulario de contraseña rechaza passwords menores a 8 caracteres.
- [x] El login se bloquea después de 5 intentos fallidos consecutivos.
- [x] Las subcolecciones de organizaciones tienen reglas específicas en `firestore.rules`.
- [x] La detección de SuperAdmin no depende de un email hardcodeado.

---

## Milestone 4: Module Enhancements & Advanced Features

### Phase 39: Agenda y Citas — Mejoras Avanzadas (calendar)
**Status**: ✅ Complete
**Objective**: Evolucionar el módulo de agenda con sincronización externa (Google Calendar/Outlook), recordatorios multicanal (correo/WhatsApp vía webhooks) y gestión de recursos físicos para evitar conflictos de capacidad.
**Depends on**: Phase 7

**Tasks**:
- [x] Plan 39.1: Gestión de Recursos Físicos y Conflictos (Data model + UI en evento)
- [x] Plan 39.2: Integraciones y Webhooks (Notificaciones por correo/WhatsApp)

**Verification**:
- [x] Módulo Agenda gestiona `resources` de Firestore.
- [x] Se bloquea la superposición de horarios para un mismo recurso.
- [x] El sistema expone un panel para configurar webhooks de integración.
- [x] Creación de eventos dispara llamadas a webhooks externos configurados.

---

### Phase 40: CRM — Historial, Segmentación y Lead Scoring (crm)
**Status**: ⬜ Not Started
**Objective**: Potenciar el CRM con un log cronológico de interacciones por contacto, segmentación dinámica con etiquetas (Cliente VIP, Proveedor Crítico) y un sistema de puntuación automática (Lead Scoring) para priorizar esfuerzo comercial.
**Depends on**: Phase 2

**Tasks**:
- [ ] TBD (run /plan 40 to create)

**Verification**:
- TBD

---

### Phase 41: Dashboard Central — KPIs Configurables y Drill-down (dashboard)
**Status**: ✅ Complete
**Objective**: Permitir que los usuarios configuren qué métricas ver en el dashboard mediante widgets personalizables, e implementar drill-down para navegar del gráfico al listado filtrado de datos.
**Depends on**: Phase 18

**Tasks**:
- [x] Plan 41.1: Personalización de Widgets del Dashboard (Modal de preferencias de usuario).
- [x] Plan 41.2: Drill-down y Navegación de KPIs (CRM e Inventario como patrón base).

**Verification**:
- [x] El usuario puede elegir qué módulos mostrar/ocultar en su dashboard.
- [x] Las preferencias del dashboard se guardan y mantienen entre sesiones.
- [x] Al hacer clic en la tarjeta de CRM en el dashboard, se navega al módulo de CRM en la pestaña correcta.
- [x] Al hacer clic en un KPI de Inventario, se navega al inventario con el filtro apropiado.

---

### Phase 42: Contabilidad — Conciliación Bancaria, Centros de Costos y Multimoneda (finance)
**Status**: ⬜ Not Started
**Objective**: Implementar conciliación bancaria para comparar movimientos ERP vs estados de cuenta, centros de costos por proyecto y soporte multimoneda con tipos de cambio diarios.
**Depends on**: Phase 6

**Tasks**:
- [ ] TBD (run /plan 42 to create)

**Verification**:
- TBD

---

### Phase 43: Inventario — Valorización, Transferencias y QR/Barras (inventory)
**Status**: ✅ Complete
**Objective**: Agregar valorización automática de inventario (FIFO/Promedio Ponderado), transferencias entre almacenes con estado "en tránsito" y soporte para lectura de códigos QR/barras desde cámara o lector.
**Depends on**: Phase 3, Phase 35

**Tasks**:
- [x] Plan 43.1 - Valorización de Inventario (FIFO/Promedio)
- [x] Plan 43.2 - Transferencias entre Almacenes
- [x] Plan 43.3 - Soporte QR/Barras Híbrido

**Verification**:
- TBD

---

### Phase 44: Bodega — Control de Insumos y Materias Primas (warehouse)
**Status**: ✅ Complete
**Objective**: Mejorar el módulo de bodega para una gestión eficiente de insumos y materias primas, optimizando el control de stock por lotes, trazabilidad de movimientos y diferenciación clara del inventario de productos terminados.
**Depends on**: Phase 3, Phase 43

**Tasks**:
- [x] Refactorizar `useWarehouse.js` para soportar `warehouseId` en stock y movimientos.
- [x] Implementar hook `useMaterialSettings` para gestión de umbrales por almacén.
- [x] Actualizar UI de `WarehouseModule.jsx` con selector de almacén y filtros.
- [x] Desarrollar lógica de valorización de inventario actual y costos de salida.
- [x] Crear panel de alertas visuales para stock bajo por ubicación.

**Verification**:
- TBD

---

### Phase 45: Nóminas — Asistencia, Boletas PDF y Préstamos (payroll)
**Status**: ✅ Complete
**Objective**: Evolucionar el módulo de nóminas con control de asistencia (horas, tardanzas, faltas), generación y envío masivo de boletas de pago en PDF firmadas digitalmente, y gestión de préstamos/adelantos con descuento automático en la siguiente nómina.
**Depends on**: Phase 37

**Tasks**:
- [x] Plan 45.1 - Payroll Data Layer (Asistencia y Préstamos)
- [x] Plan 45.2 - UI - Asistencia y Préstamos
- [x] Plan 45.3 - Procesamiento de Planilla y Boletas PDF

**Verification**:
- [x] Control de asistencias integrado.
- [x] Generación de PDF de boletas operativa.

---

### Phase 46: Proyectos — Gantt, Horas y Gestión Documental (projects_plus)
**Status**: ✅ Complete
**Objective**: Agregar diagrama de Gantt con dependencias entre tareas, espacio de gestión documental (planos, contratos, archivos técnicos) por proyecto/tarea, y control de horas (timesheet) por colaborador para cálculo de costos operativos.
**Depends on**: Phase 8, Phase 22

**Tasks**:
- [x] Plan 46.1 - Project Data Layer (Gantt, Timesheet & Docs Schema)
- [x] Plan 46.2 - UI - Gantt y Timesheet
- [x] Plan 46.3 - Gestión Documental de Proyectos

**Verification**:
- [x] El hook `useProjects` exporta funciones de tiempos y documentos.
- [x] El proyecto tiene pestañas de Gantt, Horas y Documentos.
- [x] Se pueden registrar tiempos y simular subida de documentos.

---

### Phase 47: Compras — RFQ y Recepciones Parciales (purchases)
**Status**: ⬜ Not Started
**Objective**: Implementar Solicitud de Cotización (RFQ) como paso previo a la Orden de Compra para comparar precios de proveedores, y manejo de recepciones parciales donde la OC permanece abierta hasta completar la entrega.
**Depends on**: Phase 28

**Tasks**:
- [ ] TBD (run /plan 47 to create)

**Verification**:
- TBD

---

### Phase 48: Terrenos e Inmobiliaria — Geolocalización, Presentación y Repositorio Legal (realestate)
**Status**: ✅ Complete
**Objective**: Integrar geolocalización con mapas (Google Maps/Leaflet) para ubicación de terrenos, implementar el seguimiento del estatus de presentación de terrenos con cada comprador potencial (interés, visita, propuesta) y crear repositorio legal para partidas registrales, minutas y documentos de propiedad.
**Depends on**: Phase 32

**Tasks**:
- [x] Plan 48.1 - Schema Updates & Dependencies
- [x] Plan 48.2 - Geolocalización y Mapas
- [x] Plan 48.3 - Seguimiento de Presentaciones
- [x] Plan 48.4 - Repositorio Legal de Documentos

**Verification**:
- [x] Se puede visualizar la ubicación exacta de cada terreno en un mapa interactivo.
- [x] Existe un registro claro del estatus de presentación de cada terreno por posible comprador.
- [x] El repositorio legal permite cargar y visualizar documentos críticos por terreno.

---

### Phase 49: Ventas — Facturación Electrónica, NC/ND y Cierre de Caja (sales)
**Status**: ⬜ Not Started
**Objective**: Conectar con el ente tributario (SUNAT) para envío y validación de documentos electrónicos en tiempo real, implementar flujos de Notas de Crédito/Débito para anulación o corrección, y crear reporte de cierre de caja diario por medio de pago.
**Depends on**: Phase 4, Phase 17

**Tasks**:
- [ ] TBD (run /plan 49 to create)

**Verification**:
- TBD

---

### Phase 50: Equipo — ACL Granular, Audit Log y Sesiones Activas (team)
**Status**: ✅ Complete
**Objective**: Implementar permisos granulares (ACL) por módulo y acción (Leer, Crear, Editar, Eliminar), registro de auditoría completo ("quién hizo qué y cuándo") en todo el sistema, y gestión de sesiones activas con capacidad de cierre remoto por seguridad.
**Depends on**: Phase 23, Phase 29

**Tasks**:
- [x] Plan 50.1: Sistema de ACL Granular (Modelo, Contexto y Configuración en UI).
- [x] Plan 50.2: Registro de Auditoría (Hook, Colección y Visor de Audit Logs).
- [x] Plan 50.3: Control de Sesiones Activas (Cierre Remoto).

**Verification**:
- [x] El `AuthContext` expone un helper de permisos.
- [x] El administrador puede asignar permisos a cada usuario en el equipo.
- [x] Las acciones críticas se registran en `audit_logs`.
- [x] Existe una pestaña de "Registro de Actividad" visible para administradores.
- [x] Forzar el cierre de sesión remotamente desloguea al usuario en tiempo real.

---

### Phase 51: Estabilización de Plataforma y Corrección de Permisos
**Status**: ✅ Complete
**Objective**: Corregir errores críticos de hooks, sincronizar nombres de colecciones en reglas de Firestore y resolver advertencias de seguridad y acceso a módulos.
**Depends on**: Phase 50

**Tasks**:
- [x] Corrección de hooks y permisos de Firestore
- [x] Sincronización de nombres de colecciones en reglas
- [x] Resolución de advertencias de seguridad y acceso

**Verification**:
- TBD


---

### Phase 52: Personalización de Dashboard y Perfil de Usuario
**Status**: ✅ Complete
**Objective**: Corregir la persistencia de la configuración de módulos visibles en el Dashboard. Trasladar el toggle de Modo Oscuro del Sidebar al Modal de Personalización. Implementar campos de perfil de usuario básico (Foto, Nombre, Documentos, Puesto).
**Depends on**: Phase 51

**Tasks**:
- [x] Plan 52.1: Mejorar Reactividad y Persistencia del Listener de Usuario en AuthContext.
- [x] Plan 52.2: Rediseño de DashboardSettingsModal y eliminación del toggle en Sidebar.

**Verification**:
- [x] Las preferencias de dashboard y perfil se guardan en Firestore y se reflejan sin recargar la página.
- [x] El botón de tema ha sido trasladado correctamente al modal.

---

### Phase 53: Módulo Salud - Gestión de Pacientes
**Status**: ✅ Completed
**Objective**: Construir un nuevo módulo llamado Salud dentro del ERP para gestión de pacientes (médicos, psicólogos, etc.), con Dashboard, Agenda, Lista de Pacientes y Expedientes vinculados a Clientes.
**Depends on**: Phase 52

**Tasks**:
- [x] Modelado de datos y React Hook `useHealth` con Zod.
- [x] Implementación de Dashboard, Rutas e Integración de Sidebar.
- [x] HealthAgenda reactiva e interactiva (Calendario mensual + Citas).
- [x] Expediente Clínico con bloqueo de 24h, Notas Generales y Archivos.

**Verification**:
- [x] Módulo Salud visible y navegable.
- [x] CRUDs de Expediente y Citas funcionando sobre Firestore.
- [x] Regla de bloqueo de notas validada.

---

### Phase 54: CRM — Edición y Eliminación de Clientes
**Status**: ✅ Complete
**Objective**: Implementar botones y flujos funcionales para editar y borrar registros de clientes dentro del módulo CRM en la pestaña de clientes.
**Depends on**: Phase 53

**Tasks**:
- [x] Extender `useCrm.js` con funciones de eliminación directa (`deleteContact`, `deleteLead`).
- [x] Actualizar `CRMModule.jsx` integrando iconos explícitos de Editar y Borrar en vistas Kanban y Lista.
- [x] Añadir diálogo de confirmación nativo (`window.confirm`) en los flujos de borrado.

**Verification**:
- [x] Presencia de métodos de eliminación en el Data Layer.
- [x] Despliegue visual correcto de iconos en CRM e interacción con la lógica reactiva.

---

### Phase 55: Homologación de Orden de Módulos y Depuración de Duplicados
**Status**: ✅ Complete
**Objective**: Eliminar duplicación del módulo Bodega y forzar que tanto el Dashboard como el Sidebar sigan estrictamente el orden centralizado en MODULES_CATALOG.
**Depends on**: Phase 54

**Tasks**:
- [x] Aplicar sanitización `new Set` en `getAccessibleModules` de `modulesConfig.js`.
- [x] Reescribir `getOrderedModules` para forzar alineamiento con `MODULES_CATALOG`.
- [x] Eliminar controles manuales de ordenación en `DashboardSettingsModal.jsx` y descontinuar campo en Firebase.

**Verification**:
- [x] Deduplicación verificada: la doble tarjeta de Bodega desaparece.
- [x] Sincronización rígida: el orden en Sidebar y Dashboard es el mismo.
- [x] Limpieza de UI exitosa en ventana de preferencias de usuario.

---

### Phase 56: Proyectos — Corrección de Gantt y Fechas de Tareas
**Status**: ✅ Complete
**Objective**: Cambiar el nombre de la pestaña de Calendario a GANTT en el módulo de proyectos y corregir el diagrama de Gantt para que las tareas respondan correctamente a las fechas establecidas.
**Depends on**: Phase 55

**Tasks**:
- [x] Renombrar pestaña "Calendario" a "GANTT" y actualizar icono a `BarChart2` en `ProjectKanban.jsx`.
- [x] Corregir función `getTaskPosition` en `ProjectGantt.jsx` eliminando el tope hardcodeado del final de la escala.
- [x] Implementar parseador de fecha local resistente a desajustes de zona horaria UTC en `ProjectGantt.jsx`.
- [x] Refinar textos y cabecera en el Diagrama de Gantt para consistencia temática.

**Verification**:
- [x] Las barras de progreso en el diagrama se detienen exactamente el día de vencimiento de la tarea.
- [x] El renderizado es resistente a corrimientos de días causados por la hora UTC local.
- [x] La pestaña en el menú del proyecto ahora dice "GANTT".

---

### Phase 57: Overhaul Estético Homogéneo y Estandarización de UI
**Status**: ✅ Complete
**Objective**: Refactorizar visualmente todos los módulos operativos del ERP para unificar estilos tomando como modelo maestro a CRM, Ventas e Inventario. Esto cubre la homologación de tarjetas de métricas, el diseño de pestañas (tabs), botones de acción primaria/secundaria, sombras estilizadas y combinaciones cromáticas.
**Depends on**: Phase 56

**Tasks**:
- [x] **57.1 — TeamModule.jsx (ALTO)**: Normalizar tabs desktop (eliminar shadow-lg, text-white→text-[#002150]), stats cards (rounded-3xl→2xl), thead (surface-container-high→surface-variant, font-bold→font-black), table container (rounded-3xl→2xl), botón CTA (text-white→text-[#002150]), modal invite (zoom-in-95→zoom-in, header canónico).
- [x] **57.2 — PayrollModule.jsx (MODERADO)**: Convertir tabs de border-b pills a contenedor canónico, normalizar tab activo (text-white→text-[#002150]), thead (surface-container-high→surface-variant, tracking-[0.2em]→tracking-widest), table container (rounded-[2rem]→rounded-2xl, border-separate→border-collapse), reducir botón CTA (px-8 py-3.5→px-6 py-2.5).
- [x] **57.3 — FinanceModule.jsx (LEVE)**: Stats cards: eliminar bg-gradient-to-br y shadow-inner de iconos, normalizar a surface-container-low con shadow-sm; ajustar color CTA (text-[#001b5c]→text-[#002150]).
- [x] **57.4 — WarehouseModule.jsx (LEVE)**: Modal headers: cambiar bg surface-container-low → surface-container; normalizar bordes de header.
- [x] **57.5 — PurchasesModule.jsx (LEVE)**: Modal header: cambiar bg surface-container-low/50 → surface-container; normalizar borde.
- [x] **57.6 — HealthModule.jsx (LEVE)**: Tabs: eliminar shadow-lg y scale-[1.02] del tab activo, normalizar a patrón canónico simple.
- [x] **57.7 — SalesModule.jsx (LEVE)**: Stats cards: reemplazar gradients de iconos con patrón canónico uniforme; normalizar contenedor de stats a surface-container-low con shadow-sm.

**Verification**:
- [x] Todos los tabs desktop usan contenedor canónico con bg-[#6B4FD8] text-[#002150] en activo.
- [x] Todos los tabs mobile usan `<select>` con ChevronDown decorativo.
- [x] Todas las tarjetas de métricas usan bg-[var(--color-surface-container-low)] con shadow-sm hover:shadow-md.
- [x] Todos los iconos de stats usan w-12 h-12 rounded-xl bg-[var(--color-surface-container)] con border.
- [x] Todos los thead usan bg-[var(--color-surface-variant)] con text-[10px] font-black uppercase tracking-widest.
- [x] Todos los contenedores de tabla usan rounded-2xl (no rounded-3xl ni rounded-[2rem]).
- [x] Todos los modales usan animate-in zoom-in (no zoom-in-95).
- [x] Todos los headers de modal usan bg-[var(--color-surface-container)] (no surface-container-low).
- [x] Todos los botones CTA principales usan text-[#002150].
- [x] Verificación visual en navegador con npm run dev.

---

### Phase 58: Homologar Módulo de Proyectos al Estándar Estético de CRM
**Status**: ✅ Complete
**Objective**: Refactorizar estéticamente el módulo de proyectos (ProjectModule, Kanban, Gantt, etc.) para igualar el diseño limpio y de tarjetas flotantes sobre fondo lila pastel del módulo CRM.
**Depends on**: Phase 57

**Tasks**:
- [x] **58.1 - ProjectModule.jsx**: Rediseñar cards de listado, botón CTA "Nuevo Proyecto", y normalizar el modal de creación/edición con el fondo de cabecera plano y botón principal.
- [x] **58.2 - ProjectKanban.jsx**: Aligerar la caja de cabecera y la sombra del tabs selector; normalizar el botón CTA "Nueva Tarea"; rediseñar el fondo de columnas; y quitar gradientes pesados y brillos neón en las cards del tablero Kanban reemplazándolas por tarjetas flotantes.

**Verification**:
- [x] Las cards en el listado de proyectos y tareas del tablero Kanban lucen idénticas a la estética del CRM sin luces de neón ni sombras masivas.
- [x] Modales estandarizados a bg-surface-container en su cabecera con redondeado 2xl.

---

### Phase 59: Estandarización Milimétrica de Botones/Pestañas y Pipeline CRM en Proyectos
**Status**: ⏳ Not Started
**Objective**: Estandarizar la altura, ancho, diseño, sombra, tipografía y efectos de botones y pestañas del tope de la página de todos los módulos para que sean idénticos al módulo CRM. Además, replicar el diseño de pastillas con franja izquierda de color en los proyectos y aplicar el fondo morado específico de las zonas del pipeline CRM a las columnas Kanban de Proyectos.
**Depends on**: Phase 58

**Tasks**:
- [ ] TBD (run /plan 59 to create)

**Verification**:
- [ ] TBD

---

### Phase 60: Unificación de Módulos de Inventario y Bodega
**Status**: ⬜ Not Started
**Objective**: Juntar los módulos de inventario y bodega en un solo módulo consolidado de "Inventario". Contendrá las pestañas: Stock de Inventario, Stock de Bodega, y Almacenes. La transferencia de materiales se manejará dentro de las vistas de stock. Las tarjetas de métricas serán: Ítems de Inventario, Alertas de Stock, Montos en Inventario, y Montos en Materiales. Se debe actualizar el portal SuperAdmin para reflejar este cambio (activado por defecto).
**Depends on**: Phase 3, Phase 35

**Tasks**:
- [ ] TBD (run /plan 60 to create)

**Verification**:
- TBD

---

### Phase 61: Auditoría de Reactividad y Legibilidad Móvil
**Status**: ✅ Complete
**Objective**: Verificar módulo por módulo la visibilidad y la legibilidad de la versión móvil en todos los módulos de cliente, asegurando que siga estándares de reactividad y que sea perfectamente legible en pantallas de 320px-480px.
**Depends on**: Phase 60

**Tasks**:
- [x] **61.1 - Global Shell & Dashboard**: Menú hamburguesa, sidebar móvil, logo, KPIs del dashboard apilados correctamente.
- [x] **61.2 - Módulos Operativos y Tablas**: Tablas de inventario, finanzas, nómina con scroll horizontal nativo (`-mx-4 overflow-x-auto`). Modales de creación con targets táctiles ≥44px.
- [x] **61.3 - Kanbans y Módulos Especializados**: Kanbans de CRM/Proyectos/Real Estate con scroll horizontal en columnas. Agenda médica con indicadores de puntos de color en móvil. Expediente clínico con barra de pestañas compacta. TerrainModal con footer responsivo y teclado numérico en calculadora. TerrainDetailsModal con header truncado y botón eliminar siempre visible.

**Verification**:
- [x] Build de producción sin errores (`npm run build` — 1993 módulos en 969ms).
- [x] Tableros Kanban (CRM, Proyectos, Real Estate) con scroll horizontal premium, sin desbordamientos.
- [x] Todos los botones de acción táctil con mínimo 44×44px de área de toque.
- [x] Sin uso de `group-hover` para visibilidad de elementos en interfaces táctiles.
- [x] Calendarios y agendas con indicadores compactos de puntos de color en viewports pequeños.
- [x] Calculadora de terrenos con `inputMode="decimal"` para teclado numérico en iOS/Android.

