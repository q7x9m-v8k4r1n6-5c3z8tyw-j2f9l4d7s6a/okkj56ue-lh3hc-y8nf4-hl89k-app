import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { useTeamMap } from '../model/frontend/useTeamMap'
import { mockTeamMapData } from '../model/mockMapData'
import { MapFloatingControls } from './components/MapFloatingControls'
import { StationPinItem } from './components/StationPinItem'
import { StationDetailSheet } from './components/StationDetailSheet'

export const TeamMapView = () => {
  const { selectedStationId, selectStation, clearSelection } = useTeamMap()
  
  const mapData = mockTeamMapData
  const selectedStation = mapData.stations.find((s) => s.id === selectedStationId)

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
            onKeyDown={(e) => {
              if (e.key === 'Escape') clearSelection()
            }}
            role="button"
            tabIndex={0}
          >
            <img 
              src={mapData.backgroundImageUrl} 
              alt="Bản đồ" 
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
