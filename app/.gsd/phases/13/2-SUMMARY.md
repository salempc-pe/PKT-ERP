# Summary: Plan 13.2

## Cambios Realizados
- **AdminClients (`AdminClients.jsx`)**: 
  - Se importó `impersonateUser` desde `useAuth`.
  - Dentro del menú u opciones por usuario en la lista de colaboradores vinculados a una Organización (Modal de Edición de Organización), se agregó un botón "Entrar como...".
  - Al presionarlo se invoca la lógica implementada en el Plan 13.1 forzando el reemplazo de la sesión.

## Verificación
- [x] El botón dispara correctamente la reevaluación del Contexto y redirige según rol de cliente con banner habilitado.
