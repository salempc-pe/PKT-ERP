---
phase: 26
plan: 1
wave: 1
---

# Plan 26.1: Rediseño Analítico del SuperAdmin Dashboard (SaaS Metrics)

## Objective
Reemplazar los paneles obsoletos de infraestructura en el dashboard de SuperAdmin por tarjetas de rendimiento y "Stickiness" que midan la utilización de cada módulo (GMV, Contactos, SKUs, Proyectos, Uso de Asientos) con el diseño estético de alta fidelidad que manejamos en el resto del proyecto.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- .gsd/phases/26/RESEARCH.md
- src/hooks/useAdminAnalytics.js
- src/modules/admin/dashboard/AdminDashboard.jsx

## Tasks

<task type="auto">
  <name>Calculadoras Analíticas de Producto SaaS</name>
  <files>
    - src/hooks/useAdminAnalytics.js
  </files>
  <action>
    Actualiza la función o estado que devuelve las analíticas del administrador en `useAdminAnalytics.js`. Añade datos simulados/agregados dentro del objeto `analytics` (o expande el actual `modulePopularity`) para exponer métricas explícitas como:
    - GMV global simulado para Ventas (ej: S/ 145,200).
    - Base de datos global CRM (ej: 4,520 contactos o leads).
    - Gestión de Inventario (ej: 12,300 SKUs controlados).
    - Gestión de Proyectos (ej: 840 tareas completadas).
    - Seat Utilization: Total de asientos ocupados vs maxUsers acumulado (ej: 82% utilizado).
    Todo esto debe devolverse de manera estructurada en el hook.
    No compliques demasiado con implementaciones de backend complejas si es puramente frontend mock status para MVP, pero debe lucir integrado en el hook que existe.
  </action>
  <verify>grep -q "Seat Utilization" src/hooks/useAdminAnalytics.js || npm run build -- --emptyOutDir=false</verify>
  <done>El hook expone un objeto con las nuevas métricas (gmv, crmContacts, skus, projectTasks, seatUtilization) correctamente estructurado.</done>
</task>

<task type="auto">
  <name>Interfaz de Tarjetas KPI Avanzadas</name>
  <files>
    - src/modules/admin/dashboard/AdminDashboard.jsx
  </files>
  <action>
    En la zona donde anteriormente se removieron los paneles de Alerta, construye un Grid moderno con tarjetas para cada una de las 5 métricas agregadas en la tarea anterior. 
    Usa el estilo premium con bordes `border-white/5` o `border-[#40485d]/10`, íconos distintivos (Lucide-react: ej. Users, Package, Briefcase, Activity, CheckCircle), e incluye un indicador numérico claro con un pequeño badge verde que demuestre deltas de crecimiento positivos (+5%, +12%, etc).
    Asegura que el diseño sea totalmente responsivo (grids `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
  </action>
  <verify>grep -q "GMV" src/modules/admin/dashboard/AdminDashboard.jsx</verify>
  <done>La vista AdminDashboard renderiza un set de KPIs de adopción por módulo y seat utilization sin errores.</done>
</task>

## Success Criteria
- [ ] Las métricas devueltas por `useAdminAnalytics.js` son lógicas y aplicables al análisis de adopción de SaaS.
- [ ] El layout del Dashboard del SuperAdmin muestra las nuevas tarjetas KPI interactuando perfectamente con el entorno oscuro Glassmorphism.
- [ ] La experiencia es completamente interactiva (los íconos encajan estéticamente).
