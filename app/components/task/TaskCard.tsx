"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import EditTaskModal from "@/app/components/task/EditTaskModal"
import { Button } from "@/app/components/ui/Button"
import { deleteTaskAction } from "@/lib/actions/task"
import type { Task } from "@/lib/types"

export default function TaskCard({ task, isDragOverlay = false }: { task: Task; isDragOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded border bg-surface p-3 shadow-sm transition-colors ${
        isDragging && !isDragOverlay ? "border-edge opacity-40" : ""
      } ${isDragOverlay ? "rotate-1 border-accent shadow-lg" : ""} ${
        !isDragging && !isDragOverlay ? "border-edge hover:border-accent/50" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          {...listeners}
          {...attributes}
          aria-label="Drag task"
          className="mt-0.5 shrink-0 cursor-grab text-muted active:cursor-grabbing hover:text-secondary"
        >
          ⠿
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-primary">{task.title}</p>
            <div className="flex shrink-0 items-center gap-1">
              <EditTaskModal task={task} />
              <form action={deleteTaskAction}>
                <input type="hidden" name="taskId" value={task.id} />
                <input type="hidden" name="boardId" value={task.boardId} />
                <Button type="submit" variant="danger" size="icon">
                  ✕
                </Button>
              </form>
            </div>
          </div>
          {task.description && (
            <p className="mt-1 text-xs text-secondary line-clamp-2">
              {task.description}
            </p>
          )}
          {task.subTasks.length > 0 && (
            <p className="mt-1.5 text-xs text-muted">
              {task.subTasks.filter((s) => s.completed).length} / {task.subTasks.length}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
