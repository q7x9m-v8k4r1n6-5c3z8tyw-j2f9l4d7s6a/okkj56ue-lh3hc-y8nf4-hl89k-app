import type { PropsWithChildren } from 'react'

type ModalProps = PropsWithChildren<{
  open: boolean
  title?: string
  onClose?: () => void
}>

export const Modal = ({ children, onClose, open, title }: ModalProps) => {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <section className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          {title ? <h2 className="text-lg font-semibold text-slate-950">{title}</h2> : <span />}
          <button aria-label="Close modal" className="text-sm text-slate-500" onClick={onClose} type="button">
            Close
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </section>
    </div>
  )
}
