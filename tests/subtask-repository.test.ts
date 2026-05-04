import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { db } from "@/lib/db"
import {
  getSubTasksByTask,
  createManySubTasks,
  toggleSubTask,
  deleteSubTask,
} from "@/lib/repositories/subtask"

describe("subtask repository", () => {
  let userId: string
  let boardId: string
  let columnId: string
  let taskId: string

  beforeAll(async () => {
    const user = await db.user.create({
      data: { email: `subtask-repo-test-${Date.now()}@test.com`, name: "Test" },
    })
    userId = user.id

    const board = await db.board.create({ data: { title: "Test Board", userId } })
    boardId = board.id

    const column = await db.column.create({
      data: { title: "Test Column", position: 1.0, boardId },
    })
    columnId = column.id

    const task = await db.task.create({
      data: { title: "Test Task", position: 1.0, columnId, boardId },
    })
    taskId = task.id
  })

  afterAll(async () => {
    await db.user.delete({ where: { id: userId } })
    await db.$disconnect()
  })

  it("creates multiple sub-tasks at once", async () => {
    await createManySubTasks(userId, taskId, ["Step A", "Step B"])
    const subs = await db.subTask.findMany({ where: { taskId } })
    const titles = subs.map((s) => s.title)
    expect(titles).toContain("Step A")
    expect(titles).toContain("Step B")
  })

  it("sub-tasks default to not completed", async () => {
    await createManySubTasks(userId, taskId, ["New step"])
    const subs = await db.subTask.findMany({ where: { taskId, title: "New step" } })
    expect(subs[0].completed).toBe(false)
  })

  it("getSubTasksByTask returns sub-tasks ordered by createdAt", async () => {
    const freshTask = await db.task.create({
      data: { title: "Ordered task", position: 2.0, columnId, boardId },
    })
    await createManySubTasks(userId, freshTask.id, ["First", "Second"])
    const subs = await getSubTasksByTask(userId, freshTask.id)
    expect(subs.map((s) => s.title)).toEqual(["First", "Second"])
  })

  it("rejects getSubTasksByTask when user does not own the task", async () => {
    await expect(getSubTasksByTask("wrong-user", taskId)).rejects.toThrow("access denied")
  })

  it("toggles a sub-task from false to true", async () => {
    const [sub] = await db.subTask.createManyAndReturn({
      data: [{ title: "Toggle me", taskId }],
    })
    expect(sub.completed).toBe(false)
    await toggleSubTask(userId, sub.id)
    const updated = await db.subTask.findUnique({ where: { id: sub.id } })
    expect(updated!.completed).toBe(true)
  })

  it("toggles a sub-task from true back to false", async () => {
    const [sub] = await db.subTask.createManyAndReturn({
      data: [{ title: "Toggle back", taskId, completed: true }],
    })
    await toggleSubTask(userId, sub.id)
    const updated = await db.subTask.findUnique({ where: { id: sub.id } })
    expect(updated!.completed).toBe(false)
  })

  it("rejects toggleSubTask when user does not own the sub-task", async () => {
    const [sub] = await db.subTask.createManyAndReturn({
      data: [{ title: "Protected toggle", taskId }],
    })
    await expect(toggleSubTask("wrong-user", sub.id)).rejects.toThrow("access denied")
  })

  it("deletes a sub-task", async () => {
    const [sub] = await db.subTask.createManyAndReturn({
      data: [{ title: "Delete me", taskId }],
    })
    await deleteSubTask(userId, sub.id)
    const found = await db.subTask.findUnique({ where: { id: sub.id } })
    expect(found).toBeNull()
  })

  it("rejects deleteSubTask when user does not own the sub-task", async () => {
    const [sub] = await db.subTask.createManyAndReturn({
      data: [{ title: "Protected delete", taskId }],
    })
    await expect(deleteSubTask("wrong-user", sub.id)).rejects.toThrow("access denied")
  })

  it("cascade deletes sub-tasks when the parent task is deleted", async () => {
    const task = await db.task.create({
      data: { title: "Parent", position: 99.0, columnId, boardId },
    })
    await createManySubTasks(userId, task.id, ["Orphan A", "Orphan B"])
    const before = await db.subTask.findMany({ where: { taskId: task.id } })
    expect(before).toHaveLength(2)

    await db.task.delete({ where: { id: task.id } })

    const after = await db.subTask.findMany({ where: { taskId: task.id } })
    expect(after).toHaveLength(0)
  })

  it("rejects createManySubTasks when user does not own the task", async () => {
    await expect(
      createManySubTasks("wrong-user", taskId, ["Sneaky sub-task"])
    ).rejects.toThrow("access denied")
  })
})
