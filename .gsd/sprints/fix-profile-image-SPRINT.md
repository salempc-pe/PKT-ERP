# Sprint 1 — Actualizar Imagen de Perfil en Dashboard

> **Duration**: 2026-05-10 to 2026-05-10
> **Status**: Closed

## Goal
Actualizar la tarjeta de bienvenida del Dashboard para mostrar el avatar del usuario (en lugar del logo de empresa), habilitarlo en móvil, y asegurar que aparezca a la derecha en ambas versiones.

## Scope

### Included
- Cambiar `logoUrl` por `user?.photoUrl` en `ClientDashboard.jsx`.
- Permitir la visualización en móvil (quitar `hidden md:block`).
- Ajustar el layout para que el avatar aparezca a la derecha del texto de bienvenida en móvil y escritorio.
- Agregar fallback para cuando el usuario no tenga foto de perfil (letras de iniciales o icono genérico).

### Explicitly Excluded
- Cambios en la lógica de autenticación o subida de imágenes.

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Modificar layout de bienvenida en ClientDashboard | Antigravity | ✅ Done | 1 |
| Verificar consistencia en escritorio y móvil | Antigravity | ✅ Done | 0.5 |

## Daily Log

### 2026-05-10
- Sprint creado e iniciado.
- Modificado `ClientDashboard.jsx` para usar `flex-row` fijo y posicionar el avatar del usuario a la derecha.
- Eliminados imports y lógicas no utilizadas de `logoUrl`.
- Sprint cerrado exitosamente.

## Retrospective (2026-05-10)

### What Went Well
- Se resolvió el cambio estético y funcional en un solo archivo optimizando al mismo tiempo el rendimiento quitando un listener de Firebase innecesario.

### What Could Improve
- Todo salió perfecto.

### Action Items
- [x] Desplegar cambios.
