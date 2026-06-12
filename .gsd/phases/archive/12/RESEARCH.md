# Research: Phase 12 - Business Intelligence & SaaS Metrics

## Métricas a Implementar
1. **MRR (Monthly Recurring Revenue)**: 
   - Startup: S/ 0
   - Business: S/ 199
   - Enterprise: S/ 500 (Simulado para el dashboard)
   - Cálculo: `Sum(Plan.Price for all active orgs)`.
2. **Active Customers**: Conteo total de organizaciones con status 'active'.
3. **Churn Rate (Simulado)**: Porcentaje de organizaciones que pasan a 'inactive' en el último mes.
4. **ARPU (Average Revenue Per User/Org)**: `MRR / Total Orgs`.

## Visualización Sugerida
- **KPI Cards**: Con indicadores de crecimiento (ej. +12% vs mes anterior).
- **Usage Heatmap**: Una tabla simple que muestre qué módulos son los más solicitados.
- **Lista de "Top Tenants"**: Organizaciones con más usuarios/actividad.

## Implementación Técnica
- Crear un hook `useAdminAnalytics` que procese `mockOrganizations` y `mockUsers`.
- Utilizar SVGs y gradientes de CSS para las gráficas de tendencia para mantener el diseño "Glassmorphism" sin dependencias pesadas.
