import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { AdminStationPin } from './AdminStationPin'
import type { RaceBoothItem } from '../model/buildMap.contract'

describe('AdminStationPin', () => {
  const mockBooth: RaceBoothItem = {
    boothId: 'b-pin-1',
    boothName: 'Trạm Rừng Sâu',
    boothLocation: 'Khu A',
    description: '',
    status: '',
    isHidden: false,
    mapX: 45.5,
    mapY: 60.2,
  }

  it('renders teardrop SVG pin and station name pill', () => {
    const html = renderToStaticMarkup(
      <AdminStationPin booth={mockBooth} isLocked={false} />,
    )

    expect(html).toContain('Trạm Rừng Sâu')
    expect(html).toContain('left:45.5%')
    expect(html).toContain('top:60.2%')
    expect(html).toContain('stroke="#FFFFFF"')
    expect(html).toContain('text-[#de3336]')
    expect(html).toContain('bg-black/80')
    expect(html).toContain('text-[11px]')
  })

  it('renders brand red pin color for normal station', () => {
    const html = renderToStaticMarkup(
      <AdminStationPin booth={{ ...mockBooth, isHidden: false }} isLocked={false} />,
    )
    expect(html).toContain('text-[#de3336]')
    expect(html).not.toContain('text-neutral-500')
  })

  it('renders gray pin color text-neutral-500 for hidden station (booth.isHidden is true)', () => {
    const hiddenBooth: RaceBoothItem = {
      ...mockBooth,
      boothId: 'b-pin-hidden',
      boothName: 'Trạm Ẩn Bí Mật',
      isHidden: true,
    }
    const html = renderToStaticMarkup(
      <AdminStationPin booth={hiddenBooth} isLocked={false} />,
    )
    expect(html).toContain('text-neutral-500')
    expect(html).not.toContain('text-[#de3336]')
    expect(html).toContain('Trạm Ẩn Bí Mật')
  })

  it('sets draggable to true and cursor-grab when unlocked', () => {
    const html = renderToStaticMarkup(
      <AdminStationPin booth={mockBooth} isLocked={false} />,
    )

    expect(html).toContain('draggable="true"')
    expect(html).toContain('cursor-grab')
  })

  it('disables dragging and sets cursor-default when locked', () => {
    const html = renderToStaticMarkup(
      <AdminStationPin booth={mockBooth} isLocked={true} />,
    )

    expect(html).not.toContain('draggable="true"')
    expect(html).toContain('cursor-default')
  })

  it('disables dragging when isFrozen is true even if isLocked is false', () => {
    const html = renderToStaticMarkup(
      <AdminStationPin booth={mockBooth} isLocked={false} isFrozen={true} />,
    )

    expect(html).not.toContain('draggable="true"')
    expect(html).toContain('cursor-default')
  })

  it('positions pin tip at origin via -translate-x-1/2 -translate-y-full', () => {
    const html = renderToStaticMarkup(
      <AdminStationPin booth={mockBooth} isLocked={false} />,
    )

    expect(html).toContain('-translate-x-1/2')
    expect(html).toContain('-translate-y-full')
    expect(html).toContain('origin-bottom')
  })

  it('aligns station name pill coaxially with pin tip at x=0 via left-0 -translate-x-1/2', () => {
    const html = renderToStaticMarkup(
      <AdminStationPin booth={mockBooth} isLocked={false} />,
    )

    expect(html).toContain('data-testid="admin-station-pin-pill-b-pin-1"')
    expect(html).toContain('left-0')
    expect(html).toContain('-translate-x-1/2')
    expect(html).not.toContain('left-1/2')
  })

  it('renders quick ✕ unplace button when isInteractive and onUnplaceStation is provided', () => {
    const onUnplaceStation = vi.fn()
    const html = renderToStaticMarkup(
      <AdminStationPin
        booth={mockBooth}
        isLocked={false}
        isFrozen={false}
        onUnplaceStation={onUnplaceStation}
      />,
    )

    expect(html).toContain('data-testid="admin-station-pin-unplace-b-pin-1"')
    expect(html).toContain('✕')
    expect(html).toContain('pointer-events-auto')
  })

  it('does not render ✕ unplace button when locked or frozen', () => {
    const onUnplaceStation = vi.fn()
    const lockedHtml = renderToStaticMarkup(
      <AdminStationPin
        booth={mockBooth}
        isLocked={true}
        onUnplaceStation={onUnplaceStation}
      />,
    )
    expect(lockedHtml).not.toContain(
      'data-testid="admin-station-pin-unplace-b-pin-1"',
    )
    expect(lockedHtml).toContain('pointer-events-none')

    const frozenHtml = renderToStaticMarkup(
      <AdminStationPin
        booth={mockBooth}
        isLocked={false}
        isFrozen={true}
        onUnplaceStation={onUnplaceStation}
      />,
    )
    expect(frozenHtml).not.toContain(
      'data-testid="admin-station-pin-unplace-b-pin-1"',
    )
    expect(frozenHtml).toContain('pointer-events-none')
  })

  it('triggers onUnplaceStation with boothId when ✕ unplace button is clicked', () => {
    const onUnplaceStation = vi.fn()
    let vdom: React.ReactElement<{
      children: [
        React.ReactElement,
        React.ReactElement<{
          children: [
            React.ReactElement,
            React.ReactElement<{
              'data-testid': string
              onClick: (e: { stopPropagation: () => void }) => void
              onMouseDown: (e: { stopPropagation: () => void }) => void
            }>,
          ]
        }>,
      ]
    }> | null = null

    const TestWrapper = () => {
      vdom = AdminStationPin({
        booth: mockBooth,
        isLocked: false,
        isFrozen: false,
        onUnplaceStation,
      }) as typeof vdom
      return vdom
    }

    renderToStaticMarkup(<TestWrapper />)

    expect(vdom).not.toBeNull()
    const pillChild = vdom!.props.children[1]
    const buttonChild = pillChild.props.children[1]
    expect(buttonChild).toBeDefined()
    expect(buttonChild.props['data-testid']).toBe(
      'admin-station-pin-unplace-b-pin-1',
    )

    const stopPropagationClick = vi.fn()
    buttonChild.props.onClick({
      stopPropagation: stopPropagationClick,
    })
    expect(stopPropagationClick).toHaveBeenCalled()
    expect(onUnplaceStation).toHaveBeenCalledWith('b-pin-1')

    const stopPropagationMouseDown = vi.fn()
    buttonChild.props.onMouseDown({
      stopPropagation: stopPropagationMouseDown,
    })
    expect(stopPropagationMouseDown).toHaveBeenCalled()
  })
})
