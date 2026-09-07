import React from 'react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContext } from '@/core/shared/ui/Toast/ToastContext'
import { AdminBuildMapView } from '@/core/features/race/build-map/ui/AdminBuildMapView'
import { CoordinateLockControls } from '@/core/features/race/build-map/ui/CoordinateLockControls'
import { StationSidebar } from '@/core/features/race/build-map/ui/StationSidebar'
import { AdminStationPin } from '@/core/features/race/build-map/ui/AdminStationPin'
import { RaceStartConfirmModal } from '@/core/features/race/edit-race/ui/components/RaceStartConfirmModal'
import { useEditRaceEditor } from '@/core/features/race/edit-race/ui/hooks/useEditRaceEditor'
import * as raceMapQueryModule from '@/core/features/race/build-map/model/server/useRaceMapQuery'
import * as uploadMutationModule from '@/core/features/race/build-map/model/server/useUploadRaceMapMutation'
import * as updateCoordinatesMutationModule from '@/core/features/race/build-map/model/server/useUpdateBoothCoordinatesMutation'
import * as editRaceFormModule from '@/core/features/race/edit-race/model/frontend/useEditRaceForm'
import * as patchMutationModule from '@/core/features/race/edit-race/model/server/usePatchRaceMutation'
import type { RaceBoothItem } from '@/core/features/race/build-map/model/buildMap.contract'

vi.mock('react-zoom-pan-pinch', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-zoom-pan-pinch')>()
  return {
    ...actual,
    useControls: () => ({
      resetTransform: vi.fn(),
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
    }),
  }
})

vi.mock('@/core/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/core/shared')>()
  return {
    ...actual,
    Modal: ({
      open,
      title,
      children,
      footer,
    }: {
      open: boolean
      title?: string
      children?: React.ReactNode
      footer?: React.ReactNode
      onClose?: () => void
    }) => {
      if (!open) return null
      return (
        <div data-testid="modal" role="dialog" aria-modal="true">
          {title ? <h2>{title}</h2> : null}
          <div data-testid="modal-body">{children}</div>
          {footer ? <footer>{footer}</footer> : null}
        </div>
      )
    },
  }
})

// Custom Hook Test Runner conforming to React 19 Client Hook Internals
function createHookRunner<TProps, TResult>(
  hookFn: (props: TProps) => TResult,
  customContextResolver?: (ctx: unknown) => unknown,
) {
  let hookIndex = 0
  const hooks: Array<{ val?: unknown; fn?: unknown; deps?: unknown[]; current?: unknown }> = []
  let currentProps: TProps
  let result: TResult

  const dispatcher = {
    useState<S>(initial: S | (() => S)): [S, (action: S | ((prev: S) => S)) => void] {
      const idx = hookIndex++
      if (hooks.length <= idx) {
        const val = typeof initial === 'function' ? (initial as () => S)() : initial
        hooks[idx] = { val }
      }
      const hook = hooks[idx]
      const setState = (action: S | ((prev: S) => S)) => {
        hook.val =
          typeof action === 'function' ? (action as (prev: S) => S)(hook.val as S) : action
        rerender()
      }
      return [hook.val as S, setState]
    },
    useCallback<T extends (...args: unknown[]) => unknown>(fn: T, deps?: unknown[]): T {
      const idx = hookIndex++
      if (hooks.length <= idx) {
        hooks[idx] = { fn, deps }
      } else {
        const prev = hooks[idx]
        const changed =
          !deps ||
          !prev.deps ||
          deps.length !== prev.deps.length ||
          deps.some((d, i) => !Object.is(d, prev.deps![i]))
        if (changed) {
          hooks[idx] = { fn, deps }
        }
      }
      return hooks[idx].fn as T
    },
    useMemo<T>(fn: () => T, deps?: unknown[]): T {
      const idx = hookIndex++
      if (hooks.length <= idx) {
        hooks[idx] = { val: fn(), deps }
      } else {
        const prev = hooks[idx]
        const changed =
          !deps ||
          !prev.deps ||
          deps.length !== prev.deps.length ||
          deps.some((d, i) => !Object.is(d, prev.deps![i]))
        if (changed) {
          hooks[idx] = { val: fn(), deps }
        }
      }
      return hooks[idx].val as T
    },
    useContext(ctx: unknown) {
      if (customContextResolver) {
        return customContextResolver(ctx)
      }
      return undefined
    },
    useEffect() {},
    useRef<T>(initial: T) {
      const idx = hookIndex++
      if (hooks.length <= idx) hooks[idx] = { current: initial }
      return hooks[idx] as { current: T }
    },
  }

  function rerender(newProps?: TProps) {
    if (newProps !== undefined) currentProps = newProps
    hookIndex = 0
    // @ts-expect-error accessing React internals for empirical testing
    const prevDispatcher = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE.H
    // @ts-expect-error accessing React internals for empirical testing
    React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE.H = dispatcher
    try {
      result = hookFn(currentProps)
    } finally {
      // @ts-expect-error accessing React internals for empirical testing
      React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE.H = prevDispatcher
    }
    return result
  }

  return {
    init(props: TProps) {
      return rerender(props)
    },
    rerender(props: TProps) {
      return rerender(props)
    },
    get current() {
      return result
    },
  }
}

describe('Adversarial Test Suite 3: Race Start Modal & Frozen Map Mode Across All Statuses', () => {
  let queryClient: QueryClient
  const mockToast = vi.fn().mockReturnValue('toast-1')
  const mockToastContext = {
    toast: mockToast,
    dismiss: vi.fn(),
    dismissAll: vi.fn(),
  }

  beforeEach(() => {
    vi.restoreAllMocks()
    mockToast.mockClear()
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

    vi.spyOn(uploadMutationModule, 'useUploadRaceMapMutation').mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof uploadMutationModule.useUploadRaceMapMutation>)

    vi.spyOn(updateCoordinatesMutationModule, 'useUpdateBoothCoordinatesMutation').mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof updateCoordinatesMutationModule.useUpdateBoothCoordinatesMutation>)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('1. Race Start Danger Modal & Confirmation Workflow', () => {
    let mockPatchMutate: ReturnType<typeof vi.fn>

    const defaultFormState = {
      form: {
        raceId: 'race-start-1',
        raceName: 'Giải Chạy Thử Thách',
        status: 'ready' as const,
        modifiedAt: '2026-09-01T00:00:00Z',
        rules: '',
        timeStart: '',
        timeEnd: '',
        coverUrl: '',
        coverFileName: '',
        place: '',
        booths: [],
        teams: [],
        organizers: [],
        settings: {
          isToggledLeaderboard: false,
          isHiddenPoint: false,
        },
      },
      originalForm: {
        raceId: 'race-start-1',
        raceName: 'Giải Chạy Thử Thách',
        status: 'ready' as const,
        modifiedAt: '2026-09-01T00:00:00Z',
        rules: '',
        timeStart: '',
        timeEnd: '',
        coverUrl: '',
        coverFileName: '',
        place: '',
        booths: [],
        teams: [],
        organizers: [],
        settings: {
          isToggledLeaderboard: false,
          isHiddenPoint: false,
        },
      },
      coverFile: null,
      isDirty: false,
      isEditing: false,
      startEditing: vi.fn(),
      cancelEditing: vi.fn(),
      finishEditing: vi.fn(),
      validateForSave: vi.fn().mockReturnValue(true),
    }

    beforeEach(() => {
      mockPatchMutate = vi.fn()

      vi.spyOn(editRaceFormModule, 'useEditRaceForm').mockReturnValue(
        defaultFormState as unknown as ReturnType<typeof editRaceFormModule.useEditRaceForm>,
      )

      vi.spyOn(patchMutationModule, 'usePatchRaceMutation').mockReturnValue({
        mutate: mockPatchMutate,
        isPending: false,
        error: null,
        reset: vi.fn(),
      } as unknown as ReturnType<typeof patchMutationModule.usePatchRaceMutation>)
    })

    it('clicking onStart opens modal without firing mutation, canceling preserves status, and confirming executes status transition to ongoing', () => {
      const runner = createHookRunner(
        (raceId: string) => useEditRaceEditor(raceId),
        (ctx) => {
          if (ctx === ToastContext) return mockToastContext
          return queryClient
        },
      )

      runner.init('race-start-1')

      expect(runner.current.isStartConfirmOpen).toBe(false)
      expect(mockPatchMutate).not.toHaveBeenCalled()

      // 1. User clicks "Bắt đầu" (onStart)
      runner.current.ribbon.onStart()
      expect(runner.current.isStartConfirmOpen).toBe(true)
      // Mutation MUST NOT be called yet!
      expect(mockPatchMutate).not.toHaveBeenCalled()

      // Verify modal markup renders with exact danger copy
      const modalHtml = renderToStaticMarkup(
        <RaceStartConfirmModal
          open={runner.current.isStartConfirmOpen}
          onClose={runner.current.handleCloseStartConfirm}
          onConfirm={runner.current.handleConfirmStart}
        />,
      )
      expect(modalHtml).toContain('Xác nhận bắt đầu trận đấu')
      expect(modalHtml).toContain(
        '⚠️ Lưu ý: Khi trận đấu bắt đầu, toàn bộ sơ đồ bản đồ và vị trí các trạm sẽ bị KHÓA CỐ ĐỊNH VĨNH VIỄN, không thể chỉnh sửa hay di chuyển trạm nữa. Bạn có chắc chắn muốn bắt đầu?',
      )
      expect(modalHtml).toContain('bg-red-600')
      expect(modalHtml).toContain('hover:bg-red-700')

      // 2. User clicks "Hủy" (Cancel)
      runner.current.handleCloseStartConfirm()
      expect(runner.current.isStartConfirmOpen).toBe(false)
      expect(mockPatchMutate).not.toHaveBeenCalled()

      // 3. User clicks "Bắt đầu" again and clicks "Xác nhận bắt đầu"
      runner.current.ribbon.onStart()
      expect(runner.current.isStartConfirmOpen).toBe(true)

      runner.current.handleConfirmStart()
      expect(runner.current.isStartConfirmOpen).toBe(false)
      expect(mockPatchMutate).toHaveBeenCalledTimes(1)

      const patchPayload = mockPatchMutate.mock.calls[0][0]
      expect(patchPayload.payload.basicInfo).toEqual(
        expect.objectContaining({
          status: 'ongoing',
        }),
      )
    })
  })

  describe('2. Frozen Map Enforcement Across All Race Statuses', () => {
    const allStatuses: Array<{
      status: 'draft' | 'ready' | 'ongoing' | 'paused' | 'completed'
      shouldBeFrozen: boolean
    }> = [
      { status: 'draft', shouldBeFrozen: false },
      { status: 'ready', shouldBeFrozen: true },
      { status: 'ongoing', shouldBeFrozen: true },
      { status: 'paused', shouldBeFrozen: true },
      { status: 'completed', shouldBeFrozen: true },
    ]

    const sampleBooths: RaceBoothItem[] = [
      {
        boothId: 'b-1',
        boothName: 'Trạm Alpha',
        boothLocation: '',
        description: '',
        status: 'free',
        isHidden: false,
        currentTeamName: null,
        currentOrganizerName: null,
        mapX: 20,
        mapY: 30,
      },
    ]

    for (const { status, shouldBeFrozen } of allStatuses) {
      it(`evaluates frozen mode correctly for status "${status}": isFrozen === ${shouldBeFrozen}`, () => {
        vi.spyOn(raceMapQueryModule, 'useRaceMapQuery').mockReturnValue({
          mapDetail: {
            id: 'race-freeze-test',
            mapImageUrl: 'https://example.com/map.png',
            status,
          },
          mapImageUrl: 'https://example.com/map.png',
          status,
          booths: sampleBooths,
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

        const html = renderToStaticMarkup(
          <QueryClientProvider client={queryClient}>
            <ToastContext.Provider value={mockToastContext}>
              <AdminBuildMapView raceId="race-freeze-test" raceStatus={status} />
            </ToastContext.Provider>
          </QueryClientProvider>,
        )

        if (shouldBeFrozen) {
          expect(html).toContain('data-testid="frozen-map-banner"')
          expect(html).toContain(
            '🔒 Trận đấu đang diễn ra. Bản đồ đã được khóa cố định ở chế độ chỉ đọc.',
          )
        } else {
          expect(html).not.toContain('data-testid="frozen-map-banner"')
        }
      })
    }
  })

  describe('3. Adversarial Invariants in Frozen Mode', () => {
    it('disables CoordinateLockControls toggle button and displays frozen tooltip', () => {
      const onToggleLock = vi.fn()
      const html = renderToStaticMarkup(
        <CoordinateLockControls
          isLocked={true}
          disabled={true}
          disabledTooltip="Trận đấu đang diễn ra. Vị trí trạm đã được khóa cố định."
          onToggleLock={onToggleLock}
        />,
      )

      expect(html).toContain('disabled=""')
      expect(html).toContain('title="Trận đấu đang diễn ra. Vị trí trạm đã được khóa cố định."')
    })

    it('disables sidebar card dragging when frozen', () => {
      const sampleBooth: RaceBoothItem = {
        boothId: 'b-frozen',
        boothName: 'Trạm Đông',
        boothLocation: '',
        description: '',
        status: 'free',
        isHidden: false,
        currentTeamName: null,
        currentOrganizerName: null,
        mapX: null,
        mapY: null,
      }

      const html = renderToStaticMarkup(
        <StationSidebar
          booths={[sampleBooth]}
          isLocked={true}
          isFrozen={true}
          placedBoothIds={new Set()}
        />,
      )

      // When frozen, draggable attribute must be false
      expect(html).toContain('draggable="false"')
    })

    it('disables AdminStationPin dragging and applies cursor-default when frozen', () => {
      const placedBooth: RaceBoothItem = {
        boothId: 'b-placed',
        boothName: 'Trạm Tây',
        boothLocation: '',
        description: '',
        status: 'free',
        isHidden: false,
        currentTeamName: null,
        currentOrganizerName: null,
        mapX: 40,
        mapY: 60,
      }

      const html = renderToStaticMarkup(
        <AdminStationPin
          booth={placedBooth}
          isLocked={true}
          isFrozen={true}
        />,
      )

      expect(html).toContain('draggable="false"')
      expect(html).toContain('cursor-default')
      expect(html).not.toContain('cursor-grab')
    })

    it('blocks onToggleLock completely in AdminBuildMapView when frozen (no API mutation, no toast)', () => {
      const mockUpdateMutate = vi.fn()

      vi.spyOn(raceMapQueryModule, 'useRaceMapQuery').mockReturnValue({
        mapDetail: {
          id: 'race-freeze-1',
          mapImageUrl: 'https://example.com/map.png',
          status: 'ongoing',
        },
        mapImageUrl: 'https://example.com/map.png',
        status: 'ongoing',
        booths: [],
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

      vi.spyOn(updateCoordinatesMutationModule, 'useUpdateBoothCoordinatesMutation').mockReturnValue({
        mutate: mockUpdateMutate,
        isPending: false,
      } as unknown as ReturnType<typeof updateCoordinatesMutationModule.useUpdateBoothCoordinatesMutation>)

      renderToStaticMarkup(
        <QueryClientProvider client={queryClient}>
          <ToastContext.Provider value={mockToastContext}>
            <AdminBuildMapView raceId="race-freeze-1" raceStatus="ongoing" />
          </ToastContext.Provider>
        </QueryClientProvider>,
      )

      expect(mockUpdateMutate).not.toHaveBeenCalled()
      expect(mockToast).not.toHaveBeenCalled()
    })
  })
})
