# PRD: Kanban Board

## Problem Statement

I need a personal task management tool that lets me organise work visually across workflow stages (To Do, In Progress, Done). Existing tools are either too heavyweight or don't persist my tasks across sessions. I want something I own and can deploy myself, with support for multiple boards so I can separate different areas of work.

## Solution

A full-stack Kanban board web application where authenticated users can manage multiple private boards. Tasks can be created, edited, deleted, and dragged between columns. State is persisted to a Postgres database. Local development uses Docker Compose; production database hosting is a future decision.

## User Stories

1. As a user, I want to sign in with my GitHub account, so that I don't need to manage a separate username and password.
2. As a user, I want to be redirected to my boards list automatically after signing in, so that I can pick up where I left off.
3. As a user, I want to sign out, so that my boards are not accessible to others on a shared machine.
4. As a user, I want to create a new Kanban board with a title, so that I can organise different areas of work separately.
5. As a user, I want to see a list of all my boards on the home page, so that I can navigate to the one I want.
6. As a user, I want to rename a board, so that I can keep its title accurate as my project evolves.
7. As a user, I want to delete a board (and all its tasks), so that I can remove boards I no longer need.
8. As a user, I want to see three columns — To Do, In Progress, and Done — so that I can visualise my workflow stages at a glance.
9. As a user, I want to see all my tasks loaded when I open a board, so that I can pick up where I left off.
10. As a user, I want to create a new task with a title and an optional description, so that I can capture work items quickly.
11. As a user, I want to edit the title and description of an existing task, so that I can update details as requirements change.
12. As a user, I want to delete a task, so that I can remove work items that are no longer relevant.
13. As a user, I want to drag a task card from one column to another, so that I can update its status without opening an edit form.
14. As a user, I want to drag a task card to a specific position within a column, so that I can prioritise tasks by order.
15. As a user, I want the board to update instantly when I drag a card, so that the interaction feels responsive and not laggy.
16. As a user, I want my reordering to be saved automatically, so that the order persists when I refresh the page.
17. As a user, I want to see a visual indicator of where a card will land while I am dragging it, so that I can place it precisely.
18. As a user, I want my board to be usable on mobile and tablet, so that I can manage tasks from any device.
19. As a user, I want the board to display correctly in both light and dark mode, so that it adapts to my system preference.
20. As a user, I want to see an empty state message when a column has no tasks, so that I understand the board is working correctly.
21. As a user, I want errors (e.g. failed save) to be communicated clearly, so that I know when something went wrong and can retry.
22. As a user, I want my data to be private — other users cannot see or modify my boards or tasks, so that everything is secure.
23. As a user, I want to be redirected to the sign-in page if I am not authenticated, so that unauthenticated access is prevented.

## Implementation Decisions

### Modules

- **Prisma Schema** — defines `User`, `Board`, and `Task` models for the core app. `Account` and `Session` (required by the NextAuth Prisma adapter) are added in a later migration when auth is wired up. `Board` has fields: `id`, `title`, `createdAt`, `userId` (FK → User). `Task` has fields: `id`, `title`, `description` (nullable), `status` (enum: TODO | IN_PROGRESS | DONE), `position` (Float), `createdAt`, `boardId` (FK → Board). Tasks cascade-delete when their board is deleted.

- **Board Repository** — server-side module exposing `getBoardsByUser`, `createBoard`, `updateBoard`, `deleteBoard`. Ownership is always enforced here — no board mutation can affect another user's boards.

- **Task Repository** — server-side module exposing `getTasksByBoard`, `createTask`, `updateTask`, `deleteTask`, and `reorderTask`. All database access for tasks is centralised here. Ownership is enforced through the board relationship — a task is owned by whoever owns its board.

- **Position Calculator** — pure function module. Given the position of the card above and below the drop target, returns a new Float position (average of neighbours). Handles edge cases: inserting at the start, inserting at the end, inserting between two cards. No I/O or side effects.

- **Server Actions** — thin Next.js Server Actions that validate the authenticated session, then delegate to the Board or Task Repository. One action per mutation.

- **Auth Config** — NextAuth configuration: GitHub OAuth provider, Prisma adapter, database session strategy, and session callbacks that expose the user ID to the client session. Introduced after the core board and task features are working.

- **Boards Page** (`/`) — server component. Lists the authenticated user's boards. Provides create, rename, and delete triggers.

- **Kanban Board** (`/board/[id]`) — top-level client component. Owns the `@dnd-kit` DnD context and local optimistic task state. Fetches initial task list server-side and passes it as props. Renders three Column components.

- **Column** — droppable zone component. Receives its tasks (filtered and sorted by position) and renders a list of Task Cards. Displays an empty state when no tasks are present.

- **Task Card** — draggable card component. Displays title and description preview. Provides edit and delete action triggers.

- **Task Form / Modal** — controlled form for creating and editing tasks. Fields: title (required), description (optional). Calls create or update Server Action on submit.

### Architectural Decisions

- Next.js App Router with Server Components for initial data fetch; Client Components for interactive board state.
- Server Actions for all mutations — no separate REST API layer.
- Optimistic updates: the board updates local state immediately on drag, fires the reorder Server Action in the background, and rolls back on error.
- Float positions with neighbour-averaging for ordering — avoids rewriting all sibling positions on every reorder.
- Tasks are scoped to a `boardId`; boards are scoped to a `userId`. Ownership is enforced in the repositories, not just the UI.
- Local development: Docker Compose runs a Postgres 16 container. `prisma migrate dev` targets it via `DATABASE_URL` in `.env`.
- Production database hosting is a future decision (Supabase, Railway, or similar). Prisma migrations will run as part of the deploy pipeline.
- Auth (NextAuth + GitHub OAuth) is introduced after the core board and task features are working, to keep the local dev critical path free of OAuth app setup.

## Testing Decisions

A good test verifies external behaviour, not internal implementation. Tests should call the module's public interface and assert on the output or observable side effects — never assert on private methods, internal state, or how the module achieves its result.

### Modules to test

**Board Repository**
- Test against a real local Postgres instance (Docker Compose). Not mocked.
- Test cases: create a board and assert it is retrievable; update a board title and assert the new value persists; delete a board and assert it and its tasks no longer exist; assert that a user cannot retrieve or mutate another user's boards.

**Task Repository**
- Test against a real local Postgres instance (Docker Compose). Not mocked.
- Test cases: create a task and assert it is retrievable; update a task and assert the new values persist; delete a task and assert it no longer exists; reorder tasks and assert positions are updated correctly; assert that a user cannot retrieve or mutate tasks belonging to another user's board.

**Position Calculator**
- Pure function — test with plain unit tests, no setup required.
- Test cases: insert at start (no upper neighbour), insert at end (no lower neighbour), insert between two cards, insert between two cards with very close positions (float precision), repeated insertions without gaps.

### Prior art
- No existing tests in the codebase. Tests should be introduced using Vitest.

## Out of Scope

- Shared or collaborative boards (multiple users on one board)
- Custom columns (adding, renaming, or deleting columns)
- Labels, tags, priority levels, or due dates on tasks
- File attachments or rich text in task descriptions
- Activity history or audit log
- Email or push notifications
- Google, Discord, or other OAuth providers (GitHub only)
- Admin panel or user management
- Offline support
- Real-time sync across multiple browser tabs

## Further Notes

- The README describes this as a portfolio piece — the implementation should demonstrate clean architecture and modern Next.js patterns, not just a working prototype.
- Responsive layout and dark mode are not a dedicated phase — they should be applied as each component is built, not retrofitted at the end.
- The `position` float strategy will eventually suffer from precision loss after many reorderings. A periodic normalisation job (rewriting positions to clean integers) is a known follow-up, not in scope here.
