import { useEffect, type PropsWithChildren, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from '@/core/assets'

export type DrawerProps = PropsWithChildren<{
  open: boolean
  title: string
  icon?: ReactNode
  footer?: ReactNode
  panelClassName?: string
  onClose: () => void
}>

export const Drawer = ({ children, footer, icon, onClose, open, panelClassName = '', title }: DrawerProps) => {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  return createPortal(
    <div
      className={`fixed inset-0 z-50 transition-colors duration-200 ${open ? 'bg-black/10' : 'pointer-events-none bg-black/0'}`}
      role="presentation"
      aria-hidden={!open}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <aside className={`absolute inset-y-0 right-0 flex w-full max-w-[430px] flex-col border-l border-[rgba(66,0,1,0.20)] bg-white pl-px shadow-[0_8px_15px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'} ${panelClassName}`} role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <header className="flex h-[81px] shrink-0 items-center justify-between border-b border-[#eeeeee] px-6 py-6">
          <h2 id="drawer-title" className="flex min-w-0 items-center gap-4 text-[22px] font-semibold leading-[31.2px] tracking-[-0.24px] text-[#525252]">
            {icon}
            {title}
          </h2>
          <button type="button" className="grid size-[30px] place-items-center rounded-full text-[#564240] hover:bg-[#f5f5f5]" aria-label="Đóng panel" onClick={onClose}>
            <CloseIcon className="size-3.5" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8">{children}</div>
        {footer ? <footer className="flex min-h-[86px] shrink-0 items-center justify-end gap-4 border-t border-[#eeeeee] px-6 py-6">{footer}</footer> : null}
      </aside>
    </div>,
    document.body,
  )
}
