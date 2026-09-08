import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { Spinner } from '@/core/shared/ui/Spinner'
import { useTeamMap } from '../model/frontend/useTeamMap'
import { mapRaceDetailToMapData } from '../model/teamMap.mapper'
import { useTeamMapQuery } from '../model/server/useTeamMapQuery'
import { MapFloatingControls } from './components/MapFloatingControls'
import { StationPinItem } from './components/StationPinItem'
import { StationDetailSheet } from './components/StationDetailSheet'

export interface TeamMapViewProps {
  raceId?: string
}

export const TeamMapView = ({ raceId: propRaceId }: TeamMapViewProps = {}) => {
  const params = useParams<{ raceId: string }>()
  const raceId = propRaceId ?? params.raceId
  const { data, isLoading, isError } = useTeamMapQuery(raceId)
  const { selectedStationId, selectStation, clearSelection } = useTeamMap()
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null)
  const [prevRaceId, setPrevRaceId] = useState(raceId)

  // Reset failed image tracking and station selection if raceId changes
  if (raceId !== prevRaceId) {
    setPrevRaceId(raceId)
    setFailedImageUrl(null)
    clearSelection()
  }

  const mapData = useMemo(() => mapRaceDetailToMapData(data), [data])
  const selectedStation = selectedStationId
    ? mapData.stations.find((s) => s.id === selectedStationId) ?? null
    : null

  const isImageBroken = Boolean(
    mapData.backgroundImageUrl && failedImageUrl === mapData.backgroundImageUrl,
  )

  if (isLoading) {
    return (
      <section
        className="relative flex h-[calc(100svh-137px)] w-full flex-col items-center justify-center overflow-hidden bg-[#e5e5e5]"
        aria-label="Bản đồ trận đấu"
      >
        <div className="flex flex-col items-center justify-center p-6 text-center text-sm text-[#737373]">
          <Spinner size="lg" label="Đang tải sơ đồ bản đồ..." />
        </div>
      </section>
    )
  }

  if (isError || !mapData.backgroundImageUrl || isImageBroken) {
    return (
      <section
        className="relative flex h-[calc(100svh-137px)] w-full flex-col items-center justify-center overflow-hidden bg-[#e5e5e5]"
        aria-label="Bản đồ trận đấu"
      >
        <div className="flex flex-col items-center justify-center p-6 text-center text-sm text-[#737373]">
          <p>Ban tổ chức chưa công bố sơ đồ bản đồ trận đấu.</p>
        </div>
      </section>
    )
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
          {/* Vùng Map có thể tương tác */}
          <div 
            className="relative h-full w-full"
            onClick={clearSelection}
          >
            <img 
              src={mapData.backgroundImageUrl} 
              alt="Bản đồ" 
              onError={() => setFailedImageUrl(mapData.backgroundImageUrl)}
              className="pointer-events-none h-full w-full object-cover"
            />
            
            {/* Pins Overlay */}
            {mapData.stations.map((pin) => (
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

      {/* Hiển thị Bottom Sheet khi chọn 1 trạm (luôn render để chạy animation) */}
      <StationDetailSheet 
        pin={selectedStation || null} 
        onClose={clearSelection} 
      />
    </section>
  )
}
