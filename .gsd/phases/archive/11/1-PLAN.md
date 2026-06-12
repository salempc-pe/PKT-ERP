---
phase: 11
plan: 1
wave: 1
---

# Plan 11.1: Refactorización de Capa de Datos (Planes y Suscripciones)

## Objective
Migrar de un sistema de activación manual de módulos a una estructura basada en "Planes" (Tiers) con límites técnicos, centralizando la lógica en AuthContext.

## Context
- .gsd/phases/11/RESEARCH.md
- src/context/AuthContext.jsx

## Tasks

<task type="auto">
  <name>Definir Esquema de Planes</name>
  <files>src/context/AuthContext.jsx</files>
  <action>
    Definir la constante SUBSCRIPTION_PLANS con el siguiente mapeo:
    - startup: { name: 'Startup', modules: ['crm', 'calendar'], limits: { users: 2 } }
    - business: { name: 'Business', modules: ['crm', 'inventory', 'sales', 'projects'], limits: { users: 10 } }
    - enterprise: { name: 'Enterprise', modules: ['crm', 'inventory', 'sales', 'projects', 'finance', 'calendar'], limits: { users: 100 } }
  </action>
  <verify>grep "SUBSCRIPTION_PLANS" src/context/AuthContext.jsx</verify>
  <done>La constante existe y tiene los 3 niveles definidos.</done>
</task>

<task type="auto">
  <name>Migrar Estado de Organizaciones</name>
  <files>src/context/AuthContext.jsx</files>
  <action>
    1. Actualizar el estado inicial de mockOrganizations para incluir el campo subscription: { planId: 'startup', activeModules: [...] }.
    2. Modificar adminCreateOrg para asignar el plan 'startup' por defecto.
    3. Implementar adminUpdateOrgPlan(orgId, planId) que actualice tanto el plan como los módulos activos del org automáticamente.
  </action>
  <verify>grep "adminUpdateOrgPlan" src/context/AuthContext.jsx</verify>
  <done>Las organizaciones tienen objeto subscription y existe la función de actualización de plan.</done>
</task>

## Success Criteria
- [ ] Las organizaciones creadas tienen un plan 'startup' por defecto.
- [ ] Al cambiar el plan de una organización, sus módulos activos se actualizan según la definición del plan.
