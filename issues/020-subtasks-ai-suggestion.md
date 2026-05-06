## What to build

Wire up an AI-powered suggestion flow inside the task edit modal. A "Suggest sub-tasks" button (always visible, even when there's no description) calls a pure AI Suggestion Service backed by Groq's free tier. The service returns 3–5 suggested sub-task titles; the user selects which ones to keep and clicks "Add selected" to persist them.

## Acceptance criteria

- [ ] `GROQ_API_KEY` env var documented in `.env.example` (obtain a free key at console.groq.com — no credit card required)
- [ ] AI Suggestion Service is a pure function: accepts `{ taskTitle, description?, boardName, columnName }`, returns `Promise<string[]>` via `@langchain/groq` + `llama-3.1-8b-instant` with structured output enforcing 3–5 string items
- [ ] Service has unit tests: correct prompt construction, structured output schema applied, array passthrough, edge cases (no description, very long title)
- [ ] "Suggest sub-tasks" button renders in the task edit modal below the description field and is always visible
- [ ] Clicking the button shows a loading spinner while the AI call is in flight
- [ ] Suggestions render as a selectable checklist (all unchecked by default)
- [ ] "Add selected" button is disabled until at least one suggestion is checked
- [ ] Clicking "Add selected" fires `createManySubTasksAction` with selected titles, then dismisses the panel
- [ ] Error state shown with a retry option if the Groq call fails
- [ ] A "Regenerate" affordance lets the user request a fresh batch of suggestions

## Blocked by

- #19 — feat: sub-tasks schema, repository, CRUD UI, and card progress counter

## PRD

- #18 — PRD: Sub-tasks with AI-Powered Suggestions

## Type

AFK
