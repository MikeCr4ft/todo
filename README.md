# Kanban Board

A full-stack Kanban board built with Next.js App Router, Tailwind CSS, and Postgres. Supports multiple boards per user, drag-and-drop task management, and persistent state.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Database:** Postgres via Prisma 7
- **Auth:** NextAuth.js with GitHub OAuth *(coming soon)*
- **Drag-and-drop:** @dnd-kit/core

## Local development

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in values (defaults work for local Docker)
cp .env.example .env

# 3. Start the Postgres container
docker compose up -d

# 4. Run migrations
npm run db:migrate

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database scripts

| Command | Description |
|---|---|
| `npm run db:migrate` | Create and apply a new migration |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |

## Project structure

```
prisma/
  schema.prisma       # User, Board, Task models
  migrations/         # Applied migration history
prisma.config.ts      # Prisma 7 datasource config
docker-compose.yml    # Local Postgres container
app/                  # Next.js App Router pages and components
docs/
  prd-kanban-board.md # Full product requirements
```
