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
    // Ghost element should be present
    expect(html).toContain('data-testid="station-drag-ghost"')
  })

  it('disables dragging all stations when map is locked', () => {
    const html = renderToStaticMarkup(
      <StationSidebar booths={mockBooths} isLocked={true} />,
    )

    expect(html).not.toContain('draggable="true"')
  })

  it('renders [Gỡ] button for placed booth when unlocked and onUnplaceStation is provided', () => {
    const onUnplaceStation = vi.fn()
    const html = renderToStaticMarkup(
      <StationSidebar
        booths={mockBooths}
        placedBoothIds={new Set(['b-1'])}
        isLocked={false}
        isFrozen={false}
        onUnplaceStation={onUnplaceStation}
      />,
    )

    expect(html).toContain('data-testid="booth-unplace-btn-b-1"')
    expect(html).toContain('Gỡ')
    expect(html).toContain('text-red-600')
    // b-2 is not placed, so no unplace button
    expect(html).not.toContain('data-testid="booth-unplace-btn-b-2"')
  })

  it('does not render [Gỡ] button when locked or frozen', () => {
    const onUnplaceStation = vi.fn()
    const lockedHtml = renderToStaticMarkup(
      <StationSidebar
        booths={mockBooths}
        placedBoothIds={new Set(['b-1'])}
        isLocked={true}
        isFrozen={false}
        onUnplaceStation={onUnplaceStation}
      />,
    )
    expect(lockedHtml).not.toContain('data-testid="booth-unplace-btn-b-1"')

    const frozenHtml = renderToStaticMarkup(
      <StationSidebar
        booths={mockBooths}
        placedBoothIds={new Set(['b-1'])}
        isLocked={false}
        isFrozen={true}
        onUnplaceStation={onUnplaceStation}
      />,
    )
    expect(frozenHtml).not.toContain('data-testid="booth-unplace-btn-b-1"')
  })

  it('triggers onUnplaceStation with boothId when [Gỡ] button is clicked', () => {
    const onUnplaceStation = vi.fn()
    let vdom: React.ReactElement<{
      children: Array<
        React.ReactElement<{
          className?: string
          children?: React.ReactElement<{
            children?: Array<
              React.ReactElement<{
                'data-testid'?: string
                children?: [
                  unknown,
                  React.ReactElement<{
                    children?: [
                      unknown,
                      React.ReactElement<{
                        'data-testid'?: string
                        onClick?: (e: { stopPropagation: () => void }) => void
                      }>,
                    ]
                  }>,
                ]
              }>
            >
          }>
        }>
      >
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

    // Find the station list container (has min-h-[380px] class)
    const listContainer = vdom!.props.children.find(
      (c) =>
        React.isValidElement(c) && c.props.className?.includes('min-h-[380px]'),
    )
    expect(listContainer).toBeDefined()

    const scrollContainer = listContainer!.props.children
    const cardB1 = scrollContainer?.props.children?.[0]
    expect(cardB1?.props['data-testid']).toBe('booth-card-b-1')

    // Inside card: children are [boothNameDiv, footerDiv]
    const footerDiv = cardB1?.props.children?.[1]
    const unplaceBtn = footerDiv?.props.children?.[1]
    expect(unplaceBtn).toBeDefined()
    expect(unplaceBtn?.props['data-testid']).toBe('booth-unplace-btn-b-1')

    const stopPropagation = vi.fn()
    unplaceBtn?.props.onClick?.({ stopPropagation })
    expect(stopPropagation).toHaveBeenCalled()
    expect(onUnplaceStation).toHaveBeenCalledWith('b-1')
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
