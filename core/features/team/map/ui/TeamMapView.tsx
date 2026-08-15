import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { MapFloatingControls } from './components/MapFloatingControls'
import { StationPinItem } from './components/StationPinItem'
import { TeamMapEmptyState } from './components/TeamMapEmptyState'
import { useTeamMapView } from './hooks/useTeamMapView'

/**
 * Team Interactive Map View.
 * Renders full-screen pan-and-zoom map canvas with station pins and floating bubble cards.
 * Bottom sheet is removed to keep the bottom area completely clean for navigation.
 */
export const TeamMapView = () => {
  const {
    isLoading,
    isError,
    isEmpty,
    mapImageUrl,
    stations,
    selectedStationId,
    selectStation,
    clearSelection,
    refetch,
  } = useTeamMapView()

  if (isLoading) {
    return (
      <section
        className="flex h-[calc(100svh-137px)] w-full flex-col items-center justify-center bg-[#f9fafb] p-6 text-center"
        aria-label="Đang tải bản đồ"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-3 border-[#de3336] border-t-transparent" />
          <p className="text-sm font-medium text-[#737373]">Đang tải bản đồ trận đấu...</p>
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section
        className="flex h-[calc(100svh-137px)] w-full flex-col items-center justify-center p-6 text-center bg-[#f9fafb]"
        aria-label="Lỗi tải bản đồ"
      >
        <div className="flex max-w-[320px] flex-col items-center gap-3 rounded-2xl border border-[#fecaca] bg-[#fef2f2] p-6 shadow-xs">
          <p className="text-sm font-medium text-[#dc2626]">
            Không thể tải thông tin bản đồ trận đấu.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-xl bg-[#de3336] px-4 py-2 text-sm font-medium text-white hover:bg-[#b91c1c] transition-colors cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      </section>
    )
  }

  if (isEmpty || !mapImageUrl) {
    return <TeamMapEmptyState onRetry={() => void refetch()} />
  }

  return (
    <section
      className="relative flex h-[calc(100svh-137px)] w-full flex-col overflow-hidden bg-[#e5e5e5]"
      aria-label="Bản đồ trận đấu"
    >
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={4}
        centerOnInit
        limitToBounds={false}
      >
        <MapFloatingControls />
        <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
          {/* Interactive map surface */}
          <div
            className="relative h-full w-full select-none"
            onClick={clearSelection}
            onKeyDown={(e) => {
              if (e.key === 'Escape') clearSelection()
            }}
            role="button"
            tabIndex={0}
          >
            <img
              src={mapImageUrl}
              alt="Bản đồ trận đấu"
              className="pointer-events-none h-full w-full object-cover select-none"
            />

            {/* Placed Station Pins Overlay with Floating Bubbles */}
            {stations.map((pin) => (
              <StationPinItem
                key={pin.id}
                pin={pin}
                isSelected={pin.id === selectedStationId}
                onClick={selectStation}
              />
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </section>
  )
}
