// Server Component — fetches the board and guards access before rendering.

import { notFound } from "next/navigation"
import { getBoard } from "@/lib/repositories/board"
import { getCurrentUserId } from "@/lib/auth"

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
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-primary">{board.title}</h1>

      {/* Kanban columns go here — implemented in issue #4 */}
      <p className="text-sm text-muted">Board view coming in issue #4.</p>
    </main>
  )
}
