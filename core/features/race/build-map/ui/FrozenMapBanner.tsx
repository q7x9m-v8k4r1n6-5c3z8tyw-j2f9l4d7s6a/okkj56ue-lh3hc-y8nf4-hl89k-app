import React from 'react'

export interface FrozenMapBannerProps {
  className?: string
  message?: string
}

/**
 * Static warning banner rendered when a race is not in 'draft' status (e.g. ongoing, paused, completed).
 * Informs the user that the map is frozen in read-only mode and booth coordinates are locked.
 */
export const FrozenMapBanner: React.FC<FrozenMapBannerProps> = ({
  className = '',
  message = '🔒 Trận đấu đang diễn ra. Bản đồ đã được khóa cố định ở chế độ chỉ đọc.',
}) => {
  return (
    <div
      data-testid="frozen-map-banner"
      role="status"
      className={`flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 shadow-xs ${className}`}
    >
      <span>{message}</span>
    </div>
  )
}
