import { ArrowLeftStickIcon } from '@/core/assets'

export type ReturnHeaderProps = {
  title: string
  onBack: () => void
}

export const ReturnHeader = ({ title, onBack }: ReturnHeaderProps) => (
  <div>
    <button
      type="button"
      className="flex h-12 w-full items-center gap-2 px-5 active:underline"
      onClick={onBack}
      aria-label="Quay lại"
    >
      <ArrowLeftStickIcon className="size-3 text-[#323232]" />
      <span className="text-xs font-bold text-[#323232]">{title}</span>
    </button>
  </div>
)