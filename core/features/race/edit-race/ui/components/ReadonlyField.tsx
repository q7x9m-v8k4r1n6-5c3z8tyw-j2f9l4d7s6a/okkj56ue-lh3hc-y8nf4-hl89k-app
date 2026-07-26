export const ReadonlyField = ({ label, requiredMark, value }: { label: string; requiredMark?: boolean; value?: string }) => (
  <div>
    <span className="mb-2 block text-xs font-semibold uppercase leading-[14px] tracking-[0.15px] text-[#1a1c1c]">
      {label} {requiredMark ? <span className="text-[#de3336]">(*)</span> : null}
    </span>
    <div className="flex h-10 w-full items-center rounded-lg border border-[#e2e2e2] bg-[#fafafa] px-4 text-sm text-[#8a8f98]">
      <span className="min-w-0 truncate">{value || 'Chưa có thông tin'}</span>
    </div>
  </div>
)
