import { useBuildMapRaceView } from './hooks/useBuildMapRaceView'
import { MapUploadDropzone } from './components/MapUploadDropzone'
import { AdminMapCanvas } from './components/AdminMapCanvas'
import { StationPaletteSidebar } from './components/StationPaletteSidebar'
import { LockIcon } from '@/core/assets/icons'

/**
 * Main feature view component for Admin Map Builder (Figma Node 1719-1328 & Node 1744-1966).
 * Renders:
 * - 2-Column Layout:
 *   - Left: Station Palette Sidebar ("📋 Danh sách các trạm")
 *   - Right: Map Canvas Area with Zoom/Pan, Upload Dropzone, and Pin D&D Canvas.
 * Note: Per Requirement R4, the top note ribbon is strictly excluded.
 */
export const BuildMapRaceView = () => {
  const view = useBuildMapRaceView()

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Error alert banner */}
      {view.hasImage && view.error && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 shrink-0 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{view.error}</span>
          </div>
          {view.onClearError && (
            <button
              type="button"
              onClick={view.onClearError}
              className="font-medium text-red-600 hover:text-red-800"
            >
              Đóng
            </button>
          )}
        </div>
      )}

      {!view.isDraft && (
        <div className="flex items-center gap-2.5 rounded-lg border border-[#fdcacb] bg-[#fff5f5] p-4 text-sm text-[#c82528]">
          <LockIcon className="size-4 shrink-0" />
          <span>
            Trận đấu đang diễn ra. Sơ đồ bản đồ đã được khóa cố định để đảm bảo
            tính đồng bộ cho các đội chơi.
          </span>
        </div>
      )}

      {/* 2-Column Main Content Layout (Figma Node 1719-1328) */}
      <div className="flex flex-col lg:flex-row items-start gap-4 w-full">
        {/* Left Column: Station Palette Sidebar */}
        <StationPaletteSidebar
          stations={view.stations}
          isLoading={view.isStationsLoading}
          isLocked={view.isLocked}
          selectedStationId={view.selectedStationId}
          onStationSelect={view.onStationSelect}
          onStationRemovePin={view.onStationRemovePin}
        />

        {/* Right Column: Map Canvas Area */}
        <div className="flex-1 min-w-0 w-full flex flex-col">
          {view.isStationsLoading && !view.hasImage ? (
            <div className="flex min-h-[500px] w-full animate-pulse flex-col items-center justify-center rounded-[16px] border border-[#e5e5e5] bg-white p-8">
              <div className="mb-3 h-6 w-6 rounded bg-slate-200" />
              <div className="h-4 w-32 rounded bg-slate-200" />
            </div>
          ) : view.hasImage && view.previewUrl ? (
            <AdminMapCanvas
              previewUrl={view.previewUrl}
              fileName={view.fileName}
              fileSize={view.fileSize}
              stations={view.stations}
              selectedStationId={view.selectedStationId}
              isDirty={view.isDirty}
              isSaving={view.isSaving}
              isLocked={view.isLocked}
              isDraft={view.isDraft}
              isLockSaving={view.isLockSaving}
              onSave={view.onSaveMap}
              onCancel={view.onCancelEdit}
              onRemoveImage={view.onRemoveImage}
              onFileSelect={view.onFileSelect}
              onStationSelect={view.onStationSelect}
              onStationDrop={view.onStationDrop}
              onStationRemovePin={view.onStationRemovePin}
              onToggleLock={view.onToggleLock}
              onClose={view.onClose}
            />
          ) : (
            <div className="flex flex-col gap-3 w-full">
              {view.isDirty && view.persistedUrl && (
                <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-amber-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span>
                      Ảnh bản đồ đã được gỡ khỏi bản xem trước. Bạn có thể chọn
                      ảnh mới hoặc khôi phục lại ảnh đã lưu.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={view.onCancelEdit}
                    className="shrink-0 rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    Khôi phục ảnh cũ
                  </button>
                </div>
              )}
              <MapUploadDropzone
                onFileSelect={view.isLocked ? () => {} : view.onFileSelect}
                error={view.error}
                onClearError={view.onClearError}
                disabled={view.isLocked}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
