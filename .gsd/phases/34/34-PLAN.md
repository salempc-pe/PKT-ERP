---
phase: 34
plan: 1
wave: 1
---

# Plan 34.1: Compact Mobile Dashboard Cards

## Objective
Hacer que las tarjetas de los módulos del dashboard sean sustancialmente más compactas en dispositivos móviles, optimizando el uso del espacio vertical para mostrar más información sin necesidad de hacer tanto scroll, manteniendo el diseño amplio en pantallas de escritorio.

## Context
- `app/src/components/DashboardCard.jsx`
- `app/src/modules/client/dashboard/ClientDashboard.jsx`

## Tasks

<task type="auto">
  <name>Hacer DashboardCard responsiva y compacta</name>
  <files>app/src/components/DashboardCard.jsx</files>
  <action>
    Modificar las clases de Tailwind en `DashboardCard.jsx` para que los espacios, tamaños de fuente y tamaños de íconos sean más pequeños en móviles por defecto, y usar el prefijo `md:` o `lg:` para restaurar los tamaños grandes originales en escritorio.
    
    Ajustes específicos a realizar:
    1. **Padding general**: Cambiar de `p-8` a `p-4 md:p-8`.
    2. **Contenedor del Icono**: Cambiar de `w-14 h-14` a `w-10 h-10 md:w-14 md:h-14` y el ícono interno a un tamaño menor en móvil.
    3. **Títulos**: Cambiar el título `text-2xl` a `text-xl md:text-2xl` y reducir el margen inferior.
    4. **Descripción**: Cambiar a `text-xs md:text-sm`.
    5. **Métricas**: Reducir el padding superior (e.g. `pt-3 md:pt-6`) y reducir los textos a `text-base md:text-lg`.
  </action>
  <verify>Get-Content app/src/components/DashboardCard.jsx | Select-String "md:p-8"</verify>
  <done>El componente utiliza clases responsivas para ser más compacto en móviles.</done>
</task>

<task type="auto">
  <name>Ajustar espaciado de grids en Dashboards</name>
  <files>app/src/modules/client/dashboard/ClientDashboard.jsx</files>
  <action>
    Ajustar el espaciado (gap) del contenedor grid principal en el dashboard del cliente para que también sea más compacto en móviles.
    
    Ajustes específicos:
    1. Buscar el grid principal de módulos: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`.
    2. Cambiar a `gap-4 md:gap-8` u optimizaciones similares.
  </action>
  <verify>Get-Content app/src/modules/client/dashboard/ClientDashboard.jsx | Select-String "gap-4 md:gap-8"</verify>
  <done>El grid de tarjetas tiene menos espacio entre elementos en dispositivos móviles.</done>
</task>

## Success Criteria
- [ ] Las tarjetas ocupan menos espacio vertical en pantallas móviles (padding reducido, textos más pequeños).
- [ ] El diseño en escritorio (`md` y resoluciones mayores) se mantiene intacto con sus proporciones actuales amplias.
- [ ] El grid principal tiene menor separación en móviles.
