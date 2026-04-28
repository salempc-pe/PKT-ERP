---
phase: 7
plan: 2
wave: 2
---

# Plan 7.2: Módulo Visual del Calendario y Modal de Formulario

## Objective
Construir y diseñar la interfaz `CalendarModule.jsx` utilizando la estructura actual "ArchitectOS" (Glassmorphism). Se incluirá un layout de mes y un listado lateral de "Próximas Citas". Además se desarrollará un Modal interactivo en donde se usará `useCrm` para escoger el cliente desde el CRM al crear la cita.

## Context
- `src/pages/client/CalendarModule.jsx` 
- `src/hooks/useAppointments.js`
- `src/hooks/useCrm.js`

## Tasks

<task type="auto">
  <name>Desarrollo UI CalendarModule y Modal de Formulario</name>
  <files>src/pages/client/CalendarModule.jsx</files>
  <action>
    - Diseñar `CalendarModule.jsx` consumiendo `useAppointments` y exportando como vista.
    - Omitir dependencias de calendarios externos y trazar una grilla simple de semana flex/grid y listado de citas "upcoming" en una sidebar interna o debajo del calendario.
    - Añadir botones y cabeceras estándar con iconos de la librería `lucide-react` (ej. Calendar, Clock, User, Plus).
    - Implementar el Modal para `Nueva Cita`, dentro de éste cargar dinámicamente los clientes usando el custom hook `useCrm`.
    - Ligar el "Submit" a la función `addAppointment` con los valores de `date`, `time`, `title` y la `id` de cliente.
  </action>
  <verify>Verificar sintaxis y carga de datos asincrónicos desde hooks.</verify>
  <done>El módulo muestra las citas guardadas y expone un modal capaz de consumir los clientes del CRM creando una nueva junta/cita.</done>
</task>

## Success Criteria
- [ ] La interfaz Glassmorphism está renderizada e incluye modal para formulario.
- [ ] Conexión funcional con los hooks de Crm y Citas para generar reservas.
