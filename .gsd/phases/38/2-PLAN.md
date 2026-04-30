---
phase: 38
plan: 2
wave: 1
---

# Plan 38.2: Rate Limiting en Login y SetupPassword

## Objective
Implementar protección contra fuerza bruta en los dos endpoints públicos de autenticación: Login y SetupPassword. Usar un mecanismo client-side con contador de intentos y lockout temporal.

## Context
- src/modules/Login.jsx (formulario de login sin protección)
- src/modules/SetupPassword.jsx (activación de cuenta sin protección)

## Tasks

<task type="auto">
  <name>Rate limiting en Login</name>
  <files>src/modules/Login.jsx</files>
  <action>
    Agregar estado de control de intentos al componente Login:
    ```javascript
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [lockoutUntil, setLockoutUntil] = useState(null);
    ```
    
    Al inicio de `handleLogin`, ANTES del try/catch, agregar verificación de lockout:
    ```javascript
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const secsLeft = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setError(`Demasiados intentos. Espera ${secsLeft}s.`);
      setIsSubmitting(false);
      return;
    }
    ```
    
    Después del `if (!response?.success)`, incrementar intentos y activar lockout si llega a 5:
    ```javascript
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    if (newAttempts >= 5) {
      setLockoutUntil(Date.now() + 60000);
      setLoginAttempts(0);
    }
    ```
    
    En caso de login exitoso, resetear el contador:
    ```javascript
    setLoginAttempts(0);
    setLockoutUntil(null);
    ```
    
    - NO usar localStorage para el contador (se resetea al refrescar, lo cual es aceptable para client-side).
    - El lockout de 60s es suficiente para disuadir scripts automatizados básicos.
    - Firebase Auth ya tiene su propia protección server-side; esto es defensa en profundidad.
  </action>
  <verify>grep -n "lockoutUntil" src/modules/Login.jsx && grep -n "loginAttempts" src/modules/Login.jsx</verify>
  <done>El login se bloquea por 60 segundos después de 5 intentos fallidos consecutivos.</done>
</task>

<task type="auto">
  <name>Rate limiting en SetupPassword</name>
  <files>src/modules/SetupPassword.jsx</files>
  <action>
    Aplicar el mismo patrón de rate limiting que en Login:
    
    Agregar estados:
    ```javascript
    const [attempts, setAttempts] = useState(0);
    const [lockoutUntil, setLockoutUntil] = useState(null);
    ```
    
    Al inicio de `handleSubmit` (después de preventDefault), agregar check de lockout:
    ```javascript
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const secsLeft = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setError(`Demasiados intentos. Espera ${secsLeft}s.`);
      return;
    }
    ```
    
    En el bloque de error (cuando `!response.success`), incrementar contador:
    ```javascript
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (newAttempts >= 3) {
      setLockoutUntil(Date.now() + 120000); // 2 minutos
      setAttempts(0);
    }
    ```
    
    - Límite más estricto (3 intentos, 2 min lockout) porque este endpoint maneja tokens sensibles.
    - En caso de éxito, NO es necesario resetear (el usuario es redirigido).
  </action>
  <verify>grep -n "lockoutUntil" src/modules/SetupPassword.jsx && grep -n "attempts" src/modules/SetupPassword.jsx</verify>
  <done>SetupPassword se bloquea después de 3 intentos fallidos con lockout de 2 minutos.</done>
</task>

## Success Criteria
- [ ] Login tiene rate limiting (5 intentos → 60s lockout).
- [ ] SetupPassword tiene rate limiting (3 intentos → 120s lockout).
- [ ] Ambos muestran mensaje de error con tiempo restante.
- [ ] La app compila sin errores.
