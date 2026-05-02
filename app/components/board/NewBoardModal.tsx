"use client"

import { Modal } from "@/app/components/ui/Modal"
import NewBoardForm from "@/app/components/board/NewBoardForm"
import { useModal } from "@/lib/hooks/useModal"

export default function NewBoardModal() {
  const { isOpen, open, close } = useModal()

  return (
    <>
      <button
        onClick={open}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
      >
        New board
      </button>

      <Modal isOpen={isOpen} onClose={close} title="New board">
        <NewBoardForm onSuccessAction={close} />
      </Modal>
    </>
  )
}
