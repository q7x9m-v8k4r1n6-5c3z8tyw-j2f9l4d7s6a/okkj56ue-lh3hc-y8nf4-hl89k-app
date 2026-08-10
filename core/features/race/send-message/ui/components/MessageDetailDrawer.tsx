import type { ReactNode } from 'react'
import { Drawer } from '@/core/shared'
import type { SentMessage } from '../../model/sendMessage.schema'

type MessageDetailDrawerProps = {
  message: SentMessage | null
  onClose: () => void
}

const DetailField = ({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) => (
  <div className="flex flex-col gap-2">
    <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#737373]">
      {label}
    </span>
    <div className="text-[15px] leading-6 text-[#323232]">{children}</div>
  </div>
)

export const MessageDetailDrawer = ({
  message,
  onClose,
}: MessageDetailDrawerProps) => (
  <Drawer
    open={Boolean(message)}
    panelClassName="!max-w-[560px]"
    title="Chi tiết tin nhắn"
    onClose={onClose}
  >
    {message ? (
      <div className="flex flex-col gap-6">
        <div className="rounded-xl border border-[#eeeeee] bg-[#fafafa] px-5 py-4">
          <p className="text-sm font-medium text-[#737373]">Nội dung</p>
          <p className="mt-3 whitespace-pre-wrap text-[16px] leading-7 text-[#323232]">
            {message.body}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <DetailField label="Người gửi">
            <span className="font-semibold">{message.senderName}</span>
          </DetailField>

          <DetailField label="Người nhận">
            <div className="flex flex-wrap gap-2">
              {message.recipients.map((recipient) => (
                <span
                  className="rounded-full bg-[#f4f4f4] px-3 py-1 text-sm font-medium text-[#525252]"
                  key={recipient}
                >
                  {recipient}
                </span>
              ))}
            </div>
          </DetailField>

          <DetailField label="Thời gian gửi">
            <span>{message.sentAtFull}</span>
          </DetailField>
        </div>
      </div>
    ) : null}
  </Drawer>
)
