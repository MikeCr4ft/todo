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
    <div className="flex gap-5 items-center justify-between rounded-lg border border-edge bg-surface px-4 py-3 shadow-sm">
      <div className="flex-1">
        <Link
          href={`/board/${board.id}`}
          className="font-medium text-primary transition-colors hover:text-accent"
        >
          {board.title}
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <EditBoardModal board={board} />
        <form action={deleteBoardAction}>
          <input type="hidden" name="boardId" value={board.id} />
          <button
            type="submit"
            className="cursor-pointer rounded px-3 py-1 text-sm text-danger transition-colors hover:text-danger-hover"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  )
}
