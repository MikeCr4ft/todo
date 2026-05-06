import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { db } from "@/lib/db"
import {
  createTask,
  updateTask,
  deleteTask,
  reorderTask,
} from "@/lib/repositories/task"

describe("task repository", () => {
  let userId: string
  let boardId: string
  let columnId: string

  beforeAll(async () => {
    const user = await db.user.create({
      data: { email: `task-repo-test-${Date.now()}@test.com`, name: "Test" },
    })
    userId = user.id

    const board = await db.board.create({
      data: { title: "Test Board", userId },
    })
    boardId = board.id

    // Bypass createBoard transaction — we just need a column, not default seeding
    const column = await db.column.create({
      data: { title: "Test Column", position: 1.0, boardId },
    })
    columnId = column.id
  })

  afterAll(async () => {
    await db.user.delete({ where: { id: userId } })
    await db.$disconnect()
  })

  it("creates a task at position 1.0 when column is empty", async () => {
    // Use a fresh column so earlier tests don't affect position
    const col = await db.column.create({
      data: { title: "Fresh", position: 99.0, boardId },
    })
    const task = await createTask(userId, col.id, "First task")
    expect(task.title).toBe("First task")
    expect(task.position).toBe(1.0)
    expect(task.columnId).toBe(col.id)
    expect(task.boardId).toBe(boardId)
  })

  it("places subsequent tasks at last position + 1", async () => {
    const col = await db.column.create({
      data: { title: "Seq", position: 98.0, boardId },
    })
    await createTask(userId, col.id, "First")
    const second = await createTask(userId, col.id, "Second")
    expect(second.position).toBe(2.0)
  })

  it("stores an optional description", async () => {
    const task = await createTask(userId, columnId, "With desc", "Some detail")
    expect(task.description).toBe("Some detail")
  })

  it("rejects createTask when the user does not own the column", async () => {
    const other = await db.user.create({
      data: { email: `other-${Date.now()}@test.com` },
    })
    await expect(createTask(other.id, columnId, "Sneaky")).rejects.toThrow(
      "access denied"
    )
    await db.user.delete({ where: { id: other.id } })
  })

  it("updates title and description", async () => {
    const task = await createTask(userId, columnId, "Before")
    await updateTask(userId, task.id, { title: "After", description: "New desc" })

    const fetched = await db.task.findUnique({ where: { id: task.id } })
    expect(fetched!.title).toBe("After")
    expect(fetched!.description).toBe("New desc")
  })

  it("clears description when set to null", async () => {
    const task = await createTask(userId, columnId, "Has desc", "Will clear")
    await updateTask(userId, task.id, { description: null })

    const fetched = await db.task.findUnique({ where: { id: task.id } })
    expect(fetched!.description).toBeNull()
  })

  it("rejects updateTask when the user does not own the task", async () => {
    const task = await createTask(userId, columnId, "Protected")
    await expect(
      updateTask("wrong-user-id", task.id, { title: "Hacked" })
    ).rejects.toThrow("access denied")
  })

  it("deletes a task", async () => {
    const task = await createTask(userId, columnId, "To delete")
    await deleteTask(userId, task.id)
    const found = await db.task.findUnique({ where: { id: task.id } })
    expect(found).toBeNull()
  })

  it("rejects deleteTask when the user does not own the task", async () => {
    const task = await createTask(userId, columnId, "Protected delete")
    await expect(deleteTask("wrong-user-id", task.id)).rejects.toThrow(
      "access denied"
    )
  })

  it("reorders a task to a new float position", async () => {
    const task = await createTask(userId, columnId, "Reorder me")
    await reorderTask(userId, task.id, 1.5)

    const fetched = await db.task.findUnique({ where: { id: task.id } })
    expect(fetched!.position).toBe(1.5)
  })

  it("rejects reorderTask when the user does not own the task", async () => {
    const task = await createTask(userId, columnId, "Protected reorder")
    await expect(reorderTask("wrong-user-id", task.id, 1.5)).rejects.toThrow(
      "access denied"
    )
  })
})
