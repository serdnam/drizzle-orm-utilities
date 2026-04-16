# AGENTS.md

## Project overview

`drizzle-orm-utilities` is an npm package of helper functions and type utilities for Drizzle ORM. It targets `drizzle-orm ^1.0.0-beta.22` (ready for the v1.0 stable release).

## Key commands

| Command | What it does |
|---------|-------------|
| `npm run build` | Compile src/ → dist/ (ESM + CJS + types) via tsup |
| `npm run typecheck` | Type-check without emitting (tsc --noEmit) |
| `npm run test` | Run integration tests against Postgres (requires DB up) |
| `npm run check` | Run publint + attw pre-publish validation |
| `npm run db:up` | Start Postgres 17 via Docker Compose |
| `npm run db:down` | Stop the DB container |
| `npm run db:migrate` | Run migrations with `node --strip-types tests/db/migrate.ts` |
| `npm run db:reset` | **Destructive**: wipe volume, restart, and re-migrate |

## Repository structure

- `src/` — library source (compiled and published to npm)
- `tests/` — integration tests + test infrastructure (not published)
- `tests/db/` — Drizzle schema, relations, migrations, and standalone migrate script
- `dist/` — tsup build output (gitignored)

## CI / releasing

- CI runs on every push to `main` and every PR (`.github/workflows/ci.yml`). It uses a Postgres service container — no Docker Compose needed in CI.
- Releases are triggered manually via **GitHub Actions → Publish → Run workflow**. Enter the version (e.g. `0.2.0`) and dist-tag (`latest` / `next` / `beta`). The workflow builds, type-checks, validates, tests, then commits the version bump, tags, pushes, publishes to npm, and creates a GitHub Release.
- Use **Conventional Commits** for commit messages: `feat:` (minor), `fix:` (patch), `feat!:` / `BREAKING CHANGE:` (major), `chore:`/`docs:`/`ci:` (no bump). The maintainer chooses the version number when triggering the workflow — commit prefixes inform that decision.
- **Never run `npm publish` locally.** The NPM token lives only in GitHub Secrets (`NPM_TOKEN`).

## Landmines

- **drizzle-orm 1.0.0-beta.22 is a beta**: APIs differ from stable. Always web-search current docs before writing Drizzle calls.
  - Relations use `defineRelations()` (not `relations()`)
  - RQB `where` takes a plain object, not a callback function
- Tests require a live Postgres instance — run `npm run db:up && npm run db:migrate` before `npm run test`.
- The test setup (`tests/setup.ts`) truncates all tables in `beforeEach`. Tests must insert their own fixtures.
- `npm run db:reset` tears down the Docker volume — data loss.
- When adding a new utility, export it from `src/index.ts` and add integration tests in `tests/`.
