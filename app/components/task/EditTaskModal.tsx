"use client"

import { useState, useOptimistic, useTransition } from "react"
import { Modal } from "@/app/components/ui/Modal"
import { Button } from "@/app/components/ui/Button"
import { useModal } from "@/lib/hooks/useModal"
import { updateTaskAction } from "@/lib/actions/task"
import {
  createManySubTasksAction,
  toggleSubTaskAction,
  deleteSubTaskAction,
} from "@/lib/actions/subtask"
import type { Task, SubTask } from "@/lib/types"

export default function EditTaskModal({ task }: { task: Task }) {
  const { isOpen, open, close } = useModal()
  const [formError, setFormError] = useState<string | null>(null)
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("")
  const [isPending, startTransition] = useTransition()
  const [optimisticSubTasks, updateOptimisticSubTasks] = useOptimistic<SubTask[]>(task.subTasks)

  async function handleSave(formData: FormData) {
    setFormError(null)
    try {
      await updateTaskAction(formData)
      close()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    }
  }

  function handleAddSubTask(e: React.BaseSyntheticEvent) {
    e.preventDefault()
    const title = newSubTaskTitle.trim()
    if (!title) return
    setNewSubTaskTitle("")
    startTransition(async () => {
      updateOptimisticSubTasks((prev) => [
        ...prev,
        { id: crypto.randomUUID(), title, completed: false, taskId: task.id },
      ])
      await createManySubTasksAction(task.id, [title], task.boardId)
    })
  }

  function handleToggle(subTaskId: string) {
    startTransition(async () => {
      updateOptimisticSubTasks((prev) =>
        prev.map((s) => (s.id === subTaskId ? { ...s, completed: !s.completed } : s))
      )
      await toggleSubTaskAction(subTaskId, task.boardId)
    })
  }

  function handleDelete(subTaskId: string) {
    startTransition(async () => {
      updateOptimisticSubTasks((prev) => prev.filter((s) => s.id !== subTaskId))
      await deleteSubTaskAction(subTaskId, task.boardId)
    })
  }

  const footer = (
    <div className="flex flex-col gap-3">
      {formError && (
        <div className="flex items-start justify-between gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          <span>{formError}</span>
          <button
            type="button"
            onClick={() => setFormError(null)}
            className="shrink-0 text-danger/70 hover:text-danger"
          >
            ✕
          </button>
        </div>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="md" onClick={close}>
          Cancel
        </Button>
        <Button type="submit" form="edit-task-form" variant="primary">
          Save
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <Button onClick={open} variant="ghost" size="icon">
        Edit
      </Button>
      <Modal isOpen={isOpen} onClose={close} title="Edit task" footer={footer}>
        <div className="flex flex-col gap-4">
          <form id="edit-task-form" action={handleSave} className="flex flex-col gap-3">
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
          </form>

          <div className="border-t border-edge pt-3">
            <p className="mb-2 text-sm font-medium text-primary">Sub-tasks</p>
            <ul className="mb-3 flex h-18 flex-col gap-1.5 overflow-y-auto">
              {optimisticSubTasks.length === 0 ? (
                <li className="text-xs italic text-muted">No sub-tasks yet.</li>
              ) : (
                optimisticSubTasks.map((s) => (
                  <li key={s.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={s.completed}
                      onChange={() => handleToggle(s.id)}
                      className="accent-accent h-3.5 w-3.5 shrink-0 cursor-pointer"
                    />
                    <span
                      className={`flex-1 text-sm ${
                        s.completed ? "text-muted line-through" : "text-primary"
                      }`}
                    >
                      {s.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      className="shrink-0 p-1 text-xs text-muted transition-colors hover:text-danger"
                    >
                      ✕
                    </button>
                  </li>
                ))
              )}
            </ul>
            <form onSubmit={handleAddSubTask} className="flex gap-2">
              <input
                value={newSubTaskTitle}
                onChange={(e) => setNewSubTaskTitle(e.target.value)}
                placeholder="Add a sub-task…"
                className="flex-1 rounded-lg border border-edge bg-elevated px-3 py-1.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={!newSubTaskTitle.trim() || isPending}
              >
                Add
              </Button>
            </form>
          </div>
        </div>
      </Modal>
    </>
  )
}
