# Investigación Técnica: UI del Asistente de IA (Fase 64)

Para ofrecer una experiencia de usuario sobresaliente y alineada con la estética de **Veló ERP**, la interfaz del asistente de IA debe seguir lineamientos visuales premium (estilo glassmorphic), poseer un enrutamiento seguro y estar perfectamente aislada por inquilino.

---

## 1. Capa de Datos del Cliente: `useAiAssistant.js`

El hook de cliente debe encapsular el estado de la conversación de forma reactiva:
- `messages`: Arreglo de mensajes del chat actual (`[{ role: 'user'|'assistant', text: '...', suggestions: [...], action: {...} }]`).
- `loading`: Booleano para representar si la IA está generando una respuesta.
- `error`: Estado de error para problemas de red o cuotas.
- `sendMessage(text)`: Función asíncrona para enviar mensajes.

### Aislamiento Multi-Tenant y Sesión
- El hook leerá `user` desde `AuthContext` para obtener de forma automática `organizationId` y `userId`.
- Generará un `sessionId` único utilizando `crypto.randomUUID()` al inicializarse por primera vez y lo persistirá en `sessionStorage` para asegurar la permanencia durante recargas accidentales, limpiándose al cerrar sesión o cerrar la pestaña.
- El endpoint al que consultará será el emulador local de Cloud Functions en desarrollo (`http://127.0.0.1:5001/pkt-erp/us-central1/velóAssistantEndpoint`) y la URL de producción en producción.

---

## 2. Diseño Estético Premium (Glassmorphism)

El drawer lateral deslizable y la burbuja flotante del asistente deben integrarse fluidamente sin obstaculizar la navegación del sistema.

### Paleta y Estilos CSS
- **Fondo del Drawer**: Utilizaremos un fondo translúcido blanco hueso/negro neutro según el tema con desenfoque de fondo profundo (`backdrop-filter: blur(16px)` o `backdrop-blur-md` compatible con Tailwind CSS).
- **Animaciones**:
  - Botón flotante: Animación de pulso continuo con sombras dinámicas moradas (`#6B4FD8`) para dar dinamismo a la interfaz.
  - Apertura del Drawer: Animación de deslizamiento suave desde la derecha (`animate-in slide-in-from-right duration-300 ease-out`).
- **Burbujas de Chat**:
  - Usuario: Alineadas a la derecha, con fondo morado característico de Veló (`#6B4FD8`), texto blanco y bordes redondeados orgánicos.
  - Asistente: Alineadas a la izquierda, fondo translúcido con sutil borde gris/blanco y tipografía premium.

---

## 3. Comandos Rápidos e Interactividad

En el estado vacío (cuando el chat no contiene mensajes), el asistente presentará pastillas interactivas en la parte inferior para acelerar las tareas comunes del usuario:
- *"¿Cuál es mi stock de palas?"*
- *"Registra una venta de prueba"*
- *"Revisa el saldo de caja"*

Estas pastillas actuarán como atajos rápidos: al hacer clic, se enviará el texto predefinido inmediatamente al motor de IA simulando que el usuario lo escribió.
