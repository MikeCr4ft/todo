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
    <main className="flex h-full flex-col px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted transition-colors hover:bg-elevated hover:text-primary"
        >
          ← All boards
        </Link>
        <span className="text-edge select-none">|</span>
        <h1 className="text-xl font-bold text-primary">{board.title}</h1>
      </div>

      <KanbanBoard boardId={id} />
    </main>
  )
}
