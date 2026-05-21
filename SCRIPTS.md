# Scripts Reference

Common commands for day-to-day development. Unless noted, run from the **root** of the monorepo.

---

## Dev Servers

| What | Command | Notes |
|---|---|---|
| Start all apps | `pnpm dev` | Turbo runs api + web in parallel |
| API only | `cd apps/api && pnpm dev` | NestJS on port 3001 |
| Web only | `cd apps/web && pnpm dev` | Next.js on port 3000 |

---

## Database / Prisma

All Prisma commands run from `apps/api/`.

| What | Command | Notes |
|---|---|---|
| Create + apply migration | `pnpm prisma migrate dev --name <description>` | Diffs schema, writes SQL file, applies, regenerates client |
| Apply pending migrations (CI / staging) | `pnpm prisma migrate deploy` | No prompts; does not create new migrations |
| Regenerate client only | `pnpm prisma generate` | Run after pulling schema changes without migrating |
| Open Prisma Studio | `pnpm prisma studio` | Local DB browser on port 5555 |
| Reset DB (dev only!) | `pnpm prisma migrate reset` | Drops + re-applies all migrations + seeds — destroys data |
| Inspect DB schema | `pnpm prisma db pull` | Overwrites schema.prisma from the live DB — use carefully |

Migration naming convention: `<verb>-<noun>` — e.g. `add-user-profile-pic`, `drop-legacy-slug-column`.

---

## Build & Type-check

| What | Command |
|---|---|
| Build all packages | `pnpm build` |
| Type-check (no emit) | `cd apps/api && pnpm tsc --noEmit` |

---

## Testing

| What | Command |
|---|---|
| Run all tests | `pnpm test` |
| Run API tests | `cd apps/api && pnpm test` |

---

## Package Management

| What | Command | Notes |
|---|---|---|
| Install deps | `pnpm install` | Run from root — resolves workspace |
| Add dep to a package | `pnpm --filter @euphrat/api add <pkg>` | Use `--filter` to target a workspace package |
| Add dev dep to root | `pnpm add -D -w <pkg>` | `-w` = workspace root |
