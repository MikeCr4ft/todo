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

// Insert a new board scoped to the given user.
export async function createBoard(userId: string, title: string) {
  return db.board.create({
    data: { title, userId },
  })
}

// Rename a board. The findFirst check enforces ownership — if the row doesn't
// exist for this userId the mutation is blocked before it reaches the DB.
export async function updateBoard(
  userId: string,
  boardId: string,
  title: string
) {
  const board = await db.board.findFirst({ where: { id: boardId, userId } })
  if (!board) throw new Error("Board not found or access denied")

  return db.board.update({ where: { id: boardId }, data: { title } })
}

// Delete a board (and all its tasks via cascade). Same ownership guard as updateBoard.
export async function deleteBoard(userId: string, boardId: string) {
  const board = await db.board.findFirst({ where: { id: boardId, userId } })
  if (!board) throw new Error("Board not found or access denied")

  return db.board.delete({ where: { id: boardId } })
}
