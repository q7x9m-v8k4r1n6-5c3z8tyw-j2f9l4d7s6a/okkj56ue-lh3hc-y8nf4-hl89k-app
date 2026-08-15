import { describe, expect, it } from 'vitest'
import { BuildMapRaceView } from '../index'
import { StationPaletteSidebar } from './components/StationPaletteSidebar'
import { MapUploadDropzone } from './components/MapUploadDropzone'
import { AdminMapCanvas } from './components/AdminMapCanvas'

import { renderToString } from 'react-dom/server'
import React from 'react'

describe('BuildMapRaceView component export and contract', () => {
  it('exports BuildMapRaceView from feature public API index.ts', () => {
    expect(BuildMapRaceView).toBeDefined()
    expect(typeof BuildMapRaceView).toBe('function')
  })

  it('exports StationPaletteSidebar presentational component', () => {
    expect(StationPaletteSidebar).toBeDefined()
    expect(typeof StationPaletteSidebar).toBe('function')
  })

  it('exports MapUploadDropzone presentational component', () => {
    expect(MapUploadDropzone).toBeDefined()
    expect(typeof MapUploadDropzone).toBe('function')
  })

  it('exports AdminMapCanvas presentational component', () => {
    expect(AdminMapCanvas).toBeDefined()
    expect(typeof AdminMapCanvas).toBe('function')
  })
})

describe('StationPaletteSidebar HTML rendering compliance', () => {
  it('renders stations with exactly 2 lines and without extraneous badges', () => {
    const stations = [
      { id: 's1', name: 'Trạm N', stationType: 'Trạm thường' },
      { id: 's2', name: 'Trạm L', isHidden: true },
    ]

    const html = renderToString(
      React.createElement(StationPaletteSidebar, { stations, isLoading: false })
    )

    // Header check
    expect(html).toContain('Danh sách các trạm')
    expect(html).not.toContain('4 trạm')

    // Station 1 check
    expect(html).toContain('Trạm N')
    expect(html).toContain('Trạm thường')

    // Station 2 fallback check
    expect(html).toContain('Trạm L')
    expect(html).toContain('Trạm ẩn')

    // Extraneous elements check
    expect(html).not.toContain('Sẵn sàng')
    expect(html).not.toContain('ĐHBK')
  })

  it('renders empty state when stations list is empty', () => {
    const html = renderToString(
      React.createElement(StationPaletteSidebar, { stations: [], isLoading: false })
    )

    expect(html).toContain('Chưa có trạm nào')
  })

  it('renders skeleton items when isLoading is true', () => {
    const html = renderToString(
      React.createElement(StationPaletteSidebar, { stations: [], isLoading: true })
    )

    expect(html).toContain('animate-pulse')
  })

  it('handles empty/whitespace station name gracefully with fallback', () => {
    const stations = [
      { id: 's-empty', name: '   ' },
    ]

    const html = renderToString(
      React.createElement(StationPaletteSidebar, { stations, isLoading: false })
    )

    expect(html).toContain('Trạm chưa đặt tên')
  })

  it('handles undefined stations prop without crashing', () => {
    const html = renderToString(
      // @ts-expect-error testing defensive default
      React.createElement(StationPaletteSidebar, { stations: undefined, isLoading: false })
    )

    expect(html).toContain('Chưa có trạm nào')
  })
})

describe('MapUploadDropzone HTML rendering compliance', () => {
  it('renders centered "+" icon and "Thêm ảnh bản đồ" text without blue buttons', () => {
    const html = renderToString(
      React.createElement(MapUploadDropzone, { onFileSelect: () => {} })
    )

    expect(html).toContain('Thêm ảnh bản đồ')
    expect(html).not.toContain('Chọn file ảnh bản đồ')
    expect(html).not.toContain('Kéo &amp; thả')
    expect(html).not.toContain('Kéo & thả')
  })

  it('renders error alert when error message is passed', () => {
    const html = renderToString(
      React.createElement(MapUploadDropzone, {
        onFileSelect: () => {},
        error: 'File ảnh vượt quá 20MB',
      })
    )

    expect(html).toContain('File ảnh vượt quá 20MB')
  })
})

describe('AdminMapCanvas HTML rendering compliance', () => {
  const defaultProps = {
    previewUrl: 'https://azure.blob.core.windows.net/race-map/sample-map.png',
    fileName: 'vietnam_map_2026.png',
    fileSize: 1.5 * 1024 * 1024,
    isDirty: false,
    isSaving: false,
    onRemoveImage: () => {},
    onFileSelect: () => {},
  }

  it('renders preview image, file name, formatted size, and zoom controls', () => {
    const html = renderToString(React.createElement(AdminMapCanvas, defaultProps))

    expect(html).toContain('vietnam_map_2026.png')
    expect(html).toContain('1.50 MB')
    expect(html).toContain('Thu nhỏ')
    expect(html).toContain('Phóng to')
    expect(html).toContain('Reset')
    expect(html).toContain('Đổi ảnh')
    expect(html).toContain('Xóa ảnh')
    expect(html).toContain('https://azure.blob.core.windows.net/race-map/sample-map.png')
    // Save button not rendered when isDirty is false
    expect(html).not.toContain('Lưu bản đồ')
  })

  it('renders Save and Cancel buttons when isDirty is true', () => {
    const html = renderToString(
      React.createElement(AdminMapCanvas, {
        ...defaultProps,
        isDirty: true,
      })
    )

    expect(html).toContain('Lưu bản đồ')
    expect(html).toContain('Hủy')
  })

  it('renders loading spinner and disabled state during save operation', () => {
    const html = renderToString(
      React.createElement(AdminMapCanvas, {
        ...defaultProps,
        isDirty: true,
        isSaving: true,
      })
    )

    expect(html).toContain('Đang lưu...')
    expect(html).toContain('disabled')
  })

  it('formats KB file size correctly for smaller files', () => {
    const html = renderToString(
      React.createElement(AdminMapCanvas, {
        ...defaultProps,
        fileSize: 450 * 1024,
      })
    )

    expect(html).toContain('450.0 KB')
  })

  it('displays "Đã lưu trên hệ thống" when fileSize is omitted', () => {
    const html = renderToString(
      React.createElement(AdminMapCanvas, {
        ...defaultProps,
        fileSize: undefined,
      })
    )

    expect(html).toContain('Đã lưu trên hệ thống')
  })

  it('renders replace file hidden input with image types accepted', () => {
    const html = renderToString(React.createElement(AdminMapCanvas, defaultProps))

    expect(html).toContain('data-testid="replace-map-file-input"')
    expect(html).toContain('image/jpeg,image/png,image/webp')
  })
})

describe('StationPaletteSidebar long name and type formatting', () => {
  it('applies break-words styling to both station name and station type lines', () => {
    const stations = [
      {
        id: 's-long',
        name: 'Trạm Rất Dài Không Có Dấu Cách Để Test Word Break',
        stationType: 'Loại Trạm Tùy Biến Đặc Biệt',
      },
    ]

    const html = renderToString(
      React.createElement(StationPaletteSidebar, { stations, isLoading: false })
    )

    expect(html).toContain('break-words')
    expect(html).toContain('Trạm Rất Dài Không Có Dấu Cách Để Test Word Break')
    expect(html).toContain('Loại Trạm Tùy Biến Đặc Biệt')
  })
})


