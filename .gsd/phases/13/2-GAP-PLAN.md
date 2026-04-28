---
phase: 13
plan: 2
wave: 1
gap_closure: true
---

# Plan 13.2: Activity Monitoring & Admin Alerts (Gap Closure)

## Objective
Cerrar las brechas de la Fase 13 mediante la implementación de un visor de logs de actividad y un sistema de alertas críticas para el administrador.

## Context
- `src/context/AuthContext.jsx` (Persistencia de logs y alertas)
- `src/modules/admin/ActivityLogs.jsx` (Nuevo componente)
- `src/modules/admin/dashboard/AdminDashboard.jsx` (Integración de alertas)

## Tasks

<task type="auto">
  <name>Implement Activity Logging System</name>
  <files>src/context/AuthContext.jsx</files>
  <action>
    - Añadir estado `mockActivityLogs` con persistencia en `localStorage`.
    - Crear función `addLog(action, details, type = 'info')` que registre la acción, timestamp, usuario y organización (si aplica).
    - Integrar `addLog` en eventos clave: Logins, Impersonación (inicio/fin), Cambio de plan de organización, y Creación de usuario.
    - Exponer `mockActivityLogs` en el provider.
  </action>
  <verify>grep -qi "mockActivityLogs" src/context/AuthContext.jsx</verify>
  <done>El sistema ahora registra silenciosamente las acciones administrativas y de clientes.</done>
</task>

<task type="auto">
  <name>Create Activity Logs Viewer</name>
  <files>src/modules/admin/ActivityLogs.jsx, src/App.jsx</files>
  <action>
    - Crear el componente `ActivityLogs.jsx` con diseño ArchitectOS.
    - Mostrar una tabla o lista cronológica con filtros básicos (por tipo o acción).
    - Registrar la ruta `/admin/logs` en `App.jsx` y añadir el enlace al sidebar administrativo (si existe un componente de sidebar común).
  </action>
  <verify>Test-Path "src/modules/admin/ActivityLogs.jsx"</verify>
  <done>Los administradores pueden ver el historial de actividad de la plataforma.</done>
</task>

<task type="auto">
  <name>Implement Admin Alerts & Notifications</name>
  <files>src/context/AuthContext.jsx, src/modules/admin/dashboard/AdminDashboard.jsx</files>
  <action>
    - Añadir estado `mockSystemAlerts` en `AuthContext`.
    - Crear alertas automáticas cuando un cliente alcanza el límite de usuarios o cuando ocurre un error simulado (e.g. falla de pago).
    - En `AdminDashboard.jsx`, añadir un panel lateral o sección "Alertas del Sistema" que muestre estas notificaciones en rojo/ámbar.
  </action>
  <verify>grep -qi "mockSystemAlerts" src/modules/admin/dashboard/AdminDashboard.jsx</verify>
  <done>El administrador recibe visibilidad proactiva sobre problemas en los tenants.</done>
</task>

## Success Criteria
- [ ] Existe un registro histórico de acciones accesible desde el panel Admin.
- [ ] El dashboard administrativo muestra alertas dinámicas basadas en el estado del sistema.
