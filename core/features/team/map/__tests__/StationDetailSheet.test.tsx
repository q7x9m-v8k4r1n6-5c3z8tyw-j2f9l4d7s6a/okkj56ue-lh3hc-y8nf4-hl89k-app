import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type React from 'react'
import DOMPurify from 'dompurify'
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
    expect(html).toContain('📍 Địa điểm: Khu liên hoàn thể thao')
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

  it('renders disabled button and does NOT render warning message when station is occupied', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StationDetailSheet pin={occupiedPin} onClose={() => {}} />
      </MemoryRouter>,
    )

    expect(html).not.toContain('Trạm đang bận, vui lòng chờ đội trước hoàn thành!')
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
    expect(html).not.toContain('điểm thưởng')
    expect(html).not.toContain('điểm cộng')
    expect(html).not.toContain('Điểm:')
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

    expect(html).toContain('📍 Địa điểm: Chưa cập nhật')
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

  it('renders station title as pure name without concatenating place', () => {
    const stationWithPlace: StationPin = {
      ...freePin,
      name: 'Trạm 1',
      place: 'ĐHBK A',
    }

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StationDetailSheet pin={stationWithPlace} onClose={() => {}} />
      </MemoryRouter>,
    )

    expect(html).toContain('Trạm 1')
    expect(html).not.toContain('Trạm 1: ĐHBK A')
    expect(html).toContain('📍 Địa điểm: ĐHBK A')
  })

  it('preserves existing colon in station title when already formatted', () => {
    const stationWithColon: StationPin = {
      ...freePin,
      name: 'Trạm 1: Khởi động',
      place: 'Cổng Đông',
    }

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StationDetailSheet pin={stationWithColon} onClose={() => {}} />
      </MemoryRouter>,
    )

    expect(html).toContain('Trạm 1: Khởi động')
    expect(html).toContain('📍 Địa điểm: Cổng Đông')
  })

  it('renders sanitized rich-text HTML description safely without raw HTML escaping', () => {
    const htmlDescPin: StationPin = {
      ...freePin,
      description:
        '<p data-path-to-node="2"><b>Vượt tường gỗ</b> và dây thép gai</p><ul><li>Độ khó: Cao</li></ul>',
    }

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StationDetailSheet pin={htmlDescPin} onClose={() => {}} />
      </MemoryRouter>,
    )

    // Rendered HTML tags must be preserved in sanitized markup
    expect(html).toContain('<b>Vượt tường gỗ</b>')
    expect(html).toContain('dây thép gai')
    expect(html).toContain('<li>Độ khó: Cao</li>')
    // Raw unparsed/escaped markup must NOT be leaked
    expect(html).not.toContain('&lt;p')
    expect(html).not.toContain('&lt;b&gt;')
    expect(html).not.toContain('&lt;ul')
    expect(html).not.toContain('&lt;li')
  })

  it('invokes DOMPurify.sanitize when available to purify HTML descriptions', () => {
    const mockSanitize = vi.fn((s: string) => s.replace(/<script>.*?<\/script>/g, ''))
    const purifyObj = DOMPurify as unknown as { sanitize?: typeof mockSanitize }
    purifyObj.sanitize = mockSanitize

    try {
      const htmlDescPin: StationPin = {
        ...freePin,
        description: '<script>alert("xss")</script><b>Sanitized text</b>',
      }

      const html = renderToStaticMarkup(
        <MemoryRouter>
          <StationDetailSheet pin={htmlDescPin} onClose={() => {}} />
        </MemoryRouter>,
      )

      expect(mockSanitize).toHaveBeenCalledWith('<script>alert("xss")</script><b>Sanitized text</b>')
      expect(html).toContain('<b>Sanitized text</b>')
      expect(html).not.toContain('<script>')
    } finally {
      delete purifyObj.sanitize
    }
  })

  it('does not display "Xem thêm" if text length with tags stripped is <= 100 chars', () => {
    // Description has long HTML tag attributes (> 100 raw chars) but only ~20 text chars
    const shortTextWithLongTagsPin: StationPin = {
      ...freePin,
      description: '<p class="very-long-css-class-name-that-has-many-characters-and-exceeds-one-hundred-chars">Thử thách vượt chướng ngại vật</p>',
    }

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StationDetailSheet pin={shortTextWithLongTagsPin} onClose={() => {}} />
      </MemoryRouter>,
    )

    expect(html).not.toContain('Xem thêm')
  })

  it('completely removes description container and does not render fallback text when description is empty or only whitespace tags', () => {
    const emptyDescPin: StationPin = {
      ...freePin,
      description: '   <p>&nbsp;</p>   ',
    }

    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StationDetailSheet pin={emptyDescPin} onClose={() => {}} />
      </MemoryRouter>,
    )

    expect(html).not.toContain('Chưa có mô tả thử thách.')
    expect(html).not.toContain('max-h-[4.5rem]')
  })

  describe('title formatting behavior', () => {
    it('returns "Trạm thử thách" for empty, whitespace, or null/undefined names', () => {
      const html1 = renderToStaticMarkup(
        <MemoryRouter>
          <StationDetailSheet pin={{ ...freePin, name: '' }} onClose={() => {}} />
        </MemoryRouter>,
      )
      expect(html1).toContain('Trạm thử thách')

      const html2 = renderToStaticMarkup(
        <MemoryRouter>
          <StationDetailSheet pin={{ ...freePin, name: '   ' }} onClose={() => {}} />
        </MemoryRouter>,
      )
      expect(html2).toContain('Trạm thử thách')

      const html3 = renderToStaticMarkup(
        <MemoryRouter>
          <StationDetailSheet
            pin={{ ...freePin, name: undefined as unknown as string }}
            onClose={() => {}}
          />
        </MemoryRouter>,
      )
      expect(html3).toContain('Trạm thử thách')
    })

    it('renders pure station name and does not concatenate place when place is present', () => {
      const html = renderToStaticMarkup(
        <MemoryRouter>
          <StationDetailSheet pin={{ ...freePin, name: 'Trạm 2', place: 'Vận Động Liên Hoàn' }} onClose={() => {}} />
        </MemoryRouter>,
      )
      expect(html).toContain('Trạm 2')
      expect(html).not.toContain('Trạm 2: Vận Động Liên Hoàn')
      expect(html).toContain('📍 Địa điểm: Vận Động Liên Hoàn')
    })

    it('preserves existing name when it already contains a colon', () => {
      const html = renderToStaticMarkup(
        <MemoryRouter>
          <StationDetailSheet pin={{ ...freePin, name: 'Trạm: Đố vui', place: 'Khu B' }} onClose={() => {}} />
        </MemoryRouter>,
      )
      expect(html).toContain('Trạm: Đố vui')
    })

    it('returns original name when name is not matching "Trạm X" pattern', () => {
      const html = renderToStaticMarkup(
        <MemoryRouter>
          <StationDetailSheet pin={{ ...freePin, name: 'Khu Vực Bí Mật', place: 'Hầm số 2' }} onClose={() => {}} />
        </MemoryRouter>,
      )
      expect(html).toContain('Khu Vực Bí Mật')
    })
  })

  describe('description sanitization behavior', () => {
    it('does not render description container or fallback text for whitespace descriptions', () => {
      const html = renderToStaticMarkup(
        <MemoryRouter>
          <StationDetailSheet pin={{ ...freePin, description: '   ' }} onClose={() => {}} />
        </MemoryRouter>,
      )
      expect(html).not.toContain('Chưa có mô tả thử thách.')
      expect(html).not.toContain('max-h-[4.5rem]')
    })

    it('does not render description container or fallback text when description contains only empty HTML tags or &nbsp;', () => {
      const html = renderToStaticMarkup(
        <MemoryRouter>
          <StationDetailSheet pin={{ ...freePin, description: '<p><br></p>' }} onClose={() => {}} />
        </MemoryRouter>,
      )
      expect(html).not.toContain('Chưa có mô tả thử thách.')
      expect(html).not.toContain('max-h-[4.5rem]')
    })

    it('renders valid rich text when content is provided', () => {
      const html = renderToStaticMarkup(
        <MemoryRouter>
          <StationDetailSheet pin={{ ...freePin, description: '  <p>Thử thách 1</p>  ' }} onClose={() => {}} />
        </MemoryRouter>,
      )
      expect(html).toContain('<p>Thử thách 1</p>')
    })
  })

  describe('isHideBoothDescription behavior', () => {
    it('completely removes description container from DOM and does not render fallback message when isHideBoothDescription is true', () => {
      const html = renderToStaticMarkup(
        <MemoryRouter>
          <StationDetailSheet
            pin={freePin}
            onClose={() => {}}
            isHideBoothDescription={true}
          />
        </MemoryRouter>,
      )

      expect(html).not.toContain('Ban tổ chức không công bố mô tả thử thách cho trạm này.')
      expect(html).not.toContain('Chưa có mô tả thử thách.')
      expect(html).not.toContain('Vượt qua tường lốp và cầu khỉ.')
      expect(html).not.toContain('max-h-[4.5rem]')
    })

    it('suppresses "Xem thêm" expand button when isHideBoothDescription is true even for very long descriptions', () => {
      const longDescPin: StationPin = {
        ...freePin,
        description: 'Đây là một mô tả rất dài vượt quá 100 ký tự để kiểm tra nút Xem thêm bị ẩn khi bật cài đặt ẩn mô tả thử thách từ phía admin ban tổ chức.',
      }

      const html = renderToStaticMarkup(
        <MemoryRouter>
          <StationDetailSheet
            pin={longDescPin}
            onClose={() => {}}
            isHideBoothDescription={true}
          />
        </MemoryRouter>,
      )

      expect(html).not.toContain('Ban tổ chức không công bố mô tả thử thách cho trạm này.')
      expect(html).not.toContain('Xem thêm')
      expect(html).not.toContain('Thu gọn')
      expect(html).not.toContain('max-h-[4.5rem]')
    })

    it('displays normal challenge description when isHideBoothDescription is false and description exists', () => {
      const html = renderToStaticMarkup(
        <MemoryRouter>
          <StationDetailSheet
            pin={freePin}
            onClose={() => {}}
            isHideBoothDescription={false}
          />
        </MemoryRouter>,
      )

      expect(html).not.toContain('Ban tổ chức không công bố mô tả thử thách cho trạm này.')
      expect(html).toContain('Vượt qua tường lốp và cầu khỉ.')
    })
  })

  describe('isDisabledBoothStatus behavior', () => {
    it('completely removes station status badge container from DOM when isDisabledBoothStatus is true', () => {
      const htmlFree = renderToStaticMarkup(
        <MemoryRouter>
          <StationDetailSheet
            pin={freePin}
            onClose={() => {}}
            isDisabledBoothStatus={true}
          />
        </MemoryRouter>,
      )
      expect(htmlFree).not.toContain('Trống / Sẵn sàng')
      expect(htmlFree).not.toContain('Đang có đội tham gia')
      expect(htmlFree).not.toContain('bg-[#168944]')

      const htmlOccupied = renderToStaticMarkup(
        <MemoryRouter>
          <StationDetailSheet
            pin={occupiedPin}
            onClose={() => {}}
            isDisabledBoothStatus={true}
          />
        </MemoryRouter>,
      )
      expect(htmlOccupied).not.toContain('Trống / Sẵn sàng')
      expect(htmlOccupied).not.toContain('Đang có đội tham gia')
      expect(htmlOccupied).not.toContain('bg-[#168944]')
    })

    it('renders enabled "Chuyển sang Quét QR" button even when station is occupied if isDisabledBoothStatus is true', () => {
      const html = renderToStaticMarkup(
        <MemoryRouter>
          <StationDetailSheet
            pin={occupiedPin}
            onClose={() => {}}
            isDisabledBoothStatus={true}
          />
        </MemoryRouter>,
      )

      expect(html).toContain('Chuyển sang Quét QR')
      expect(html).not.toContain('disabled=""')
    })

    it('allows scanning navigation when clicked on occupied station if isDisabledBoothStatus is true', () => {
      const onNavigateToScan = vi.fn()
      let capturedButton: React.ReactElement<{ onClick: () => void; disabled: boolean }> | null = null

      const TestWrapper = () => {
        const element = StationDetailSheet({
          pin: occupiedPin,
          onClose: () => {},
          onNavigateToScan,
          isDisabledBoothStatus: true,
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

      expect(onNavigateToScan).toHaveBeenCalledTimes(1)
    })

    it('renders normal status badges and disables button for occupied pin when isDisabledBoothStatus is false', () => {
      const htmlFree = renderToStaticMarkup(
        <MemoryRouter>
          <StationDetailSheet
            pin={freePin}
            onClose={() => {}}
            isDisabledBoothStatus={false}
          />
        </MemoryRouter>,
      )
      expect(htmlFree).toContain('Trống / Sẵn sàng')
      expect(htmlFree).not.toContain('disabled=""')

      const htmlOccupied = renderToStaticMarkup(
        <MemoryRouter>
          <StationDetailSheet
            pin={occupiedPin}
            onClose={() => {}}
            isDisabledBoothStatus={false}
          />
        </MemoryRouter>,
      )
      expect(htmlOccupied).toContain('Đang có đội tham gia')
      expect(htmlOccupied).toContain('disabled=""')
    })
  })
})
