"use client"

import { useState } from "react"
import { Modal } from "@/app/components/ui/Modal"
import NewBoardForm from "@/app/components/board/NewBoardForm"

export default function NewBoardModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        New board
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="New board">
        <NewBoardForm onSuccessAction={() => setIsOpen(false)} />
      </Modal>
    </>
  )
}
