import { db } from "@/lib/db"

export async function getColumnsByBoard(boardId: string) {
  return db.column.findMany({
    where: { boardId },
    orderBy: { position: "asc" },
  })
}

export async function createColumn(
  userId: string,
  boardId: string,
  title: string,
  position: number
) {
  const board = await db.board.findFirst({ where: { id: boardId, userId } })
  if (!board) throw new Error("Board not found or access denied")

  return db.column.create({ data: { title, position, boardId } })
}

export async function updateColumn(
  userId: string,
  columnId: string,
  title: string
) {
  const column = await db.column.findFirst({
    where: { id: columnId, board: { userId } },
  })
  if (!column) throw new Error("Column not found or access denied")

  return db.column.update({ where: { id: columnId }, data: { title } })
}

export async function deleteColumn(userId: string, columnId: string) {
  const column = await db.column.findFirst({
    where: { id: columnId, board: { userId } },
    include: { _count: { select: { tasks: true } } },
  })
  if (!column) throw new Error("Column not found or access denied")
  if (column._count.tasks > 0)
    throw new Error("Remove all tasks before deleting this column")

  return db.column.delete({ where: { id: columnId } })
}

export async function reorderColumn(
  userId: string,
  columnId: string,
  newPosition: number
) {
  const column = await db.column.findFirst({
    where: { id: columnId, board: { userId } },
  })
  if (!column) throw new Error("Column not found or access denied")

  return db.column.update({
    where: { id: columnId },
    data: { position: newPosition },
  })
}
