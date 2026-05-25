# Wave 5 Phases

This document defines operational phase gates for Wave 5 execution.

Technical details are intentionally referenced from existing docs rather than duplicated.

## Phase 1 — Repository Audit & Stabilization
### Objectives
- Eliminate CI/install ambiguity and baseline failures.
- Confirm branch, workflow, and reproducibility standards.

### Scope
- CI reliability, lockfile integrity, workflow consistency.
- Baseline issue taxonomy and milestone setup.

### Expected Outputs
- Stable deterministic CI baseline.
- Phase 1 audit closure checklist.

### Dependencies
- Existing OSS hardening and governance docs.

### Contributor Opportunities
- DevEx/CI fixes, docs cleanup, workflow polish.

### Suggested Milestone
- `W5-M1: Baseline Stabilized`

## Phase 2 — Soroban Migration Expansion
### Objectives
- Expand smart contract migration through scoped modules.
- Preserve contract boundary decisions and ADR alignment.

### Scope
- `core_game` extension and adjacent contract tracks (`rewards`, `achievements`, `admin_registry`).

### Expected Outputs
- Incremental contract capabilities behind passing CI.
- Updated migration progress mapping.

### Dependencies
- Soroban foundation architecture and ADR 0001.

### Contributor Opportunities
- SC beginner/intermediate/advanced issues.

### Suggested Milestone
- `W5-M2: Soroban Contract Expansion`

## Phase 3 — Wallet + SDK Integration Expansion
### Objectives
- Scale integration ergonomics for frontend and tooling contributors.
- Standardize client, tx, and event handling patterns.

### Scope
- SDK client improvements, registry loading, event parsing consistency, wallet tx flow expansion.

### Expected Outputs
- Reusable integration primitives with docs and examples.

### Dependencies
- Soroban SDK guide + wallet foundation docs.

### Contributor Opportunities
- FE + SDK track issues with clear acceptance tests.

### Suggested Milestone
- `W5-M3: Integration Layer Expansion`

## Phase 4 — Backend Indexer + Observability
### Objectives
- Improve event ingestion resilience and projection consistency.
- Build reliable observability and replay-safe processing.

### Scope
- Cursor progression, projection improvements, worker flow hardening, monitoring hooks.

### Expected Outputs
- Stable indexer foundation for read APIs and analytics.

### Dependencies
- Backend indexer foundation + security foundation.

### Contributor Opportunities
- BE + QA + DevOps issues.

### Suggested Milestone
- `W5-M4: Indexer Reliability`

## Phase 5 — Contributor Scaling + DevEx
### Objectives
- Increase contributor throughput without degrading quality.
- Improve onboarding and review ergonomics.

### Scope
- Task decomposition, labels, templates, contributor scripts, review workflows.

### Expected Outputs
- Higher merge velocity and reduced reviewer friction.

### Dependencies
- GitHub strategy and Wave orchestration docs.

### Contributor Opportunities
- DX + Docs + Automation issues.

### Suggested Milestone
- `W5-M5: Contributor Throughput`

## Phase 6 — Testnet Readiness
### Objectives
- Ensure migration components are testnet-operational.
- Validate cross-track integration behavior.

### Scope
- Deploy flow validation, environment sanity checks, integration verification.

### Expected Outputs
- Testnet readiness checklist completed or explicitly blocked.

### Dependencies
- Soroban deployment flow and CI maturity.

### Contributor Opportunities
- SC/SDK/BE/QA integration tasks.

### Suggested Milestone
- `W5-M6: Testnet Ready`

## Phase 7 — Production Hardening
### Objectives
- Raise confidence for post-Wave progression toward production quality.
- Prioritize security, reliability, and maintainability debt.

### Scope
- Security hardening, flaky-test elimination, operational runbook tightening.

### Expected Outputs
- Hardened baseline and prioritized post-Wave backlog.

### Dependencies
- Security foundation and phase completion data.

### Contributor Opportunities
- Security, QA, DevOps, and advanced SC work.

### Suggested Milestone
- `W5-M7: Hardening Gate`

## Phase Governance Rules
- Every issue must map to exactly one active phase milestone.
- Cross-phase issues require explicit maintainer waiver.
- Unmapped issues are deferred to backlog until phase alignment is clear.
