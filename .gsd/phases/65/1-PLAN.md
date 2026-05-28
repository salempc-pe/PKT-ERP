---
phase: 65
plan: 1
wave: 1
---

# Plan 65.1: Creación de Componente Visual AiActionCard.jsx

## Objective
Desarrollar el componente interactivo de confirmación táctil `AiActionCard.jsx` y su correspondiente archivo de estilos. Este componente interceptará el payload estructurado de la IA y representará visualmente la propuesta de transacción en un formato enriquecido y limpio, impidiendo cualquier escritura directa y proporcionando estados visuales claros ("Pendiente", "Ejecutando", "Confirmado" y "Cancelado").

## Context
- .gsd/SPEC.md
- .gsd/phases/65/RESEARCH.md
- src/components/AiAssistantDrawer.jsx

## Tasks

<task type="auto">
  <name>Construir el componente AiActionCard</name>
  <files>
    - [NEW] src/components/AiActionCard.jsx
  </files>
  <action>
    - Crear `src/components/AiActionCard.jsx` como un componente de interfaz enriquecido.
    - Definir estados locales para la tarjeta: `status` (que puede ser 'pending', 'executing', 'confirmed', 'cancelled') y `errorMessage`.
    - Implementar el renderizado dinámico por tipo de acción extraída del payload:
      - `CREATE_SALE`: Muestra el nombre del cliente, una tabla con la lista de productos (nombre y cantidad), el subtotal, el impuesto y el total final de la cotización/factura previa de forma sumamente limpia.
      - `DEDUCT_INVENTORY`: Muestra el material a egresar, la cantidad física, y la justificación o motivo de la merma.
      - `QUERY_STOCK`: Muestra el stock disponible de forma atractiva en una tarjeta mini con un indicador de salud del producto.
    - Agregar botones interactivos de acción táctil: "Confirmar" (con icono de Check) y "Cancelar" (con icono de X).
    - Deshabilitar y ocultar los botones de acción si el estado de la tarjeta cambia a 'confirmed' o 'cancelled', mostrando en su lugar una insignia visual de estado de éxito o rechazo definitiva para congelar la transacción.
  </action>
  <verify>
    Importar la tarjeta visual con un payload simulado en un entorno temporal y certificar que la interfaz cambia de forma correcta al presionar "Confirmar" o "Cancelar".
  </verify>
  <done>
    El componente `AiActionCard` se renderiza con diseño sofisticado, despliega adecuadamente los detalles de cada tipo de acción, y bloquea re-ejecuciones congelando la tarjeta tras confirmarse o cancelarse.
  </done>
</task>

<task type="auto">
  <name>Diseñar los estilos CSS de AiActionCard</name>
  <files>
    - [NEW] src/components/AiActionCard.css
  </files>
  <action>
    - Crear `src/components/AiActionCard.css` para aplicar la estética premium glassmorphic de Veló ERP.
    - Estilizar el contenedor de la tarjeta con bordes redondeados `xl`, bordes translúcidos finos, y un color de fondo neutro sutil para que contraste elegantemente con el feed de burbujas.
    - Diseñar los botones de acción principal usando el color morado corporativo (#6B4FD8) con texto claro para máxima legibilidad, y el botón secundario en modo contorno translúcido.
    - Incorporar sutiles micro-animaciones en los hover de los botones y una animación de entrada suave para la tarjeta.
    - Diseñar estados especiales de éxito (color morado suave) y error (rojo suave) con iconos decorativos.
  </action>
  <verify>
    Revisar visualmente el aspecto de la tarjeta en navegadores bajo resoluciones de escritorio y móviles para garantizar la coherencia y una legibilidad impecable del texto y montos.
  </verify>
  <done>
    El archivo `AiActionCard.css` aplica los estilos de diseño unificados de Veló, garantizando una visualización nítida del totalizador de precios y una adaptabilidad responsiva completa.
  </done>
</task>

## Success Criteria
- [ ] Componente visual `AiActionCard` creado y estilizado de acuerdo con la línea de diseño glassmorphic unificada.
- [ ] Renderizado dinámico e interactivo completamente funcional para cotizaciones de ventas (`CREATE_SALE`), consultas de stock (`QUERY_STOCK`) y egresos de material (`DEDUCT_INVENTORY`).
- [ ] La interfaz bloquea cualquier posibilidad de doble clic o re-confirmación mediante congelación definitiva del estado.
