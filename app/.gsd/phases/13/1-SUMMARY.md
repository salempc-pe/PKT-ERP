# Summary: Plan 13.1

## Cambios Realizados
- **Contexto de Autenticación (`AuthContext.jsx`)**: 
  - Se añadieron las funciones `impersonateUser` y `stopImpersonation`.
  - Se implementó la lógica para guardar temporalmente al administrador en `sessionStorage` (`pkt_original_admin`) mientras se inyecta la sesión del cliente seleccionado.
  - Se previno el cierre de sesión directo si se está en modo suplantación, derivando el `logout` a `stopImpersonation`.
- **Layout de Cliente (`ClientLayout.jsx`)**:
  - Se agregó una barra superior roja destacada condicional `isImpersonating`.
  - Esta barra muestra el nombre y la empresa del usuario suplantado, junto a un botón rápido de "Salir del Modo Soporte", regresando al admin a su panel.

## Verificación
- [x] La lógica de Context y Session Storage para impersonación está exportada.
- [x] El Layout del cliente intercepta este estado de forma responsiva y animada para notificar la actividad de soporte.
