---
phase: 38
plan: 4
wave: 2
---

# Plan 38.4: Granularizar Firestore Rules y Eliminar SuperAdmin Hardcodeado

## Objective
Reemplazar el wildcard permisivo `{allSubcollections=**}` en las reglas de Firestore por reglas específicas por subcolección, y eliminar la dependencia del email hardcodeado `admin@admin.com` para la detección del SuperAdmin.

## Context
- firestore.rules (reglas actuales con wildcard en línea 82-84)
- src/context/AuthContext.jsx (líneas 196-197 y 285-286 — email hardcodeado)

## Tasks

<task type="auto">
  <name>Granularizar reglas de subcolecciones en Firestore</name>
  <files>firestore.rules</files>
  <action>
    Reemplazar el bloque wildcard (líneas 81-84):
    ```
    // --- Subcolecciones de la Organización ---
    match /{allSubcollections=**} {
      allow read, write: if request.auth != null && (getUserOrg() == orgId || isSuperAdmin());
    }
    ```
    
    Por reglas específicas para cada subcolección conocida:
    ```
    // --- Subcolecciones de la Organización ---
    
    // CRM: Contactos y Leads
    match /contacts/{docId} {
      allow read, write: if request.auth != null && (getUserOrg() == orgId || isSuperAdmin());
    }
    
    // Inventario
    match /inventory/{docId} {
      allow read, write: if request.auth != null && (getUserOrg() == orgId || isSuperAdmin());
    }
    
    // Ventas y Facturación
    match /sales/{docId} {
      allow read, write: if request.auth != null && (getUserOrg() == orgId || isSuperAdmin());
    }
    
    // Finanzas: Transacciones
    match /transactions/{docId} {
      allow read, write: if request.auth != null && (getUserOrg() == orgId || isSuperAdmin());
    }
    
    // Calendario: Citas
    match /appointments/{docId} {
      allow read, write: if request.auth != null && (getUserOrg() == orgId || isSuperAdmin());
    }
    
    // Proyectos y Tareas
    match /projects/{projectId} {
      allow read, write: if request.auth != null && (getUserOrg() == orgId || isSuperAdmin());
      match /tasks/{taskId} {
        allow read, write: if request.auth != null && (getUserOrg() == orgId || isSuperAdmin());
      }
    }
    
    // Compras: Proveedores y Órdenes
    match /suppliers/{docId} {
      allow read, write: if request.auth != null && (getUserOrg() == orgId || isSuperAdmin());
    }
    match /purchase_orders/{docId} {
      allow read, write: if request.auth != null && (getUserOrg() == orgId || isSuperAdmin());
    }
    
    // Real Estate: Terrenos y Pipeline
    match /terrains/{docId} {
      allow read, write: if request.auth != null && (getUserOrg() == orgId || isSuperAdmin());
    }
    match /pipeline/{docId} {
      allow read, write: if request.auth != null && (getUserOrg() == orgId || isSuperAdmin());
    }
    
    // Bodega / Warehouse
    match /warehouse/{docId} {
      allow read, write: if request.auth != null && (getUserOrg() == orgId || isSuperAdmin());
    }
    match /warehouse_movements/{docId} {
      allow read, write: if request.auth != null && (getUserOrg() == orgId || isSuperAdmin());
    }
    
    // Nóminas: Empleados
    match /employees/{docId} {
      allow read, write: if request.auth != null && (getUserOrg() == orgId || isSuperAdmin());
    }
    ```
    
    - Verificar qué subcolecciones usan los hooks consultando los archivos `use*.js`.
    - Si se descubre alguna subcolección adicional, agregarla.
    - NO cambiar las funciones helper (getUserOrg, isSuperAdmin, etc.).
    - PRESERVAR todos los comentarios existentes en el archivo.
  </action>
  <verify>$content = Get-Content "firestore.rules" -Raw; ($content -notmatch "allSubcollections") -and ($content -match "employees") -and ($content -match "warehouse")</verify>
  <done>El wildcard `{allSubcollections=**}` ha sido eliminado y reemplazado por reglas individuales para cada subcolección.</done>
</task>

<task type="auto">
  <name>Eliminar email hardcodeado de SuperAdmin</name>
  <files>src/context/AuthContext.jsx</files>
  <action>
    Hay DOS ocurrencias del patrón hardcodeado que deben modificarse:
    
    1. En `onAuthStateChanged` (~línea 196):
    ```javascript
    // ANTES:
    const isSuperAdmin = (firebaseUser.email === 'admin@admin.com') && 
      (userData.role === 'superadmin' || (userData.role === 'admin' && !userData.organizationId));
    // DESPUÉS:
    const isSuperAdmin = userData.role === 'superadmin' || 
      (userData.role === 'admin' && !userData.organizationId);
    ```
    
    2. En la función `login` (~línea 285):
    ```javascript
    // ANTES:
    const isSuperAdmin = (firebaseUser.email === 'admin@admin.com') && 
      (foundUser.role === 'superadmin' || (foundUser.role === 'admin' && !foundUser.organizationId));
    // DESPUÉS:
    const isSuperAdmin = foundUser.role === 'superadmin' || 
      (foundUser.role === 'admin' && !foundUser.organizationId);
    ```
    
    - La lógica se simplifica: un SuperAdmin es alguien con rol `superadmin` O un `admin` sin `organizationId`.
    - Esto ya es seguro porque el rol se lee de Firestore (no del frontend) y las reglas de Firestore protegen la escritura.
    - NO necesitamos Custom Claims de Firebase en esta iteración — el rol de Firestore es suficiente con las reglas actuales.
  </action>
  <verify>$content = Get-Content "src/context/AuthContext.jsx" -Raw; $content -notmatch "admin@admin.com"</verify>
  <done>No existe ninguna referencia a `admin@admin.com` en AuthContext.jsx. La detección de SuperAdmin se basa exclusivamente en el rol de Firestore.</done>
</task>

## Success Criteria
- [ ] `firestore.rules` no contiene `{allSubcollections=**}`.
- [ ] Cada subcolección tiene su propia regla explícita.
- [ ] `admin@admin.com` no aparece en ningún archivo del proyecto.
- [ ] Las reglas de Firestore pasan validación (`firebase deploy --only firestore:rules --dry-run` o validación MCP).
