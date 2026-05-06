"use client"

import Link from "next/link"
import { deleteBoardAction } from "@/lib/actions/board"
import EditBoardModal from "@/app/components/board/EditBoardModal"
import { Button } from "@/app/components/ui/Button"
import type { Board } from "@/lib/types"

export default function BoardCard({ board }: { board: Board }) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-lg border border-edge bg-surface px-4 py-3 shadow-sm transition-colors hover:border-accent/40 hover:bg-elevated">
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
          <Button type="submit" variant="danger" size="sm">
            Delete
          </Button>
        </form>
      </div>
    </div>
  )
}
