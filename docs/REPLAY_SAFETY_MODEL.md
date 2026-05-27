# Replay Safety Model: Contract → SDK → Indexer Pipeline

This document describes the end-to-end replay safety narrative and operational checklist for the DeWordle Soroban migration pipeline, covering the Smart Contract (SC), TypeScript SDK, and Backend Indexer (BE) layers.

## Source Anchors

This document consolidates safety invariants established in:
- **#577** — Soroban contract session and nonce model
- **#583** — TypeScript SDK transaction lifecycle
- **#593** — Backend indexer event ingestion and projection

---

## Layer-by-Layer Safety Model

### 1. Smart Contract (SC) Layer

**Nonce invariant:** Each player action is keyed by `(player, nonce)`. The contract rejects any submission where the nonce has already been consumed, preventing duplicate guess or finalize transactions.

**Event-order invariant:** Contract events are emitted in strict ledger sequence. The event index within a transaction is deterministic and monotonically increasing.

**State-transition guard:** A session in `InProgress` state cannot be finalized twice. Invalid transitions are rejected at the contract level before any event is emitted.

**Empty commitment guard:** Commitments with empty or zero-value payloads are rejected to prevent placeholder-guess replay attacks.

### 2. TypeScript SDK Layer

**Transaction lifecycle states:** The SDK tracks each transaction through explicit states: `idle → signing → submitting → success | error`. A transaction that errors does not silently retry; the caller must explicitly resubmit.

**Signing abstraction:** Freighter signing is separated from submission logic. A signed-but-not-submitted transaction cannot be replayed by the SDK automatically.

**Network config guard:** Network configuration (RPC URL, passphrase, contract ID) is centralized. Misconfigured submissions are caught at SDK initialization, not at submission time.

### 3. Backend Indexer (BE) Layer

**Unique ingestion key:** Every ingested event is stored with a composite unique key `(network, txHash, eventIndex)`. Duplicate event delivery from the Soroban RPC poller is silently deduplicated via upsert — the projection is not applied twice.

**Idempotent projections:** `ProjectionService` updates are designed to be idempotent. Replaying the same event sequence produces the same read-model state.

**Cursor checkpoint model:** The indexer persists a durable cursor (ledger sequence + event index) after each successful batch. On restart, polling resumes from the last checkpoint, preventing both gaps and double-processing.

---

## Cross-Layer Invariants

| Invariant | SC | SDK | BE |
|-----------|:--:|:---:|:--:|
| Nonce uniqueness per player | ✓ enforced | ✓ tracked | ✓ deduplicated |
| Event order determinism | ✓ ledger-ordered | ✓ submitted once | ✓ cursor-ordered |
| Idempotent processing | ✓ state guards | ✓ explicit lifecycle | ✓ upsert + idempotent projections |
| No silent retry on error | ✓ tx rejected | ✓ error state surfaced | ✓ checkpoint not advanced |

---

## Operational Checklist

### Pre-deployment

- [ ] Confirm contract nonce table is initialized (no stale nonces from prior deployment)
- [ ] Confirm SDK network config points to correct RPC endpoint and contract ID
- [ ] Confirm indexer cursor table is empty or reset for a fresh network

### Post-deployment validation

```bash
# 1. Verify backend indexer is running and cursor is advancing
curl http://localhost:3000/indexer/status

# 2. Submit a test session via SDK and confirm event appears in projection
# (replace with actual test script)
npx ts-node scripts/test-session-replay.ts

# 3. Replay the same event twice and confirm projection count does not increase
# Expected: idempotent — second replay produces no change
npx ts-node scripts/test-replay-idempotency.ts
```

### Incident response

- [ ] If duplicate events are detected in projections: check `IngestedEventEntity` for missing unique constraint on `(network, txHash, eventIndex)`
- [ ] If cursor regresses: check checkpoint write path in `EventProcessorService` — ensure checkpoint is written *after* projection commit, not before
- [ ] If nonce collision is reported: verify contract storage is not shared across networks (testnet vs mainnet isolation)

---

## ADR Compatibility

This model is consistent with **ADR 0001** (event-sourced projection architecture). No invariant described here contradicts the append-only event log assumption in ADR 0001. Maintainer review should confirm no new state-mutation paths have been introduced outside the event processor.

## Related Docs

- [Security Foundation](./SECURITY_FOUNDATION.md)
- [Backend Indexer Foundation](./BACKEND_INDEXER_FOUNDATION.md)
- [Soroban Foundation Architecture](./SOROBAN_FOUNDATION_ARCHITECTURE.md)
