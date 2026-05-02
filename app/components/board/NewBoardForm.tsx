"use client"

import { useRef } from "react"
import { createBoardAction } from "@/lib/actions/board"

export default function NewBoardForm({ onSuccessAction }: { onSuccessAction?: () => void }) {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    await createBoardAction(formData)
    formRef.current?.reset()
    onSuccessAction?.()
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex gap-2">
      <input
        name="title"
        placeholder="Board title"
        required
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        New board
      </button>
    </form>
  )
}
