import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ToastContext } from '@/core/shared/ui/Toast/ToastContext'
import { AdminBuildMapView } from './AdminBuildMapView'
import * as raceMapQueryModule from '../model/server/useRaceMapQuery'
import * as uploadMutationModule from '../model/server/useUploadRaceMapMutation'
import * as updateCoordinatesMutationModule from '../model/server/useUpdateBoothCoordinatesMutation'
import * as draftStorageModule from '../model/frontend/useMapDraftStorage'
import type { AdminMapCanvasProps } from './AdminMapCanvas'

let capturedCanvasProps: {
  onToggleLock?: () => void
  isLocked?: boolean
  isSaving?: boolean
  isFrozen?: boolean
} | null = null

vi.mock('./AdminMapCanvas', () => ({
  AdminMapCanvas: (props: AdminMapCanvasProps) => {
    capturedCanvasProps = {
      onToggleLock: props.onToggleLock,
      isLocked: props.isLocked,
      isSaving: props.isSaving,
      isFrozen: props.isFrozen,
    }
    return <div data-testid="mock-admin-map-canvas" />
  },
}))

vi.mock('./MapUploadCanvas', () => ({
  MapUploadCanvas: () => <div data-testid="mock-map-upload-canvas" />,
}))

describe('Adversarial Test Suite 2: Coordinate Locking & Validation Workflow', () => {
  let mockStore: Record<string, string> = {}
  const mockToast = vi.fn().mockReturnValue('toast-1')
  const mockToastContext = {
    toast: mockToast,
    dismiss: vi.fn(),
    dismissAll: vi.fn(),
  }

  const generateBooths = (count: number, placedCount: number) => {
    return Array.from({ length: count }, (_, i) => ({
      boothId: `booth-${i + 1}`,
      boothName: `Trạm ${i + 1}`,
      boothLocation: `Vị trí ${i + 1}`,
      description: `Mô tả ${i + 1}`,
      status: 'free',
      isHidden: false,
      currentTeamName: null,
      currentOrganizerName: null,
      mapX: i < placedCount ? 10 + i * 15 : null,
      mapY: i < placedCount ? 20 + i * 10 : null,
    }))
  }

  beforeEach(() => {
    capturedCanvasProps = null
    mockToast.mockClear()
    mockStore = {}

    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: vi.fn((k: string) => mockStore[k] ?? null),
        setItem: vi.fn((k: string, v: string) => {
          mockStore[k] = v
        }),
        removeItem: vi.fn((k: string) => {
          delete mockStore[k]
        }),
        clear: vi.fn(() => {
          mockStore = {}
        }),
        key: vi.fn(() => null),
        length: 0,
      },
      writable: true,
      configurable: true,
    })

    vi.spyOn(uploadMutationModule, 'useUploadRaceMapMutation').mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof uploadMutationModule.useUploadRaceMapMutation>)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const setupTestHarness = (options: {
    boothsCount: number
    placedCount: number
    updateMutateFn?: ReturnType<typeof vi.fn>
    isLockedDefault?: boolean
    raceStatus?: 'draft' | 'ready' | 'ongoing' | 'paused' | 'completed'
  }) => {
    const booths = generateBooths(options.boothsCount, options.placedCount)

    vi.spyOn(raceMapQueryModule, 'useRaceMapQuery').mockReturnValue({
      mapDetail: {
        id: 'race-lock-1',
        mapImageUrl: 'https://example.com/map.png',
        status: options.raceStatus ?? 'draft',
      },
      mapImageUrl: 'https://example.com/map.png',
      status: options.raceStatus ?? 'draft',
      booths: booths as unknown as ReturnType<typeof raceMapQueryModule.useRaceMapQuery>['booths'],
      isLoadingMap: false,
      isLoadingBooths: false,
      isLoading: false,
      isErrorMap: false,
      isErrorBooths: false,
      isError: false,
      mapError: null,
      boothsError: null,
      refetchMap: vi.fn(),
      refetchBooths: vi.fn(),
    })

    const updateMutate = options.updateMutateFn ?? vi.fn()
    vi.spyOn(updateCoordinatesMutationModule, 'useUpdateBoothCoordinatesMutation').mockReturnValue({
      mutate: updateMutate,
      isPending: false,
    } as unknown as ReturnType<typeof updateCoordinatesMutationModule.useUpdateBoothCoordinatesMutation>)

    renderToStaticMarkup(
      <ToastContext.Provider value={mockToastContext}>
        <AdminBuildMapView
          raceId="race-lock-1"
          raceStatus={options.raceStatus ?? 'draft'}
          isLockedDefault={options.isLockedDefault ?? false}
        />
      </ToastContext.Provider>,
    )

    return { updateMutate }
  }

  it('blocks lock and triggers warning toast when 0 of 6 booths are placed', () => {
    const { updateMutate } = setupTestHarness({
      boothsCount: 6,
      placedCount: 0,
      isLockedDefault: false,
    })

    expect(capturedCanvasProps).not.toBeNull()
    capturedCanvasProps!.onToggleLock?.()

    // Assert Warning Toast
    expect(mockToast).toHaveBeenCalledTimes(1)
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Cảnh báo',
      description: 'Vui lòng kéo và xếp tất cả các trạm vào sơ đồ trước khi khóa!',
      variant: 'warning',
    })

    // Assert Mutation NOT called
    expect(updateMutate).not.toHaveBeenCalled()
  })

  it('blocks lock and triggers warning toast when 5 of 6 booths are placed', () => {
    const { updateMutate } = setupTestHarness({
      boothsCount: 6,
      placedCount: 5,
      isLockedDefault: false,
    })

    expect(capturedCanvasProps).not.toBeNull()
    capturedCanvasProps!.onToggleLock?.()

    // Assert Warning Toast
    expect(mockToast).toHaveBeenCalledTimes(1)
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Cảnh báo',
      description: 'Vui lòng kéo và xếp tất cả các trạm vào sơ đồ trước khi khóa!',
      variant: 'warning',
    })

    // Assert Mutation NOT called
    expect(updateMutate).not.toHaveBeenCalled()
  })

  it('fires PUT mutation with exact payload when 6 of 6 booths are placed', () => {
    const { updateMutate } = setupTestHarness({
      boothsCount: 6,
      placedCount: 6,
      isLockedDefault: false,
    })

    expect(capturedCanvasProps).not.toBeNull()
    capturedCanvasProps!.onToggleLock?.()

    // Assert Mutation called with all 6 booth coordinates rounded
    expect(updateMutate).toHaveBeenCalledTimes(1)
    const [payload, callbacks] = updateMutate.mock.calls[0]
    expect(payload.coordinates).toHaveLength(6)
    expect(payload.coordinates[0]).toEqual({ boothId: 'booth-1', mapX: 10, mapY: 20 })
    expect(payload.coordinates[5]).toEqual({ boothId: 'booth-6', mapX: 85, mapY: 70 })

    // Simulate mutation success
    callbacks.onSuccess()

    // Assert Success Toast
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Thành công',
      description: 'Đã khóa và lưu vị trí các trạm thành công!',
      variant: 'success',
    })
  })

  it('handles mutation failure: displays danger toast without falsely locking or clearing draft prematurely', () => {
    const clearDraftSpy = vi.spyOn(draftStorageModule, 'clearMapDraft')

    const { updateMutate } = setupTestHarness({
      boothsCount: 6,
      placedCount: 6,
      isLockedDefault: false,
    })

    capturedCanvasProps!.onToggleLock?.()

    expect(updateMutate).toHaveBeenCalledTimes(1)
    const [, callbacks] = updateMutate.mock.calls[0]

    // Simulate mutation error
    callbacks.onError(new Error('Network 500: Database write failed'))

    // Assert Danger Toast
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Lưu thất bại',
      description: 'Network 500: Database write failed',
      variant: 'danger',
    })

    // Draft MUST NOT be cleared on failure
    expect(clearDraftSpy).not.toHaveBeenCalled()
  })

  it('unlocks directly without mutation or toast when currently locked', () => {
    const { updateMutate } = setupTestHarness({
      boothsCount: 6,
      placedCount: 6,
      isLockedDefault: true, // Currently locked
    })

    expect(capturedCanvasProps).not.toBeNull()
    capturedCanvasProps!.onToggleLock?.()

    expect(updateMutate).not.toHaveBeenCalled()
    expect(mockToast).not.toHaveBeenCalled()
  })
})
