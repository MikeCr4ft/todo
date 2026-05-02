"use client"

import Link from "next/link"
import { deleteBoardAction } from "@/lib/actions/board"
import EditBoardModal from "@/app/components/board/EditBoardModal"

type Board = {
  id: string
  title: string
}

export default function BoardCard({ board }: { board: Board }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-edge bg-surface px-4 py-3 shadow-sm">
      <Link
        href={`/board/${board.id}`}
        className="flex-1 font-medium text-primary hover:underline"
      >
        {board.title}
      </Link>
      <div className="flex items-center gap-2">
        <EditBoardModal board={board} />
        <form action={deleteBoardAction}>
          <input type="hidden" name="boardId" value={board.id} />
          <button
            type="submit"
            className="rounded px-3 py-1 text-sm text-danger hover:text-danger-hover"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  )
}
