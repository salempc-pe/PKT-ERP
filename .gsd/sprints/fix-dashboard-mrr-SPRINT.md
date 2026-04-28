# Sprint 2 — Fix Dashboard MRR

> **Duration**: 2026-04-24 to 2026-04-24
> **Status**: In Progress

## Goal
Update SuperAdmin dashboard MRR calculation to reflect the real monthly fees set for each organization.

## Scope

### Included
- Update `calculateMRR` in `useAdminAnalytics.js` to use `org.subscription?.monthlyFee`.
- Ensure fallback to 0 if no fee is set.

### Explicitly Excluded
- Historical MRR data (still 0% growth).

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Update `calculateMRR` in `useAdminAnalytics.js` | Claude | ✅ Done | 0.5 |
| Verify Dashboard UI | Claude | ✅ Done | 0.2 |

## Daily Log

### 2026-04-24
- Sprint created.
- Identified `useAdminAnalytics.js` as the source of the MRR calculation.
