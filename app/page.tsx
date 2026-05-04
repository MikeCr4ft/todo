// Server Component — runs on the server and fetches boards before rendering.
// No "use client" means Next.js keeps this out of the browser bundle entirely.

import { getBoardsByUser } from "@/lib/repositories/board"
import { getCurrentUserId } from "@/lib/auth"
import BoardCard from "@/app/components/board/BoardCard"
import NewBoardModal from "@/app/components/board/NewBoardModal"

export default async function HomePage() {
  const userId = await getCurrentUserId()
  const boards = await getBoardsByUser(userId)

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">My Boards</h1>
            <p className="mt-1 text-sm text-muted">Organize your work across boards</p>
          </div>
          <NewBoardModal />
        </div>

        {boards.length === 0 ? (
          <div className="rounded-lg border border-dashed border-edge py-16 text-center">
            <p className="text-sm text-muted">No boards yet — create one to get started.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {boards.map((board: { id: string; title: string }) => (
              <li key={board.id}>
                <BoardCard board={board} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
