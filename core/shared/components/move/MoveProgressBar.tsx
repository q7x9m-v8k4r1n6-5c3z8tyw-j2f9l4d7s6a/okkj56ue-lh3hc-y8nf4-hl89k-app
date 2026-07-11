export const MoveProgressBar = ({ className = '', size = 'sm', value }: { value: number; size?: 'sm' | 'lg'; className?: string }) => {
  const safeValue = Math.max(0, Math.min(100, value))

  return (
    <div className={`overflow-hidden rounded-full bg-[#f2e7e4] ${size === 'lg' ? 'h-3' : 'h-2'} ${className}`}>
      <div className="h-full rounded-full bg-[linear-gradient(90deg,#f97316,#ef4444)] transition-[width]" style={{ width: `${safeValue}%` }} />
    </div>
  )
}
