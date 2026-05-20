---
trigger: model_decision
---

La aplicacion esta en la carpeta /app 
No buscar nada fuera de esa carpeta.

## Configuración de Entorno
- El proyecto SIEMPRE se ejecuta y se sirve en el puerto **7100** (`http://localhost:7100`). Nunca intentar otros puertos en pruebas locales.


## Estética y Títulos de Módulos
- Los módulos NO deben incluir títulos (`<h1>`, `<h2>`, etc.) de forma estática o hardcodeada dentro de sus componentes de vista principal.
- La versión Web (Desktop) NO lleva título dentro del canvas del módulo.
- La versión Móvil autogenera el título. NUNCA duplicar el título en el código del módulo específico.

## Checklist Obligatorio para Nuevos Módulos
Cada vez que se construya un nuevo módulo, SIEMPRE se debe cumplir con lo siguiente:
1. **Registro Super Admin**: Añadir la clave del módulo a `AVAILABLE_MODULES` en `AdminClients.jsx` para que pueda activarse/desactivarse por empresa.
2. **Registro de Permisos**: Añadir a `MODULES_CONFIG` en `PermissionsModal.jsx` para delegación interna.
3. **Dashboard Widget**: Crear un archivo `{Modulo}DashboardCard.jsx` usando el componente `<DashboardCard />` con métricas vivas, e importarlo en `ClientDashboard.jsx` y `DashboardSettingsModal.jsx`.
4. **Consistencia Estética**: Todo módulo DEBE seguir los estándares definidos en `.agents/rules/design-standards.md`. Esto incluye: pestañas, botones, pastillas KPI, tablas, badges, Kanban, modales, formularios, animaciones y paleta de colores.