import { db } from "@/lib/db"

// Fetch all boards belonging to a user, most recently created first.
export async function getBoardsByUser(userId: string) {
  return db.board.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
}

// Fetch a single board. Returns null if it doesn't exist OR belongs to a
// different user — callers treat both cases the same (404).
export async function getBoard(userId: string, boardId: string) {
  return db.board.findFirst({
    where: { id: boardId, userId },
  })
}

// Insert a new board and seed three default columns in a single transaction.
export async function createBoard(userId: string, title: string) {
  return db.$transaction(async (tx) => {
    const board = await tx.board.create({ data: { title, userId } })
    await tx.column.createMany({
      data: [
        { title: "To Do", position: 1.0, boardId: board.id },
        { title: "In Progress", position: 2.0, boardId: board.id },
        { title: "Done", position: 3.0, boardId: board.id },
      ],
    })
    return board
  })
}

export async function updateBoard(
  userId: string,
  boardId: string,
  title: string
) {
  const { count } = await db.board.updateMany({
    where: { id: boardId, userId },
    data: { title },
  })
  if (count === 0) throw new Error("Board not found or access denied")
}

export async function deleteBoard(userId: string, boardId: string) {
  const { count } = await db.board.deleteMany({
    where: { id: boardId, userId },
  })
  if (count === 0) throw new Error("Board not found or access denied")
}
