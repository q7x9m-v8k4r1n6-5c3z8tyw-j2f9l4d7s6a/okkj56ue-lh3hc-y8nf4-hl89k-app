import { describe, expect, it } from 'vitest'
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
})
