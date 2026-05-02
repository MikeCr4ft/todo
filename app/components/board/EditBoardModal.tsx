"use client"

import { ModalForm } from "@/app/components/ui/ModalForm"
import { updateBoardAction } from "@/lib/actions/board"

type Board = { id: string; title: string }

export default function EditBoardModal({ board }: { board: Board }) {
  return (
    <ModalForm
      trigger={(open) => (
        <button
          onClick={open}
          className="rounded px-3 py-1 text-sm text-secondary hover:text-primary"
        >
          Edit
        </button>
      )}
      title="Edit board"
      action={updateBoardAction}
      submitLabel="Save"
    >
      <input type="hidden" name="boardId" value={board.id} />
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-primary">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={board.title}
          required
          autoFocus
          className="rounded-lg border border-edge bg-elevated px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
    </ModalForm>
  )
}
