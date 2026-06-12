# Summary Plan 29.1

## Tasks Completed
- [x] Crear AdminRoute guard component
- [x] Proteger ruta /team con AdminRoute

## Changes
- Created `src/components/AdminRoute.jsx` to enforce role-based access.
- Modified `src/App.jsx` to wrap the `/client/team` route with `AdminRoute`.

## Verification
- Verified that `AdminRoute.jsx` contains the correct redirection logic.
- Verified that `App.jsx` imports and uses the guard correctly.
