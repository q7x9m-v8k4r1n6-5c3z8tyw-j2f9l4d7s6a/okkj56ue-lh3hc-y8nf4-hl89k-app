export type SkeletonProps = {
  className?: string
  lines?: number
}

export const Skeleton = ({ className = '', lines = 1 }: SkeletonProps) => (
  <div className={`grid gap-2 ${className}`} aria-hidden="true">
    {Array.from({ length: lines }, (_, index) => (
      <div key={index} className={`h-3 animate-pulse rounded bg-[#eeeeee] ${index === lines - 1 && lines > 1 ? 'w-2/3' : 'w-full'}`} />
    ))}
  </div>
)
