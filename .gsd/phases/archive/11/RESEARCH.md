# Research: Phase 11 - Sistema de Suscripciones y Entitlements

## Objetivo
Definir la arquitectura de datos y flujo de UI para pasar de una activación manual de módulos a un modelo de suscripción basado en tiers (Planes).

## Definición de Planes Propuesta
Proponemos 3 niveles iniciales:
1. **Startup (Gratis/Trial)**: 
   - Módulos: CRM (Básico), Calendario.
   - Límites: 2 usuarios, 50 contactos.
2. **Business (Standard)**: 
   - Módulos: CRM Full, Inventario, Ventas, Proyectos.
   - Límites: 10 usuarios, 500 facturas/mes.
3. **Enterprise (Custom)**: 
   - Módulos: Todo + Finanzas.
   - Límites: ilimitados.

## Cambios en Estructura de Datos
El objeto `user` / `organization` en el estado mock debe cambiar:
```json
{
  "subscription": {
    "planId": "business",
    "status": "active",
    "activeModules": ["crm", "inventory", "sales", "projects"],
    "limits": {
      "users": 10,
      "storage": "5GB"
    },
    "currentUsage": {
      "users": 3
    }
  }
}
```

## Impacto en Módulos Existentes
- **MarketplaceModule**: Debe permitir "Upgrade" entre planes.
- **ClientLayout**: El sidebar debe filtrar módulos basándose en `subscription.activeModules`.
- **AdminClients**: El modal de edición ahora debe permitir elegir un "Plan" en lugar de (o además de) módulos individuales.
