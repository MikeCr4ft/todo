"use client"

import React from "react"
import { Modal } from "@/app/components/ui/Modal"
import { useModal } from "@/lib/hooks/useModal"

type ModalFormProps = {
  trigger: (open: () => void) => React.ReactNode
  title: string
  action: (formData: FormData) => Promise<void>
  submitLabel?: string
  children: React.ReactNode
}

export function ModalForm({
  trigger,
  title,
  action,
  submitLabel = "Save",
  children,
}: ModalFormProps) {
  const { isOpen, open, close } = useModal()

  async function handleSubmit(formData: FormData) {
    await action(formData)
    close()
  }

  return (
    <>
      {trigger(open)}

      <Modal isOpen={isOpen} onClose={close} title={title}>
        <form action={handleSubmit} className="flex flex-col gap-4">
          {children}
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
              {submitLabel}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
