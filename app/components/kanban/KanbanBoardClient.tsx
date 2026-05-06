"use client"

import { useOptimistic, useTransition, useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import KanbanColumn from "@/app/components/kanban/KanbanColumn"
import TaskCard from "@/app/components/task/TaskCard"
import { moveTaskAction, reorderTaskAction } from "@/lib/actions/task"
import { calcInsertPosition, calcAppendPosition } from "@/lib/position-calculator"
import type { Column, Task } from "@/lib/types"

export default function KanbanBoardClient({
  columns,
  boardId,
}: {
  columns: Column[]
  boardId: string
}) {
  const [optimisticColumns, addOptimistic] = useOptimistic(
    columns,
    (current: Column[], apply: (cols: Column[]) => Column[]) => apply(current)
  )
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [, startTransition] = useTransition()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const allTaskIds = new Set(optimisticColumns.flatMap((col) => col.tasks.map((t) => t.id)))

  function handleDragStart(event: DragStartEvent) {
    const taskId = event.active.id as string
    const task = optimisticColumns.flatMap((c) => c.tasks).find((t) => t.id === taskId) ?? null
    setActiveTask(task)
  }

  function handleReorder(taskId: string, sourceColumn: Column, overTaskIndex: number) {
    const oldIndex = sourceColumn.tasks.findIndex((t) => t.id === taskId)
    const reordered = arrayMove(sourceColumn.tasks, oldIndex, overTaskIndex)
    const finalIndex = reordered.findIndex((t) => t.id === taskId)
    const above = reordered[finalIndex - 1]?.position ?? null
    const below = reordered[finalIndex + 1]?.position ?? null
    const newPosition = calcInsertPosition(above, below)

    startTransition(async () => {
      addOptimistic((cols) =>
        cols.map((col) =>
          col.id === sourceColumn.id
            ? { ...col, tasks: reordered.map((t) => (t.id === taskId ? { ...t, position: newPosition } : t)) }
            : col
        )
      )
      await reorderTaskAction(taskId, newPosition, boardId)
    })
  }

  function handleCrossMove(taskId: string, sourceColumn: Column, targetColumn: Column) {
    const movedTask = sourceColumn.tasks.find((t) => t.id === taskId)!
    const lastInTarget = targetColumn.tasks.at(-1)
    const newPosition = calcAppendPosition(lastInTarget?.position ?? null)
    const updatedTask: Task = { ...movedTask, columnId: targetColumn.id, position: newPosition }

    startTransition(async () => {
      addOptimistic((cols) =>
        cols.map((col) => {
          if (col.id === sourceColumn.id) return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
          if (col.id === targetColumn.id) return { ...col, tasks: [...col.tasks, updatedTask] }
          return col
        })
      )
      await moveTaskAction(taskId, targetColumn.id, boardId)
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const overId = over.id as string

    const sourceColumn = optimisticColumns.find((col) => col.tasks.some((t) => t.id === taskId))
    if (!sourceColumn) return

    if (allTaskIds.has(overId)) {
      const targetColumn = optimisticColumns.find((col) => col.tasks.some((t) => t.id === overId))!
      const overTaskIndex = targetColumn.tasks.findIndex((t) => t.id === overId)

      if (sourceColumn.id === targetColumn.id) {
        if (taskId !== overId) handleReorder(taskId, sourceColumn, overTaskIndex)
      } else {
        handleCrossMove(taskId, sourceColumn, targetColumn)
      }
    } else {
      const targetColumn = optimisticColumns.find((col) => col.id === overId)
      if (targetColumn && sourceColumn.id !== targetColumn.id) {
        handleCrossMove(taskId, sourceColumn, targetColumn)
      }
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-3">
        {optimisticColumns.map((column) => (
          <KanbanColumn key={column.id} boardId={boardId} column={column} />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  )
}
