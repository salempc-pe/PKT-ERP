# SPEC.md — Especificación del Proyecto

> **Status**: `FINALIZED`

## Visión
Veló ERP es una solución de planificación de recursos empresariales (ERP) multi-tenant de alto rendimiento y diseño premium para pequeñas y medianas empresas. Adopta una arquitectura altamente modular y dinámica, permitiendo a las organizaciones activar solo los módulos específicos que necesitan (CRM, Terrenos e Inmobiliaria, Proyectos, Inventario, Finanzas, Ventas, Compras, Agenda, Almacén, etc.).

## Metas (Goals)
1. Proporcionar una interfaz de usuario moderna, limpia y estética con diseño glassmorphic y adaptativo tanto para vistas móviles como de escritorio.
2. Garantizar un aislamiento estricto de los datos por inquilino (multi-tenancy) a través de reglas de seguridad de Firebase y autenticación.
3. Permitir suscripciones y derechos de acceso dinámicos a módulos por inquilino junto con límites de usuarios granulares.
4. Escalar características empresariales rápidamente, incluyendo facturación, gestión de inmuebles, inventarios inteligentes y control de equipo.

## Fuera de Alcance (Non-Goals)
- Construir cumplimiento fiscal local profundo para múltiples países en el núcleo del SaaS.
- Integrar hardware de punto de venta (POS) físico.
- Almacenar archivos binarios masivos directamente en Firestore sin almacenamiento de objetos dedicado.

## Usuarios
- **SuperAdmin**: Supervisa organizaciones de inquilinos, cuotas de uso, métricas SaaS (MRR/ARR) y activación de módulos.
- **Administrador del Inquilino**: Configura el perfil de la organización, invita a los miembros del equipo, gestiona planes/tiers, activa módulos y actualiza la identidad corporativa.
- **Usuario del Inquilino**: Interactúa diariamente con los módulos de negocio activos según su rol (`admin` o `user`).

## Restricciones (Constraints)
- Debe ser ligero y desplegable a través de alojamiento web estándar (Firebase Hosting o despliegue estático).
- El aislamiento multi-tenant estricto se debe aplicar en todos los hooks personalizados de obtención de datos y estructuras en la nube.
- Uso exclusivo de tokens modernos de Tailwind CSS con variables CSS para transiciones dinámicas (modo claro/oscuro).

## Criterios de Éxito (Success Criteria)
- [x] Aislamiento multi-tenant funcional con persistencia en tiempo real (Firestore).
- [x] Sistema de activación de módulos en vivo con enrutamiento dinámico.
- [x] Diseño optimizado para móviles con estética de app nativa.
- [x] Flujo de invitaciones seguro utilizando tokens criptográficos únicos.
