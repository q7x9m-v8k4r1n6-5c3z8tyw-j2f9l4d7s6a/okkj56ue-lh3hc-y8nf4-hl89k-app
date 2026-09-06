import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ToastContext } from '@/core/shared/ui/Toast/ToastContext'
import { AdminBuildMapView } from './AdminBuildMapView'
import * as raceMapQueryModule from '../model/server/useRaceMapQuery'
import * as uploadMutationModule from '../model/server/useUploadRaceMapMutation'
import type { MapUploadCanvasProps } from './MapUploadCanvas'

// Mock MapUploadCanvas to capture callbacks passed from AdminBuildMapView
let capturedCanvasProps: MapUploadCanvasProps | null = null

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
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const setupMocks = (options?: { mutateFn?: ReturnType<typeof vi.fn> }) => {
    vi.spyOn(raceMapQueryModule, 'useRaceMapQuery').mockReturnValue({
      mapDetail: { id: 'race-1', mapImageUrl: 'https://example.com/map.png' },
      mapImageUrl: 'https://example.com/map.png',
      booths: [
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
      ],
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

    const mockToastContext = {
      toast: vi.fn().mockReturnValue('toast-1'),
      dismiss: vi.fn(),
      dismissAll: vi.fn(),
    }

    return { mutate, mockToastContext }
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
})
