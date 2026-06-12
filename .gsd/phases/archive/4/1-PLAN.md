---
phase: 4
plan: 1
wave: 1
---

# Plan 4.1: Modelo de Datos y Hook de Ventas

## Objective
Desarrollar la capa de datos de la fase 4 creando el custom hook `useSales` para interactuar con la colección `invoices` en Firebase y dar soporte al mock mode para pruebas aisladas.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- src/hooks/useInventory.js (Referencia de estructura con Mock Fallback)
- src/services/firebase.js

## Tasks

<task type="auto">
  <name>Implementar useSales.js Hook</name>
  <files>src/hooks/useSales.js</files>
  <action>
    - Crear `useSales.js` recibiendo `orgId` igual que en `useInventory`.
    - Implementar Firebase Firestore imports (`collection`, `onSnapshot`, `addDoc`, `serverTimestamp`).
    - Añadir soporte de mock mode (`isFirebaseConfigured`) si las credenciales de vite `.env` fallan.
    - Exportar variables: `sales`, `loading`, `error`.
    - Exportar función `addSale(saleData)` que agregue a Firestore con colección `organizations/{orgId}/invoices`.
    - Asegurarse de retornar también IDs falsos en caso de mock.
  </action>
  <verify>Verificar la exportación y sintaxis de useSales.js con `node -c src/hooks/useSales.js` o revisando lintings localmente.</verify>
  <done>El hook useSales expone correctamente lectura reactiva y un método mutador addSale.</done>
</task>

## Success Criteria
- [ ] Script `src/hooks/useSales.js` existe y sigue el patrón reactivo implementado en hooks preexistentes.
- [ ] Puede retornar datos iniciales ("ventas de prueba") en modo mock.
