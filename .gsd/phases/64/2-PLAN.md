---
phase: 64
plan: 2
wave: 1
---

# Plan 64.2: Componente del Drawer de IA Glassmorphic y Botón Flotante en el Cliente

## Objective
Desarrollar la interfaz visual premium del asistente de IA ("Veló AI") en el portal del cliente. Construiremos el Drawer lateral deslizable con diseño translúcido (glassmorphic, desenfoque de fondo), burbujas de conversación interactivas, estados de carga y pastillas de atajos rápidos ("Comandos Rápidos"). Finalmente, integraremos el botón flotante del asistente con animación de pulso continuo en el layout del cliente.

## Context
- .gsd/SPEC.md
- .gsd/phases/64/RESEARCH.md
- src/layouts/client/ClientLayout.jsx

## Tasks

<task type="auto">
  <name>Construir el componente AiAssistantDrawer</name>
  <files>
    - [NEW] src/components/AiAssistantDrawer.jsx
    - [NEW] src/components/AiAssistantDrawer.css
  </files>
  <action>
    - Crear `src/components/AiAssistantDrawer.jsx` como componente interactivo.
    - Utilizar Lucide React para incorporar iconos de soporte de primer nivel (ej. Sparkles, Send, X, Bot, User, Trash2).
    - Diseñar una cabecera translúcida con el logo e información del asistente de IA.
    - Implementar las burbujas de chat responsivas en el feed, estilizando los diálogos del usuario con color púrpura (#6B4FD8) y los de la IA en formato neutral translúcido.
    - Renderizar pastillas de comandos rápidos ("Comandos Rápidos") interactivos en la parte inferior cuando el feed esté vacío (ej. "Consultar stock", "Crear cotización"). Al hacer clic, enviarán la frase automáticamente.
    - Implementar el indicador de escritura ("Escribiendo...") con una animación palpitante delicada cuando la IA esté procesando.
    - Crear `src/components/AiAssistantDrawer.css` declarando los estilos glassmorphic, desenfoques de fondo (`backdrop-filter: blur(12px)`), sombras premium y animaciones de deslizamiento lateral suaves (`@keyframes slideInRight`).
  </action>
  <verify>
    Importar y renderizar el componente de forma aislada en local para comprobar que la interfaz responde visualmente a los estados de carga y renderiza el historial de mensajes de manera fluida.
  </verify>
  <done>
    El Drawer de IA se renderiza con diseño translúcido glassmorphic impecable, las burbujas de conversación están correctamente alineadas y los comandos rápidos envían texto al hacer clic.
  </done>
</task>

<task type="auto">
  <name>Integrar el Asistente de IA en el Layout de Clientes</name>
  <files>
    - src/layouts/client/ClientLayout.jsx
  </files>
  <action>
    - Modificar `src/layouts/client/ClientLayout.jsx` para importar el componente `AiAssistantDrawer`.
    - Declarar un estado reactivo `isAssistantOpen` (booleano) para alternar la visibilidad del Drawer.
    - Crear un botón flotante fijo en la esquina inferior derecha de la pantalla (con un z-index elevado, ej. z-40) que represente al asistente con icono de IA/Sparkles y animación de pulso circular elegante.
    - Ubicar el componente `<AiAssistantDrawer isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />` al final del marcado JSX de `ClientLayout.jsx`.
    - Garantizar adaptabilidad móvil completa: en resoluciones pequeñas (pantallas de 320px-480px) el Drawer ocupará el 100% de la pantalla para evitar colisiones estéticas, mientras que en desktop mantendrá un ancho compacto lateral (ej. 400px).
  </action>
  <verify>
    Lanzar la aplicación local y validar que el botón flotante del asistente es visible en todas las páginas del portal del cliente, que abre el Drawer lateral con micro-animaciones al pulsarlo, y que responde adecuadamente en resoluciones móviles.
  </verify>
  <done>
    El botón de IA y el Drawer están perfectamente integrados en la barra lateral e interfaz de cliente, poseen transiciones fluidas de apertura y cierre y se adaptan a todas las resoluciones de pantalla analizadas.
  </done>
</task>

## Success Criteria
- [ ] Drawer del asistente de IA completamente implementado con estética translúcida (glassmorphic) y sutiles animaciones premium de entrada.
- [ ] Botón de IA flotante e interactivo ubicado en la esquina del portal de clientes del ERP.
- [ ] La UI en móviles es responsiva y respeta el área de toque mínima táctil recomendada.
