# PRD: Sub-tasks with AI-Powered Suggestions

## Problem Statement

When a user creates a task on their Kanban board, breaking it down into concrete, actionable steps requires manual effort and context-switching. Users often leave tasks vague (e.g., "Deploy to production") because decomposing them into sub-tasks is tedious. This makes it hard to track partial progress and leads to tasks sitting in a column longer than necessary.

## Solution

Introduce a lightweight sub-task checklist on every task, and a one-click AI suggestion flow that proposes 3–5 sub-tasks based on the task's title, description, board name, and current column. The user reviews the suggestions, selects the ones they want, and adds them in a single action. The task card on the board shows a compact progress counter so progress is visible without opening the task.

## User Stories

1. As a board user, I want to add sub-tasks to a task so that I can track granular progress within a single card.
2. As a board user, I want to check off individual sub-tasks so that I can mark steps as complete without moving the whole task.
3. As a board user, I want to delete a sub-task I no longer need so that my checklist stays relevant.
4. As a board user, I want to see a sub-task progress counter on the task card so that I can gauge how much work remains at a glance without opening the task.
5. As a board user, I want to click a "Suggest sub-tasks" button inside the task modal so that I can get AI-generated sub-task ideas without leaving the page.
6. As a board user, I want the AI suggestions to use my task's title, description, board name, and column so that the suggestions are contextually relevant.
7. As a board user, I want to see the AI suggestions as a selectable checklist so that I can pick only the ones that are useful.
8. As a board user, I want to click "Add selected" to persist only my chosen suggestions so that I stay in control of what gets added.
9. As a board user, I want the "Suggest sub-tasks" button to be available even when my task has no description so that a descriptive title alone is enough to get useful suggestions.
10. As a board user, I want to see a loading indicator while the AI generates suggestions so that I know the request is in progress.
11. As a board user, I want the suggestion panel to show an error state if the AI call fails so that I understand what went wrong and can retry.
12. As a board user, I want sub-tasks to be scoped to their parent task so that sub-tasks from one task never appear on another.
13. As a board user, I want sub-tasks to persist across page reloads so that my checklist is durable.
14. As a board user, I want sub-tasks to be deleted automatically when their parent task is deleted so that I don't accumulate orphaned data.
15. As a board user, I want the sub-task checklist to appear inside the task edit modal below the description field so that I can view and manage sub-tasks in context.
16. As a board user, I want checked sub-tasks to appear visually distinct (e.g., strikethrough) so that I can quickly see what's done.
17. As a board user, I want the progress counter on the card to update in real time as I check off sub-tasks so that the board always reflects current state.
18. As a board user, I want to re-generate AI suggestions if the first batch wasn't useful so that I get a second opinion without manually typing sub-tasks.
19. As a board user, I want the AI suggestion feature to work on tasks with only a title (no description) so that I'm not forced to write a description first.
20. As a board user, I want adding sub-tasks to not affect the task's position on the board so that the Kanban order is undisturbed.

## Implementation Decisions

### Schema

- A new `SubTask` model is added with fields: `id` (cuid), `title` (string), `completed` (boolean, default false), `createdAt` (datetime), and a required `taskId` foreign key referencing `Task` with cascade delete.
- No position field — sub-tasks are ordered by `createdAt` ascending.
- No nesting — sub-tasks are one level deep only.

### SubTask Repository

- A dedicated server-side repository module exposes: `getSubTasksByTask`, `createManySubTasks`, `toggleSubTask`, `deleteSubTask`.
- Ownership is enforced by joining through `Task → Board → userId`, matching the existing ownership pattern.
- Never queried directly from Server Actions or components.

### AI Suggestion Service

- A pure, framework-free module that accepts `{ taskTitle, description?, boardName, columnName }` and returns `Promise<string[]>`.
- Uses `@langchain/groq` with model `llama-3.1-8b-instant`.
- Structured output (JSON schema) enforces that the response is an array of 3–5 strings.
- The Groq API key is read from an environment variable (`GROQ_API_KEY`).
- No LangGraph — a single prompt → structured output round-trip is sufficient.

### Server Actions

- `createManySubTasksAction(taskId, titles[])` — validates session, delegates to SubTask Repository.
- `toggleSubTaskAction(subTaskId)` — validates session, delegates to SubTask Repository.
- `deleteSubTaskAction(subTaskId)` — validates session, delegates to SubTask Repository.
- Each action verifies ownership before mutating.

### SubTask Checklist UI

- Rendered inside the task edit modal, below the description field.
- Shows existing sub-tasks as checkboxes; checking one fires `toggleSubTaskAction` optimistically.
- A "Suggest sub-tasks" button is always visible regardless of whether a description exists.
- Clicking the button renders the AI Suggestion Panel inline.

### AI Suggestion Panel UI

- Three states: loading spinner, suggestions checklist, error with retry.
- Suggestions rendered as checkboxes (all unchecked by default).
- "Add selected" button is disabled until at least one suggestion is checked.
- On submit, fires `createManySubTasksAction` with the selected titles, then dismisses the panel.

### TaskCard Update

- The existing TaskCard component gains a sub-task progress counter ("X / Y") displayed below the task title when the task has at least one sub-task.
- Sub-task counts are fetched as part of the existing task query (aggregated, not the full sub-task list).

## Testing Decisions

Good tests verify observable behavior against real infrastructure — they do not test implementation details or mock the database.

### SubTask Repository (integration tests)

- Tests run against a real local Postgres instance (Docker Compose), matching the pattern established by the Board and Task repository tests.
- Cover: create, toggle, delete, cascade delete when parent task is deleted, ownership enforcement (cannot access another user's sub-tasks).

### AI Suggestion Service (unit tests)

- The service is a pure function except for the LangChain client call.
- Tests mock the `@langchain/groq` client and assert that: the correct prompt is constructed from the input context, the structured output schema is applied, and the returned array is passed through correctly.
- Edge cases: empty description, very long title, model returning fewer than 3 suggestions.

## Out of Scope

- Sub-task ordering / drag-and-drop reordering.
- Sub-tasks on sub-tasks (no nesting beyond one level).
- Editing a sub-task's title after creation.
- AI suggestions using the full board context (other task titles).
- Streaming the AI response token by token.
- LangGraph multi-step agentic flows.
- Any paid AI provider — only Groq free tier.

## Further Notes

- The Groq free tier has generous rate limits for a personal dev project; no credit card is required.
- `llama-3.1-8b-instant` is fast enough that no streaming UX is needed — the round-trip is typically under 1 second.
- The AI Suggestion Service should be designed so the provider can be swapped (e.g., to Anthropic or OpenAI) by changing one import and the model string.
- Sub-task progress on the card should be computed server-side and passed as a prop to avoid an extra client fetch.
