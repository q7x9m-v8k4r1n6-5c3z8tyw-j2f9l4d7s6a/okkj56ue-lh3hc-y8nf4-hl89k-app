import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { FrozenMapBanner } from './FrozenMapBanner'

describe('FrozenMapBanner', () => {
  it('renders default amber warning banner with exact Vietnamese copy', () => {
    const html = renderToStaticMarkup(<FrozenMapBanner />)

    expect(html).toContain('data-testid="frozen-map-banner"')
    expect(html).toContain('role="status"')
    expect(html).toContain(
      '🔒 Trận đấu đang diễn ra. Bản đồ đã được khóa cố định ở chế độ chỉ đọc.',
    )
    expect(html).toContain('bg-amber-50')
    expect(html).toContain('border-amber-200')
    expect(html).toContain('text-amber-900')
  })

  it('renders custom message and merges custom className', () => {
    const html = renderToStaticMarkup(
      <FrozenMapBanner
        message="Bản đồ đã được khóa bảo vệ."
        className="custom-banner-class"
      />,
    )

    expect(html).toContain('Bản đồ đã được khóa bảo vệ.')
    expect(html).not.toContain(
      '🔒 Trận đấu đang diễn ra. Bản đồ đã được khóa cố định ở chế độ chỉ đọc.',
    )
    expect(html).toContain('custom-banner-class')
  })
})
