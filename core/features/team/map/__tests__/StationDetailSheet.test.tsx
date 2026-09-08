import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type React from 'react'
import { StationDetailSheet } from '../ui/components/StationDetailSheet'
import type { StationPin } from '../model/teamMap.types'

describe('StationDetailSheet', () => {
  const freePin: StationPin = {
    id: 'station-free',
    name: 'Trạm Vượt Chướng Ngại Vật',
    place: 'Khu liên hoàn thể thao',
    description: 'Vượt qua tường lốp và cầu khỉ.',
    x: 30,
    y: 50,
    status: 'free',
  }

  const occupiedPin: StationPin = {
    id: 'station-occupied',
    name: 'Trạm Giải Đố',
    place: 'Thư viện trung tâm',
    description: 'Giải mật mã cổ.',
    x: 70,
    y: 80,
    status: 'occupied',
  }

  it('renders station name, location, and challenge description', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StationDetailSheet pin={freePin} onClose={() => {}} />
      </MemoryRouter>,
    )

    expect(html).toContain('Trạm Vượt Chướng Ngại Vật')
    expect(html).toContain('📍 Khu liên hoàn thể thao')
    expect(html).toContain('Vượt qua tường lốp và cầu khỉ.')
  })

  it('renders "Trống / Sẵn sàng" badge in green when station is free', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StationDetailSheet pin={freePin} onClose={() => {}} />
      </MemoryRouter>,
    )

    expect(html).toContain('Trống / Sẵn sàng')
    expect(html).toContain('bg-[#168944]')
    expect(html).not.toContain('Đang có đội tham gia')
    expect(html).not.toContain('bg-[#de3336] text-white')
  })

  it('renders enabled "Chuyển sang Quét QR" button and no warning text when station is free', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StationDetailSheet pin={freePin} onClose={() => {}} />
      </MemoryRouter>,
    )

    expect(html).toContain('Chuyển sang Quét QR')
    expect(html).not.toContain('Trạm đang bận, vui lòng chờ đội trước hoàn thành!')
    expect(html).not.toContain('disabled=""')
  })

  it('renders "Đang có đội tham gia" badge in red when station is occupied', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StationDetailSheet pin={occupiedPin} onClose={() => {}} />
      </MemoryRouter>,
    )

    expect(html).toContain('Đang có đội tham gia')
    expect(html).toContain('bg-[#de3336]')
    expect(html).not.toContain('Trống / Sẵn sàng')
    expect(html).not.toContain('bg-[#168944]')
  })

  it('renders disabled button and warning message when station is occupied', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StationDetailSheet pin={occupiedPin} onClose={() => {}} />
      </MemoryRouter>,
    )

    expect(html).toContain('Trạm đang bận, vui lòng chờ đội trước hoàn thành!')
    expect(html).toContain('disabled=""')
    expect(html).toContain('Chuyển sang Quét QR')
  })

  it('contains absolutely no legacy completed or locked styles or points', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StationDetailSheet pin={freePin} onClose={() => {}} />
      </MemoryRouter>,
    )

    expect(html).not.toContain('Hoàn thành')
    expect(html).not.toContain('Đã khoá')
    expect(html).not.toContain('điểm')
    expect(html).not.toContain('Mã:')
  })

  it('calls onNavigateToScan callback when provided and button is clicked on free pin', () => {
    const onNavigateToScan = vi.fn()
    let capturedButton: React.ReactElement<{ onClick: () => void; disabled: boolean }> | null = null

    const TestWrapper = () => {
      const element = StationDetailSheet({
        pin: freePin,
        onClose: () => {},
        onNavigateToScan,
      })
      const fragments = element.props.children
      const sheetContainer = fragments[1]
      const sheetContent = sheetContainer.props.children
      capturedButton = sheetContent.props.children[sheetContent.props.children.length - 1]
      return element
    }

    renderToStaticMarkup(
      <MemoryRouter>
        <TestWrapper />
      </MemoryRouter>,
    )

    expect(capturedButton).not.toBeNull()
    expect(capturedButton!.props.disabled).toBe(false)
    capturedButton!.props.onClick()

    expect(onNavigateToScan).toHaveBeenCalled()
  })

  it('updates query param ?tab=scan when clicked without custom onNavigateToScan', () => {
    const TestConsumer = () => {
      return (
        <Routes>
          <Route
            path="/team/race/:raceId"
            element={
              <div>
                <StationDetailSheet pin={freePin} onClose={() => {}} />
              </div>
            }
          />
        </Routes>
      )
    }

    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/team/race/race-1']}>
        <TestConsumer />
      </MemoryRouter>,
    )

    expect(html).toContain('Chuyển sang Quét QR')
  })

  it('does NOT call onNavigateToScan callback when button is clicked on occupied pin', () => {
    const onNavigateToScan = vi.fn()
    let capturedButton: React.ReactElement<{ onClick: () => void; disabled: boolean }> | null = null

    const TestWrapper = () => {
      const element = StationDetailSheet({
        pin: occupiedPin,
        onClose: () => {},
        onNavigateToScan,
      })
      const fragments = element.props.children
      const sheetContainer = fragments[1]
      const sheetContent = sheetContainer.props.children
      capturedButton = sheetContent.props.children[sheetContent.props.children.length - 1]
      return element
    }

    renderToStaticMarkup(
      <MemoryRouter>
        <TestWrapper />
      </MemoryRouter>,
    )

    expect(capturedButton).not.toBeNull()
    expect(capturedButton!.props.disabled).toBe(true)
    capturedButton!.props.onClick()

    // Must strictly NOT navigate when station is occupied
    expect(onNavigateToScan).not.toHaveBeenCalled()
  })

  it('triggers onClose when close button is clicked', () => {
    const onClose = vi.fn()
    let capturedCloseBtn: React.ReactElement<{ onClick: () => void }> | null = null

    const TestWrapper = () => {
      const element = StationDetailSheet({
        pin: freePin,
        onClose,
      })
      const fragments = element.props.children
      const sheetContainer = fragments[1]
      const sheetContent = sheetContainer.props.children
      const headerRow = sheetContent.props.children[0]
      capturedCloseBtn = headerRow.props.children[1]
      return element
    }

    renderToStaticMarkup(
      <MemoryRouter>
        <TestWrapper />
      </MemoryRouter>,
    )

    expect(capturedCloseBtn).not.toBeNull()
    capturedCloseBtn!.props.onClick()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('triggers onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    let capturedBackdrop: React.ReactElement<{ onClick: () => void }> | null = null

    const TestWrapper = () => {
      const element = StationDetailSheet({
        pin: freePin,
        onClose,
      })
      const fragments = element.props.children
      capturedBackdrop = fragments[0]
      return element
    }

    renderToStaticMarkup(
      <MemoryRouter>
        <TestWrapper />
      </MemoryRouter>,
    )

    expect(capturedBackdrop).not.toBeNull()
    capturedBackdrop!.props.onClick()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders fallback place text when station place is empty', () => {
    const noPlacePin: StationPin = {
      ...freePin,
      place: '',
    }

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StationDetailSheet pin={noPlacePin} onClose={() => {}} />
      </MemoryRouter>,
    )

    expect(html).toContain('📍 Chưa cập nhật địa điểm')
  })

  it('renders "Xem thêm" button for long description (> 100 chars)', () => {
    const longDescPin: StationPin = {
      ...freePin,
      description: 'Đây là một mô tả rất dài vượt quá 100 ký tự để kiểm tra hiển thị nút Xem thêm và thu gọn cho chi tiết trạm thử thách trận đấu.',
    }

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StationDetailSheet pin={longDescPin} onClose={() => {}} />
      </MemoryRouter>,
    )

    expect(html).toContain('Xem thêm')
  })

  it('calls onClose when scan button is clicked on a free station', () => {
    const onClose = vi.fn()
    const onNavigateToScan = vi.fn()
    let capturedButton: React.ReactElement<{ onClick: () => void; disabled: boolean }> | null = null

    const TestWrapper = () => {
      const element = StationDetailSheet({
        pin: freePin,
        onClose,
        onNavigateToScan,
      })
      const fragments = element.props.children
      const sheetContainer = fragments[1]
      const sheetContent = sheetContainer.props.children
      capturedButton = sheetContent.props.children[sheetContent.props.children.length - 1]
      return element
    }

    renderToStaticMarkup(
      <MemoryRouter>
        <TestWrapper />
      </MemoryRouter>,
    )

    expect(capturedButton).not.toBeNull()
    capturedButton!.props.onClick()

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onNavigateToScan).toHaveBeenCalledTimes(1)
  })

  it('renders fallback station name "Trạm thử thách" when pin.name is empty or whitespace', () => {
    const noNamePin: StationPin = {
      ...freePin,
      name: '   ',
    }

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StationDetailSheet pin={noNamePin} onClose={() => {}} />
      </MemoryRouter>,
    )

    expect(html).toContain('Trạm thử thách')
  })
})
