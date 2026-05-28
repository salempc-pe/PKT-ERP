# Summary Plan 63.2: Lógica de Comunicación con Gemini y Configuración de Tools

Se ha diseñado la inteligencia del asistente integrando la Gemini API de Google con el perfil estético y las herramientas estructuradas de Veló ERP.

## Acciones Realizadas
1. **Configuración de Conexión de IA**:
   - Creado [functions/assistant.js](file:///d:/Users/Usuario/Documents/TRABAJO/PROYECTOS/VELO/PKT%20ERP/functions/assistant.js) encapsulando la inicialización del modelo de Gemini.
   - Definida una `systemInstruction` premium y clara en español que dota al asistente de una personalidad profesional de soporte del ERP ("Veló AI").
   - Configurado el modelo `gemini-1.5-flash` con parámetros de baja temperatura (0.2) para evitar la alucinación y asegurar estabilidad en respuestas analíticas.

2. **Diseño del Catálogo de Herramientas**:
   - Creado [functions/tools.js](file:///d:/Users/Usuario/Documents/TRABAJO/PROYECTOS/VELO/PKT%20ERP/functions/tools.js) que especifica tres herramientas críticas de negocio en formato JSON de Function Calling de la API de Gemini:
     - `queryStock`: Buscar la existencia de productos en el inventario o la bodega.
     - `createSaleDraft`: Generar borradores/cotizaciones interactivas de ventas para un cliente específico.
     - `deductInventory`: Preparar salidas de stock de bodega para confirmación del usuario.

## Resultados
- La capa de procesamiento de lenguaje natural y traducción a formatos JSON estructurados está lista.
- La IA puede interpretar comandos y mapear parámetros de forma limpia en el backend.
