---
phase: 29
plan: 1
wave: 1
---

# Plan 29.1: Guard de Ruta para Team + Protección de Acceso Directo

## Objective
Proteger la ruta `/client/team` para que solo usuarios con rol `admin` puedan acceder, incluso si navegan directamente por URL. Actualmente el enlace está oculto en el sidebar pero la ruta no tiene protección.

## Context
- .gsd/SPEC.md
- .gsd/ARCHITECTURE.md
- src/App.jsx (línea 60: ruta `/team` sin guard)
- src/components/ModuleRoute.jsx (patrón de guard existente)
- src/layouts/client/ClientLayout.jsx (sidebar ya filtrado para `role === 'admin'`)

## Tasks

<task type="auto">
  <name>Crear AdminRoute guard component</name>
  <files>src/components/AdminRoute.jsx</files>
  <action>
    Crear un componente `AdminRoute` siguiendo el mismo patrón que `ModuleRoute.jsx`:
    - Importar `Navigate`, `Outlet` de `react-router-dom`
    - Importar `useAuth`
    - Si `user?.role !== 'admin'` y `user?.role !== 'superadmin'`, redirigir a `/client/dashboard`
    - Si el usuario es admin o superadmin, renderizar `<Outlet />`
    - Mantener el mismo estilo de código y comentarios que `ModuleRoute.jsx`
  </action>
  <verify>El archivo src/components/AdminRoute.jsx existe y exporta un componente por defecto</verify>
  <done>AdminRoute.jsx creado con lógica de redirección para usuarios no-admin</done>
</task>

<task type="auto">
  <name>Proteger ruta /team con AdminRoute</name>
  <files>src/App.jsx</files>
  <action>
    En App.jsx, envolver la ruta `team` con el guard `AdminRoute`:
    
    1. Importar `AdminRoute` de `./components/AdminRoute`
    2. Cambiar línea 60 de:
       `<Route path="team" element={<TeamModule />} />`
       a:
       ```
       <Route element={<AdminRoute />}>
         <Route path="team" element={<TeamModule />} />
       </Route>
       ```
    
    NO modificar ninguna otra ruta. Solo envolver `team`.
  </action>
  <verify>npm run build compila sin errores</verify>
  <done>La ruta /client/team redirige a /client/dashboard cuando un usuario con rol 'user' intenta acceder directamente</done>
</task>

## Success Criteria
- [ ] Un usuario con rol `user` que navega a `/client/team` directamente es redirigido a `/client/dashboard`
- [ ] Un usuario con rol `admin` puede acceder a `/client/team` normalmente
- [ ] El build compila sin errores
