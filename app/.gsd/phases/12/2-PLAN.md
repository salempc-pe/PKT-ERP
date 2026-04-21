---
phase: 12
plan: 2
wave: 1
---

# Plan 12.2: Dashboard de Analíticas Reales

## Objective
Actualizar el Admin Dashboard para mostrar las métricas generadas por el hook useAdminAnalytics con una UI premium.

## Context
- src/modules/admin/dashboard/AdminDashboard.jsx
- src/hooks/useAdminAnalytics.js

## Tasks

<task type="auto">
  <name>Integrar KPI Cards Reales</name>
  <files>src/modules/admin/dashboard/AdminDashboard.jsx</files>
  <action>
    Reemplazar los valores estáticos por los calculados:
    - MRR Actual.
    - Total de Organizaciones.
    - ARPU.
    Añadir badges de tendencia (ej. "up 5%").
  </action>
  <verify>grep "useAdminAnalytics" src/modules/admin/dashboard/AdminDashboard.jsx</verify>
  <done>El dashboard muestra datos reales del sistema mock.</done>
</task>

<task type="auto">
  <name>Visualización de Uso de Módulos</name>
  <files>src/modules/admin/dashboard/AdminDashboard.jsx</files>
  <action>
    Implementar una sección de "Adopción de Módulos" que use barras de progreso horizontales estilizadas para mostrar qué módulos son los más contratados.
  </action>
  <verify>grep "Adopción de Módulos" src/modules/admin/dashboard/AdminDashboard.jsx</verify>
  <done>Gráfico de popularidad visible y funcional.</done>
</task>

## Success Criteria
- [ ] El administrador tiene una visión clara del estado financiero del SaaS.
- [ ] Los datos se actualizan automáticamente al realizar cambios en las suscripciones de los clientes.
