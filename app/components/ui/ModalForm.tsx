"use client"

import React, { useState } from "react"
import { Modal } from "@/app/components/ui/Modal"
import { Button } from "@/app/components/ui/Button"
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
  const [error, setError] = useState<string | null>(null)

  function handleClose() {
    setError(null)
    close()
  }

  async function handleSubmit(formData: FormData) {
    setError(null)
    try {
      await action(formData)
      close()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    }
  }

  return (
    <>
      {trigger(open)}

      <Modal isOpen={isOpen} onClose={handleClose} title={title}>
        <form action={handleSubmit} className="flex flex-col gap-4">
          {children}
          {error && (
            <div className="flex items-start justify-between gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="shrink-0 text-danger/70 hover:text-danger"
              >
                ✕
              </button>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="md" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {submitLabel}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
