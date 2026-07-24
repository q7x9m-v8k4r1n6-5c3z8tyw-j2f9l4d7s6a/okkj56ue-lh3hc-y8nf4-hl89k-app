import { SectionCard } from '@/core/features/race/edit-race/ui/components'

export const PlaceholderTab = ({ label }: { label: string }) => (
  <SectionCard>
    <p className="text-sm text-[#737373]">{label} sẽ được cấu hình ở bước tiếp theo.</p>
  </SectionCard>
)
