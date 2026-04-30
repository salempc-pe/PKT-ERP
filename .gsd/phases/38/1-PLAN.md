---
phase: 38
plan: 1
wave: 1
---

# Plan 38.1: Token Seguro y Política de Contraseñas

## Objective
Reemplazar la generación insegura de tokens (`Math.random()`) por `crypto.randomUUID()` y fortalecer la validación de contraseñas en el frontend. Estos son cambios quirúrgicos de alto impacto sin dependencias externas.

## Context
- .gsd/SPEC.md
- src/context/AuthContext.jsx (línea 526 — generación de inviteToken)
- src/modules/SetupPassword.jsx (línea 25 — validación de password)

## Tasks

<task type="auto">
  <name>Reemplazar Math.random() por crypto.randomUUID()</name>
  <files>src/context/AuthContext.jsx</files>
  <action>
    En la función `adminCreateUser` (línea ~526), reemplazar:
    ```javascript
    const inviteToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    ```
    Por:
    ```javascript
    const inviteToken = crypto.randomUUID();
    ```
    - `crypto.randomUUID()` está disponible nativamente en todos los navegadores modernos (soporte 95%+).
    - NO importar ningún polyfill — el Web Crypto API es nativo.
    - NO modificar ningún otro código — el token sigue siendo un string que se almacena en Firestore.
  </action>
  <verify>grep -n "crypto.randomUUID" src/context/AuthContext.jsx && ! grep -n "Math.random" src/context/AuthContext.jsx</verify>
  <done>La línea `Math.random()` ya no existe en AuthContext.jsx y fue reemplazada por `crypto.randomUUID()`.</done>
</task>

<task type="auto">
  <name>Fortalecer política de contraseñas</name>
  <files>src/modules/SetupPassword.jsx</files>
  <action>
    En la función `handleSubmit`, reemplazar la validación:
    ```javascript
    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    ```
    Por una validación más robusta:
    ```javascript
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.');
      return;
    }
    ```
    - Esto se alinea con el mínimo de 6 chars de Firebase Auth pero lo supera.
    - NO modificar el placeholder del input (dejarlo como guía visual).
    - Actualizar el placeholder a "Mínimo 8 caracteres" para coherencia.
  </action>
  <verify>grep -n "passwordRegex" src/modules/SetupPassword.jsx && grep -n "8 caracteres" src/modules/SetupPassword.jsx</verify>
  <done>La validación exige mínimo 8 caracteres con al menos 1 mayúscula y 1 número. El placeholder refleja el requisito.</done>
</task>

## Success Criteria
- [ ] `Math.random()` eliminado de AuthContext.jsx para generación de tokens.
- [ ] `crypto.randomUUID()` usado en su lugar.
- [ ] Password mínimo subido de 4 a 8 caracteres con complejidad requerida.
- [ ] La app compila sin errores (`npm run dev`).
