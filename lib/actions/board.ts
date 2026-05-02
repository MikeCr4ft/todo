"use server"

// "use server" marks every exported function in this file as a Server Action —
// Next.js ensures they only ever run on the server, never in the browser bundle.

import { revalidatePath } from "next/cache"
import { getCurrentUserId } from "@/lib/auth"
import {
  createBoard,
  updateBoard,
  deleteBoard,
} from "@/lib/repositories/board"

// Called by the NewBoardForm. `formData` is the native browser FormData object
// that Next.js passes automatically when you use `action={createBoardAction}`.
export async function createBoardAction(formData: FormData) {
  const userId = await getCurrentUserId()
  const title = formData.get("title") as string
  if (!title?.trim()) return

  await createBoard(userId, title.trim())

  // Tell Next.js to re-fetch the boards list on the landing page.
  revalidatePath("/")
}

// Called by the rename form inside BoardCard.
export async function updateBoardAction(formData: FormData) {
  const userId = await getCurrentUserId()
  const boardId = formData.get("boardId") as string
  const title = formData.get("title") as string
  if (!title?.trim()) return

  await updateBoard(userId, boardId, title.trim())

  revalidatePath("/")
}

// Called by the delete button inside BoardCard.
export async function deleteBoardAction(formData: FormData) {
  const userId = await getCurrentUserId()
  const boardId = formData.get("boardId") as string

  await deleteBoard(userId, boardId)

  revalidatePath("/")
}
