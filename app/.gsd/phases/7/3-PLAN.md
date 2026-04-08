---
phase: 7
plan: 3
wave: 2
---

# Plan 7.3: Integración de Vistas y Ruteo

## Objective
Conectar el módulo de calendario (Agenda) en el ClientLayout global y el router de aplicación.

## Context
- `src/App.jsx`
- `src/layouts/ClientLayout.jsx`

## Tasks

<task type="auto">
  <name>Integraciones en Routers y Menús</name>
  <files>src/App.jsx, src/layouts/ClientLayout.jsx</files>
  <action>
    - Importar `CalendarModule` en `src/App.jsx` y proveer un route `<Route path="calendar" element={<CalendarModule />} />` adentro del dashboard padre.
    - Añadir un nuevo item en la navegación lateral de `ClientLayout.jsx` para el path `/dashboard/calendar`, asignándole el ícono 'Calendar' e importándolo desde `lucide-react`.
  </action>
  <verify>Revisar visualmente el menú por el nuevo elemento e intentar clickearlo si existiesen tests.</verify>
  <done>El ruteador procesa el link en sidebar y retorna el módulo visual.</done>
</task>

## Success Criteria
- [ ] Navegación operable que dirige a '/dashboard/calendar'.
