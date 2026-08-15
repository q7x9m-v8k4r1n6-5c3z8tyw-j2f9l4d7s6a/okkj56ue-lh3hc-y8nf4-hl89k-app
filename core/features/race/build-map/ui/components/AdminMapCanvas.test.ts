import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import React from 'react'
import { AdminMapCanvas } from './AdminMapCanvas'

describe('AdminMapCanvas Component', () => {
  it('renders viewport with zoom controls and placed pin markers', () => {
    const stations = [
      { id: 's-1', name: 'Trạm Đã Đặt', mapX: 45.0, mapY: 55.0, status: 'free' },
      { id: 's-2', name: 'Trạm Chưa Đặt', mapX: null, mapY: null },
    ]

    const html = renderToString(
      React.createElement(AdminMapCanvas, {
        previewUrl: 'https://azure.blob/map.png',
        fileName: 'map.png',
        stations,
        onRemoveImage: () => {},
        onFileSelect: () => {},
      }),
    )

    expect(html).toContain('map.png')
    expect(html).toContain('Thu nhỏ')
    expect(html).toContain('Phóng to')
    expect(html).toContain('Reset')
    expect(html).toContain('data-testid="admin-station-pin-s-1"')
    expect(html).not.toContain('data-testid="admin-station-pin-s-2"')
  })

  it('renders locked instructions when isLocked is true', () => {
    const html = renderToString(
      React.createElement(AdminMapCanvas, {
        previewUrl: 'https://azure.blob/map.png',
        isLocked: true,
        onRemoveImage: () => {},
        onFileSelect: () => {},
      }),
    )

    expect(html).toContain('Bản đồ đã khóa cố định')
  })
})
