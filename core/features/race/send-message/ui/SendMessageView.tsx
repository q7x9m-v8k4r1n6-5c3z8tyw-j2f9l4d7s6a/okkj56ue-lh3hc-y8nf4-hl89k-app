import { HistoryIcon, MailIcon } from '@/core/assets/icons'
import { useSendMessageState } from '../model/frontend/useSendMessageState'
import { MessageComposer } from './components/MessageComposer'
import { MessageDetailDrawer } from './components/MessageDetailDrawer'
import { MessageHistory } from './components/MessageHistory'
import { MessageSectionHeader } from './components/MessageSectionHeader'

/** Renders the race-detail message composition workflow. */
export const SendMessageView = () => {
  const message = useSendMessageState()

  return (
    <section className="flex min-h-full flex-col gap-4">
      <div className="flex flex-col gap-3">
        <MessageSectionHeader
          icon={<MailIcon className="size-5" />}
          title="Soạn tin nhắn"
        />
        <MessageComposer
          body={message.body}
          canSend={message.canSend}
          isLoadingRecipients={message.isLoadingRecipients}
          isSending={message.isSending}
          recipientErrorMessage={message.recipientErrorMessage}
          recipientOptions={message.recipientOptions}
          recipientSearch={message.recipientSearch}
          selectedIds={message.selectedIds}
          selectedRecipients={message.selectedRecipients}
          onBodyChange={message.setBody}
          onRecipientRemove={message.removeRecipient}
          onRecipientSearchChange={message.setRecipientSearch}
          onRecipientToggle={message.toggleRecipient}
          onSend={message.send}
        />
        {message.sendErrorMessage ? (
          <p className="text-sm font-medium text-[#de3336]">
            {message.sendErrorMessage}
          </p>
        ) : null}
      </div>

      <div className="mt-1 flex flex-col gap-3">
        <MessageSectionHeader
          icon={<HistoryIcon className="size-[18px]" />}
          title="Lịch sử tin nhắn"
        />
        {message.messageErrorMessage ? (
          <p className="rounded-lg border border-[#fee2e2] bg-[#fef2f2] px-4 py-3 text-sm font-medium text-[#de3336]">
            {message.messageErrorMessage}
          </p>
        ) : (
          <MessageHistory
            messages={message.messages}
            selectedMessageId={message.selectedMessageId}
            onSelectMessage={message.openMessageDetail}
          />
        )}
      </div>

      <MessageDetailDrawer
        message={message.selectedMessage}
        onClose={message.closeMessageDetail}
      />
    </section>
  )
}
