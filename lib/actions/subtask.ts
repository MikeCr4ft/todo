"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUserId } from "@/lib/auth"
import { createManySubTasks, toggleSubTask, deleteSubTask } from "@/lib/repositories/subtask"

export async function createManySubTasksAction(taskId: string, titles: string[], boardId: string) {
  const userId = await getCurrentUserId()
  await createManySubTasks(userId, taskId, titles)
  revalidatePath(`/board/${boardId}`)
}

export async function toggleSubTaskAction(subTaskId: string, boardId: string) {
  const userId = await getCurrentUserId()
  await toggleSubTask(userId, subTaskId)
  revalidatePath(`/board/${boardId}`)
}

export async function deleteSubTaskAction(subTaskId: string, boardId: string) {
  const userId = await getCurrentUserId()
  await deleteSubTask(userId, subTaskId)
  revalidatePath(`/board/${boardId}`)
}
