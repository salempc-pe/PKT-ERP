---
phase: 51
plan: 2
wave: 1
---

# Plan 51.2: Corrección de Acceso a Módulos y Errores de React

## Objective
Solucionar la expulsión del SuperAdmin de los módulos (ej. `realestate`) por lógica restrictiva en `ModuleRoute.jsx` y corregir las validaciones de acceso que provocan redirecciones erráticas y errores de "Rendered fewer hooks than expected" en el árbol de renderizado de React.

## Context
- src/components/ModuleRoute.jsx
- src/context/AuthContext.jsx

## Tasks

<task type="auto">
  <name>Actualizar permisos de SuperAdmin en ModuleRoute</name>
  <files>src/components/ModuleRoute.jsx</files>
  <action>
    Modificar la validación de `isModuleActive` para permitir el acceso a los usuarios con rol de `superadmin` o usuarios que expongan `user.isAdmin === true` en general, además de `admin` regular.
    - Cambiar: `const isModuleActive = user?.subscription?.activeModules?.includes(module) || user?.role === 'admin';`
    - A: `const isModuleActive = user?.subscription?.activeModules?.includes(module) || user?.role === 'admin' || user?.role === 'superadmin';`
    
    Esto evitará que el SuperAdmin sea redirigido a `/client/marketplace` con la advertencia "Intento de acceso a módulo no activo".
  </action>
  <verify>Get-Content src/components/ModuleRoute.jsx | Select-String -Pattern "superadmin"</verify>
  <done>El componente `ModuleRoute` no redirige a los SuperAdmins cuando intentan visualizar un módulo de cliente.</done>
</task>

## Success Criteria
- [ ] Desaparece el mensaje `Intento de acceso a módulo no activo` para el rol de SuperAdmin.
- [ ] La navegación entre pestañas de módulos (`/client/realestate`, etc.) funciona fluidamente sin abortar renderizados, eliminando el error secundario de Hooks en la consola.
