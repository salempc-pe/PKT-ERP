# Summary 67.1: Simulador de WhatsApp de SuperAdmin y Visor de Logs de IA

Se ha completado el desarrollo e integración de la consola de soporte del SuperAdmin, la cual incluye un simulador de chat de WhatsApp y un inspector de logs de IA en tiempo real.

## Cambios Realizados

1. **Reglas de Seguridad de Firestore (`firestore.rules`)**:
   - Añadida regla granular para la colección raíz `/whatsapp_bindings/{code}`.
   - Permitida la creación (`create`) solo para usuarios autenticados asociando su propio `userId`.
   - Permitida la lectura (`read`) y eliminación (`delete`) para el creador del documento o para el `SuperAdmin`.
   - Prohibidas las actualizaciones (`update: if false`).

2. **Rutas e Integración en la Barra Lateral (`src/App.jsx`, `src/layouts/admin/AdminLayout.jsx`)**:
   - Importado y registrado el componente `AdminWhatsappSimulator` bajo la ruta `/admin/whatsapp`.
   - Agregado el enlace de navegación "Simulador WhatsApp" con el icono `MessageSquare` en el sidebar de SuperAdmin.

3. **Componente Simulador (`src/modules/admin/whatsapp/AdminWhatsappSimulator.jsx`)**:
   - Interfaz de doble columna utilizando la estética de Veló ERP (fondos HSL, bordes transparentes y tipografía Inter/Outfit).
   - **Columna Izquierda**:
     - Selector de usuarios registrados con visualización en tiempo real de su estado de vinculación y código OTP activo (leído reactivamente desde Firestore).
     - Caja de entrada manual de teléfono.
     - Réplica de chat de WhatsApp ("Veló AI Assistant") con burbujas de conversación, loader y pastillas de sugerencias dinámicas.
     - Envío de POST simulando el payload de Meta a la Cloud Function del asistente.
   - **Columna Derecha**:
     - Visor cronológico estructurado de logs (Request/Response) con inspector de JSON expandible/colapsible.
     - Resaltado visual en morado cuando Gemini invoca herramientas (`QUERY_STOCK`, `CREATE_SALE`, `DEDUCT_INVENTORY`).
     - Botones rápidos de copiado y de limpieza de logs.
