# Phase 2: CRM Module — Research

## Contexto Actual
El módulo actual en `src/pages/client/CRMModule.jsx` es un visualizador mock. El objetivo es proporcionar persistencia de datos con Firebase Firestore e implementar la gestión "real" de contactos, pipeline comercial y leads. 

Al no haber una capa de autenticación real aún (Fase 1 usa mock auth), ligaremos los registros localmente a `organizationId` simulados o mock de la sesión.

## Requisitos Técnicos
1. **Firebase Integration**: 
   - Dependencias requeridas: `firebase`.
   - Inicialización en `src/services/firebase.js`.
   - Estructura base en Firestore: `/organizations/{orgId}/contacts` y `/organizations/{orgId}/leads`.
   
2. **Gestión de Lógica (Hooks)**:
   - Crear un hook centralizado `useCRM` (ej. en `src/hooks/useCRM.js`) para manejar operaciones CRUD de la BD y mantenerlas sincronizadas con Firebase mediante `onSnapshot` o `getDocs`.

3. **Interfaz de Usuario (UI)**:
   - Pipeline Kanban para Leads (Prospectos).
   - Tabla o Grid interactivo para Listado de Contactos (Clientes regulares).
   - Componentes modales/formularios para crear y editar entidades con diseño *ArchitectOS* consistente con la estética premium actual.

## Conclusión
Para asegurar pasos atómicos y manejables, la implementación de la Fase 2 se dividirá en los siguientes planes (2-3 tareas max. c/u):

1. **Plan 2.1**: Configuración BD y Conexión Firebase.
2. **Plan 2.2**: Lógica de Estado (CRUD y custom Hooks para CRM).
3. **Plan 2.3**: Interfaces visuales interactivas (Kanban Pipeline y Listado de Contactos).
