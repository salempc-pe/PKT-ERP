---
phase: 63
plan: 2
wave: 1
---

# Plan 63.2: Lógica de Comunicación con Gemini y Configuración de Tools

## Objective
Desarrollar la lógica central de inteligencia artificial utilizando el SDK de Gemini. Configuraremos la inicialización de `gemini-1.5-flash`, definiremos la personalidad del asistente "Veló AI" a través de instrucciones del sistema en español, y estructuraremos el catálogo de herramientas (Tools) o Function Calling que permitirán a la IA interpretar lenguaje natural y traducirlo a intenciones estructuradas del ERP.

## Context
- .gsd/SPEC.md
- .gsd/phases/63/RESEARCH.md
- functions/package.json

## Tasks

<task type="auto">
  <name>Implementar inicializador de la API de Gemini y configuración del modelo</name>
  <files>
    - [NEW] functions/assistant.js
  </files>
  <action>
    - Crear un módulo de servicios de IA en `functions/assistant.js`.
    - Importar `GoogleGenAI` o el cliente de `@google/generative-ai`.
    - Implementar una función para obtener la API Key desde las variables de entorno (utilizando `process.env.GEMINI_API_KEY` cargada con `dotenv`).
    - Configurar el modelo `gemini-1.5-flash` definiendo sus parámetros base (temperature, topP, etc.) adecuados para tareas de procesamiento estructurado y de soporte interactivo.
    - Definir una `systemInstruction` exhaustiva en español que establezca la identidad de "Veló AI": un asistente inteligente, proactivo y cortés del ERP que ayuda a los usuarios a consultar inventarios, registrar borradores de ventas o cotizaciones y revisar datos del CRM.
  </action>
  <verify>
    Crear un script temporal de prueba rápida en `functions/test-ai.js` que invoque localmente a `assistant.js` con una consulta básica de texto para verificar que la comunicación con la API de Gemini se realiza de forma exitosa usando la API Key provista en el archivo local `.env`.
  </verify>
  <done>
    El módulo de IA se inicializa correctamente y devuelve respuestas válidas de Gemini al recibir una petición de texto plano de prueba en el entorno de desarrollo local.
  </done>
</task>

<task type="auto">
  <name>Definir esquemas de herramientas y function calling</name>
  <files>
    - [NEW] functions/tools.js
    - functions/assistant.js
  </files>
  <action>
    - Crear `functions/tools.js` que albergará las declaraciones (declarations) de las herramientas en formato JSON según la especificación técnica de Gemini.
    - Definir la herramienta `queryStock`: recibe `productName` (string, nombre del producto) y opcionalmente `category`, describiendo que sirve para consultar la cantidad disponible en el inventario.
    - Definir la herramienta `createSaleDraft`: recibe `clientName` (string) y `products` (array de objetos con id de producto, nombre y cantidad), describiendo que sirve para preparar una propuesta o borrador de venta.
    - Definir la herramienta `deductInventory`: recibe `productName` (string), `quantity` (number) y `reason` (string, ej. "Merma" o "Consumo interno"), describiendo que sirve para preparar la salida de stock de un material.
    - Exportar estas declaraciones e integrarlas en la llamada al modelo dentro de `functions/assistant.js` para habilitar el motor de herramientas.
  </action>
  <verify>
    Ejecutar el script de prueba mandando una instrucción en lenguaje natural como *"¿Cuántas palas tenemos en stock?"* o *"Prepara una cotización de 2 carretillas para Juan"* y comprobar que el modelo devuelve una intención estructurada de llamada a función (`functionCall`) con los argumentos correctamente parseados.
  </verify>
  <done>
    Gemini procesa las frases de lenguaje natural y activa de forma consistente las llamadas a las funciones de herramientas correspondientes, retornando el nombre de la función y un mapa estructurado de parámetros.
  </done>
</task>

## Success Criteria
- [ ] Módulo de conexión con Gemini operativo y seguro frente a fallos de API Key ausente.
- [ ] La IA posee una personalidad corporativa clara y responde en español.
- [ ] El sistema de Tools mapea correctamente consultas y acciones de inventario, ventas y CRM a formatos JSON estructurados utilizables por la lógica del ERP.
