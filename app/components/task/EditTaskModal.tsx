"use client"

import { ModalForm } from "@/app/components/ui/ModalForm"
import { Button } from "@/app/components/ui/Button"
import { updateTaskAction } from "@/lib/actions/task"
import type { Task } from "@/lib/types"

export default function EditTaskModal({ task }: { task: Task }) {
  return (
    <ModalForm
      trigger={(open) => (
        <Button onClick={open} variant="ghost" size="icon">
          Edit
        </Button>
      )}
      title="Edit task"
      action={updateTaskAction}
      submitLabel="Save"
    >
      <input type="hidden" name="taskId" value={task.id} />
      <input type="hidden" name="boardId" value={task.boardId} />
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-primary">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={task.title}
          required
          autoFocus
          className="rounded-lg border border-edge bg-elevated px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-primary">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={task.description ?? ""}
          rows={3}
          className="resize-none rounded-lg border border-edge bg-elevated px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
    </ModalForm>
  )
}
