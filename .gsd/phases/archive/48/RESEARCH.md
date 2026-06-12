# RESEARCH: Phase 48 - Terrenos e Inmobiliaria (Mejoras Avanzadas)

## 1. Map Integration (Geolocalización)
**Goal:** Show terrains on a map interactively.
**Options:**
- **Google Maps (react-google-maps/api):** Standard, powerful, but requires API key and billing setup which breaks the "zero config" principle.
- **Leaflet (react-leaflet):** Open-source, no API key required for base OpenStreetMap tiles. Highly compatible with React.
**Decision:** Use `leaflet` and `react-leaflet` to maintain the project accessible without external API keys.
**Data Model Update:** Add `coordinates: z.object({ lat: z.number(), lng: z.number() }).optional()` to `TerrainSchema`.

## 2. Presentation Tracking (Seguimiento de Compradores)
**Goal:** Track the status of a terrain with multiple potential buyers.
**Current State:** `status` (string) and `buyerId` (string). This only tracks ONE buyer at a time.
**New Data Model:** 
We need an array or a subcollection to track presentations. An array is simpler and fits within the 1MB Firestore document limit since presentation records are small.
Add `presentations: z.array(z.object({ buyerId: z.string(), status: z.enum(['interes', 'visita', 'propuesta', 'rechazado']), notes: z.string().optional(), date: z.string() })).default([])`.
The main `status` of the terrain could become `available`, `reserved`, `sold`. But currently it is `["presentacion", "negociacion", "aprobado", "descartado"]`. We will keep the global status as the Kanban column, but add `presentations` for detailed tracking.

## 3. Legal Repository (Repositorio Legal)
**Goal:** Upload and view documents related to the terrain (partidas, minutas).
**Implementation:** Use Firebase Storage (or mock it as base64/external URLs if Storage is not configured). Since we want to keep it simple, we can add a `documents: z.array(z.object({ id: z.string(), name: z.string(), type: z.string(), url: z.string(), uploadedAt: z.string() })).default([])` to the `TerrainSchema`.
Upload logic can be simulated (using a mock function returning a data URI) or use real Firebase Storage if it's set up. Given we might not have Storage rules ready, we'll implement a mock file upload that converts to base64, or just stores the metadata if using actual files is out of scope. (Actually, for small PDFs, base64 works, but it's risky for Firestore limits. We will implement the UI for it and mock the upload to a local state or use `URL.createObjectURL` for immediate view).

## Implementation Plan
1. **Plan 48.1:** Update `useRealEstate` schema to include `coordinates`, `presentations`, and `documents`. Install `leaflet` and `react-leaflet`.
2. **Plan 48.2:** Implement Map view in `RealEstateModule.jsx` and map picking in `TerrainFormModal.jsx`.
3. **Plan 48.3:** Implement Presentations Tracking UI inside a Terrain details view/modal.
4. **Plan 48.4:** Implement Legal Repository UI (upload and list documents).
