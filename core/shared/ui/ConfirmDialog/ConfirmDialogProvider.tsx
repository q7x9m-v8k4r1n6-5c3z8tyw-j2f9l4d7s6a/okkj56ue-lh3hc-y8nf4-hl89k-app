import { useCallback, useMemo, useRef, useState, type PropsWithChildren } from 'react'
import { Modal } from '../Modal'
import { ConfirmDialogContext } from './ConfirmDialogContext'
import type { ConfirmDialogOptions } from './useConfirmDialog'

type PendingDialog = ConfirmDialogOptions

export const ConfirmDialogProvider = ({ children }: PropsWithChildren) => {
  const [pending, setPending] = useState<PendingDialog | null>(null)
  const resolveRef = useRef<((value: boolean) => void) | null>(null)

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve
      setPending(options)
    })
  }, [])

  const close = useCallback((result: boolean) => {
    resolveRef.current?.(result)
    resolveRef.current = null
    setPending(null)
  }, [])

  const contextValue = useMemo(() => ({ confirm }), [confirm])

  return (
    <ConfirmDialogContext.Provider value={contextValue}>
      {children}
      <Modal
        open={Boolean(pending)}
        title={pending?.title}
        onClose={() => close(false)}
        footer={
          <>
            <button
              type="button"
              className="h-11 flex-1 rounded-[10px] border border-[#e5e5e5] bg-white text-sm font-bold text-[#564240] transition-colors hover:bg-[#fafafa]"
              onClick={() => close(false)}
            >
              Không
            </button>
            <button
              type="button"
              className="h-11 flex-1 rounded-[10px] bg-[#de3336] text-sm font-bold text-white transition-colors hover:bg-[#c92d30]"
              onClick={() => close(true)}
            >
              Có
            </button>
          </>
        }
      >
        {pending?.description ? (
          <p className="text-sm leading-5 text-[#737373]">{pending.description}</p>
        ) : null}
      </Modal>
    </ConfirmDialogContext.Provider>
  )
}