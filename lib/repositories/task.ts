import { db } from "@/lib/db"

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
  const position = last ? last.position + 1.0 : 1.0

  return db.task.create({
    data: { title, description, position, columnId, boardId: column.boardId },
  })
}

export async function updateTask(
  userId: string,
  taskId: string,
  data: { title?: string; description?: string | null }
) {
  const task = await db.task.findFirst({
    where: { id: taskId, column: { board: { userId } } },
  })
  if (!task) throw new Error("Task not found or access denied")

  return db.task.update({ where: { id: taskId }, data })
}

export async function deleteTask(userId: string, taskId: string) {
  const task = await db.task.findFirst({
    where: { id: taskId, column: { board: { userId } } },
  })
  if (!task) throw new Error("Task not found or access denied")

  return db.task.delete({ where: { id: taskId } })
}

export async function reorderTask(
  userId: string,
  taskId: string,
  newPosition: number
) {
  const task = await db.task.findFirst({
    where: { id: taskId, column: { board: { userId } } },
  })
  if (!task) throw new Error("Task not found or access denied")

  return db.task.update({
    where: { id: taskId },
    data: { position: newPosition },
  })
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
  const position = last ? last.position + 1.0 : 1.0

  return db.task.update({
    where: { id: taskId },
    data: { columnId: newColumnId, position },
  })
}
