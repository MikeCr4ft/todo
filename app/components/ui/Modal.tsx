import React from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-lg border border-edge bg-surface shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-edge px-6 py-4">
          <h3 className="text-lg font-semibold text-primary">{title || "Modal"}</h3>
          <button
            onClick={onClose}
            className="cursor-pointer text-muted transition-colors hover:text-primary"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-edge px-6 pb-5 pt-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
