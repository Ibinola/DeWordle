# Development Guide

## Recommended Workflow
1. Pick an issue with acceptance criteria.
2. Create focused branch.
3. Implement with tests.
4. Run local quality checks.
5. Open PR using template.

## Lockfile Freshness Guard

CI enforces that `package-lock.json` is updated whenever `package.json` changes.

**Rule:** If `frontend/package.json` or `backend/package.json` is modified in a PR, the corresponding `package-lock.json` must also be updated in the same commit.

**How to comply:**
```bash
# After changing package.json in frontend or backend, regenerate the lockfile:
cd frontend && npm install   # updates frontend/package-lock.json
cd backend  && npm install   # updates backend/package-lock.json
```

If CI fails with `ERROR: package.json was changed but package-lock.json was not updated`, run the command above and amend your commit.

## Backend Notes
- API prefix: `/api/v1`
- Swagger: `/api`
- Uses TypeORM migrations and seed scripts.

## Frontend Notes
- Next.js app router
- Keep UI changes accompanied by screenshots in PRs.

## Onchain Notes
- Current stack: Cairo/Starknet
- Migration target: Soroban (see `STELLAR_MIGRATION.md`)
