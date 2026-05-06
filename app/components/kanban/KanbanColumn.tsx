"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import TaskCard from "@/app/components/task/TaskCard"
import NewTaskModal from "@/app/components/task/NewTaskModal"
import type { Column } from "@/lib/types"

const EMPTY_MESSAGES: Record<string, string> = {
  "To Do": "No tasks to do yet",
  "In Progress": "Nothing in progress",
  "Done": "All caught up",
}

export default function KanbanColumn({
  column,
  boardId,
}: {
  column: Column
  boardId: string
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const taskIds = column.tasks.map((t) => t.id)

  return (
    <div
      className={`flex flex-col rounded-lg border bg-elevated transition-colors ${
        isOver ? "border-accent" : "border-edge"
      }`}
    >
      <div className="shrink-0 flex items-center justify-between border-b border-edge px-3 py-2.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-secondary">
          {column.title}
        </h2>
        <span className="rounded-full bg-edge px-1.5 py-0.5 text-xs font-medium text-muted">
          {column.tasks.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className="flex min-h-48 max-h-[calc(100vh-14rem)] flex-col gap-2 overflow-y-auto p-3"
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {column.tasks.length === 0 ? (
            <p className="m-auto text-xs text-muted">
              {EMPTY_MESSAGES[column.title] ?? "No tasks yet"}
            </p>
          ) : (
            column.tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </SortableContext>
      </div>
      <div className="shrink-0 border-t border-edge p-2">
        <NewTaskModal columnId={column.id} boardId={boardId} />
      </div>
    </div>
  )
}
