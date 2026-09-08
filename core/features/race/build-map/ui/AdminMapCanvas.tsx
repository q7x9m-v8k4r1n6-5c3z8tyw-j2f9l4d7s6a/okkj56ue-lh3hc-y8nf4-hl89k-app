import React, { useRef } from 'react'
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchContentRef,
  type ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch'
import { UploadIcon } from '@/core/assets/icons'
import { Button } from '@/core/shared'
import type { RaceBoothItem } from '../model/buildMap.contract'
import { calculatePinCoordinates } from '../model/calculatePinCoordinates'
import { validateDroppedFiles } from '../model/buildMap.validation'
import { AdminStationPin } from './AdminStationPin'
import { CoordinateLockControls } from './CoordinateLockControls'

export interface AdminMapCanvasProps {
  mapImageUrl?: string | null
  placedBooths?: RaceBoothItem[]
  isLocked?: boolean
  isFrozen?: boolean
  onPlacePin?: (boothId: string, mapX: number, mapY: number) => void
  onMovePin?: (boothId: string, mapX: number, mapY: number) => void
  onUnplacePin?: (boothId: string) => void
  onUploadNewMap?: (file: File) => void
  onError?: (message: string) => void
  isUploading?: boolean
  onToggleLock?: () => void
  isSaving?: boolean
  className?: string
}

/**
 * Admin Map Canvas container supporting zoom/pan (TransformWrapper),
 * Teardrop SVG station pin rendering, drop detection for pin placement and repositioning,
 * and optional map image replacement.
 * Bottom zoom instruction hint bubble has been completely eliminated.
 */
export const AdminMapCanvas: React.FC<AdminMapCanvasProps> = ({
  mapImageUrl,
  placedBooths = [],
  isLocked = true,
  isFrozen = false,
  onPlacePin,
  onMovePin,
  onUnplacePin,
  onUploadNewMap,
  onError,
  isUploading = false,
  onToggleLock,
  isSaving = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const transformRef = useRef<ReactZoomPanPinchContentRef | null>(null)
  const transformStateRef = useRef<{ scale: number; positionX: number; positionY: number }>({
    scale: 1,
    positionX: 0,
    positionY: 0,
  })

  const canEditPins = !isLocked && !isFrozen

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!canEditPins) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!canEditPins) return

    let boothId = ''
    let source = 'sidebar'

    try {
      const rawJson = e.dataTransfer.getData('application/json')
      if (rawJson) {
        const parsed = JSON.parse(rawJson)
        if (parsed.boothId) boothId = parsed.boothId
        if (parsed.source) source = parsed.source
      }
    } catch {
      // Ignore JSON parse error
    }

    if (!boothId) {
      boothId = e.dataTransfer.getData('text/plain')
    }
    if (!boothId) return

    const containerRect = containerRef.current?.getBoundingClientRect() ?? {
      left: 0,
      top: 0,
      width: 800,
      height: 600,
    }

    const unscaledWidth = contentRef.current?.offsetWidth || containerRect.width || 800
    const unscaledHeight = contentRef.current?.offsetHeight || containerRect.height || 600

    const scale = transformStateRef.current.scale || 1
    const positionX = transformStateRef.current.positionX || 0
    const positionY = transformStateRef.current.positionY || 0

    const { mapX, mapY } = calculatePinCoordinates({
      clientX: e.clientX,
      clientY: e.clientY,
      mapRect: {
        left: containerRect.left,
        top: containerRect.top,
        width: unscaledWidth,
        height: unscaledHeight,
      },
      positionX,
      positionY,
      scale,
    })

    if (source === 'canvas') {
      onMovePin?.(boothId, mapX, mapY)
    } else {
      onPlacePin?.(boothId, mapX, mapY)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validation = validateDroppedFiles(e.target.files)
    if (!validation.valid) {
      onError?.(validation.error ?? 'Tệp tin không hợp lệ.')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    if (validation.file && onUploadNewMap) {
      onUploadNewMap(validation.file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div
      ref={containerRef}
      data-testid="admin-map-canvas"
      className={`relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[10px] border border-[#e5e5e5] bg-white min-h-[380px] lg:min-h-0 w-full ${className}`}
    >
      {/* Hidden file picker for map replacement */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        aria-label="Thay đổi ảnh sơ đồ trận đấu"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Button to replace map image */}
      {onUploadNewMap && mapImageUrl && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isFrozen}
            leadingIcon={<UploadIcon className="size-4" />}
            className="outline-none focus-visible:ring-2 focus-visible:ring-[#de3336] focus-visible:ring-offset-2"
          >
            Thay đổi ảnh bản đồ
          </Button>
        </div>
      )}

      {/* Interactive zoom/pan wrapper */}
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={1}
        maxScale={4}
        centerOnInit
        limitToBounds={false}
        onTransform={(ref: ReactZoomPanPinchRef) => {
          transformStateRef.current = {
            scale: ref.state.scale,
            positionX: ref.state.positionX,
            positionY: ref.state.positionY,
          }
        }}
      >
        {/* 4-Button Floating Controls */}
        <CoordinateLockControls
          isLocked={isLocked}
          onToggleLock={onToggleLock ?? (() => {})}
          isSaving={isSaving}
          disabled={isFrozen}
          disabledTooltip="Trận đấu đang diễn ra. Vị trí trạm đã được khóa cố định."
        />

        <TransformComponent
          wrapperClass="!w-full !h-full"
          contentClass="!w-full !h-full"
        >
          <div
            ref={contentRef}
            data-testid="admin-map-canvas-content"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="relative size-full select-none"
          >
            {mapImageUrl && (
              <img
                ref={imageRef}
                src={mapImageUrl}
                alt="Sơ đồ trận đấu"
                className="pointer-events-none size-full object-contain"
              />
            )}

            {/* Pins overlay container */}
            <div
              data-testid="admin-pins-layer"
              className="absolute inset-0 size-full pointer-events-none"
            >
              {placedBooths.map((booth) => (
                <AdminStationPin
                  key={booth.boothId}
                  booth={booth}
                  isLocked={isLocked}
                  isFrozen={isFrozen}
                  mapWrapperRef={containerRef}
                  onUnplaceStation={onUnplacePin}
                />
              ))}
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}
