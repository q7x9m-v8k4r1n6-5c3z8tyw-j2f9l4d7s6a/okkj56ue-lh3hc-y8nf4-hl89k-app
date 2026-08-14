import type { SentMessage } from '../../model/sendMessage.schema'

type MessageHistoryProps = {
  messages: SentMessage[]
  selectedMessageId: string | null
  onSelectMessage: (messageId: string) => void
}

export const MessageHistory = ({
  messages,
  onSelectMessage,
  selectedMessageId,
}: MessageHistoryProps) => (
  <div className="rounded-lg border border-[#e5e5e5] px-4 py-4 lg:px-6 lg:py-5">
    <div className="divide-y divide-[#f4f4f4]">
      {messages.map((message) => (
        <button
          className={`grid min-h-[68px] w-full grid-cols-[120px_1fr_52px] items-center gap-4 rounded-md px-2 text-left text-sm text-[#737373] transition-colors hover:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#f4b5b7] lg:grid-cols-[280px_1fr_56px] ${selectedMessageId === message.id ? 'bg-[#fef2f2] ring-2 ring-inset ring-[#f4b5b7]' : 'bg-white'}`}
          key={message.id}
          type="button"
          onClick={() => onSelectMessage(message.id)}
        >
          <span className="truncate font-medium text-[#666666]">
            {message.recipients.join(', ')}
          </span>
          <span className="truncate">{message.body}</span>
          <span className="text-right">{message.sentAt}</span>
        </button>
      ))}
      {!messages.length ? (
        <p className="py-10 text-center text-sm text-[#737373]">
          Chưa có tin nhắn nào.
        </p>
      ) : null}
    </div>
  </div>
)
