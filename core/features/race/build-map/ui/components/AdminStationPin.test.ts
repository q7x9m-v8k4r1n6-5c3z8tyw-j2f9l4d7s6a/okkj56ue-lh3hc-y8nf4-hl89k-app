import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import React from 'react'
import { AdminStationPin } from './AdminStationPin'
import { getStationInitial } from '../../model/frontend/usePinPlacementState'

describe('AdminStationPin Component', () => {
  it('renders teardrop pin anchored at bottom-center with correct coordinates', () => {
    const html = renderToString(
      React.createElement(AdminStationPin, {
        id: 'pin-1',
        name: 'Trạm Khởi Động',
        x: 45.5,
        y: 60.2,
      }),
    )

    expect(html).toContain('left:45.5%')
    expect(html).toContain('top:60.2%')
    expect(html).toContain('translate(-50%, -100%)')
    expect(html).toContain('origin-bottom')
    expect(html).toContain('data-testid="admin-station-pin-pin-1"')
    expect(html).toContain('aria-label="Trạm Trạm Khởi Động"')
  })

  it('renders center initial badge for booth', () => {
    const html = renderToString(
      React.createElement(AdminStationPin, {
        id: 'pin-2',
        name: 'Trạm 12',
        x: 50.0,
        y: 50.0,
      }),
    )

    expect(html).toContain('12')
  })

  it('renders distinct purple color for hidden booth', () => {
    const html = renderToString(
      React.createElement(AdminStationPin, {
        id: 'pin-hidden',
        name: 'Trạm Ẩn Mật',
        isHidden: true,
        x: 10.0,
        y: 20.0,
      }),
    )

    expect(html).toContain('#7c3aed')
  })

  it('renders selection ring when selected', () => {
    const html = renderToString(
      React.createElement(AdminStationPin, {
        id: 'pin-selected',
        name: 'Trạm Chọn',
        isSelected: true,
        x: 50.0,
        y: 50.0,
      }),
    )

    expect(html).toContain('ring-2 ring-blue-500')
    expect(html).toContain('scale-125')
  })

  it('extracts initial from names with getStationInitial helper', () => {
    expect(getStationInitial('Trạm 1')).toBe('1')
    expect(getStationInitial('Trạm 25')).toBe('25')
    expect(getStationInitial('Trạm Khởi Động')).toBe('T')
    expect(getStationInitial('Booth 7')).toBe('7')
    expect(getStationInitial('Special')).toBe('S')
    expect(getStationInitial('')).toBe('?')
  })
})
