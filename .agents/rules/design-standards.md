---
trigger: always
---

# PKT ERP — Directiva de Consistencia Estética UI

1. **Fuente de verdad:** Todos los componentes visuales del ERP deben respetar rigurosamente los estándares estéticos detallados en el archivo [design-standards.md](file:///d:/Users/Usuario/Documents/TRABAJO/PROYECTOS/PKT%20ERP/documentacion/design-standards.md).
2. **Obligatoriedad:** ANTES de modificar, refactorizar o crear cualquier componente de UI (botones, inputs, tablas, Kanban, modales, pestañas o flujos responsive), DEBES leer y consultar dicho archivo de estándares detallado usando la herramienta `view_file`.
3. **Principios Clave:**
   - Acento Principal: Violeta `#6B4FD8` (con texto activo `#002150` si va sobre botones/tabs activos).
   - Tipografías: *Outfit* (`--font-display`) para encabezados y *Inter* (`--font-body`) para el cuerpo de texto y campos.
   - Prohibido Hardcodear Títulos: No agregues títulos estáticos en los canvas de las vistas principales de los módulos (el canvas los omite en desktop y los autogenera en móvil).
   - Responsive First: Las vistas en pantallas móviles deben transformar las pestañas en un selector desplegable (`select` nativo estilizado) y ocultar/simplificar tablas y KPIs.
