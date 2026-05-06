# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Workflow Rules

**PRD first** — update current pdr in github whenever schema, architecture, scope, or issue sequence changes. Do it before writing code, not after. Do not wait to be asked.

**Consult before acting** — for any non-trivial change (new files, schema edits, issue updates, refactors), present a numbered plan with rationale and wait for approval before executing.

**Issue hygiene** — close the GitHub issue when all acceptance criteria are met. Never modify issue descriptions without being asked.

## Skills

| Skill | When to use |
|---|---|
| `/to-issues` | Break a plan or PRD into GitHub issues; each issue references the PRD issue |
| `/grill-me` | Stress-test a design before building |
| `/review` | Review a PR before merging |
| `/security-review` | Run before wiring in auth or any sensitive change |
| `/simplify` | Clean up code quality after a slice is complete |
| `/fewer-permission-prompts` | Run after a productive session to reduce tool-call approval prompts |

## Commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run lint         # ESLint
npm run db:migrate   # create and apply a Prisma migration
npm run db:generate  # regenerate the Prisma client
npm run db:studio    # open Prisma Studio
```

Local database: `docker compose up -d` then `npm run db:migrate`.

No test runner is installed yet. When adding tests, use **Vitest**.

## Architecture

Multi-board Kanban app built on Next.js App Router.

| Layer | Choice |
|---|---|
| Database (local) | Docker Compose + Postgres 16 |
| Database (production) | TBD — Supabase / Railway / similar |
| ORM | Prisma 7 |
| Auth | NextAuth.js + GitHub OAuth + Prisma adapter — **not yet implemented** |
| Drag-and-drop | `@dnd-kit/core` — **not yet implemented** |
| Mutations | Server Actions (no REST API layer) |
| Styling | Tailwind CSS v4 |

The full PRD is at `docs/prd-kanban-board.md`. Read it before making architectural decisions.

## Prisma Schema

Three models are live: `User`, `Board`, `Task`.
`Account` and `Session` (NextAuth adapter tables) are added in issue #11 — do not add them before then.

```
User    — id, email, name, createdAt
Board   — id, title, createdAt, userId → User (cascade delete)
Task    — id, title, description?, status (TODO|IN_PROGRESS|DONE), position (Float), createdAt, boardId → Board (cascade delete)
```

Prisma 7 config lives in `prisma.config.ts` — the `datasource` block in `schema.prisma` has no `url` field.

## Key Patterns

**Board Repository** — all database access for boards goes through a single server-side module (`getBoardsByUser`, `createBoard`, `updateBoard`, `deleteBoard`). Never query the Board table directly from Server Actions or components.

**Task Repository** — all database access for tasks goes through a single server-side module (`getTasksByBoard`, `createTask`, `updateTask`, `deleteTask`, `reorderTask`). Never query the Task table directly.

**Ownership scope** — boards are scoped to `userId`; tasks are scoped to `boardId`. Enforce ownership in the repositories, not in Server Actions or UI. Never check `userId` directly on `Task` — ownership flows through Board.

**Position Calculator** — pure function module. Given the positions of the cards above and below the drop target, returns a new Float (average of neighbours). No I/O, no framework dependencies.

**Server Actions** — thin wrappers that validate the session then delegate to a repository. One action per mutation. Once auth is live (#11), every action must verify the session before delegating.

**Optimistic updates** — the Kanban Board component owns local optimistic state. On drag-end, update local state immediately and fire the reorder Server Action in the background. Roll back on error.

## Testing Scope

Only three modules get tests:
- **Board Repository** — integration tests against real local Postgres (Docker). No mocks.
- **Task Repository** — integration tests against real local Postgres (Docker). No mocks.
- **Position Calculator** — pure unit tests, no setup needed.

UI components and Server Actions are not unit tested.

## Issue Tracker

GitHub: https://github.com/MikeCr4ft/todo/issues

| Issue | Title | Status |
|---|---|---|
| #3 | Local dev infrastructure (Docker + Prisma schema) | ✅ done |
| #10 | Board CRUD + boards landing page | next |
| #4 | Board view shell (no auth) | blocked by #10 |
| #5 | Task CRUD | blocked by #4 |
| #6 | Drag between columns | blocked by #4 |
| #7 | Empty states + error handling | blocked by #4 |
| #8 | Drag to reorder within column | blocked by #6 |
| #9 | Optimistic updates for drag | blocked by #6 |
| #11 | Auth + route protection | blocked by #5 — HITL, last |
