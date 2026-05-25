# Research: Phase 59 — Estandarización Milimétrica de Botones/Pestañas y Pipeline CRM en Proyectos

## Discovery Protocol (Level 0 — Skip)
Este plan consiste únicamente en refactorizaciones de estilos internos de la interfaz de usuario en React y Tailwind CSS, siguiendo patrones ya establecidos en otros módulos (específicamente, la homogeneización milimétrica introducida por la Fase 57 y el Pipeline del módulo CRM). No se incorporan dependencias externas ni APIs nuevas.

## Análisis de Estilos CRM vs Proyectos

### 1. Colores de Columnas del Kanban de CRM (Maestro)
En `CRMModule.jsx`, el arreglo `pipelineStages` está definido con colores suaves y estilizados:
- **Prospecto (`prospect`)**: `bg-[#a3aac4]` (Lila Grisáceo)
- **Negociación (`negotiating`)**: `bg-[#6B4FD8]` (Morado Principal de Veló)
- **Ganado (`won`)**: `bg-[#5391ff]` (Azul de Éxito)
- **Perdido (`lost`)**: `bg-[#ff6b6b]` (Rojo de Error)

En el Kanban de Proyectos (`ProjectKanban.jsx`), las columnas utilizan colores planos de Tailwind:
- **Por Hacer (`todo`)**: `bg-slate-500` 
- **En Curso (`in_progress`)**: `bg-blue-500`
- **Finalizado (`done`)**: `bg-emerald-500`

**Acción:** Reemplazar los colores genéricos de Proyectos por la paleta calibrada del CRM para unificar la identidad visual:
- `todo` -> `bg-[#a3aac4]`
- `in_progress` -> `bg-[#6B4FD8]`
- `done` -> `bg-[#5391ff]`

### 2. Alturas, Paddings y Efectos de Botones / Pestañas
Para garantizar homogeneidad milimétrica:
- El contenedor de pestañas en Proyectos debe usar `bg-[var(--color-surface-container)]/50 rounded-xl border border-[var(--color-outline-variant)]`.
- Las pestañas individuales en Proyectos deben usar exactamente la transición `activeTab === tab.id ? 'bg-[#6B4FD8] text-[#002150]' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'`.
- Los botones principales (CTA) de "Nuevo Proyecto" y "Nueva Tarea" deben usar `bg-[#6B4FD8] text-[#002150] font-bold hover:shadow-[0_0_20px_rgba(133,173,255,0.3)]` para alinearse con la identidad de Veló.
