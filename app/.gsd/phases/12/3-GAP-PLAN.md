---
phase: 12
plan: 3
wave: 1
gap_closure: true
---

# Plan 12.3: Health Score & Export Export Data (Gap Closure)

## Objective
Implementar "Health Score" automático para identificar la salud y utilización del SaaS por parte del cliente, e integrar un botón de exportación de métricas financieras.

## Context
- .gsd/ROADMAP.md
- src/hooks/useAdminAnalytics.js
- src/modules/admin/dashboard/AdminDashboard.jsx
- src/modules/admin/clients/AdminClients.jsx

## Tasks

<task type="auto">
  <name>Implement Health Score</name>
  <files>src/hooks/useAdminAnalytics.js, src/modules/admin/clients/AdminClients.jsx</files>
  <action>
    - **En `useAdminAnalytics.js`**: Exportar una función auxiliar o propiedad `calculateHealthScore(org)` que asigne un puntaje en base a cuántos `activeModules` tiene vs los módulos del plan y el número de usuarios si es posible. Para simplificar, puede clasificar el score en text strings: "Excellent", "Good", "At Risk" en base a la longitud de los módulos activos.
    - **En `AdminClients.jsx`**: Incorporar de forma vistosa el "Healthy Score" en la tarjeta de cada Organización (junto al ID o debajo). Puedes colorear `Excellent` en verde o celeste, `Good` en amarillo/naranja y `At Risk` en rojo/rosado.
  </action>
  <verify>grep -qi "health" src/modules/admin/clients/AdminClients.jsx</verify>
  <done>Customer Health Score is clearly visible for all clients.</done>
</task>

<task type="auto">
  <name>Data Export feature</name>
  <files>src/modules/admin/dashboard/AdminDashboard.jsx</files>
  <action>
    - Agregar en el componente un botón de "Exportar Métricas (JSON)" cerca del título principal "Ingresos MRR" o en la parte superior.
    - El manejador de evento `handleExport` deberá convertir un resumen de `analytics` (MRR, Clientes Activos, ARPU, Crecimiento, Popularidad) en un string JSON formateado y descargarlo usando un `Blob` y un ancla dinámica `<a>`.
  </action>
  <verify>grep -qi "blob" src/modules/admin/dashboard/AdminDashboard.jsx</verify>
  <done>Los administradores deben poder descargar el estado actual de las métricas.</done>
</task>

## Success Criteria
- [ ] Todo Inquilino tiene ahora una visualización de su Health Score.
- [ ] Un JSON o CSV descriptivo baja a la máquina del host al presionar el botón de exportación.
