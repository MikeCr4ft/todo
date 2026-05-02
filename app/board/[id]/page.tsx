// Server Component — fetches the board and guards access before rendering.

import Link from "next/link"
import { notFound } from "next/navigation"
import { getBoard } from "@/lib/repositories/board"
import { getCurrentUserId } from "@/lib/auth"
import KanbanBoard from "@/app/components/kanban/KanbanBoard"

type Props = {
  // Next.js passes route segment params as a promise in the App Router.
  params: Promise<{ id: string }>
}

export default async function BoardPage({ params }: Props) {
  const { id } = await params
  const userId = await getCurrentUserId()

  // Returns null if the board doesn't exist OR belongs to a different user.
  // Both cases are treated as 404 — we never reveal whether a board exists.
  const board = await getBoard(userId, id)
  if (!board) notFound()

  return (
    <main className="px-8 py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
      >
        ← All boards
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-primary">{board.title}</h1>

      <KanbanBoard boardId={id} />
    </main>
  )
}
