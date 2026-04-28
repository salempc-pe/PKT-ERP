# RESEARCH: Agenda y Citas (Phase 7)

## Objetivos
Definir la arquitectura de componentes y manejo de datos para el soporte de reservas de clientes/reuniones a través de un sistema de calendario.

## Análisis de Herramientas UI
El proyecto requiere una vista de calendario o agenda. 
Opciones evaluadas:
1. **Librerías externas (react-big-calendar, fullcalendar):** Excelentes, pero traen sus propios estilos (muy difícil de integrar con el esquema tailwind/glassmorphism de ArchitectOS) y engordan el bundle solo para requerir un planificador básico.
2. **Vanilla UI + Tailwind Grid (Elegida):** Teniendo en cuenta la simplicidad de la app y para mantener todo liviano y a medida, construiremos una grilla de 7x5 sencilla con Tailwind para visualizar un mes de calendario e interactuar con los días.

## Capa de Persistencia de Datos
Siguiendo los patrones previos (utilizados en CRM y Ventas), la solución empleará un hook llamado `useAppointments.js` con las siguientes características:
- Colección Firestore: `appointments`
- Campos básicos: `id`, `title`, `date` (YYYY-MM-DD o timestamp), `time`, `clientId` (vínculo con CRM), `status` (PENDING, DONE, CANCELLED), `notes`.
- Modos: Firebase modo y Backup Array. Mismos principios de reactividad que `useFinance` y `useSales`.
