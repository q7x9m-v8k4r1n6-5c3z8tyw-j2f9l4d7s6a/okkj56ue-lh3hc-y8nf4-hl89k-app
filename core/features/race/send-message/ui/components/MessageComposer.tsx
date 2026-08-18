import { useEffect, useRef, useState } from 'react'
import { CloseIcon } from '@/core/assets/icons'
import type { MessageRecipient } from '../../model/sendMessage.schema'

type MessageComposerProps = {
  body: string
  canSend: boolean
  isLoadingRecipients: boolean
  isSending: boolean
  recipientErrorMessage: string
  recipientOptions: MessageRecipient[]
  recipientSearch: string
  selectedIds: Set<string>
  selectedRecipients: MessageRecipient[]
  onBodyChange: (value: string) => void
  onRecipientSearchChange: (value: string) => void
  onRecipientToggle: (recipient: MessageRecipient) => void
  onRecipientRemove: (id: string) => void
  onSend: () => void
}

const getRecipientGroupLabel = (recipient: MessageRecipient) => {
  if (recipient.type === 'organizer') return 'Ban tổ chức'
  if (recipient.type === 'team') return 'Đội chơi'
  return 'Nhóm'
}

export const MessageComposer = ({
  body,
  canSend,
  isLoadingRecipients,
  isSending,
  onBodyChange,
  onRecipientRemove,
  onRecipientSearchChange,
  onRecipientToggle,
  onSend,
  recipientErrorMessage,
  recipientOptions,
  recipientSearch,
  selectedIds,
  selectedRecipients,
}: MessageComposerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const bodyInputRef = useRef<HTMLTextAreaElement>(null)
  const recipientPickerRef = useRef<HTMLDivElement>(null)

  const focusBodyInput = () => {
    window.requestAnimationFrame(() => {
      bodyInputRef.current?.focus()
    })
  }

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (recipientPickerRef.current?.contains(target)) return

      setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isOpen])

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_126px]">
      <div ref={recipientPickerRef} className="relative">
        <div
          aria-expanded={isOpen}
          aria-label="Gửi đến"
          className="flex min-h-[50px] w-full items-center rounded-lg border border-[#e5e5e5] px-3 text-left text-base text-[#323232] outline-none transition-colors focus:border-[#de3336]"
          role="button"
          tabIndex={0}
          onClick={() => setIsOpen((current) => !current)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return
            event.preventDefault()
            setIsOpen((current) => !current)
          }}
        >
          {selectedRecipients.length ? (
            <span className="flex min-w-0 flex-wrap gap-2 py-2">
              {selectedRecipients.map((recipient) => (
                <span
                  className="inline-flex max-w-[220px] items-center gap-1 rounded-full bg-[#f4f4f4] px-2.5 py-1 text-sm font-medium text-[#525252]"
                  key={recipient.id}
                >
                  <span className="truncate">{recipient.label}</span>
                  <button
                    aria-label={`Xóa ${recipient.label}`}
                    className="flex size-4 items-center justify-center rounded-full text-[#737373] hover:text-[#de3336]"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onRecipientRemove(recipient.id)
                    }}
                  >
                    <CloseIcon className="size-3" />
                  </button>
                </span>
              ))}
            </span>
          ) : (
            <span className="text-[#98a2b3]">Gửi đến:</span>
          )}
        </div>

        {isOpen ? (
          <div className="absolute z-20 mt-2 max-h-[360px] w-full overflow-hidden rounded-lg border border-[#e5e5e5] bg-white shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
            <div className="border-b border-[#eeeeee] p-3">
              <input
                autoFocus
                className="h-10 w-full rounded-md border border-[#eeeeee] px-3 text-sm text-[#323232] outline-none placeholder:text-[#98a2b3] focus:border-[#de3336]"
                placeholder="Tìm người nhận"
                value={recipientSearch}
                onChange={(event) => onRecipientSearchChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' || event.nativeEvent.isComposing) return

                  event.preventDefault()
                  setIsOpen(false)
                  focusBodyInput()
                }}
              />
              {recipientErrorMessage ? (
                <p className="mt-2 text-xs text-[#de3336]">{recipientErrorMessage}</p>
              ) : null}
            </div>

            <div className="max-h-[286px] overflow-y-auto py-2">
              {isLoadingRecipients ? (
                <p className="px-4 py-8 text-center text-sm text-[#737373]">
                  Đang tải người nhận...
                </p>
              ) : recipientOptions.length ? (
                recipientOptions.map((recipient) => (
                  <button
                    className="grid w-full grid-cols-[20px_1fr_auto] items-center gap-3 px-4 py-2.5 text-left hover:bg-[#fafafa]"
                    key={recipient.id}
                    type="button"
                    onClick={() => onRecipientToggle(recipient)}
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter') return

                      event.preventDefault()
                      if (!selectedIds.has(recipient.id)) {
                        onRecipientToggle(recipient)
                      }
                      setIsOpen(false)
                      focusBodyInput()
                    }}
                  >
                    <span
                      className={`flex size-5 items-center justify-center rounded border ${selectedIds.has(recipient.id) ? 'border-[#de3336] bg-[#de3336]' : 'border-[#d4d4d4] bg-white'}`}
                    >
                      {selectedIds.has(recipient.id) ? (
                        <span className="h-2 w-3 rotate-[-45deg] border-b-2 border-l-2 border-white" />
                      ) : null}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-[#323232]">
                        {recipient.label}
                      </span>
                      {recipient.description ? (
                        <span className="block truncate text-xs text-[#737373]">
                          {recipient.description}
                        </span>
                      ) : null}
                    </span>
                    <span className="rounded-full bg-[#f4f4f4] px-2 py-1 text-xs text-[#737373]">
                      {getRecipientGroupLabel(recipient)}
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-4 py-8 text-center text-sm text-[#737373]">
                  Không tìm thấy người nhận.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <button
        className="h-[50px] rounded-lg bg-[#de3336] px-6 text-base font-bold text-white transition-colors hover:bg-[#c92c2f] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!canSend}
        type="button"
        onClick={onSend}
      >
        {isSending ? 'Đang gửi...' : 'Gửi'}
      </button>
      <textarea
        aria-label="Soạn tin nhắn"
        ref={bodyInputRef}
        className="min-h-[290px] resize-none rounded-lg border border-[#e5e5e5] px-3 py-3 text-base text-[#323232] outline-none transition-colors placeholder:text-[#98a2b3] focus:border-[#de3336] lg:col-span-2 xl:min-h-[326px]"
        placeholder="Soạn tin nhắn"
        value={body}
        onChange={(event) => onBodyChange(event.target.value)}
      />
    </div>
  )
}
