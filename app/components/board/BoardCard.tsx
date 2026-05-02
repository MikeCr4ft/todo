"use client"

import { useState } from "react"
import Link from "next/link"
import { updateBoardAction, deleteBoardAction } from "@/lib/actions/board"

type Board = {
  id: string
  title: string
}

export default function BoardCard({ board }: { board: Board }) {
  const [renaming, setRenaming] = useState(false)

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      {renaming ? (
        <form
          action={updateBoardAction}
          onSubmit={() => setRenaming(false)}
          className="flex flex-1 items-center gap-2"
        >
          <input type="hidden" name="boardId" value={board.id} />
          <input
            name="title"
            defaultValue={board.title}
            autoFocus
            required
            className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setRenaming(false)}
            className="rounded px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <Link
            href={`/board/${board.id}`}
            className="flex-1 font-medium text-gray-900 hover:underline"
          >
            {board.title}
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRenaming(true)}
              className="rounded px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
            >
              Rename
            </button>
            <form action={deleteBoardAction}>
              <input type="hidden" name="boardId" value={board.id} />
              <button
                type="submit"
                className="rounded px-3 py-1 text-sm text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
