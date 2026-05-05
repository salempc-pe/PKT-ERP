---
phase: 51
plan: 1
wave: 1
---

# Plan 51.1: Corrección de Reglas de Seguridad y Nombres de Colecciones en Firestore

## Objective
Corregir los errores de "Missing or insufficient permissions" en Firestore resolviendo la falla de evaluación de `getUserOrg()` para el SuperAdmin y sincronizando los nombres de las subcolecciones para que coincidan con la implementación del código (`purchases`, `warehouse_stock`, `warehouse_history`, `leads`, `interactions`).

## Context
- .gsd/SPEC.md
- firestore.rules

## Tasks

<task type="auto">
  <name>Sincronizar nombres y agregar colecciones faltantes en firestore.rules</name>
  <files>firestore.rules</files>
  <action>
    Actualizar las reglas de Firestore bajo la ruta `match /organizations/{orgId}`:
    1. Reemplazar `match /purchase_orders/{docId}` por `match /purchases/{docId}`.
    2. Reemplazar `match /warehouse/{docId}` por `match /warehouse_stock/{docId}`.
    3. Reemplazar `match /warehouse_movements/{docId}` por `match /warehouse_history/{docId}`.
    4. Agregar nuevas reglas (con los mismos permisos que las demás: `allow read, write: if request.auth != null && (getUserOrg() == orgId || isSuperAdmin());`) para las subcolecciones faltantes del CRM:
       - `match /leads/{docId}`
       - `match /interactions/{docId}`
  </action>
  <verify>Get-Content firestore.rules | Select-String -Pattern "match /purchases/", "match /warehouse_stock/", "match /leads/"</verify>
  <done>Las reglas de Firestore reflejan exactamente los nombres de colecciones usados en el código base.</done>
</task>

<task type="auto">
  <name>Prevenir excepciones por propiedades faltantes en firestore.rules</name>
  <files>firestore.rules</files>
  <action>
    Modificar la función `getUserOrg()` para que maneje de forma segura la ausencia del campo `organizationId` (lo cual ocurre en documentos de SuperAdmin).
    - Cambiar: `return userExists() ? get(/databases/$(database)/documents/users/$(request.auth.uid)).data.organizationId : null;`
    - A: `return userExists() ? get(/databases/$(database)/documents/users/$(request.auth.uid)).data.get('organizationId', null) : null;`
    
    Adicionalmente, asegurarse de que `isSuperAdmin()` no lance errores si `organizationId` no existe. La sintaxis actual `!('organizationId' in userData)` es segura, pero revisar que la evaluación de reglas no se rompa prematuramente.
  </action>
  <verify>Get-Content firestore.rules -TotalCount 25 | Select-String -Pattern "\.get\('organizationId', null\)"</verify>
  <done>La función `getUserOrg()` es resiliente a documentos de usuario que no tienen `organizationId`.</done>
</task>

## Success Criteria
- [ ] Las consultas a `purchases`, `warehouse_stock` y `leads` ya no devuelven "Missing or insufficient permissions".
- [ ] El SuperAdmin puede leer y escribir sin que Firestore aborte la evaluación por errores en la propiedad `.organizationId`.
