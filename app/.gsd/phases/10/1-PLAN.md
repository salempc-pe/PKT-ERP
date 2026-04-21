---
phase: 10
plan: 1
wave: 1
---

# Plan 10.1: Mejoras y Arreglos Admin

## Objective
Resolver la cabecera redundante de Admin y usar el SalesModule, además de habilitar la "Nueva Organización".

## Context
- .gsd/ROADMAP.md
- src/layouts/admin/AdminLayout.jsx
- src/App.jsx
- src/modules/admin/clients/AdminClients.jsx
- src/context/AuthContext.jsx

## Tasks

<task type="auto">
  <name>Facturación Administrador y Limpieza de Cabecera</name>
  <files>
    - src/layouts/admin/AdminLayout.jsx
    - src/App.jsx
  </files>
  <action>
    - En `AdminLayout.jsx`:
      - Eliminar el bloque `<header>` con sus variables "ArchitectOS Admin".
      - Actualizar las clases de `<main>` para que correspondan al estilo sin header (similar a ClientLayout: `className="flex-1 p-6 lg:p-10 w-full max-h-screen overflow-y-auto flex-col"` o dejarlo adaptado pero que se vea limpio).
      - Cambiar el link en el Sidebar de `/admin/payments` (Billing) a `/admin/sales` y nombrarlo "Facturación y Ventas" o similar a como está en cliente ("Ventas y Facturas") (ajustar ícono a `FileText` de lucide-react si es necesario, o conservar el que está).
    - En `App.jsx`:
      - Importar `SalesModule` (ya se está importando).
      - Añadir una nueva `<Route path="sales" element={<SalesModule />} />` dentro del route de Admin (`/admin`).
  </action>
  <verify>Verificar la carga y renderización limpia en el navegador tras reiniciar App.jsx.</verify>
  <done>
    - `/admin/sales` muestra el módulo de ventas.
    - La interfaz de admin ya no contiene el header superior "ArchitectOS".
  </done>
</task>

<task type="auto">
  <name>Botón "Nueva Organización"</name>
  <files>
    - src/context/AuthContext.jsx
    - src/modules/admin/clients/AdminClients.jsx
  </files>
  <action>
    - En `AuthContext.jsx`:
      - Crear e implementar la función `adminCreateUser(newUser)` que agregue un nuevo cliente mock a `mockUsers`. Debería asignar una nueva UUID al usuario (`usr_...`) y a su `organizationId` si no la tiene.
    - En `AdminClients.jsx`:
      - Agregar un estado para el modal de "Nueva Organización" (`isNewOrgModalOpen`).
      - Al pulsar en "Nueva Organización", abrir un modal muy sencillo pidiendo el Nombre de Organización, Nombre del Usuario Contacto, y Correo para login (password siempre será `1234` de prueba).
      - Con este modal, al guardar, llamar a `adminCreateUser` y cerrar el modal (mostrando opcionalmente un alert de éxito).
      - Esto refrescará la vista ya que usa `getClientUsers()` y el memo.
  </action>
  <verify>Añadir un console.log de prueba si falla y verificar en interfaz si aparece la empresa en el Grid.</verify>
  <done>
    - El modal captura los datos y los envía a `AuthContext`.
    - La vista se refresca mostrando la nueva organización listada de forma reactiva.
  </done>
</task>

## Success Criteria
- [ ] No aparece la cabecera duplicada o redundante en admin.
- [ ] El administrador puede emitir y ver ventas usando la misma pantalla que los clientes.
- [ ] El administrador puede crear una nueva organización mock de manera funcional.
