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
**Status**: ⬜ Not Started
**Objective**: Mejorar la visualización en dispositivos móviles reduciendo el tamaño de los títulos de los módulos y expandiendo las tablas/listas al ancho completo de la pantalla.
**Depends on**: Phase 35

**Tasks**:
- [ ] Refactorizar títulos de módulos en `ClientLayout.jsx` para una tipografía más delicada en móvil.
- [ ] Ajustar el padding del contenedor principal (`main`) en móvil para maximizar el espacio de las listas.
- [ ] Eliminar contenedores de tarjetas (border, rounded, bg) en vistas de listas para dispositivos móviles en todos los módulos (Inventario, Ventas, Finanzas, etc.).
- [ ] Estandarizar el diseño de tablas "full-width" para que se vean premium sin el encajonamiento de tarjetas.

**Verification**:
- [ ] Los títulos en móvil son más pequeños y elegantes (ej. text-2xl en lugar de text-4xl).
- [ ] Las tablas de información ocupan el 100% del ancho del viewport en móvil (sin márgenes laterales excesivos).
- [ ] El diseño se mantiene premium y limpio en ambas orientaciones.

