---
trigger: model_decision
---

La aplicacion esta en la carpeta /app 
No buscar nada fuera de esa carpeta.

## Estética y Títulos de Módulos
- Los módulos NO deben incluir títulos (`<h1>`, `<h2>`, etc.) de forma estática o hardcodeada dentro de sus componentes de vista principal.
- La versión Web (Desktop) NO lleva título dentro del canvas del módulo (solo en el sidebar/layout si aplica).
- La versión Móvil autogenera el título a través del `ClientLayout`. Por lo tanto, NUNCA duplicar el título en el código del módulo específico para que no aparezca doble en móvil.