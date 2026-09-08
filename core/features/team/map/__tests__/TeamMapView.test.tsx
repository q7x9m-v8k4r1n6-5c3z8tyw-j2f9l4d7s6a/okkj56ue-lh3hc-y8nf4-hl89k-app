import { describe, expect, it, vi, afterEach } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { TeamMapView } from '../ui/TeamMapView'
import * as queryModule from '../model/server/useTeamMapQuery'
import type { TeamMapDetailResponse } from '../model/teamMap.contract'

describe('TeamMapView', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders Loading state with spinner when query is loading', () => {
    vi.spyOn(queryModule, 'useTeamMapQuery').mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof queryModule.useTeamMapQuery>)

    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/team/race/race-123?tab=map']}>
        <Routes>
          <Route path="/team/race/:raceId" element={<TeamMapView />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(html).toContain('role="status"')
    expect(html).toContain('Đang tải sơ đồ bản đồ...')
    expect(html).not.toContain('Ban tổ chức chưa công bố sơ đồ bản đồ trận đấu.')
  })

  it('renders Empty state when race has no mapImageUrl', () => {
    const emptyMapResponse: TeamMapDetailResponse = {
      id: 'race-123',
      name: 'Giải chạy Mùa Thu',
      mapImageUrl: null,
      booth: [],
    }

    vi.spyOn(queryModule, 'useTeamMapQuery').mockReturnValue({
      data: emptyMapResponse,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof queryModule.useTeamMapQuery>)

    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/team/race/race-123?tab=map']}>
        <Routes>
          <Route path="/team/race/:raceId" element={<TeamMapView />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(html).toContain('Ban tổ chức chưa công bố sơ đồ bản đồ trận đấu.')
    expect(html).not.toContain('role="status"')
  })

  it('renders Empty state when race query encounters an error', () => {
    vi.spyOn(queryModule, 'useTeamMapQuery').mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as ReturnType<typeof queryModule.useTeamMapQuery>)

    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/team/race/race-123?tab=map']}>
        <Routes>
          <Route path="/team/race/:raceId" element={<TeamMapView />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(html).toContain('Ban tổ chức chưa công bố sơ đồ bản đồ trận đấu.')
  })

  it('renders Success state with map image, floating controls, and valid pins', () => {
    const successResponse: TeamMapDetailResponse = {
      id: 'race-123',
      name: 'Giải Chạy Lớn',
      mapImageUrl: 'https://example.com/stadium-map.png',
      booth: [
        {
          id: 'booth-1',
          name: 'Trạm 1: Khởi Động',
          place: 'Cổng Đông',
          description: 'Khởi động nhẹ nhàng',
          isHidden: false,
          status: 'free',
          mapX: 20,
          mapY: 30,
        },
        {
          id: 'booth-2',
          name: 'Trạm 2: Vượt Chướng Ngại Vật',
          place: 'Khu trung tâm',
          description: 'Vượt tường gỗ',
          isHidden: false,
          status: 'occupied',
          mapX: 60,
          mapY: 75,
        },
        {
          id: 'booth-hidden',
          name: 'Trạm Bí Mật',
          place: 'Hầm số 3',
          description: 'Trạm này phải bị ẩn 100%',
          isHidden: true,
          status: 'free',
          mapX: 50,
          mapY: 50,
        },
        {
          id: 'booth-no-coord',
          name: 'Trạm Thiếu Toạ Độ',
          place: 'Chưa rõ',
          description: 'Không có toạ độ',
          isHidden: false,
          status: 'free',
          mapX: null,
          mapY: null,
        },
      ],
    }

    vi.spyOn(queryModule, 'useTeamMapQuery').mockReturnValue({
      data: successResponse,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof queryModule.useTeamMapQuery>)

    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/team/race/race-123?tab=map']}>
        <Routes>
          <Route path="/team/race/:raceId" element={<TeamMapView />} />
        </Routes>
      </MemoryRouter>,
    )

    // Map image is rendered
    expect(html).toContain('https://example.com/stadium-map.png')

    // Floating controls are rendered
    expect(html).toContain('aria-label="Reset Zoom"')
    expect(html).toContain('aria-label="Zoom In"')
    expect(html).toContain('aria-label="Zoom Out"')

    // Visible pins are rendered
    expect(html).toContain('Trạm 1: Khởi Động')
    expect(html).toContain('text-[#168944]') // Green for free

    expect(html).toContain('Trạm 2: Vượt Chướng Ngại Vật')
    expect(html).toContain('text-[#de3336]') // Red for occupied

    // Hidden and invalid pins are NOT rendered
    expect(html).not.toContain('Trạm Bí Mật')
    expect(html).not.toContain('Trạm Thiếu Toạ Độ')
  })

  it('renders Empty state when mapImageUrl is an empty string', () => {
    const emptyStringMapResponse: TeamMapDetailResponse = {
      id: 'race-empty-str',
      mapImageUrl: '',
      booth: [],
    }

    vi.spyOn(queryModule, 'useTeamMapQuery').mockReturnValue({
      data: emptyStringMapResponse,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof queryModule.useTeamMapQuery>)

    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/team/race/race-123?tab=map']}>
        <Routes>
          <Route path="/team/race/:raceId" element={<TeamMapView />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(html).toContain('Ban tổ chức chưa công bố sơ đồ bản đồ trận đấu.')
  })

  it('prioritizes propRaceId over route param raceId when provided', () => {
    const querySpy = vi.spyOn(queryModule, 'useTeamMapQuery').mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof queryModule.useTeamMapQuery>)

    renderToStaticMarkup(
      <MemoryRouter initialEntries={['/team/race/route-id?tab=map']}>
        <Routes>
          <Route path="/team/race/:raceId" element={<TeamMapView raceId="explicit-prop-id" />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(querySpy).toHaveBeenCalledWith('explicit-prop-id')
  })
})
