import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { StationSidebar } from './StationSidebar'
import type { RaceBoothItem } from '../model/buildMap.contract'

describe('StationSidebar', () => {
  const mockBooths: RaceBoothItem[] = [
    {
      boothId: 'b-1',
      boothName: 'Trạm 1 - Khởi động',
      boothLocation: 'Khu A',
      description: 'Mô tả trạm 1',
      status: 'active',
      isHidden: false,
    },
    {
      boothId: 'b-2',
      boothName: 'Trạm 2 - Bí mật',
      boothLocation: 'Khu B',
      description: 'Mô tả trạm 2',
      status: 'active',
      isHidden: true,
    },
  ]

  it('renders header with title and format list icon', () => {
    const html = renderToStaticMarkup(<StationSidebar booths={mockBooths} />)
    expect(html).toContain('Danh sách các trạm')
  })

  it('renders list of booths with names and correct badges', () => {
    const html = renderToStaticMarkup(<StationSidebar booths={mockBooths} />)
    expect(html).toContain('Trạm 1 - Khởi động')
    expect(html).toContain('Trạm thường')
    expect(html).toContain('Trạm 2 - Bí mật')
    expect(html).toContain('Trạm ẩn')
    // Hidden station badge should use subtle gray styling instead of amber
    expect(html).toContain('bg-neutral-100')
    expect(html).toContain('text-neutral-600')
    expect(html).toContain('border-neutral-200')
  })

  it('renders loading skeleton when isLoading is true', () => {
    const html = renderToStaticMarkup(
      <StationSidebar booths={[]} isLoading={true} />,
    )
    expect(html).toContain('animate-pulse')
    expect(html).not.toContain('Chưa có trạm nào trong trận đấu.')
  })

  it('renders error message and retry button when isError is true', () => {
    const html = renderToStaticMarkup(
      <StationSidebar booths={[]} isError={true} onRetry={() => {}} />,
    )
    expect(html).toContain('Không thể tải danh sách trạm.')
    expect(html).toContain('Thử lại')
  })

  it('renders empty message when no booths are present', () => {
    const html = renderToStaticMarkup(<StationSidebar booths={[]} />)
    expect(html).toContain('Chưa có trạm nào trong trận đấu.')
  })

  it('renders long booth name with break-words styling', () => {
    const longBooth: RaceBoothItem = {
      boothId: 'b-long',
      boothName: 'Trạm Rất Dài Với Tên Vượt Quá Độ Rộng Tiêu Chuẩn Của Khung Sidebar',
      boothLocation: '',
      description: '',
      status: '',
      isHidden: false,
    }
    const html = renderToStaticMarkup(<StationSidebar booths={[longBooth]} />)
    expect(html).toContain('Trạm Rất Dài')
    expect(html).toContain('break-words')
  })

  it('renders placed badge and counter for placed stations', () => {
    const placedSet = new Set(['b-1'])
    const html = renderToStaticMarkup(
      <StationSidebar
        booths={mockBooths}
        placedBoothIds={placedSet}
        isLocked={false}
      />,
    )

    expect(html).toContain('✓ Đã đặt trên bản đồ')
    expect(html).toContain('1/2 đã đặt')
    expect(html).toContain('opacity-60')
  })

  it('allows dragging unplaced stations when unlocked, but disables placed stations', () => {
    const placedSet = new Set(['b-1'])
    const html = renderToStaticMarkup(
      <StationSidebar
        booths={mockBooths}
        placedBoothIds={placedSet}
        isLocked={false}
      />,
    )

    // b-2 is unplaced and should be draggable
    expect(html).toContain('data-testid="booth-card-b-2"')
    // Ghost elements should be present (normal and hidden)
    expect(html).toContain('data-testid="station-drag-ghost"')
    expect(html).toContain('data-testid="station-drag-ghost-hidden"')
  })

  it('renders dedicated drag ghost preview with gray pin and dashed stroke for hidden stations', () => {
    const html = renderToStaticMarkup(
      <StationSidebar booths={mockBooths} isLocked={false} />,
    )

    expect(html).toContain('data-testid="station-drag-ghost-hidden"')
    expect(html).toContain('text-neutral-500')
    expect(html).toContain('stroke-dasharray="2 1"')
    expect(html).toContain('Trạm ẩn')
  })

  it('disables dragging all stations when map is locked', () => {
    const html = renderToStaticMarkup(
      <StationSidebar booths={mockBooths} isLocked={true} />,
    )

    expect(html).not.toContain('draggable="true"')
  })

  it('renders chevron expand button on each station card with aria attributes', () => {
    const html = renderToStaticMarkup(<StationSidebar booths={mockBooths} />)
    expect(html).toContain('data-testid="booth-expand-btn-b-1"')
    expect(html).toContain('data-testid="booth-expand-btn-b-2"')
    expect(html).toContain('aria-expanded="false"')
    expect(html).toContain('aria-label="Chi tiết trạm Trạm 1 - Khởi động"')
    expect(html).toContain('aria-label="Chi tiết trạm Trạm 2 - Bí mật"')
    // Neither detail panel should be rendered initially
    expect(html).not.toContain('data-testid="booth-detail-panel-b-1"')
    expect(html).not.toContain('data-testid="booth-detail-panel-b-2"')
  })

  it('renders collapsible detail panel with all station attributes when expanded', () => {
    const detailedBooths: RaceBoothItem[] = [
      {
        boothId: 'b-free',
        boothName: 'Trạm Khởi Động',
        boothLocation: 'Khu A',
        description: 'Mô tả trạm khởi động',
        status: 'free',
        isHidden: false,
        currentOrganizerName: 'Trọng tài Nam',
      },
      {
        boothId: 'b-occupied',
        boothName: 'Trạm Vượt Chướng Ngại Vật',
        boothLocation: 'Khu B',
        description: '',
        status: 'occupied',
        isHidden: false,
        currentTeamName: 'Chiến Binh Thép',
      },
      {
        boothId: 'b-pending',
        boothName: 'Trạm Về Đích',
        boothLocation: '',
        description: null,
        status: 'pending',
        isHidden: true,
      },
    ]

    const html = renderToStaticMarkup(
      <StationSidebar
        booths={detailedBooths}
        defaultExpandedBoothIds={new Set(['b-free', 'b-occupied', 'b-pending'])}
      />,
    )

    // Check rotated icon and expanded aria state
    expect(html).toContain('rotate-180')
    expect(html).toContain('aria-expanded="true"')

    // b-free panel
    expect(html).toContain('data-testid="booth-detail-panel-b-free"')
    expect(html).toContain('Mô tả trạm khởi động')
    expect(html).toContain('📍 Vị trí: Khu A')
    expect(html).toContain('Trống')
    expect(html).toContain('bg-emerald-50')
    expect(html).toContain('text-emerald-700')
    expect(html).toContain('👤 Người phụ trách: Trọng tài Nam')

    // b-occupied panel (empty description -> fallback, occupied status with team name)
    expect(html).toContain('data-testid="booth-detail-panel-b-occupied"')
    expect(html).toContain('Chưa có mô tả.')
    expect(html).toContain('📍 Vị trí: Khu B')
    expect(html).toContain('Đang phục vụ (Chiến Binh Thép)')
    expect(html).toContain('bg-blue-50')
    expect(html).toContain('text-blue-700')

    // b-pending panel (pending status)
    expect(html).toContain('data-testid="booth-detail-panel-b-pending"')
    expect(html).toContain('Chờ duyệt')
    expect(html).toContain('bg-amber-50')
    expect(html).toContain('text-amber-700')
  })

  it('correctly parses and renders rich HTML description without displaying raw HTML tags', () => {
    const htmlBooths: RaceBoothItem[] = [
      {
        boothId: 'b-html-1',
        boothName: 'Trạm 1',
        boothLocation: 'ĐHBK A',
        description:
          '<p data-path-to-node="0" class="first-token" style="--animation-duration: 600ms;"><b>Trạm 1: Giải Mã Mật Thư (Trí tuệ)</b></p><ul data-path-to-node="1"><li><p data-path-to-node="1,0,0"><b>Tên trạm:</b><span> Mật Mã Bàn Cờ</span></p></li></ul>',
        status: 'free',
        isHidden: false,
        currentOrganizerName: 'TÂN NGUYỄN NHẬT',
      },
      {
        boothId: 'b-empty-html',
        boothName: 'Trạm 2',
        boothLocation: '',
        description: '<p><br></p>',
        status: 'free',
        isHidden: false,
      },
    ]

    const html = renderToStaticMarkup(
      <StationSidebar
        booths={htmlBooths}
        defaultExpandedBoothIds={new Set(['b-html-1', 'b-empty-html'])}
      />,
    )

    // Should render real HTML tags instead of escaped HTML entities
    expect(html).toContain('<b>Trạm 1: Giải Mã Mật Thư (Trí tuệ)</b>')
    expect(html).toContain('<span> Mật Mã Bàn Cờ</span>')
    expect(html).not.toContain('&lt;p')
    expect(html).not.toContain('&lt;b')
    expect(html).not.toContain('&lt;ul')

    // Empty HTML should fallback to "Chưa có mô tả."
    expect(html).toContain('data-testid="booth-detail-panel-b-empty-html"')
    expect(html).toContain('Chưa có mô tả.')
  })

  it('toggles detail panel open on first click and closed on second click with stopPropagation', () => {
    function findElementByTestId(
      element: unknown,
      testId: string,
    ): React.ReactElement<Record<string, unknown>> | null {
      if (!React.isValidElement(element)) return null
      const props = element.props as Record<string, unknown>
      if (props && props['data-testid'] === testId) {
        return element as React.ReactElement<Record<string, unknown>>
      }
      if (props && props.children) {
        const children = Array.isArray(props.children)
          ? props.children
          : [props.children]
        for (const child of children) {
          const found = findElementByTestId(child, testId)
          if (found) return found
        }
      }
      return null
    }

    function createComponentRunner<P>(Component: (props: P) => React.ReactElement | null) {
      let hookIndex = 0
      const hooks: Array<{ val?: unknown; current?: unknown }> = []
      let currentProps: P
      let result: React.ReactElement | null = null

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
        useRef<T>(initial: T) {
          const idx = hookIndex++
          if (hooks.length <= idx) hooks[idx] = { current: initial }
          return hooks[idx] as { current: T }
        },
        useCallback<T extends (...args: unknown[]) => unknown>(fn: T): T {
          return fn
        },
        useMemo<T>(fn: () => T): T {
          return fn()
        },
        useEffect() {},
      }

      function rerender(newProps?: P) {
        if (newProps !== undefined) currentProps = newProps
        hookIndex = 0
        // @ts-expect-error accessing React internals for testing
        const prevDispatcher = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE.H
        // @ts-expect-error accessing React internals for testing
        React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE.H = dispatcher
        try {
          result = Component(currentProps)
        } finally {
          // @ts-expect-error accessing React internals for testing
          React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE.H = prevDispatcher
        }
        return result
      }

      return {
        init(props: P) {
          return rerender(props)
        },
        get vdom() {
          return result
        },
        get html() {
          return result ? renderToStaticMarkup(result) : ''
        },
      }
    }

    const runner = createComponentRunner(StationSidebar)
    runner.init({ booths: mockBooths })

    // Step 1: Initially closed
    expect(runner.html).not.toContain('data-testid="booth-detail-panel-b-1"')
    const btnInitially = findElementByTestId(runner.vdom, 'booth-expand-btn-b-1')
    expect(btnInitially).toBeDefined()
    expect(btnInitially?.props['aria-expanded']).toBe(false)

    // Step 2: First click -> open panel
    const stopPropagation1 = vi.fn()
    const onMouseDownStop = vi.fn()
    ;(btnInitially?.props.onMouseDown as (e: unknown) => void)({ stopPropagation: onMouseDownStop })
    expect(onMouseDownStop).toHaveBeenCalled()

    ;(btnInitially?.props.onClick as (e: unknown) => void)({ stopPropagation: stopPropagation1 })
    expect(stopPropagation1).toHaveBeenCalled()

    // Panel is now open
    expect(runner.html).toContain('data-testid="booth-detail-panel-b-1"')
    expect(runner.html).toContain('Mô tả trạm 1')
    expect(runner.html).toContain('📍 Vị trí: Khu A')
    const btnOpened = findElementByTestId(runner.vdom, 'booth-expand-btn-b-1')
    expect(btnOpened?.props['aria-expanded']).toBe(true)

    // Verify detail panel prevents drag propagation
    const detailPanel = findElementByTestId(runner.vdom, 'booth-detail-panel-b-1')
    expect(detailPanel).toBeDefined()
    const stopPropagationPanel = vi.fn()
    const preventDefaultPanel = vi.fn()
    ;(detailPanel?.props.onClick as (e: unknown) => void)({ stopPropagation: stopPropagationPanel })
    expect(stopPropagationPanel).toHaveBeenCalled()
    ;(detailPanel?.props.onDragStart as (e: unknown) => void)({
      stopPropagation: stopPropagationPanel,
      preventDefault: preventDefaultPanel,
    })
    expect(preventDefaultPanel).toHaveBeenCalled()

    // Step 3: Second click -> close panel
    const stopPropagation2 = vi.fn()
    ;(btnOpened?.props.onClick as (e: unknown) => void)({ stopPropagation: stopPropagation2 })
    expect(stopPropagation2).toHaveBeenCalled()

    // Panel is now closed
    expect(runner.html).not.toContain('data-testid="booth-detail-panel-b-1"')
    const btnClosed = findElementByTestId(runner.vdom, 'booth-expand-btn-b-1')
    expect(btnClosed?.props['aria-expanded']).toBe(false)
  })

  it('handles drop event on sidebar and unplaces placed booth', () => {
    const onUnplaceStation = vi.fn()
    let vdom: React.ReactElement<{
      onDrop: (e: {
        preventDefault: () => void
        stopPropagation: () => void
        dataTransfer: { getData: (format: string) => string }
      }) => void
    }> | null = null

    const TestWrapper = () => {
      vdom = StationSidebar({
        booths: mockBooths,
        placedBoothIds: new Set(['b-1']),
        isLocked: false,
        isFrozen: false,
        onUnplaceStation,
      }) as typeof vdom
      return vdom
    }

    renderToStaticMarkup(<TestWrapper />)
    expect(vdom).not.toBeNull()

    const stopPropagation = vi.fn()
    const preventDefault = vi.fn()
    const mockDataTransfer = {
      getData: (format: string) => {
        if (format === 'application/json') {
          return JSON.stringify({ boothId: 'b-1' })
        }
        return 'b-1'
      },
    }

    vdom!.props.onDrop({
      preventDefault,
      stopPropagation,
      dataTransfer: mockDataTransfer,
    })

    expect(preventDefault).toHaveBeenCalled()
    expect(stopPropagation).toHaveBeenCalled()
    expect(onUnplaceStation).toHaveBeenCalledWith('b-1')
  })

  it('prevents default and sets dropEffect to move on drag over when unlocked', () => {
    let vdom: React.ReactElement<{
      onDragOver: (e: {
        preventDefault: () => void
        dataTransfer: { dropEffect: string }
      }) => void
    }> | null = null

    const TestWrapper = () => {
      vdom = StationSidebar({
        booths: mockBooths,
        placedBoothIds: new Set(['b-1']),
        isLocked: false,
        isFrozen: false,
      }) as typeof vdom
      return vdom
    }

    renderToStaticMarkup(<TestWrapper />)
    expect(vdom).not.toBeNull()

    const preventDefault = vi.fn()
    const mockEvent = {
      preventDefault,
      dataTransfer: { dropEffect: '' },
    }

    vdom!.props.onDragOver(mockEvent)
    expect(preventDefault).toHaveBeenCalled()
    expect(mockEvent.dataTransfer.dropEffect).toBe('move')
  })
})
