import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import React from 'react'
import { StationPaletteSidebar } from './StationPaletteSidebar'

describe('StationPaletteSidebar Component', () => {
  it('renders sidebar with unplaced draggable cards and counters', () => {
    const stations = [
      { id: 's-1', name: 'Trạm 1', stationType: 'Trạm thường', mapX: null, mapY: null },
      { id: 's-2', name: 'Trạm 2', stationType: 'Trạm ẩn', isHidden: true, mapX: 40.0, mapY: 50.0 },
    ]

    const html = renderToString(
      React.createElement(StationPaletteSidebar, {
        stations,
        isLoading: false,
      }),
    )

    expect(html).toContain('Danh sách các trạm')
    expect(html).toContain('1 chưa đặt')
    expect(html).toContain('Trạm 1')
    expect(html).toContain('Trạm thường')
    expect(html).toContain('Trạm 2')
    expect(html).toContain('Đã đặt')
  })

  it('renders loading skeleton when isLoading is true', () => {
    const html = renderToString(
      React.createElement(StationPaletteSidebar, {
        stations: [],
        isLoading: true,
      }),
    )

    expect(html).toContain('animate-pulse')
  })

  it('renders empty state when stations array is empty', () => {
    const html = renderToString(
      React.createElement(StationPaletteSidebar, {
        stations: [],
        isLoading: false,
      }),
    )

    expect(html).toContain('Chưa có trạm nào')
    expect(html).toContain('Thêm trạm trong tab Thông tin cơ bản')
  })
})
