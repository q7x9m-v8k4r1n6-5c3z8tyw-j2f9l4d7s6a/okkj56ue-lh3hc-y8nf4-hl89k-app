import { PlusIcon } from '@/core/assets'

export type AddEvidenceCardProps = {
  onClick: () => void
}

export const AddEvidenceCard = ({ onClick }: AddEvidenceCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex aspect-[9/16] w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#a6a6a6] bg-white transition-colors hover:bg-gray-50 active:scale-95"
  >
    <PlusIcon className="size-7 text-[#111111]" />
    <span className="text-xs font-medium text-[#111111]">Tạo mới</span>
  </button>
)