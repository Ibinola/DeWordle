#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${SOROBAN_RPC_URL:-}" || -z "${SOROBAN_NETWORK_PASSPHRASE:-}" || -z "${SOROBAN_SECRET_KEY:-}" ]]; then
  echo "Missing SOROBAN_RPC_URL, SOROBAN_NETWORK_PASSPHRASE or SOROBAN_SECRET_KEY"
  exit 1
fi

pushd "$(dirname "$0")/../.." >/dev/null

echo "Building contracts..."
cargo build --workspace --target wasm32-unknown-unknown --release

echo "Deploy script scaffold ready. Add per-contract deploy commands in future tasks."

popd >/dev/null
