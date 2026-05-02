# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # start dev server
npm run build     # production build
npm run lint      # ESLint
```

No test runner is installed yet. When adding tests, use **Vitest**.

## Architecture

This is a Kanban board built on Next.js App Router with the following confirmed stack:

| Layer | Choice |
|---|---|
| Auth | NextAuth.js (GitHub OAuth, Prisma adapter, database sessions) |
| Database | Prisma + Supabase (Postgres) |
| Drag-and-drop | `@dnd-kit/core` |
| Mutations | Server Actions (no REST API layer) |
| Styling | Tailwind CSS v4 |

The full PRD is at `docs/prd-kanban-board.md`. Read it before making architectural decisions.

## Key Patterns

**Task Repository** — all database access for tasks goes through a single server-side module (`getTasksByUser`, `createTask`, `updateTask`, `deleteTask`, `reorderTask`). Never query the Task table directly from Server Actions or components.

**Position Calculator** — a pure function module responsible for computing float positions when cards are reordered (averages the positions of the neighbouring cards). Keep it free of I/O and framework dependencies.

**Server Actions** — all mutations go through Server Actions. Each action must validate the authenticated session before delegating to the Task Repository.

**Optimistic updates** — the Kanban Board component owns local optimistic state. On drag-end, update local state immediately and fire the reorder Server Action in the background. Roll back on error.

**Auth scope** — tasks are always scoped to `userId`. Enforce this in the Task Repository, not just the UI.

## Prisma Schema Shape

Four models: `User`, `Account`, `Session` (all required by NextAuth Prisma adapter — do not remove them), and `Task`. Task fields: `id`, `title`, `description` (nullable), `status` (enum: TODO | IN_PROGRESS | DONE), `position` (Float), `createdAt`, `userId` (FK to User).

## Testing Scope

Only two modules get unit tests:
- **Task Repository** — test against a real database, not mocks.
- **Position Calculator** — pure unit tests, no setup needed.

UI components and Server Actions are not unit tested.
