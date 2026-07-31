export const AvatarName = ({ avatarUrl, name }: { avatarUrl?: string | null; name: string }) => (
  <span className="flex min-w-0 items-center gap-3">
    {avatarUrl ? (
      <img src={avatarUrl} alt="" className="size-9 shrink-0 rounded-full object-cover" referrerPolicy="no-referrer" />
    ) : (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fde5e5] text-xs font-semibold text-[#8f1c1e]">
        {name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U'}
      </span>
    )}
    <span className="truncate">{name}</span>
  </span>
)
