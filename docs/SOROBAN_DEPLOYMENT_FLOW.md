# Soroban Deployment Flow (Foundation)

## Current State
Deployment scripts are scaffolds to standardize future contributor work.

## Intended Flow
1. Build all wasm artifacts in `soroban/`.
2. Deploy `admin_registry` then `core_game`, `rewards`, `achievements`.
3. Persist resulting IDs in `soroban/config/contracts.<network>.json`.
4. Publish registry artifact to frontend/backend runtime config.

## Testnet Environment Variable Contract

The following variables are required or optional when running deployment scripts against testnet.

| Variable | Required | Owner Module | Default / Fallback | Description |
|---|---|---|---|---|
| `STELLAR_NETWORK` | ✅ | `deploy-testnet.sh` | — | Target network (`testnet`) |
| `STELLAR_RPC_URL` | ✅ | `deploy-testnet.sh` | — | Soroban RPC endpoint URL |
| `STELLAR_SECRET_KEY` | ✅ | `deploy-testnet.sh` | — | Deployer account secret key |
| `STELLAR_NETWORK_PASSPHRASE` | ✅ | `deploy-testnet.sh` | — | Network passphrase for signing |
| `CONTRACT_ADMIN_REGISTRY_ID` | ⬜ | `invoke-core-game.sh` | Read from `contracts.testnet.json` | Pre-deployed admin registry contract ID |
| `CONTRACT_CORE_GAME_ID` | ⬜ | `invoke-core-game.sh` | Read from `contracts.testnet.json` | Pre-deployed core game contract ID |
| `CONTRACT_REWARDS_ID` | ⬜ | `invoke-core-game.sh` | Read from `contracts.testnet.json` | Pre-deployed rewards contract ID |
| `CONTRACT_ACHIEVEMENTS_ID` | ⬜ | `invoke-core-game.sh` | Read from `contracts.testnet.json` | Pre-deployed achievements contract ID |
| `SOROBAN_CLI_VERSION` | ⬜ | CI workflow | Latest stable | Pin to avoid breaking changes |

**Default/Fallback Behavior**
- Contract IDs default to values in `soroban/config/contracts.testnet.json` when not set as environment variables.
- If `STELLAR_RPC_URL` is unset, scripts will exit with a clear error rather than silently using a wrong endpoint.

**Validation**
- Variable names must match exactly what is used in `soroban/scripts/deploy/deploy-testnet.sh` and `soroban/scripts/invoke/invoke-core-game.sh`.
- Run `grep -r 'STELLAR_\|CONTRACT_' soroban/scripts/` to verify alignment after any script changes.

## Next Enhancements
- automated contract hash verification
- per-environment deploy manifests
- rollback and migration script support
