import { useEffect, type PropsWithChildren, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from '@/core/assets'

export type DrawerProps = PropsWithChildren<{
  open: boolean
  title: string
  icon?: ReactNode
  footer?: ReactNode
  onClose: () => void
}>

export const Drawer = ({ children, footer, icon, onClose, open, title }: DrawerProps) => {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  return createPortal(
    <div
      className={`fixed inset-0 z-50 transition-colors duration-200 ${open ? 'bg-black/20' : 'pointer-events-none bg-black/0'}`}
      role="presentation"
      aria-hidden={!open}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <aside className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-[-8px_0_24px_rgba(0,0,0,0.10)] transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`} role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <header className="flex h-[86px] items-center justify-between border-b border-[#eeeeee] px-6">
          <h2 id="drawer-title" className="flex items-center gap-3 text-xl font-semibold text-[#525252]">
            {icon}
            {title}
          </h2>
          <button type="button" className="rounded-lg p-2 text-[#525252] hover:bg-[#f5f5f5]" aria-label="Đóng panel" onClick={onClose}>
            <CloseIcon className="size-5" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">{children}</div>
        {footer ? <footer className="flex min-h-[86px] items-center justify-end gap-3 border-t border-[#eeeeee] px-6">{footer}</footer> : null}
      </aside>
    </div>,
    document.body,
  )
}
