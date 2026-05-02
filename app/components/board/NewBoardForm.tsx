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
        className="flex-1 rounded-lg border border-edge bg-elevated px-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <button
        type="submit"
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
      >
        New board
      </button>
    </form>
  )
}
