"use client"

import { ModalForm } from "@/app/components/ui/ModalForm"
import { createTaskAction } from "@/lib/actions/task"

type Props = { columnId: string; boardId: string }

export default function NewTaskModal({ columnId, boardId }: Props) {
  return (
    <ModalForm
      trigger={(open) => (
        <button
          onClick={open}
          className="flex w-full items-center gap-1 rounded px-2 py-1 text-xs text-muted hover:text-primary"
        >
          + Add task
        </button>
      )}
      title="New task"
      action={createTaskAction}
      submitLabel="Create"
    >
      <input type="hidden" name="columnId" value={columnId} />
      <input type="hidden" name="boardId" value={boardId} />
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-primary">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          autoFocus
          placeholder="Task name"
          className="rounded-lg border border-edge bg-elevated px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-primary">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Optional description"
          className="resize-none rounded-lg border border-edge bg-elevated px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
    </ModalForm>
  )
}
