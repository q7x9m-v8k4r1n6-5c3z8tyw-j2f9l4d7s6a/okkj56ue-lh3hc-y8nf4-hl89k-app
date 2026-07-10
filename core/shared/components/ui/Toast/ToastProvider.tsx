import { useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from '@/core/assets'
import { ToastContext } from './ToastContext'
import type { ToastItem, ToastOptions, ToastVariant } from './toast.type'

const variantClasses: Record<ToastVariant, string> = {
  success: 'border-[#bbf7d0] bg-white text-[#15803d] before:bg-[#22c55e]',
  info: 'border-[#bfdbfe] bg-white text-[#1d4ed8] before:bg-[#3b82f6]',
  warning: 'border-[#fde68a] bg-white text-[#b45309] before:bg-[#f59e0b]',
  danger: 'border-[#fecaca] bg-white text-[#b91c1c] before:bg-[#ef4444]',
}

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id)
    if (timer) clearTimeout(timer)
    timersRef.current.delete(id)
    setToasts((current) => current.filter((item) => item.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current.clear()
    setToasts([])
  }, [])

  const toast = useCallback((options: ToastOptions) => {
    const id = crypto.randomUUID()
    const item: ToastItem = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant ?? 'info',
      duration: options.duration ?? 4000,
    }

    setToasts((current) => [...current.slice(-3), item])
    if (item.duration > 0) {
      timersRef.current.set(id, setTimeout(() => dismiss(id), item.duration))
    }
    return id
  }, [dismiss])

  useEffect(() => () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current.clear()
  }, [])

  const contextValue = useMemo(() => ({ dismiss, dismissAll, toast }), [dismiss, dismissAll, toast])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3" aria-live="polite" aria-atomic="false">
          {toasts.map((item) => (
            <div
              key={item.id}
              role="status"
              className={`toast-enter pointer-events-auto relative overflow-hidden rounded-xl border p-4 pl-5 shadow-[0_12px_30px_rgba(0,0,0,0.14)] before:absolute before:inset-y-0 before:left-0 before:w-1 ${variantClasses[item.variant]}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#171717]">{item.title}</p>
                  {item.description ? <p className="mt-1 text-sm leading-5 text-[#737373]">{item.description}</p> : null}
                </div>
                <button type="button" className="shrink-0 rounded-md p-1 text-[#737373] hover:bg-[#f5f5f5]" aria-label="Đóng thông báo" onClick={() => dismiss(item.id)}>
                  <CloseIcon className="size-4" />
                </button>
              </div>
              {item.duration > 0 ? <div className="toast-progress absolute inset-x-0 bottom-0 h-0.5 bg-current opacity-30" style={{ animationDuration: `${item.duration}ms` }} /> : null}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}
