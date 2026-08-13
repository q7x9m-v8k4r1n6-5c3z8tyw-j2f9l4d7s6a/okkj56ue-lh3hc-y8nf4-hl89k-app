import { describe, expect, it } from 'vitest'
import {
  hasStationContent,
  validateBasicStep,
  validateStationStep,
} from './createRace.validation'

describe('create-race validation', () => {
  it('reports required and chronological basic-information errors', () => {
    expect(validateBasicStep({
      name: '',
      startAt: '2026-01-02T10:00',
      endAt: '2026-01-02T09:00',
      imageName: '',
      location: '',
      rules: '',
    })).toEqual({
      name: 'Vui lòng nhập tên trận đấu.',
      endAt: 'Thời gian kết thúc phải sau thời gian bắt đầu.',
      location: 'Vui lòng nhập địa điểm trận đấu.',
      rules: 'Vui lòng nhập luật trận đấu.',
    })
  })

  it('ignores an untouched station and validates a started station', () => {
    const emptyStation = {
      id: 'empty',
      name: '',
      location: '',
      managers: [],
      description: '',
      isHidden: false,
    }
    const startedStation = {
      ...emptyStation,
      id: 'started',
      description: '<p>Luật chơi</p>',
    }

    expect(hasStationContent(emptyStation)).toBe(false)
    expect(validateStationStep([emptyStation, startedStation])).toEqual({
      started: {
        name: 'Vui lòng nhập tên trạm.',
        location: 'Vui lòng nhập địa điểm.',
        managers: 'Vui lòng chọn ít nhất một quản trạm.',
      },
    })
  })

  it('treats selecting hidden as starting a station draft', () => {
    const hiddenStation = {
      id: 'hidden',
      name: '',
      location: '',
      managers: [],
      description: '',
      isHidden: true,
    }

    expect(hasStationContent(hiddenStation)).toBe(true)
    expect(validateStationStep([hiddenStation])).toEqual({
      hidden: {
        name: 'Vui lòng nhập tên trạm.',
        location: 'Vui lòng nhập địa điểm.',
        managers: 'Vui lòng chọn ít nhất một quản trạm.',
      },
    })
  })

  it('rejects one organizer assigned to multiple stations', () => {
    const manager = {
      id: '11111111-1111-4111-8111-111111111111',
      email: 'organizer@example.com',
      displayName: 'Organizer',
    }
    const station = (id: string) => ({
      id,
      name: `Station ${id}`,
      location: 'BK',
      managers: [manager],
      description: '',
      isHidden: false,
    })

    expect(validateStationStep([station('one'), station('two')])).toEqual({
      one: { managers: 'Mỗi quản trạm chỉ được quản lý một trạm.' },
      two: { managers: 'Mỗi quản trạm chỉ được quản lý một trạm.' },
    })
  })
})
