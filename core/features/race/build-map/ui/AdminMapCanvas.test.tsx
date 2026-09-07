import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { AdminMapCanvas } from './AdminMapCanvas'
import type { RaceBoothItem } from '../model/buildMap.contract'

describe('AdminMapCanvas', () => {
  const mockBooths: RaceBoothItem[] = [
    {
      boothId: 'b-canvas-1',
      boothName: 'Trạm Cổng Đông',
      boothLocation: '',
      description: '',
      status: '',
      isHidden: false,
      mapX: 20,
      mapY: 30,
    },
    {
      boothId: 'b-canvas-2',
      boothName: 'Trạm Cổng Tây',
      boothLocation: '',
      description: '',
      status: '',
      isHidden: false,
      mapX: 70,
      mapY: 80,
    },
  ]

  it('renders map image and all placed station pins', () => {
    const html = renderToStaticMarkup(
      <AdminMapCanvas
        mapImageUrl="https://example.com/stadium-map.png"
        placedBooths={mockBooths}
        isLocked={false}
      />,
    )

    expect(html).toContain('https://example.com/stadium-map.png')
    expect(html).toContain('Trạm Cổng Đông')
    expect(html).toContain('Trạm Cổng Tây')
    expect(html).toContain('data-testid="admin-pins-layer"')
  })

  it('ensures bottom zoom instruction hint bubble is completely absent', () => {
    const html = renderToStaticMarkup(
      <AdminMapCanvas
        mapImageUrl="https://example.com/stadium-map.png"
        placedBooths={mockBooths}
      />,
    )

    expect(html).not.toContain('Dùng chuột lăn để zoom')
    expect(html).not.toContain('chuột lăn')
  })

  it('renders replace map image button when onUploadNewMap is provided', () => {
    const html = renderToStaticMarkup(
      <AdminMapCanvas
        mapImageUrl="https://example.com/stadium-map.png"
        placedBooths={mockBooths}
        onUploadNewMap={() => {}}
      />,
    )

    expect(html).toContain('Thay đổi ảnh bản đồ')
  })

  it('renders 4-button floating controls within canvas', () => {
    const html = renderToStaticMarkup(
      <AdminMapCanvas
        mapImageUrl="https://example.com/stadium-map.png"
        placedBooths={mockBooths}
        isLocked={true}
        onToggleLock={() => {}}
      />,
    )

    expect(html).toContain('data-testid="coordinate-lock-controls"')
    expect(html).toContain('data-testid="btn-reset-viewport"')
    expect(html).toContain('data-testid="btn-zoom-in"')
    expect(html).toContain('data-testid="btn-zoom-out"')
    expect(html).toContain('data-testid="btn-toggle-lock"')
  })
})

