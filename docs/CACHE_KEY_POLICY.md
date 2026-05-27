# Cache Key Policy

## Rules

All CI jobs that restore cached dependencies **must** pin their cache key to the
exact lockfile that governs the dependency tree.

| Ecosystem | Cache action | Required `cache-dependency-path` |
|-----------|-------------|----------------------------------|
| npm (backend) | `actions/setup-node` `cache: npm` | `backend/package-lock.json` |
| npm (frontend) | `actions/setup-node` `cache: npm` | `frontend/package-lock.json` |
| Cargo | `Swatinem/rust-cache@v2` | *(auto-detected from `Cargo.lock`)* |

## Key format

GitHub Actions derives the cache key from a hash of the lockfile path(s)
supplied. Changing any dependency therefore automatically busts the cache.

## Allowlist exceptions

No exceptions are currently granted. If a job legitimately cannot pin a
lockfile (e.g. a matrix job that installs optional system packages), add an
entry here with a rationale and the PR that introduced it.

| Job | Reason | Approved in |
|-----|--------|-------------|
| *(none)* | | |

## Cache-bust troubleshooting

1. **Stale cache hit after adding a dependency** — confirm the lockfile was
   committed. `package-lock.json` or `Cargo.lock` must be present in the repo.
2. **`cache-dependency-path` not found** — the workflow will fail with
   `Error: Some specified paths were not resolved`. Fix the path in the
   workflow YAML.
3. **Force-bust** — delete the cache entry in
   *Actions → Caches* or bump a `CACHE_VERSION` env var in the workflow.
4. **Cargo cache miss every run** — ensure `Cargo.lock` is committed
   (`soroban/Cargo.lock`). Rust library crates omit it by default; override
   with `resolver = "2"` and commit the lock.

## Validation

The workflow `.github/workflows/cache-key-policy.yml` validates that every
`cache-dependency-path` referenced in CI workflows resolves to an existing
file. It runs on every PR that touches `.github/workflows/`.
