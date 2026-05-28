---
phase: 65
plan: 2
wave: 1
---

# Plan 65.2: Conexión con Datos del ERP e Integración en el Chat

## Objective
Conectar la tarjeta de confirmación visual `AiActionCard.jsx` con los hooks reales del sistema (`useSales` y `useInventory`) para ejecutar escrituras reales en Firestore al presionar "Confirmar". Finalmente, integraremos el componente interactivo dentro de las burbujas de diálogo de `AiAssistantDrawer.jsx`, reemplazando el antiguo previsualizador tosco de código JSON.

## Context
- .gsd/SPEC.md
- .gsd/phases/65/RESEARCH.md
- src/components/AiAssistantDrawer.jsx
- src/components/AiActionCard.jsx
- src/modules/client/sales/useSales.js
- src/modules/client/inventory/useInventory.js

## Tasks

<task type="auto">
  <name>Conectar confirmación táctil con la capa de datos de Firestore</name>
  <files>
    - src/components/AiActionCard.jsx
  </files>
  <action>
    - En `src/components/AiActionCard.jsx`, importar `useAuth` para extraer de forma transparente el `organizationId` activo del inquilino.
    - Importar y consumir los hooks `useSales(orgId)` y `useInventory(orgId)` en el componente.
    - Desarrollar la función asíncrona `handleConfirm()` para procesar escrituras atómicas:
      - Para `CREATE_SALE`: sanitizar los campos, estructurar la orden, llamar a `addSale(saleData)` de forma asíncrona para emitir la factura/boleta numerada, y para cada artículo vendido, ubicar su ID en la lista de productos y llamar a `updateProductStock(productId, newStock)` para descontar físicamente las unidades del inventario en tiempo real.
      - Para `DEDUCT_INVENTORY`: descontar las unidades correspondientes del insumo de bodega llamando a la lógica del inventario del almacén.
    - Gestionar estados de error de manera segura: si falla la validación o la escritura en Firestore, capturar el error, restaurar la interfaz al estado pendiente y mostrar el aviso visual.
  </action>
  <verify>
    Probar el flujo completo en local y verificar mediante la consola del navegador que presionar "Confirmar" lanza las llamadas a Firestore y actualiza el inventario del sistema de forma coherente.
  </verify>
  <done>
    Presionar "Confirmar" en la tarjeta de cotización impacta la base de datos de Firestore insertando la venta correlativa y descontando el stock correspondiente de forma instantánea.
  </done>
</task>

<task type="auto">
  <name>Integrar AiActionCard en el Drawer del Asistente</name>
  <files>
    - src/components/AiAssistantDrawer.jsx
  </files>
  <action>
    - Modificar `src/components/AiAssistantDrawer.jsx` para importar el nuevo componente `AiActionCard` e importar también su hoja de estilos `AiActionCard.css`.
    - Buscar la sección del feed de mensajes donde se evalúa `msg.action`.
    - Reemplazar el previsualizador heredado tosco (la etiqueta `<div className="ai-action-preview">` y el tag `<pre>`) por la renderización enriquecida del componente `<AiActionCard action={msg.action} />`.
    - Pasar props adicionales opcionales si es necesario para sincronizar estados o disparar diálogos del bot de éxito al finalizar la transacción.
  </action>
  <verify>
    Abrir el chat del asistente local, escribir *"Vender 1 pala a Juan"* para gatillar la respuesta estructurada de Gemini, confirmar que se despliega la tarjeta enriquecida con el desglose de productos y totalizadores de precio en lugar del código plano, y que responde adecuadamente al hacer clic.
  </verify>
  <done>
    Las respuestas estructuradas de Veló AI muestran tarjetas de confirmación visual integradas orgánicamente con el feed del chat del Drawer, reemplazando la vista de JSON plano.
  </done>
</task>

## Success Criteria
- [ ] Conexión robusta de `AiActionCard` con la capa de datos de Firestore mediante el consumo de `useSales` y `useInventory` aislando por inquilino.
- [ ] La IA no realiza escrituras directas; toda alteración a la base de datos se rige bajo la interacción explícita del usuario (Human-in-the-Loop).
- [ ] La tarjeta visual enriquecida se integra perfectamente en las burbujas de diálogo del Drawer, eliminando el código JSON plano tosco.
