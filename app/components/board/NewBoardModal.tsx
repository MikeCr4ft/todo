"use client"

import { ModalForm } from "@/app/components/ui/ModalForm"
import { createBoardAction } from "@/lib/actions/board"

export default function NewBoardModal() {
  return (
    <ModalForm
      trigger={(open) => (
        <button
          onClick={open}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          New board
        </button>
      )}
      title="New board"
      action={createBoardAction}
      submitLabel="Create"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-primary">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          autoFocus
          placeholder="Board title"
          className="rounded-lg border border-edge bg-elevated px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
    </ModalForm>
  )
}
