---
phase: 5
plan: 2
wave: 1
---

# Plan 5.2: Configuración de Empresa

## Objective
Implementar el módulo de configuración donde el usuario puede actualizar los datos de su empresa y perfil.

## Context
- .gsd/SPEC.md
- app/src/context/AuthContext.jsx
- app/src/services/firebase.js

## Tasks

<task type="auto">
  <name>Crear Módulo de Configuración y Formulario de Perfil</name>
  <files>
    - app/src/modules/settings/SettingsModule.jsx
    - app/src/modules/settings/components/BusinessProfileForm.jsx
  </files>
  <action>
    - Crear `SettingsModule` en `src/modules/settings`.
    - Implementar un formulario para editar: Nombre de la Empresa, Sector, Dirección y Email de contacto.
    - Los datos deben persistirse en el documento del tenant en Firestore (`tenants/{tenantId}`).
    - Usar feedback visual (Toasts o mensajes de éxito) al guardar.
  </action>
  <verify>Cambiar el nombre de la empresa y verificar que se guarda en Firestore.</verify>
  <done>Formulario de perfil funcional y conectado a Firestore.</done>
</task>

<task type="auto">
  <name>Actualizar Header y Perfil de Usuario</name>
  <files>
    - app/src/layouts/client/ClientLayout.jsx
  </files>
  <action>
    - Añadir acceso a "Configuración" desde el menú de usuario en el Sidebar/Header.
    - Mostrar el nombre de la empresa dinámicamente en el Layout a partir de los datos del tenant.
  </action>
  <verify>El nombre de la empresa en el sidebar cambia cuando se actualiza en Settings.</verify>
  <done>Navegación a Settings integrada y datos de empresa dinámicos.</done>
</task>

## Success Criteria
- [ ] Posibilidad de editar datos de la empresa.
- [ ] Persistencia real en el documento del tenant.
