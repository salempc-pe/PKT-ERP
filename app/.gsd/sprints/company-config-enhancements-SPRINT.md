# Sprint 1 — Company Configuration Enhancements

> **Duration**: 2026-04-24 to 2026-04-25
> **Status**: In Progress

## Goal
Add logo upload (auto-squared) and monthly fee field to company/client configuration, and refine the save button UI.

## Scope

### Included
- Add `logoUrl` and `monthlyFee` fields to Organization model.
- Implement image upload with client-side squaring logic in `AdminClients.jsx`.
- Add "Cuota Mensual" input field in `AdminClients.jsx`.
- Update `AuthContext.jsx` (`adminCreateOrg`, `adminUpdateFullOrg`) to handle new fields.
- Shrink and reposition the "Save Changes" button in the edit modal.

### Explicitly Excluded
- Backend image processing (will use client-side squaring).
- Payment gateway integration.

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Update `AuthContext.jsx` logic | Claude | ✅ Done | 1 |
| Implement Logo Upload with Squaring in `AdminClients.jsx` | Claude | ✅ Done | 2 |
| Add Monthly Fee field to `AdminClients.jsx` | Claude | ✅ Done | 0.5 |
| Refine Save Button UI | Claude | ✅ Done | 0.5 |
| Verify and Test | Claude | ✅ Done | 1 |

## Daily Log

### 2026-04-24
- Sprint created.
- Analyzed `AdminClients.jsx` and `AuthContext.jsx`.
