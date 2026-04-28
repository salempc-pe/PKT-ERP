# Research: Phase 5 - Dashboard Central & Configuración de Empresa

## Objective
Aggregating data from multiple firestore collections into a unified dashboard and providing a UI for tenant-level settings.

## Data Points to Aggregrate
1. **CRM**: Count of leads/contacts.
2. **Inventory**: Number of products, Alert count (stock < minStock).
3. **Sales**: Total revenue (sum of paid invoices), Count of pending invoices.

## Implementation Strategy
- Use existing hooks (`useCrm`, `useInventory`, `useSales`) on the Dashboard page to pull data.
- Process the data client-side for the summary cards.
- **Problem**: This might be expensive if collections are large.
- **Solution for MVP**: Client-side aggregation is fine for now as data volumes are small. Future phases can use Cloud Functions to maintain summary documents.

## Business Profile
- Need a `BusinessSettings` view.
- Persist data to `tenants/{tenantId}` document (name, email, sector, logoUrl, address).

## UI Components
- `KpiCard`: Modular card for individual metric display.
- `ActivityFeed`: (Optional) Recent actions across all modules.
- `BusinessProfileForm`: Form to update owner info.
