# Research: SuperAdmin Dashboard Analytic Redesign (Phase 26)

## Discovery Mode: Level 2 - Standard Research

### Question / Objective
What analytics should be shown on the SuperAdmin Dashboard to effectively measure product usage, stickiness, and overall SaaS health, replacing the obsolete infrastructure cards?

### Findings from kpi-dashboard-design & Product Management Best Practices
1. **Focus on Product Stickiness**: Instead of infrastructure metrics (since Firebase rarely goes down entirely), a multi-tenant SaaS admin should focus on the "Stickiness" of the platform.
2. **Key Metric 1 - GMV (Gross Merchandise Volume)**: Total value processed through the 'Ventas' module. This is a proxy for how essential the ERP is for their economic operations. Target UI: Money/Value format.
3. **Key Metric 2 - Core Data Volume**: Such as "Total Contacts in CRM", "Total SKUs in Inventory", and "Total Projects Managed". High volume means high friction to leave (lower churn). Target UI: Standard numbers with positive growth indicators.
4. **Key Metric 3 - Seat Utilization**: The ratio of active users vs the `maxUsers` limits sold to clients across organizations. For example: "120 Seats used out of 150 sold". 
    - *Why it matters*: Identifies expansion up-sell opportunities (near 100% usage) and churn risks (low usage).
5. **Dashboard Aesthetics**: Must retain the existing dark mode premium feel with glassmorphism but strictly organize information using a modular, grid-based layout. Colors should indicate states (Green for growth, neutral/blue for data points).

### Execution Strategy
- Aggregate mock logic or summarize across Firestore data into a consolidated `useAdminAnalytics` hook.
- Implement a series of KPI Cards spanning the newly cleared space in `AdminDashboard.jsx`.
- Implement hover micro-interactions to emphasize the importance of these KPIs.
