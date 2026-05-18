#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 3 ]]; then
  echo "Usage: $0 <CONTRACT_ID> <FUNCTION> <ARGS_JSON>"
  exit 1
fi

CONTRACT_ID="$1"
FUNCTION="$2"
ARGS_JSON="$3"

echo "Invoke scaffold"
echo "Contract: ${CONTRACT_ID}"
echo "Function: ${FUNCTION}"
echo "Args: ${ARGS_JSON}"
echo "Implement soroban cli invocation in follow-up issue."
