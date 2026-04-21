---
phase: 12
plan: 1
wave: 1
---

# Plan 12.1: Lógica de Analíticas (Hook useAdminAnalytics)

## Objective
Crear un hook especializado que procese el estado de AuthContext para generar métricas de negocio en tiempo real.

## Context
- src/context/AuthContext.jsx
- .gsd/phases/12/RESEARCH.md

## Tasks

<task type="auto">
  <name>Crear hook useAdminAnalytics</name>
  <files>src/hooks/useAdminAnalytics.js</files>
  <action>
    Implementar el hook con las siguientes funciones:
    - calculateMRR(): Sumar precios según el plan de cada org (Startup: 0, Business: 199, Enterprise: 499).
    - getModulePopularity(): Contar cuántas veces aparece cada módulo en el total de suscripciones.
    - getGrowthMetrics(): Comparar conteos actuales vs datos simulados de "mes pasado".
  </action>
  <verify>test -f src/hooks/useAdminAnalytics.js</verify>
  <done>El archivo existe y exporta las funciones de cálculo correctamente.</done>
</task>

## Success Criteria
- [ ] El hook es capaz de devolver un valor numérico para el MRR total.
- [ ] El hook devuelve un objeto con el conteo de uso de cada módulo.
