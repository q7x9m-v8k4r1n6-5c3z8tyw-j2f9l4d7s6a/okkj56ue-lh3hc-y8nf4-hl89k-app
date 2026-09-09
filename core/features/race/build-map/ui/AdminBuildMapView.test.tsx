import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ToastContext } from '@/core/shared/ui/Toast/ToastContext'
import { AdminBuildMapView } from './AdminBuildMapView'
import * as raceMapQueryModule from '../model/server/useRaceMapQuery'
import * as uploadMutationModule from '../model/server/useUploadRaceMapMutation'
import * as updateCoordinatesMutationModule from '../model/server/useUpdateBoothCoordinatesMutation'
import type { MapUploadCanvasProps } from './MapUploadCanvas'
import type { AdminMapCanvasProps } from './AdminMapCanvas'

let capturedCanvasProps: {
  onUpload: (file: File) => void
  onError?: (message: string) => void
  mapImageUrl?: string | null
  onToggleLock?: () => void
  isLocked?: boolean
  isSaving?: boolean
  isFrozen?: boolean
} | null = null

let capturedMapSettingsProps: {
  raceId?: string
  isFrozen?: boolean
  settings?: {
    isShowHiddenBooths?: boolean
    isHideBoothDescription?: boolean
    isDisabledBoothStatus?: boolean
    modifiedAt?: string
  }
} | null = null

vi.mock('./MapSettingsSection', () => ({
  MapSettingsSection: (props: {
    raceId?: string
    isFrozen?: boolean
    settings?: {
      isShowHiddenBooths?: boolean
      isHideBoothDescription?: boolean
      isDisabledBoothStatus?: boolean
      modifiedAt?: string
    }
  }) => {
    capturedMapSettingsProps = props
    return (
      <div data-testid="mock-map-settings-section">
        Cài đặt bản đồ
      </div>
    )
  },
}))

vi.mock('./AdminMapCanvas', () => ({
  AdminMapCanvas: (props: AdminMapCanvasProps) => {
    capturedCanvasProps = {
      onUpload: props.onUploadNewMap ?? (() => {}),
      onError: props.onError,
      mapImageUrl: props.mapImageUrl,
      onToggleLock: props.onToggleLock,
      isLocked: props.isLocked,
      isSaving: props.isSaving,
      isFrozen: props.isFrozen,
    }
    return (
      <div data-testid="mock-admin-map-canvas">
        {props.mapImageUrl ? 'Thay đổi ảnh bản đồ' : 'Thêm ảnh bản đồ'}
        {props.mapImageUrl}
      </div>
    )
  },
}))

vi.mock('./MapUploadCanvas', () => ({
  MapUploadCanvas: (props: MapUploadCanvasProps) => {
    capturedCanvasProps = props
    return (
      <div data-testid="mock-map-upload-canvas">
        {props.mapImageUrl ? 'Thay đổi ảnh bản đồ' : 'Thêm ảnh bản đồ'}
        {props.mapImageUrl}
      </div>
    )
  },
}))

describe('AdminBuildMapView', () => {
  beforeEach(() => {
    capturedCanvasProps = null
    capturedMapSettingsProps = null
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const setupMocks = (options?: {
    mutateFn?: ReturnType<typeof vi.fn>
    updateMutateFn?: ReturnType<typeof vi.fn>
    status?: 'draft' | 'ready' | 'ongoing' | 'paused' | 'completed'
    booths?: Array<{
      boothId: string
      boothName: string
      boothLocation?: string
      description?: string | null
      status?: string
      isHidden?: boolean
      mapX?: number | null
      mapY?: number | null
      currentTeamName?: string | null
      currentOrganizerName?: string | null
    }>
  }) => {
    const booths = (options?.booths ?? [
      {
        boothId: 'b-1',
        boothName: 'Trạm Alpha',
        boothLocation: '',
        description: '',
        status: '',
        isHidden: false,
        currentTeamName: null,
        currentOrganizerName: null,
      },
    ]) as ReturnType<typeof raceMapQueryModule.useRaceMapQuery>['booths']

    vi.spyOn(raceMapQueryModule, 'useRaceMapQuery').mockReturnValue({
      mapDetail: {
        id: 'race-1',
        mapImageUrl: 'https://example.com/map.png',
        status: options?.status ?? 'draft',
      },
      mapImageUrl: 'https://example.com/map.png',
      status: options?.status ?? 'draft',
      booths,
      isLoadingMap: false,
      isLoadingBooths: false,
      isLoading: false,
      isErrorMap: false,
      isErrorBooths: false,
      isError: false,
      mapError: null,
      boothsError: null,
      refetchMap: vi.fn() as unknown as ReturnType<
        typeof raceMapQueryModule.useRaceMapQuery
      >['refetchMap'],
      refetchBooths: vi.fn() as unknown as ReturnType<
        typeof raceMapQueryModule.useRaceMapQuery
      >['refetchBooths'],
    })

    const mutate = options?.mutateFn ?? vi.fn()
    vi.spyOn(uploadMutationModule, 'useUploadRaceMapMutation').mockReturnValue({
      mutate,
      isPending: false,
    } as unknown as ReturnType<
      typeof uploadMutationModule.useUploadRaceMapMutation
    >)

    const updateMutate = options?.updateMutateFn ?? vi.fn()
    vi.spyOn(
      updateCoordinatesMutationModule,
      'useUpdateBoothCoordinatesMutation',
    ).mockReturnValue({
      mutate: updateMutate,
      isPending: false,
    } as unknown as ReturnType<
      typeof updateCoordinatesMutationModule.useUpdateBoothCoordinatesMutation
    >)

    const mockToastContext = {
      toast: vi.fn().mockReturnValue('toast-1'),
      dismiss: vi.fn(),
      dismissAll: vi.fn(),
    }

    return { mutate, updateMutate, mockToastContext }
  }

  it('renders StationSidebar and MapUploadCanvas in a 2-column layout', () => {
    const { mockToastContext } = setupMocks()

    const html = renderToStaticMarkup(
      <ToastContext.Provider value={mockToastContext}>
        <AdminBuildMapView raceId="race-1" />
      </ToastContext.Provider>,
    )

    expect(html).toContain('Danh sách các trạm')
    expect(html).toContain('Trạm Alpha')
    expect(html).toContain('Thay đổi ảnh bản đồ')
    expect(html).toContain('https://example.com/map.png')
  })

  it('warns when upload is triggered without a valid raceId', () => {
    const { mutate, mockToastContext } = setupMocks()

    renderToStaticMarkup(
      <ToastContext.Provider value={mockToastContext}>
        <AdminBuildMapView raceId="" />
      </ToastContext.Provider>,
    )

    expect(capturedCanvasProps).not.toBeNull()

    const file = new File(['valid'], 'map.png', { type: 'image/png' })
    capturedCanvasProps!.onUpload(file)

    expect(mockToastContext.toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Thiếu thông tin trận đấu',
        variant: 'danger',
      }),
    )
    expect(mutate).not.toHaveBeenCalled()
  })

  it('warns when upload file is an unsupported format', () => {
    const { mutate, mockToastContext } = setupMocks()

    renderToStaticMarkup(
      <ToastContext.Provider value={mockToastContext}>
        <AdminBuildMapView raceId="race-1" />
      </ToastContext.Provider>,
    )

    expect(capturedCanvasProps).not.toBeNull()

    const badFile = new File(['bad'], 'document.pdf', {
      type: 'application/pdf',
    })
    capturedCanvasProps!.onUpload(badFile)

    expect(mockToastContext.toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Tệp không hợp lệ',
        variant: 'warning',
      }),
    )
    expect(mutate).not.toHaveBeenCalled()
  })

  it('warns when upload file exceeds 5MB limit', () => {
    const { mutate, mockToastContext } = setupMocks()

    renderToStaticMarkup(
      <ToastContext.Provider value={mockToastContext}>
        <AdminBuildMapView raceId="race-1" />
      </ToastContext.Provider>,
    )

    expect(capturedCanvasProps).not.toBeNull()

    const hugeContent = new Uint8Array(6 * 1024 * 1024)
    const hugeFile = new File([hugeContent], 'huge.png', { type: 'image/png' })
    capturedCanvasProps!.onUpload(hugeFile)

    expect(mockToastContext.toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Tệp không hợp lệ',
        description: 'Kích thước ảnh sơ đồ không được vượt quá 5MB.',
        variant: 'warning',
      }),
    )
    expect(mutate).not.toHaveBeenCalled()
  })

  it('calls mutation when valid image file is uploaded', () => {
    const { mutate, mockToastContext } = setupMocks()

    renderToStaticMarkup(
      <ToastContext.Provider value={mockToastContext}>
        <AdminBuildMapView raceId="race-1" />
      </ToastContext.Provider>,
    )

    expect(capturedCanvasProps).not.toBeNull()

    const validFile = new File(['valid-png'], 'map.png', { type: 'image/png' })
    capturedCanvasProps!.onUpload(validFile)

    expect(mutate).toHaveBeenCalledWith(validFile, expect.any(Object))
    expect(mockToastContext.toast).not.toHaveBeenCalled()
  })

  it('handles canvas onError callback by displaying a warning toast', () => {
    const { mockToastContext } = setupMocks()

    renderToStaticMarkup(
      <ToastContext.Provider value={mockToastContext}>
        <AdminBuildMapView raceId="race-1" />
      </ToastContext.Provider>,
    )

    expect(capturedCanvasProps).not.toBeNull()
    capturedCanvasProps!.onError?.('Chỉ được chọn 1 tệp ảnh sơ đồ trận đấu.')

    expect(mockToastContext.toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Tệp không hợp lệ',
        description: 'Chỉ được chọn 1 tệp ảnh sơ đồ trận đấu.',
        variant: 'warning',
      }),
    )
  })

  it('warns and blocks locking when not all booths are placed on the canvas', () => {
    const { updateMutate, mockToastContext } = setupMocks()

    renderToStaticMarkup(
      <ToastContext.Provider value={mockToastContext}>
        <AdminBuildMapView raceId="race-1" isLockedDefault={false} />
      </ToastContext.Provider>,
    )

    expect(capturedCanvasProps).not.toBeNull()
    capturedCanvasProps!.onToggleLock?.()

    expect(mockToastContext.toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Cảnh báo',
        description: 'Vui lòng kéo và xếp tất cả các trạm vào sơ đồ trước khi khóa!',
        variant: 'warning',
      }),
    )
    expect(updateMutate).not.toHaveBeenCalled()
  })

  it('calls updateBoothCoordinates mutation when locking with 100% booths placed', () => {
    const { updateMutate, mockToastContext } = setupMocks({
      booths: [
        {
          boothId: 'b-1',
          boothName: 'Trạm Alpha',
          isHidden: false,
          mapX: 40,
          mapY: 60,
        },
      ],
    })

    renderToStaticMarkup(
      <ToastContext.Provider value={mockToastContext}>
        <AdminBuildMapView raceId="race-1" isLockedDefault={false} />
      </ToastContext.Provider>,
    )

    expect(capturedCanvasProps).not.toBeNull()
    capturedCanvasProps!.onToggleLock?.()

    expect(updateMutate).toHaveBeenCalledWith(
      {
        coordinates: [{ boothId: 'b-1', mapX: 40, mapY: 60 }],
      },
      expect.any(Object),
    )
  })

  it('shows success toast and clears draft on mutation success callback', () => {
    const { updateMutate, mockToastContext } = setupMocks({
      booths: [
        {
          boothId: 'b-1',
          boothName: 'Trạm Alpha',
          isHidden: false,
          mapX: 40,
          mapY: 60,
        },
      ],
    })

    renderToStaticMarkup(
      <ToastContext.Provider value={mockToastContext}>
        <AdminBuildMapView raceId="race-1" isLockedDefault={false} />
      </ToastContext.Provider>,
    )

    expect(capturedCanvasProps).not.toBeNull()
    capturedCanvasProps!.onToggleLock?.()

    expect(updateMutate).toHaveBeenCalled()
    const mutationCallbacks = updateMutate.mock.calls[0][1] as {
      onSuccess?: () => void
    }
    mutationCallbacks.onSuccess?.()

    expect(mockToastContext.toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Thành công',
        description: 'Đã khóa và lưu vị trí các trạm thành công!',
        variant: 'success',
      }),
    )
  })

  it('shows error toast on mutation error callback', () => {
    const { updateMutate, mockToastContext } = setupMocks({
      booths: [
        {
          boothId: 'b-1',
          boothName: 'Trạm Alpha',
          isHidden: false,
          mapX: 40,
          mapY: 60,
        },
      ],
    })

    renderToStaticMarkup(
      <ToastContext.Provider value={mockToastContext}>
        <AdminBuildMapView raceId="race-1" isLockedDefault={false} />
      </ToastContext.Provider>,
    )

    expect(capturedCanvasProps).not.toBeNull()
    capturedCanvasProps!.onToggleLock?.()

    expect(updateMutate).toHaveBeenCalled()
    const mutationCallbacks = updateMutate.mock.calls[0][1] as {
      onError?: (err: Error) => void
    }
    mutationCallbacks.onError?.(new Error('Lỗi máy chủ kết nối'))

    expect(mockToastContext.toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Lưu thất bại',
        description: 'Lỗi máy chủ kết nối',
        variant: 'danger',
      }),
    )
  })

  it('unlocks without calling mutation when currently locked', () => {
    const { updateMutate, mockToastContext } = setupMocks()

    renderToStaticMarkup(
      <ToastContext.Provider value={mockToastContext}>
        <AdminBuildMapView raceId="race-1" isLockedDefault={true} />
      </ToastContext.Provider>,
    )

    expect(capturedCanvasProps).not.toBeNull()
    capturedCanvasProps!.onToggleLock?.()

    expect(updateMutate).not.toHaveBeenCalled()
    expect(mockToastContext.toast).not.toHaveBeenCalled()
  })

  describe('Frozen Map Mode', () => {
    it('does not render FrozenMapBanner and keeps isFrozen false when status is draft', () => {
      const { mockToastContext } = setupMocks({ status: 'draft' })

      const html = renderToStaticMarkup(
        <ToastContext.Provider value={mockToastContext}>
          <AdminBuildMapView raceId="race-1" raceStatus="draft" />
        </ToastContext.Provider>,
      )

      expect(html).not.toContain('data-testid="frozen-map-banner"')
      expect(capturedCanvasProps).not.toBeNull()
      expect(capturedCanvasProps!.isFrozen).toBe(false)
    })

    it('does not render FrozenMapBanner and keeps isFrozen false when status is ready', () => {
      const { mockToastContext } = setupMocks({ status: 'ready' })

      const html = renderToStaticMarkup(
        <ToastContext.Provider value={mockToastContext}>
          <AdminBuildMapView raceId="race-1" raceStatus="ready" />
        </ToastContext.Provider>,
      )

      expect(html).not.toContain('data-testid="frozen-map-banner"')
      expect(capturedCanvasProps).not.toBeNull()
      expect(capturedCanvasProps!.isFrozen).toBe(false)
    })

    it('allows toggling lock and saving coordinates when status is ready and unlocked', () => {
      const { updateMutate, mockToastContext } = setupMocks({
        status: 'ready',
        booths: [
          {
            boothId: 'b-ready-1',
            boothName: 'Trạm Alpha',
            isHidden: false,
            mapX: 40,
            mapY: 60,
          },
        ],
      })

      renderToStaticMarkup(
        <ToastContext.Provider value={mockToastContext}>
          <AdminBuildMapView
            raceId="race-1"
            raceStatus="ready"
            isLockedDefault={false}
          />
        </ToastContext.Provider>,
      )

      expect(capturedCanvasProps).not.toBeNull()
      expect(capturedCanvasProps!.isFrozen).toBe(false)
      expect(capturedCanvasProps!.isLocked).toBe(false)

      capturedCanvasProps!.onToggleLock?.()
      expect(updateMutate).toHaveBeenCalledWith(
        {
          coordinates: [{ boothId: 'b-ready-1', mapX: 40, mapY: 60 }],
        },
        expect.any(Object),
      )
    })

    it('renders FrozenMapBanner with exact warning message when raceStatus is ongoing', () => {
      const { mockToastContext } = setupMocks()

      const html = renderToStaticMarkup(
        <ToastContext.Provider value={mockToastContext}>
          <AdminBuildMapView raceId="race-1" raceStatus="ongoing" />
        </ToastContext.Provider>,
      )

      expect(html).toContain('data-testid="frozen-map-banner"')
      expect(html).toContain(
        '🔒 Trận đấu đang diễn ra. Bản đồ đã được khóa cố định ở chế độ chỉ đọc.',
      )
      expect(capturedCanvasProps).not.toBeNull()
      expect(capturedCanvasProps!.isFrozen).toBe(true)
      expect(capturedCanvasProps!.isLocked).toBe(true)
    })

    it('renders FrozenMapBanner when status from useRaceMapQuery is ongoing', () => {
      const { mockToastContext } = setupMocks({ status: 'ongoing' })

      const html = renderToStaticMarkup(
        <ToastContext.Provider value={mockToastContext}>
          <AdminBuildMapView raceId="race-1" />
        </ToastContext.Provider>,
      )

      expect(html).toContain('data-testid="frozen-map-banner"')
      expect(capturedCanvasProps).not.toBeNull()
      expect(capturedCanvasProps!.isFrozen).toBe(true)
      expect(capturedCanvasProps!.isLocked).toBe(true)
    })

    it('renders FrozenMapBanner when status is paused or completed', () => {
      const { mockToastContext: toastPaused } = setupMocks({ status: 'paused' })
      const htmlPaused = renderToStaticMarkup(
        <ToastContext.Provider value={toastPaused}>
          <AdminBuildMapView raceId="race-1" />
        </ToastContext.Provider>,
      )
      expect(htmlPaused).toContain('data-testid="frozen-map-banner"')

      const { mockToastContext: toastCompleted } = setupMocks({
        status: 'completed',
      })
      const htmlCompleted = renderToStaticMarkup(
        <ToastContext.Provider value={toastCompleted}>
          <AdminBuildMapView raceId="race-1" />
        </ToastContext.Provider>,
      )
      expect(htmlCompleted).toContain('data-testid="frozen-map-banner"')
    })

    it('blocks toggleLock and does not trigger mutation or toast when frozen', () => {
      const { updateMutate, mockToastContext } = setupMocks()

      renderToStaticMarkup(
        <ToastContext.Provider value={mockToastContext}>
          <AdminBuildMapView raceId="race-1" raceStatus="ongoing" />
        </ToastContext.Provider>,
      )

      expect(capturedCanvasProps).not.toBeNull()
      expect(capturedCanvasProps!.isFrozen).toBe(true)

      // Attempt to toggle lock
      capturedCanvasProps!.onToggleLock?.()

      expect(updateMutate).not.toHaveBeenCalled()
      expect(mockToastContext.toast).not.toHaveBeenCalled()
    })

    it('renders MapSettingsSection and passes raceId, isFrozen and settings', () => {
      const { mockToastContext } = setupMocks()

      const html = renderToStaticMarkup(
        <ToastContext.Provider value={mockToastContext}>
          <AdminBuildMapView raceId="race-test-settings" raceStatus="draft" />
        </ToastContext.Provider>,
      )

      expect(html).toContain('data-testid="mock-map-settings-section"')
      expect(capturedMapSettingsProps).not.toBeNull()
      expect(capturedMapSettingsProps!.raceId).toBe('race-test-settings')
      expect(capturedMapSettingsProps!.isFrozen).toBe(false)
      expect(capturedMapSettingsProps!.settings).toEqual({
        isShowHiddenBooths: false,
        isHideBoothDescription: false,
        isDisabledBoothStatus: false,
        modifiedAt: undefined,
      })
    })
  })
})

