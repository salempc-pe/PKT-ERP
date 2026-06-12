---
phase: 29
plan: 2
wave: 1
---

# Plan 29.2: Sincronización de Módulos y Verificación de Persistencia

## Objective
Garantizar que los usuarios invitados por administradores de empresa hereden correctamente los módulos activos de su organización y que el flujo completo de invitación → activación → sesión funcione sin interrupciones de datos.

## Context
- .gsd/SPEC.md
- .gsd/ARCHITECTURE.md
- src/context/AuthContext.jsx (funciones adminCreateUser, setupUserPassword, onAuthStateChanged)
- src/modules/client/dashboard/ClientDashboard.jsx (depende de `user?.subscription?.activeModules`)
- src/modules/client/team/TeamModule.jsx (invitación de usuarios)
- firestore.rules (permisos de lectura/escritura)

## Tasks

<task type="auto">
  <name>Asegurar herencia de módulos en setupUserPassword</name>
  <files>src/context/AuthContext.jsx</files>
  <action>
    En la función `setupUserPassword`, después de activar al usuario y obtener la suscripción de la organización (líneas ~592-601), verificar que `orgSubscription` incluye `activeModules`. Si no, hacer un fallback para construir la suscripción desde el documento de organización:
    
    1. En el bloque donde se obtiene `orgSubscription` (líneas 592-601), asegurar que se captura el objeto completo de suscripción `{ planId, maxUsers, activeModules }` y no solo una parte.
    2. Verificar que `userWithSub.subscription.activeModules` es un array válido antes de setear el usuario.
    3. En la función `onAuthStateChanged` (bloque de hidratación ~líneas 180-190), verificar que `orgSubscription` se carga correctamente para usuarios con rol `user` (no solo para `admin`). Actualmente esto ya se hace, pero confirmar que la cadena de datos no se rompe.
    
    NO cambiar la estructura del objeto `subscription`. Solo asegurar que siempre llega completo.
    
    Evitar duplicar la lógica de carga de organización — si ya existe, solo verificar que no hay paths donde se pierda.
  </action>
  <verify>npm run build compila sin errores</verify>
  <done>La suscripción con activeModules llega al usuario tanto en setupUserPassword como en onAuthStateChanged para todos los roles</done>
</task>

<task type="auto">
  <name>Validar compilación y actualizar ROADMAP</name>
  <files>.gsd/ROADMAP.md</files>
  <action>
    1. Ejecutar `npm run build` para validar que no hay errores de compilación.
    2. En ROADMAP.md, actualizar el status de Phase 29:
       - Cambiar `**Status**: ⬜ Not Started` a `**Status**: 🔄 In Progress`
       - Marcar las tareas completadas:
         - [x] Corregir nombres de variables (ya hecho)
         - [x] Asegurar persistencia de usuarios pending (ya hecho)
         - [x] Implementar ocultación dinámica del módulo Mi Equipo (ya hecho)
         - [x] Sincronizar permisos de módulos (este plan)
         - [ ] Verificar visibilidad en portal SuperAdmin (checkpoint manual)
  </action>
  <verify>npm run build sale exitoso con exit code 0</verify>
  <done>Build exitoso y ROADMAP.md actualizado con el progreso de la fase</done>
</task>

## Success Criteria
- [ ] Un usuario invitado como `user` por un admin de empresa, tras activar su cuenta, ve los módulos activos de su organización en el dashboard
- [ ] La cadena de datos `Firestore org → subscription → activeModules → sidebar/dashboard` es continua para todos los roles
- [ ] El proyecto compila sin errores
- [ ] ROADMAP.md refleja el progreso real de la fase
