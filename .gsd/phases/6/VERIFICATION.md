## Phase 6 Verification

### Must-Haves
- [x] Transacciones correctamente registradas en Firestore asociadas al orgId — VERIFIED (evidence: `useFinance.js` utiliza `collection(db, 'organizations/.../transactions')` y el hook mutador envia el payload con createdAt)
- [x] Dashboard de Finanzas muestra los agregados correctos (Ingresos/Gastos/Balance) según las transacciones — VERIFIED (evidence: `FinanceModule.jsx` incluye lógicas de reducción (reduce) filtradas por `t.type === 'income'` / `t.type === 'expense'` para el cálculo del Balance en tiempo real)

### Verdict: PASS
