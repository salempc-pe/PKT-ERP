---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: Capa de Datos del Inventario (useInventory)

## Objective
Establecer la conexión con Firebase / Mock API para el módulo de inventario mediante la creación de un hook personalizado `useInventory`, manteniendo el mismo diseño arquitectónico híbrido que `useCrm`.

## Context
- .gsd/ROADMAP.md
- src/hooks/useCrm.js (referencia de patrón)
- src/pages/client/InventoryModule.jsx (UI objetivo futuro)

## Tasks

<task type="auto">
  <name>Crear useInventory Hook</name>
  <files>src/hooks/useInventory.js</files>
  <action>
    - Crear el archivo `useInventory.js` en `src/hooks/`.
    - Implementar el hook importando a Firebase (`db`) y funciones de `firestore`.
    - Crear estado inicial con un array de productos hardcodeados equivalente al que existe en `InventoryModule.jsx`.
    - Emular estructura fallback: Si no existe `import.meta.env.VITE_FIREBASE_API_KEY`, usar la data en memoria (Mock).
    - Si existe la API, realizar suscripción `onSnapshot` a `organizations/{orgId}/products`.
    - Exportar métodos `products`, `loading`, `error`, `addProduct`, `updateProductStock`.
  </action>
  <verify>Get-Content src/hooks/useInventory.js (Verificar existencia y métodos clave)</verify>
  <done>El archivo `useInventory.js` se ha creado con su estructura completa interactiva mock/firebase.</done>
</task>

## Success Criteria
- [ ] El hook `useInventory` soporta tanto el modo Mock como la conexión con Firestore en tiempo real.
- [ ] Incorpora las mutaciones asíncronas para agregar productos y actualizar stock.
