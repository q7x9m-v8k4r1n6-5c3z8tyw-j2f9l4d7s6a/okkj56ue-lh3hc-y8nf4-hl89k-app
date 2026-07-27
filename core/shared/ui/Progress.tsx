export type ProgressProps = {
  className?: string
  value: number
  max: number
  label?: string
  showSteps?: boolean
}

export const Progress = ({ className = '', label, max, showSteps = true, value }: ProgressProps) => {
  const safeMax = Math.max(max, 1)
  const safeValue = Math.min(Math.max(value, 0), safeMax)
  const percentage = (safeValue / safeMax) * 100

  return (
    <div className={`w-full ${className}`}>
      {label || showSteps ? <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span className="font-medium text-[#525252]">{label}</span>
        {showSteps ? <span><strong className="font-medium text-[#de3336]">Step {safeValue}</strong><span className="text-[#737373]"> of {safeMax}</span></span> : null}
      </div> : null}
      <div className="h-2 overflow-hidden rounded-full bg-[#e4e7f6]" role="progressbar" aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={safeValue}>
        <div className="h-full rounded-full bg-[#de3336] transition-[width] duration-300" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
