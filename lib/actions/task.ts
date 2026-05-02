"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUserId } from "@/lib/auth"
import { createTask, updateTask, deleteTask } from "@/lib/repositories/task"

export async function createTaskAction(formData: FormData) {
  const userId = await getCurrentUserId()
  const columnId = formData.get("columnId") as string
  const boardId = formData.get("boardId") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string | null

  if (!title?.trim()) return

  await createTask(userId, columnId, title.trim(), description?.trim() || undefined)
  revalidatePath(`/board/${boardId}`)
}

export async function updateTaskAction(formData: FormData) {
  const userId = await getCurrentUserId()
  const taskId = formData.get("taskId") as string
  const boardId = formData.get("boardId") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string | null

  if (!title?.trim()) return

  await updateTask(userId, taskId, {
    title: title.trim(),
    description: description?.trim() || null,
  })
  revalidatePath(`/board/${boardId}`)
}

export async function deleteTaskAction(formData: FormData) {
  const userId = await getCurrentUserId()
  const taskId = formData.get("taskId") as string
  const boardId = formData.get("boardId") as string

  await deleteTask(userId, taskId)
  revalidatePath(`/board/${boardId}`)
}
