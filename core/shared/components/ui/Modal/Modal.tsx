import { useEffect, type PropsWithChildren, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from '@/core/assets'

export type ModalProps = PropsWithChildren<{
  open: boolean
  title?: string
  description?: string
  footer?: ReactNode
  onClose: () => void
}>

export const Modal = ({ children, description, footer, onClose, open, title }: ModalProps) => {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="w-full max-w-lg rounded-xl bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className="flex items-start justify-between gap-4 border-b border-[#eeeeee] px-6 py-5">
          <div>
            {title ? <h2 id="modal-title" className="text-lg font-semibold text-[#1a1c1c]">{title}</h2> : null}
            {description ? <p className="mt-1 text-sm text-[#737373]">{description}</p> : null}
          </div>
          <button type="button" className="rounded-lg p-1.5 text-[#525252] hover:bg-[#f5f5f5]" aria-label="Đóng modal" onClick={onClose}>
            <CloseIcon className="size-5" />
          </button>
        </header>
        <div className="px-6 py-5">{children}</div>
        {footer ? <footer className="flex justify-end gap-3 border-t border-[#eeeeee] px-6 py-4">{footer}</footer> : null}
      </section>
    </div>,
    document.body,
  )
}
