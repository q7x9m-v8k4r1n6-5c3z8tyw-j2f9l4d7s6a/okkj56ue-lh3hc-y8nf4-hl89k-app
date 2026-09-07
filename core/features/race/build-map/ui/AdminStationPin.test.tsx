import { describe, expect, it } from 'vitest'
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
    expect(html).toContain('bg-black/80')
    expect(html).toContain('text-[11px]')
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
})
