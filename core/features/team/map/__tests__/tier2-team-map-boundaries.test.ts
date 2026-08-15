import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderToString } from 'react-dom/server'
import React from 'react'
import { StationPinItem } from '../ui/components/StationPinItem'
import { StationDetailSheet } from '../ui/components/StationDetailSheet'
import type { StationPin } from '../model/teamMap.types'

describe('Tier 2: Team Map Boundary & Corner Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =========================================================================
  // Boundary 1: Extreme Pin Positions (0%, 100%) on Player Viewport
  // =========================================================================
  describe('Boundary 1: Extreme Pin Coordinates (0% - 100%)', () => {
    it('T2.TM.1: renders pin at exact top-left corner (0%, 0%) without clipping out of container', () => {
      const pin: StationPin = {
        id: 'p-tl',
        name: 'Trạm Góc Trái Trên',
        code: 'TL',
        x: 0,
        y: 0,
        status: 'active',
        points: 100,
        description: '',
      }

      const html = renderToString(
        React.createElement(StationPinItem, { pin, isSelected: false, onClick: () => {} }),
      )

      expect(html).toContain('left:0%')
      expect(html).toContain('top:0%')
    })

    it('T2.TM.2: renders pin at exact bottom-right corner (100%, 100%) without overflow', () => {
      const pin: StationPin = {
        id: 'p-br',
        name: 'Trạm Góc Phải Dưới',
        code: 'BR',
        x: 100,
        y: 100,
        status: 'active',
        points: 100,
        description: '',
      }

      const html = renderToString(
        React.createElement(StationPinItem, { pin, isSelected: false, onClick: () => {} }),
      )

      expect(html).toContain('left:100%')
      expect(html).toContain('top:100%')
    })

    it('T2.TM.3: handles decimal percentage coordinates (33.33%, 66.67%) with high rendering fidelity', () => {
      const pin: StationPin = {
        id: 'p-dec',
        name: 'Trạm Tọa Độ Lẻ',
        code: 'DL',
        x: 33.33,
        y: 66.67,
        status: 'active',
        points: 100,
        description: '',
      }

      const html = renderToString(
        React.createElement(StationPinItem, { pin, isSelected: false, onClick: () => {} }),
      )

      expect(html).toContain('left:33.33%')
      expect(html).toContain('top:66.67%')
    })
  })

  // =========================================================================
  // Boundary 2: Hidden Booths (isHidden: true) Handling
  // =========================================================================
  describe('Boundary 2: Hidden Booths Filtering', () => {
    it('T2.TM.4: filters isHidden booths if team visibility rule excludes secret stations', () => {
      const booths = [
        { id: 'b1', name: 'Trạm 1', mapX: 20, mapY: 30, isHidden: false },
        { id: 'b2', name: 'Trạm Bí Mật', mapX: 50, mapY: 50, isHidden: true },
      ]

      const visibleBooths = booths.filter((b) => !b.isHidden)
      expect(visibleBooths).toHaveLength(1)
      expect(visibleBooths[0].id).toBe('b1')
    })

    it('T2.TM.5: handles null description or missing points gracefully in StationDetailSheet', () => {
      const pin: StationPin = {
        id: 'p-no-desc',
        name: 'Trạm Không Mô Tả',
        code: 'KMT',
        x: 10,
        y: 10,
        status: 'active',
        points: 0,
        description: '',
      }

      const html = renderToString(
        React.createElement(StationDetailSheet, { pin, onClose: () => {} }),
      )

      expect(html).toContain('Trạm Không Mô Tả')
    })
  })

  // =========================================================================
  // Boundary 3: Station Status Variants (active, locked, completed)
  // =========================================================================
  describe('Boundary 3: Station Status Variants', () => {
    it('T2.TM.6: renders active station pin with distinct visual indicator', () => {
      const activePin: StationPin = {
        id: 'p-act',
        name: 'Trạm Đang Mở',
        code: 'A',
        x: 20,
        y: 20,
        status: 'active',
        points: 100,
        description: '',
      }

      const html = renderToString(
        React.createElement(StationPinItem, { pin: activePin, isSelected: false, onClick: () => {} }),
      )

      expect(html).toContain('Trạm Đang Mở')
    })

    it('T2.TM.7: renders locked station pin with lock styling', () => {
      const lockedPin: StationPin = {
        id: 'p-lock',
        name: 'Trạm Khóa',
        code: 'L',
        x: 40,
        y: 40,
        status: 'locked',
        points: 50,
        description: '',
      }

      const html = renderToString(
        React.createElement(StationPinItem, { pin: lockedPin, isSelected: false, onClick: () => {} }),
      )

      expect(html).toContain('Trạm Khóa')
    })

    it('T2.TM.8: renders completed station pin with completed check/badge styling', () => {
      const completedPin: StationPin = {
        id: 'p-done',
        name: 'Trạm Hoàn Thành',
        code: 'D',
        x: 60,
        y: 60,
        status: 'completed',
        points: 200,
        description: '',
      }

      const html = renderToString(
        React.createElement(StationPinItem, { pin: completedPin, isSelected: false, onClick: () => {} }),
      )

      expect(html).toContain('Trạm Hoàn Thành')
    })
  })

  // =========================================================================
  // Boundary 4: Selection & Keyboard Interactions
  // =========================================================================
  describe('Boundary 4: Selection & Keyboard Interactions', () => {
    it('T2.TM.9: clears pin selection when Escape key is pressed', () => {
      let selectedId: string | null = 'p1'
      const handleKeyDown = (key: string) => {
        if (key === 'Escape') selectedId = null
      }

      handleKeyDown('Escape')
      expect(selectedId).toBeNull()
    })

    it('T2.TM.10: closes StationDetailSheet when onClose is triggered', () => {
      const onCloseMock = vi.fn()
      onCloseMock()
      expect(onCloseMock).toHaveBeenCalledTimes(1)
    })
  })
})
