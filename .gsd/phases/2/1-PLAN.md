---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: Configuración de Firebase Firestore

## Objective
Configurar la dependencia de Firebase en la aplicación React e inicializar el módulo base de Firestore para almacenamiento en tiempo real.

## Context
- .gsd/ARCHITECTURE.md
- .gsd/phases/2/RESEARCH.md

## Tasks

<task type="auto">
  <name>Instalar Dependencia de Firebase</name>
  <files>package.json</files>
  <action>
    - Instanciar la instalación del SDK de Firebase al proyecto.
    - Ejecutar el script via linea de comandos `npm install firebase`.
  </action>
  <verify>npm list firebase</verify>
  <done>El paquete de `firebase` debe constar listado bajo `dependencies` en `package.json`.</done>
</task>

<task type="auto">
  <name>Inicializar Configuración y DB</name>
  <files>
    - src/services/firebase.js
    - .env.example
  </files>
  <action>
    - Crear el archivo `.env.example` listando las keys `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, etc., requeridas.
    - Omitir la creación del `.env` local para dejar que el usuario asigne después sus credenciales.
    - Codificar `src/services/firebase.js` importando y realizando `initializeApp` mediante los `import.meta.env`, instanciando y exportando `const db = getFirestore(app);`.
    - Integrar un control de validación sencillo que arroje log si las keys no están definidas.
  </action>
  <verify>Get-Content src/services/firebase.js</verify>
  <done>El archivo `src/services/firebase.js` existe exportando correctamente la instancia `db`.</done>
</task>

## Success Criteria
- [ ] Dependencia persistida en NPM.
- [ ] Plantilla de variables de entorno generada y lista para rellenarse.
- [ ] Contexto de la base de datos disponible para importarse.
