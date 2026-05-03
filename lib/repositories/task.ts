import { db } from "@/lib/db"
import { calcAppendPosition } from "@/lib/position-calculator"

export async function getTasksByColumn(columnId: string) {
  return db.task.findMany({
    where: { columnId },
    orderBy: { position: "asc" },
  })
}

export async function createTask(
  userId: string,
  columnId: string,
  title: string,
  description?: string
) {
  const column = await db.column.findFirst({
    where: { id: columnId, board: { userId } },
  })
  if (!column) throw new Error("Column not found or access denied")

  const last = await db.task.findFirst({
    where: { columnId },
    orderBy: { position: "desc" },
  })
  const position = calcAppendPosition(last?.position ?? null)

  return db.task.create({
    data: { title, description, position, columnId, boardId: column.boardId },
  })
}

export async function updateTask(
  userId: string,
  taskId: string,
  data: { title?: string; description?: string | null }
) {
  const { count } = await db.task.updateMany({
    where: { id: taskId, column: { board: { userId } } },
    data,
  })
  if (count === 0) throw new Error("Task not found or access denied")
}

export async function deleteTask(userId: string, taskId: string) {
  const { count } = await db.task.deleteMany({
    where: { id: taskId, column: { board: { userId } } },
  })
  if (count === 0) throw new Error("Task not found or access denied")
}

export async function reorderTask(
  userId: string,
  taskId: string,
  newPosition: number
) {
  const { count } = await db.task.updateMany({
    where: { id: taskId, column: { board: { userId } } },
    data: { position: newPosition },
  })
  if (count === 0) throw new Error("Task not found or access denied")
}

export async function moveTask(
  userId: string,
  taskId: string,
  newColumnId: string
) {
  const task = await db.task.findFirst({
    where: { id: taskId, column: { board: { userId } } },
  })
  if (!task) throw new Error("Task not found or access denied")

  const newColumn = await db.column.findFirst({
    where: { id: newColumnId, boardId: task.boardId },
  })
  if (!newColumn) throw new Error("Column not found")

  const last = await db.task.findFirst({
    where: { columnId: newColumnId },
    orderBy: { position: "desc" },
  })
  const position = calcAppendPosition(last?.position ?? null)

  return db.task.update({
    where: { id: taskId },
    data: { columnId: newColumnId, position },
  })
}
