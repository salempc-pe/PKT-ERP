# Research: Phase 13 - Centro de Soporte y Diagnóstico (SaaS Ops)

## Objetivo de Impersonation (Login as a Tenant)
El administrador necesita acceder a la plataforma exactamente como lo vería un cliente para poder resolver problemas (support tickets).
Para lograr esto sin solicitar contraseñas, se requiere una funcionalidad de **Impersonation**.

## Flujo de Trabajo
1. **Admin**: En el listado de clientes (`AdminClients.jsx`), junto a cada usuario, debe haber un botón "Entrar como este usuario".
2. **Contexto (`AuthContext.jsx`)**: 
   - Necesitamos una función `impersonateUser(userId)`.
   - Se debe guardar el usuario administrador actual en una variable de sesión separada (e.j. `pkt_original_admin`).
   - Se reemplaza el objeto `user` actual por el del cliente y se redirige a `/client/dashboard`.
3. **Banner de Impersonation**:
   - Mientras un administrador está suplantando la identidad de un cliente, DEBE MOSTRARSE SIEMPRE un banner superior rojo/visible indicando "Modo Suposición: [Nombre del Cliente]".
   - El banner debe tener un botón de "Terminar sesión y volver a Admin".
4. **Terminar Impersonation (`stopImpersonation`)**:
   - Limpia al cliente del estado activo.
   - Restaura el objeto de usuario desde `pkt_original_admin`.
   - Redirige a `/admin/dashboard/clients`.

## Consideraciones de Seguridad Mock
En entorno real, los logs de auditoría registrarían todas las acciones hechas en modo impersonation. En el prototipo actual, con mostrar el banner y tener vías de entrada/salida claras será suficiente para validar la experiencia UX.
