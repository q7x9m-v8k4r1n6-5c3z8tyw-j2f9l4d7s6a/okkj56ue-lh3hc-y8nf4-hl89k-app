import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapUploadCanvas } from './MapUploadCanvas'

describe('MapUploadCanvas', () => {
  it('renders empty state with plus icon and upload prompt', () => {
    const html = renderToStaticMarkup(
      <MapUploadCanvas isUploading={false} onUpload={vi.fn()} />,
    )

    expect(html).toContain('Thêm ảnh bản đồ')
    expect(html).toContain('type="file"')
    expect(html).toContain('accept="image/jpeg,image/png,image/webp,image/*"')
  })

  it('renders uploading state with spinner and loading text', () => {
    const html = renderToStaticMarkup(
      <MapUploadCanvas isUploading={true} onUpload={vi.fn()} />,
    )

    expect(html).toContain('Đang tải ảnh bản đồ...')
    expect(html).not.toContain('Thêm ảnh bản đồ')
  })

  it('renders uploaded state with image and change map button', () => {
    const imageUrl = 'https://example.com/race-map.png'
    const html = renderToStaticMarkup(
      <MapUploadCanvas
        mapImageUrl={imageUrl}
        isUploading={false}
        onUpload={vi.fn()}
      />,
    )

    expect(html).toContain(imageUrl)
    expect(html).toContain('Thay đổi ảnh bản đồ')
    expect(html).toContain('alt="Sơ đồ trận đấu"')
  })

  it('applies custom className to outer container', () => {
    const html = renderToStaticMarkup(
      <MapUploadCanvas
        className="custom-test-class"
        isUploading={false}
        onUpload={vi.fn()}
      />,
    )

    expect(html).toContain('custom-test-class')
  })

  it('renders with test id attribute for end-to-end and test selection', () => {
    const html = renderToStaticMarkup(
      <MapUploadCanvas isUploading={false} onUpload={vi.fn()} />,
    )

    expect(html).toContain('data-testid="map-upload-canvas"')
  })

  it('renders keyboard-accessible focus-visible styles and aria-label', () => {
    const html = renderToStaticMarkup(
      <MapUploadCanvas isUploading={false} onUpload={vi.fn()} />,
    )

    expect(html).toContain('aria-label="Thêm ảnh bản đồ"')
    expect(html).toContain('focus-visible:ring-2')
    expect(html).toContain('focus-visible:ring-[#de3336]')
  })

  it('renders focus-visible styles on change map button in uploaded state', () => {
    const html = renderToStaticMarkup(
      <MapUploadCanvas
        mapImageUrl="https://example.com/map.png"
        isUploading={false}
        onUpload={vi.fn()}
      />,
    )

    expect(html).toContain('focus-visible:ring-2')
    expect(html).toContain('focus-visible:ring-[#de3336]')
    expect(html).toContain('Thay đổi ảnh bản đồ')
  })
})
