# DeWordle

DeWordle is an open-source word game platform migrating to a Soroban-native architecture in the Stellar ecosystem.

## Foundation Status
This repository now includes a **Soroban Migration Foundation** baseline:
- Soroban Rust workspace and modular contracts
- TypeScript Soroban SDK scaffolding
- Frontend wallet/provider architecture (Freighter + Wallet Kit)
- Backend indexer/projection scaffolding
- CI workflows and contributor documentation for Wave-scale contribution

## Repository Layout
- `frontend/` - Next.js app
- `backend/` - NestJS API and indexer foundation
- `onchain/` - legacy Cairo contracts (reference)
- `soroban/` - new Soroban workspace (migration target)
- `docs/` - migration architecture and contributor guides

## Quick Start
### Install JS dependencies
```bash
npm run install:all
```

### Validation Shortcuts
```bash
npm run verify:frontend
npm run verify:backend
```

### Frontend
```bash
npm run dev --prefix frontend
```

### Backend
```bash
npm run start:dev --prefix backend
```

### Soroban workspace
```bash
cd soroban
cargo check --workspace
```

## Key Docs
- [Soroban Foundation Architecture](./docs/SOROBAN_FOUNDATION_ARCHITECTURE.md)
- [Soroban Local Development](./docs/SOROBAN_LOCAL_DEV.md)
- [Frontend Wallet Foundation](./docs/FRONTEND_WALLET_FOUNDATION.md)
- [Backend Indexer Foundation](./docs/BACKEND_INDEXER_FOUNDATION.md)
- [Wave Issue Candidates](./docs/WAVE_MIGRATION_ISSUE_CANDIDATES.md)
- [Wave 5 Execution Plan](./docs/wave/WAVE5_EXECUTION_PLAN.md)
- [Wave 5 Phases](./docs/wave/WAVE5_PHASES.md)
- [Wave 5 Issue Tracks](./docs/wave/WAVE5_ISSUE_TRACKS.md)

## License
[MIT](./LICENSE)
