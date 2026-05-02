"use client"

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import KanbanColumn from "@/app/components/kanban/KanbanColumn"
import { moveTaskAction } from "@/lib/actions/task"

type Task = {
  id: string
  title: string
  description: string | null
  position: number
  boardId: string
  columnId: string
}

type Column = {
  id: string
  title: string
  position: number
  tasks: Task[]
}

export default function KanbanBoardClient({
  columns,
  boardId,
}: {
  columns: Column[]
  boardId: string
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require 8px of movement before a drag starts so button clicks inside
      // cards aren't accidentally treated as drag gestures.
      activationConstraint: { distance: 8 },
    })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const newColumnId = over.id as string

    const sourceColumn = columns.find((col) =>
      col.tasks.some((t) => t.id === taskId)
    )
    if (!sourceColumn || sourceColumn.id === newColumnId) return

    await moveTaskAction(taskId, newColumnId, boardId)
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {columns.map((column) => (
          <KanbanColumn key={column.id} boardId={boardId} column={column} />
        ))}
      </div>
    </DndContext>
  )
}
