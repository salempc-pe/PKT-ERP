# Summary: Plan 11.1

## Cambios Realizados
- **Definición de Planes**: Se creó la constante `SUBSCRIPTION_PLANS` en `AuthContext.jsx` definiendo 3 niveles (Startup, Business, Enterprise) con sus respectivos módulos y límites.
- **Refactorización de Estado**: Se migró `mockOrganizations` para que cada empresa tenga un objeto `subscription` persistente.
- **Control de Cuotas**: Se modificó `adminCreateUser` para validar el límite de usuarios según el plan contratado.
- **Gestión de Upgrade**: Se implementó `adminUpdateOrgPlan` para cambiar el nivel de suscripción y sincronizar automáticamente los módulos activos de todos los usuarios vinculados.

## Verificación
- [x] `SUBSCRIPTION_PLANS` definido.
- [x] Lógica de creación de organizaciones con plan 'startup' por defecto.
- [x] Función de actualización de plan operativa y exportada.
