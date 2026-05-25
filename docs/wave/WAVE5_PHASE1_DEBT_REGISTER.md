# Wave 5 Phase 1 Debt Register

This register captures stabilization debt discovered during Phase 1.
It is intended for issue creation under `wave:5` and `phase:1` labels.

## CI and Build Debt
1. Backend lint debt is extensive and blocks clean CI signal.
- Track: `BE`, `DX`
- Priority: `P0`
- Size: `L` to `XL` (split by module)

2. Backend typecheck debt in tests (notably supertest typing/import usage).
- Track: `BE`, `QA`
- Priority: `P0`
- Size: `M`

3. Soroban local runner network assumptions are not documented as an explicit troubleshooting path.
- Track: `DEVOPS`, `DOCS`
- Priority: `P1`
- Size: `S`

## Architecture/Code Quality Debt
4. Legacy backend modules contain unsafe `any`, inconsistent formatting, and brittle test patterns.
- Track: `BE`
- Priority: `P1`
- Size: `L`

5. Some migration files fail stricter formatting/lint expectations.
- Track: `BE`, `DX`
- Priority: `P2`
- Size: `M`

## Contributor Experience Debt
6. Need explicit Phase 1 checklist command script for one-shot contributor validation.
- Track: `DX`
- Priority: `P1`
- Size: `S`

7. Need module-specific backend debt buckets so contributors can parallelize safely.
- Track: `DOCS`, `BE`
- Priority: `P1`
- Size: `S`

## Security/Integrity Debt
8. Add formal replay/integrity validation tests for indexer cursor progression.
- Track: `SECURITY`, `BE`, `QA`
- Priority: `P1`
- Size: `M`

9. Add contract-level invariants tests for state transition integrity to reduce regressions.
- Track: `SC`, `QA`, `SECURITY`
- Priority: `P1`
- Size: `M`

## Suggested Issue Batch Strategy
- Batch A: Backend lint/typecheck unblockers (P0)
- Batch B: Contributor setup and command ergonomics (P1)
- Batch C: Replay/integrity tests for indexer + contracts (P1)
- Batch D: Formatting/consistency hardening (P2)
