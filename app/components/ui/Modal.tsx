import React from "react"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-surface border border-edge p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-edge pb-3">
          <h3 className="text-lg font-semibold text-primary">{title || 'Modal'}</h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-primary"
          >
            ✕
          </button>
        </div>

        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  )
}
