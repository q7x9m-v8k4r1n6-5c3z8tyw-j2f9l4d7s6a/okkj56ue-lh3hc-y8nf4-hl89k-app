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
    })
  })

  it('ignores an untouched station and validates a started station', () => {
    const emptyStation = {
      id: 'empty',
      name: '',
      location: '',
      managers: [],
      description: '',
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
})
