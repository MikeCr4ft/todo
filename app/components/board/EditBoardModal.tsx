"use client"

import { Modal } from "@/app/components/ui/Modal"
import { updateBoardAction } from "@/lib/actions/board"
import { useModal } from "@/lib/hooks/useModal"

type Board = {
  id: string
  title: string
}

export default function EditBoardModal({ board }: { board: Board }) {
  const { isOpen, open, close } = useModal()

  async function handleSubmit(formData: FormData) {
    await updateBoardAction(formData)
    close()
  }

  return (
    <>
      <button
        onClick={open}
        className="rounded px-3 py-1 text-sm text-secondary hover:text-primary"
      >
        Edit
      </button>

      <Modal isOpen={isOpen} onClose={close} title="Edit board">
        <form action={handleSubmit} className="flex flex-col gap-4">
          <input type="hidden" name="boardId" value={board.id} />
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-sm font-medium text-primary">
              Title
            </label>
            <input
              id="title"
              name="title"
              defaultValue={board.title}
              required
              autoFocus
              className="rounded-lg border border-edge bg-elevated px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className="rounded-lg px-4 py-2 text-sm text-secondary hover:text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
