import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { DetailRacePage } from './DetailRacePage'

vi.mock('@/core/features/race/build-map', () => ({
  AdminBuildMapView: ({ raceId }: { raceId?: string }) => (
    <div data-testid="mock-admin-build-map-view">
      <span>AdminBuildMapView</span>
      <span>RaceID: {raceId}</span>
    </div>
  ),
}))

vi.mock('@/core/features/race/edit-race', () => ({
  EditRaceView: () => <div data-testid="mock-edit-race-view">EditRaceView</div>,
}))

vi.mock('@/core/features/race/live-race', () => ({
  LiveRaceView: () => <div>LiveRaceView</div>,
}))

vi.mock('@/core/features/race/scoring-log-history', () => ({
  ScoringLogHistoryView: () => <div>ScoringLogHistoryView</div>,
}))

vi.mock('@/core/features/race/send-message', () => ({
  SendMessageView: () => <div>SendMessageView</div>,
}))

vi.mock('@/plugin/move2026/features/secret-mission/admin-secret-mission/ui/AdminSecretMissionListView', () => ({
  AdminSecretMissionListView: () => <div>AdminSecretMissionListView</div>,
}))

vi.mock('@/plugin/move2026/features/card', () => ({
  CardStoreManagementView: () => <div>CardStoreManagementView</div>,
}))

describe('DetailRacePage', () => {
  it('renders AdminBuildMapView with raceId when activeTab is map', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/admin/races/test-race-id-123?tab=map']}>
        <Routes>
          <Route path="/admin/races/:raceId" element={<DetailRacePage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(html).toContain('AdminBuildMapView')
    expect(html).toContain('RaceID: test-race-id-123')
    expect(html).not.toContain('EditRaceView')
  })

  it('renders EditRaceView when activeTab is basic or default', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/admin/races/test-race-id-123']}>
        <Routes>
          <Route path="/admin/races/:raceId" element={<DetailRacePage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(html).toContain('EditRaceView')
    expect(html).not.toContain('AdminBuildMapView')
  })

  it('renders tabs navigation with "Bản đồ" tab', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/admin/races/test-race-id-123']}>
        <Routes>
          <Route path="/admin/races/:raceId" element={<DetailRacePage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(html).toContain('Bản đồ')
    expect(html).toContain('Thông tin cơ bản')
  })
})
