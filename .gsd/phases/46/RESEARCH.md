# Research: Fase 46 - Gantt, Gestión Documental y Timesheet

## 1. Gantt Chart y Dependencias
Para mantener el proyecto ligero y con alta consistencia visual (glassmorphism, tailwind, etc.), construiremos una vista de Gantt custom o utilizaremos una librería muy ligera y adaptable como `gantt-task-react` si es estrictamente necesario. Sin embargo, dada la necesidad de personalización extrema, una solución basada en CSS Grid (filas por tarea, columnas por días/semanas) es preferible y encaja mejor con nuestro UI.
- **Cambios de Esquema (Task)**: Necesitaremos añadir `startDate`, `dueDate` (ya que ahora el Gantt requiere rangos de fecha explícitos), `progress` (0-100%) y `dependencies` (array de IDs de otras tareas).

## 2. Gestión Documental
Ya existe un patrón de repositorio de documentos en el módulo Inmobiliaria (`RealEstate`). Podemos replicar este patrón para `Projects`.
- **Estructura**: Nueva colección `organizations/{orgId}/project_documents` o usar la colección existente de almacenamiento (storage).
- **Esquema (ProjectDocument)**: `id, projectId, taskId (opcional), name, url, type, size, uploadedBy, createdAt`.

## 3. Timesheet (Control de Horas)
Para calcular costos operativos, necesitamos registrar el tiempo invertido en las tareas.
- **Esquema (TimesheetEntry)**: `id, projectId, taskId, userId, date, hours, description`.
- **UI**: Un modal/sección dentro del detalle de la tarea para agregar horas. Sumarización a nivel de proyecto para ver horas totales y costo estimado (horas x tarifa hora del colaborador, aunque la tarifa puede dejarse para una fase posterior o ingresarse estáticamente).

## Conclusión
La Fase 46 se dividirá en 3 planes:
1. **Plan 46.1**: Actualización del Data Layer (Task Dates, Dependencies, Timesheet Schema, Document Schema).
2. **Plan 46.2**: Vistas Gantt y Timesheet UI integradas en `ProjectKanban` (como tabs o vistas alternativas).
3. **Plan 46.3**: Gestión Documental UI (Subida de archivos y listado por proyecto/tarea).
