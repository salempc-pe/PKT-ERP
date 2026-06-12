---
phase: 3
plan: 3
wave: 2
---

# Plan 3.3: Creación Modal de Producto y Lógica de Registro

## Objective
Proporcionar a los usuarios una interfaz sencilla y funcional mediante un modal reactivo ("Glassmorphism") para registrar nuevos elementos en su inventario. 

## Context
- src/pages/client/InventoryModule.jsx
- src/hooks/useInventory.js

## Tasks

<task type="auto">
  <name>Implementar NewProductModal</name>
  <files>src/pages/client/InventoryModule.jsx</files>
  <action>
    - Diseñar y crear el modal interno (como overlay con fondos `glass` usando el token `architectural-glass`).
    - Añadir un formulario con los campos SKU, Nombre, Categoría, Precio, Stock Inicial.
    - Capturar los cambios usando el estado del componente.
    - Controlar visibilidad mediante state reactivo booleano (`isModalOpen`).
    - Implementar el envío de información mediante el hook provisto: `await addProduct(formData)`.
    - Calcular el campo `status` previo al guardado (Agotado/Bajo Stock/Normal) o dejarlo definido a la capa de datos.
    - Cerrar el Modal tras guardar satisfactoriamente.
  </action>
  <verify>Get-Content src/pages/client/InventoryModule.jsx | Select-String "isModalOpen"</verify>
  <done>El usuario puede hacer click en "Agregar Producto", rellenar la forma y se guarda en el estado global reactivo de la aplicación.</done>
</task>

## Success Criteria
- [ ] Botón "Agregar Producto" activa un Overlay visual sin interrumpir la UX general de la página.
- [ ] La escritura de información usa la función de persistencia, actualizando automáticamente el grid sin refrescar página debido al `onSnapshot` global.
