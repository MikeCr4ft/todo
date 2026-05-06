import { db } from "@/lib/db"

async function verifyTaskAccess(userId: string, taskId: string) {
  const task = await db.task.findFirst({
    where: { id: taskId, column: { board: { userId } } },
  })
  if (!task) throw new Error("Task not found or access denied")
  return task
}

async function verifySubTaskAccess(userId: string, subTaskId: string) {
  const subTask = await db.subTask.findFirst({
    where: { id: subTaskId, task: { column: { board: { userId } } } },
  })
  if (!subTask) throw new Error("Sub-task not found or access denied")
  return subTask
}

export async function getSubTasksByTask(userId: string, taskId: string) {
  await verifyTaskAccess(userId, taskId)
  return db.subTask.findMany({
    where: { taskId },
    orderBy: { createdAt: "asc" },
  })
}

export async function createManySubTasks(userId: string, taskId: string, titles: string[]) {
  await verifyTaskAccess(userId, taskId)
  return db.subTask.createMany({
    data: titles.map((title) => ({ title, taskId })),
  })
}

export async function toggleSubTask(userId: string, subTaskId: string) {
  const subTask = await verifySubTaskAccess(userId, subTaskId)
  return db.subTask.update({
    where: { id: subTaskId },
    data: { completed: !subTask.completed },
  })
}

export async function deleteSubTask(userId: string, subTaskId: string) {
  await verifySubTaskAccess(userId, subTaskId)
  return db.subTask.delete({ where: { id: subTaskId } })
}
