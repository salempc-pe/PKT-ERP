---
phase: 36
plan: 2
wave: 1
---

# Plan 36.2: Tablas a Ancho Completo en Módulos Financieros y Otros

## Objective
Aplicar la misma estandarización "full-width" para móviles en los módulos de Finanzas, Inmobiliaria, Compras, Proveedores y CRM (si aplica a listas de contactos).

## Context
- .gsd/ROADMAP.md
- src/modules/client/finance/FinanceModule.jsx
- src/modules/client/purchases/PurchasesModule.jsx
- src/modules/client/purchases/SuppliersModule.jsx
- src/modules/client/realestate/RealEstateModule.jsx
- src/modules/client/crm/CRMModule.jsx

## Tasks

<task type="auto">
  <name>Refactorizar Tablas de Módulos (Parte 1)</name>
  <files>
    - src/modules/client/finance/FinanceModule.jsx
    - src/modules/client/purchases/PurchasesModule.jsx
    - src/modules/client/purchases/SuppliersModule.jsx
  </files>
  <action>
    - Ubicar los contenedores de tabla y aplicar clases responsivas para que en móvil ocupen el 100% del ancho (`-mx-4 md:mx-0`) y pierdan el estilo de tarjeta (`md:rounded-xl`, `border-y md:border`, etc.).
  </action>
  <verify>npm run build</verify>
  <done>Tablas de finanzas y compras se adaptan de lado a lado en móvil.</done>
</task>

<task type="auto">
  <name>Refactorizar Tablas de Módulos (Parte 2)</name>
  <files>
    - src/modules/client/realestate/RealEstateModule.jsx
    - src/modules/client/crm/CRMModule.jsx
  </files>
  <action>
    - Para `RealEstateModule`, modificar las listas de la pestaña "Directorio" para seguir la misma lógica de ancho completo.
    - Para `CRMModule`, modificar la vista de "Contactos" (Listado) para que ocupe todo el ancho sin redondos en bordes en móvil.
  </action>
  <verify>npm run build</verify>
  <done>Tablas de inmobiliaria y CRM están integradas full-width en móvil.</done>
</task>

## Success Criteria
- [ ] Finanzas, Compras y Proveedores no parecen tarjetas en móvil.
- [ ] Real Estate y CRM (vista lista) tienen diseño fluido de borde a borde en celular.
