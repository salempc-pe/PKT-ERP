## Phase 14 Verification

### Must-Haves
- [x] Al crear un usuario, el admin recibe un link único — VERIFIED (Lógica `inviteToken` en `AuthContext` y botón de copia en `AdminClients.jsx`).
- [x] Acceder al link permite guardar una contraseña y activa la cuenta inmediatamente — VERIFIED (Componente `SetupPassword.jsx` implementa `setupUserPassword` que cambia el estado a `active`).

### Verdict: PASS
