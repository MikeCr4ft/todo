## What to build

Add a lightweight sub-task checklist to every task. This slice covers the full vertical: Prisma schema, SubTask repository, server actions, checklist UI inside the task edit modal, and the progress counter on the task card.

A user can open any task, manually add sub-tasks, check them off, delete them, and see live "X / Y" progress on the Kanban card — all without touching the AI feature.

## Acceptance criteria

- [ ] `SubTask` model added to Prisma schema (`id`, `title`, `completed`, `createdAt`, `taskId` with cascade delete)
- [ ] Migration applied cleanly against local Postgres
- [ ] SubTask repository exposes `getSubTasksByTask`, `createManySubTasks`, `toggleSubTask`, `deleteSubTask` — ownership enforced via `Task → Board → userId`
- [ ] Repository has integration tests covering create, toggle, delete, cascade delete on parent task deletion, and ownership enforcement
- [ ] `createManySubTasksAction`, `toggleSubTaskAction`, `deleteSubTaskAction` server actions validate session and delegate to the repository
- [ ] Sub-task checklist renders inside the task edit modal below the description field
- [ ] Checking a sub-task toggles `completed` optimistically and persists via `toggleSubTaskAction`
- [ ] Deleting a sub-task removes it via `deleteSubTaskAction`
- [ ] Checked sub-tasks appear visually distinct (strikethrough)
- [ ] Task card shows "X / Y" counter when at least one sub-task exists; counter is computed server-side
- [ ] Sub-task count is fetched as part of the existing task query (aggregated, not a separate round-trip)

## Blocked by

None — can start immediately.

## PRD

- #18 — PRD: Sub-tasks with AI-Powered Suggestions

## Type

AFK
