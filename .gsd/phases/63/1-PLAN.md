---
phase: 63
plan: 1
wave: 1
---

# Plan 63.1: Configuración de Firebase Cloud Functions e Instalación de Dependencias

## Objective
Establecer la infraestructura de backend del asistente de IA. Inicializaremos el entorno de Firebase Cloud Functions en el directorio `functions/`, instalaremos las dependencias necesarias de Firebase y `@google/generative-ai`, y configuraremos el emulador local para habilitar pruebas de integración rápidas sin alterar el frontend actual.

## Context
- .gsd/SPEC.md
- firebase.json
- package.json

## Tasks

<task type="auto">
  <name>Inicializar directorio y configuración de Firebase Functions</name>
  <files>
    - firebase.json
    - [NEW] functions/package.json
    - [NEW] functions/.gitignore
  </files>
  <action>
    - Modificar `firebase.json` en la raíz del proyecto para declarar la sección de Cloud Functions indicando que el código fuente se encuentra en el directorio "functions".
    - Crear la carpeta `functions/` en la raíz del proyecto.
    - Crear `functions/package.json` declarando un entorno de Node.js (se recomienda "engines": { "node": "20" }) y los scripts de inicio y emulación de Firebase.
    - Crear `functions/.gitignore` para asegurar que directorios locales como `node_modules` y archivos con llaves secretas como `.env` no se suban al control de versiones.
  </action>
  <verify>
    Confirmar que la carpeta `functions/` existe y que el archivo `firebase.json` contiene la sección "functions" correctamente configurada.
  </verify>
  <done>
    El archivo `firebase.json` tiene una clave "functions" válida y estructurada. `functions/package.json` existe y define el nombre del codebase como "default" o similar compatible con la configuración de Firebase.
  </done>
</task>

<task type="auto">
  <name>Instalar dependencias y configurar emuladores locales</name>
  <files>
    - [NEW] functions/package.json
    - [NEW] functions/.env.example
  </files>
  <action>
    - Agregar las dependencias esenciales en `functions/package.json`: `firebase-admin`, `firebase-functions`, `@google/generative-ai` y `dotenv`.
    - Ejecutar la instalación de paquetes de node en la carpeta `functions/` para generar `package-lock.json` y la carpeta `node_modules` local del backend.
    - Crear un archivo `functions/.env.example` que sirva como plantilla para definir variables de entorno, incluyendo la variable `GEMINI_API_KEY` necesaria para el desarrollo de la IA.
    - Configurar de forma preliminar el archivo `firebase.json` para definir la emulación del puerto de las Cloud Functions si es necesario (generalmente puerto 5001 por defecto).
  </action>
  <verify>
    Navegar a la carpeta `functions/` y ejecutar la comprobación de que el paquete `@google/generative-ai` está instalado localmente en el backend.
  </verify>
  <done>
    La carpeta `functions/node_modules/` contiene las librerías `firebase-functions` y `@google/generative-ai`. Existe un archivo `functions/.env.example` limpio y sin secretos reales.
  </done>
</task>

<task type="auto">
  <name>Crear función HTTP de verificación preliminar</name>
  <files>
    - [NEW] functions/index.js
  </files>
  <action>
    - Crear el archivo de entrada principal de las funciones: `functions/index.js`.
    - Importar `onRequest` de `firebase-functions/v2/https` y `initializeApp` de `firebase-admin/app`.
    - Inicializar la app de Firebase Admin usando `initializeApp()`.
    - Definir y exportar una función HTTP simple `helloWorld` de prueba que responda con un JSON: `{ "status": "ok", "message": "Veló AI backend ready" }` al recibir una petición HTTP GET.
  </action>
  <verify>
    Proponer o ejecutar el arranque del emulador de Firebase Cloud Functions en local y realizar una petición HTTP GET mediante una llamada local en PowerShell a la URL de helloWorld para validar la respuesta.
  </verify>
  <done>
    El emulador de Firebase Functions arranca exitosamente sin errores de sintaxis o importación. Al consultar el endpoint local de `helloWorld`, se recibe una respuesta con el estado HTTP 200 y el JSON esperado.
  </done>
</task>

## Success Criteria
- [ ] La infraestructura de Firebase Cloud Functions está formalmente inicializada y estructurada en el repositorio.
- [ ] Las dependencias críticas para la conexión con el SDK de inteligencia artificial de Google (`@google/generative-ai`) están instaladas en el backend.
- [ ] Se puede arrancar el emulador local de Cloud Functions con un endpoint de prueba HTTPS que responde exitosamente.
