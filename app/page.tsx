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
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Boards</h1>

      <div className="mb-8">
        <NewBoardModal />
      </div>
      

      {/* Board list or empty state */}
      {boards.length === 0 ? (
        <p className="text-center text-sm text-gray-400">
          No boards yet — create one above.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {boards.map((board: { id: string; title: string }) => (
            <li key={board.id}>
              <BoardCard board={board} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
