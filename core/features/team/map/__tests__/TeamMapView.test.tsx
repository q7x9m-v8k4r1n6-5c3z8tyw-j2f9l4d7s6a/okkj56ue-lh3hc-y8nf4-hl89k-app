import { describe, expect, it, vi } from 'vitest'
import { renderToString } from 'react-dom/server'
import React from 'react'
import { TeamMapView } from '../ui/TeamMapView'
import * as useTeamMapViewModule from '../ui/hooks/useTeamMapView'

vi.mock('../ui/hooks/useTeamMapView')

describe('TeamMapView Component', () => {
  it('renders loading indicator when isLoading is true', () => {
    vi.spyOn(useTeamMapViewModule, 'useTeamMapView').mockReturnValue({
      raceId: 'race-1',
      mapImageUrl: null,
      stations: [],
      placedStations: [],
      selectedStation: null,
      selectedStationId: null,
      selectStation: vi.fn(),
      clearSelection: vi.fn(),
      isLoading: true,
      isError: false,
      error: null,
      isEmpty: false,
      refetch: vi.fn(),
    })

    const html = renderToString(React.createElement(TeamMapView))
    expect(html).toContain('Đang tải bản đồ trận đấu...')
  })

  it('renders error message and retry button when isError is true', () => {
    vi.spyOn(useTeamMapViewModule, 'useTeamMapView').mockReturnValue({
      raceId: 'race-1',
      mapImageUrl: null,
      stations: [],
      placedStations: [],
      selectedStation: null,
      selectedStationId: null,
      selectStation: vi.fn(),
      clearSelection: vi.fn(),
      isLoading: false,
      isError: true,
      error: new Error('Network error'),
      isEmpty: false,
      refetch: vi.fn(),
    })

    const html = renderToString(React.createElement(TeamMapView))
    expect(html).toContain('Không thể tải thông tin bản đồ trận đấu.')
    expect(html).toContain('Thử lại')
  })

  it('renders empty state banner when isEmpty is true or mapImageUrl is null', () => {
    vi.spyOn(useTeamMapViewModule, 'useTeamMapView').mockReturnValue({
      raceId: 'race-1',
      mapImageUrl: null,
      stations: [],
      placedStations: [],
      selectedStation: null,
      selectedStationId: null,
      selectStation: vi.fn(),
      clearSelection: vi.fn(),
      isLoading: false,
      isError: false,
      error: null,
      isEmpty: true,
      refetch: vi.fn(),
    })

    const html = renderToString(React.createElement(TeamMapView))
    expect(html).toContain('Ban tổ chức chưa công bố sơ đồ bản đồ trận đấu')
  })

  it('renders map image and station pins when valid data exists', () => {
    vi.spyOn(useTeamMapViewModule, 'useTeamMapView').mockReturnValue({
      raceId: 'race-1',
      mapImageUrl: 'https://example.com/map.jpg',
      stations: [
        {
          id: 'p1',
          name: 'Trạm 1: Khởi động',
          code: '1',
          x: 20,
          y: 30,
          status: 'active',
          points: 100,
          description: 'Mô tả trạm 1',
        },
      ],
      placedStations: [
        {
          id: 'p1',
          name: 'Trạm 1: Khởi động',
          code: '1',
          x: 20,
          y: 30,
          status: 'active',
          points: 100,
          description: 'Mô tả trạm 1',
        },
      ],
      selectedStation: null,
      selectedStationId: null,
      selectStation: vi.fn(),
      clearSelection: vi.fn(),
      isLoading: false,
      isError: false,
      error: null,
      isEmpty: false,
      refetch: vi.fn(),
    })

    const html = renderToString(React.createElement(TeamMapView))
    expect(html).toContain('https://example.com/map.jpg')
    expect(html).toContain('Trạm 1: Khởi động')
    expect(html).toContain('left:20%')
    expect(html).toContain('top:30%')
  })
})
