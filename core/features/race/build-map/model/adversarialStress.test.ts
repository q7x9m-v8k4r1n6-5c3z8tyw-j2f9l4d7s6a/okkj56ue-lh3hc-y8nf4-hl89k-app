import { describe, expect, it } from 'vitest'
import {
  calculatePinCoordinates,
  isDropOutsideCanvas,
} from './calculatePinCoordinates'
import {
  type PlacedBoothCoordinate,
  validateAllBoothsPlaced,
} from './buildMap.validation'

describe('Adversarial Stress Test: calculatePinCoordinates & isDropOutsideCanvas', () => {
  const baseMapRect = {
    left: 100,
    top: 200,
    width: 1000,
    height: 800,
  }

  describe('Extreme Zoom Scales (0.001x to 1000x)', () => {
    const scales = [0.001, 0.25, 0.5, 1.0, 2.0, 2.5, 4.0, 10.0, 50.0, 1000.0]

    it.each(scales)('accurately maps exact center point (50%, 50%) at scale %sx', (scale) => {
      // Center of scaled content:
      // clientX = mapRect.left + positionX + 0.5 * (width * scale)
      // clientY = mapRect.top + positionY + 0.5 * (height * scale)
      const positionX = 50
      const positionY = -30
      const clientX = baseMapRect.left + positionX + 0.5 * baseMapRect.width * scale
      const clientY = baseMapRect.top + positionY + 0.5 * baseMapRect.height * scale

      const result = calculatePinCoordinates({
        clientX,
        clientY,
        mapRect: baseMapRect,
        positionX,
        positionY,
        scale,
      })

      expect(result.mapX).toBe(50)
      expect(result.mapY).toBe(50)
    })

    it.each(scales)('accurately maps corners (0%, 0%) and (100%, 100%) at scale %sx', (scale) => {
      const positionX = -150
      const positionY = 250

      // Top-left corner (0%, 0%)
      const clientTopLeft = {
        clientX: baseMapRect.left + positionX,
        clientY: baseMapRect.top + positionY,
      }
      const topLeftRes = calculatePinCoordinates({
        ...clientTopLeft,
        mapRect: baseMapRect,
        positionX,
        positionY,
        scale,
      })
      expect(topLeftRes.mapX).toBe(0)
      expect(topLeftRes.mapY).toBe(0)

      // Bottom-right corner (100%, 100%)
      const clientBottomRight = {
        clientX: baseMapRect.left + positionX + baseMapRect.width * scale,
        clientY: baseMapRect.top + positionY + baseMapRect.height * scale,
      }
      const bottomRightRes = calculatePinCoordinates({
        ...clientBottomRight,
        mapRect: baseMapRect,
        positionX,
        positionY,
        scale,
      })
      expect(bottomRightRes.mapX).toBe(100)
      expect(bottomRightRes.mapY).toBe(100)
    })

    it('safely handles scale <= 0 by returning (0, 0)', () => {
      const invalidScales = [0, -0.001, -1, -10, -Infinity]
      for (const scale of invalidScales) {
        const res = calculatePinCoordinates({
          clientX: 500,
          clientY: 400,
          mapRect: baseMapRect,
          positionX: 0,
          positionY: 0,
          scale,
        })
        expect(res).toEqual({ mapX: 0, mapY: 0 })
      }
    })

    it('empirically evaluates behavior under NaN and Infinite parameters', () => {
      // scale = NaN: since (NaN <= 0) is false, it proceeds and produces NaN
      const resNaNScale = calculatePinCoordinates({
        clientX: 500,
        clientY: 400,
        mapRect: baseMapRect,
        positionX: 0,
        positionY: 0,
        scale: Number.NaN,
      })
      expect(Number.isNaN(resNaNScale.mapX)).toBe(true)
      expect(Number.isNaN(resNaNScale.mapY)).toBe(true)

      // clientX = NaN
      const resNaNClient = calculatePinCoordinates({
        clientX: Number.NaN,
        clientY: 400,
        mapRect: baseMapRect,
        positionX: 0,
        positionY: 0,
        scale: 1,
      })
      expect(Number.isNaN(resNaNClient.mapX)).toBe(true)

      // width = NaN
      const resNaNWidth = calculatePinCoordinates({
        clientX: 500,
        clientY: 400,
        mapRect: { ...baseMapRect, width: Number.NaN },
        positionX: 0,
        positionY: 0,
        scale: 1,
      })
      expect(Number.isNaN(resNaNWidth.mapX)).toBe(true)

      // scale = Infinity -> division by Infinity yields 0
      const resInfScale = calculatePinCoordinates({
        clientX: 500,
        clientY: 400,
        mapRect: baseMapRect,
        positionX: 0,
        positionY: 0,
        scale: Infinity,
      })
      expect(resInfScale).toEqual({ mapX: 0, mapY: 0 })
    })
  })

  describe('Extreme Pan Offsets (Large Positive & Negative Offsets)', () => {
    const extremePans = [
      { positionX: -100_000, positionY: -100_000 },
      { positionX: 100_000, positionY: 100_000 },
      { positionX: -50_000, positionY: 50_000 },
      { positionX: 12345.6789, positionY: -98765.4321 },
    ]

    it.each(extremePans)(
      'compensates pan offset ($positionX, $positionY) correctly for 25% and 75% points',
      ({ positionX, positionY }) => {
        const scale = 2.0

        const clientX25 = baseMapRect.left + positionX + 0.25 * baseMapRect.width * scale
        const clientY75 = baseMapRect.top + positionY + 0.75 * baseMapRect.height * scale

        const res = calculatePinCoordinates({
          clientX: clientX25,
          clientY: clientY75,
          mapRect: baseMapRect,
          positionX,
          positionY,
          scale,
        })

        expect(res.mapX).toBe(25)
        expect(res.mapY).toBe(75)
      },
    )
  })

  describe('Boundary Clamping & Out-of-Bounds Clicks', () => {
    it('clamps clicks outside left/top to 0.00', () => {
      const res = calculatePinCoordinates({
        clientX: -999999,
        clientY: -999999,
        mapRect: baseMapRect,
        positionX: 0,
        positionY: 0,
        scale: 1,
      })
      expect(res.mapX).toBe(0)
      expect(res.mapY).toBe(0)
      expect(Object.is(res.mapX, -0)).toBe(false)
      expect(Object.is(res.mapY, -0)).toBe(false)
    })

    it('clamps clicks outside right/bottom to 100.00', () => {
      const res = calculatePinCoordinates({
        clientX: 999999,
        clientY: 999999,
        mapRect: baseMapRect,
        positionX: 0,
        positionY: 0,
        scale: 1,
      })
      expect(res.mapX).toBe(100)
      expect(res.mapY).toBe(100)
    })

    it('clamps 1px outside boundaries exactly', () => {
      const positionX = 0
      const positionY = 0
      const scale = 1

      // 1px left of map
      const resLeft = calculatePinCoordinates({
        clientX: baseMapRect.left - 1,
        clientY: baseMapRect.top + 400,
        mapRect: baseMapRect,
        positionX,
        positionY,
        scale,
      })
      expect(resLeft.mapX).toBe(0)

      // 1px above map
      const resTop = calculatePinCoordinates({
        clientX: baseMapRect.left + 500,
        clientY: baseMapRect.top - 1,
        mapRect: baseMapRect,
        positionX,
        positionY,
        scale,
      })
      expect(resTop.mapY).toBe(0)

      // 1px right of map
      const resRight = calculatePinCoordinates({
        clientX: baseMapRect.left + baseMapRect.width + 1,
        clientY: baseMapRect.top + 400,
        mapRect: baseMapRect,
        positionX,
        positionY,
        scale,
      })
      expect(resRight.mapX).toBe(100)

      // 1px below map
      const resBottom = calculatePinCoordinates({
        clientX: baseMapRect.left + 500,
        clientY: baseMapRect.top + baseMapRect.height + 1,
        mapRect: baseMapRect,
        positionX,
        positionY,
        scale,
      })
      expect(resBottom.mapY).toBe(100)
    })
  })

  describe('Rounding Precision & Float Stability', () => {
    it('always rounds to strictly 2 decimal places', () => {
      // 1/7 = 0.142857142857... -> 14.29%
      // 1/3 = 0.333333333333... -> 33.33%
      const res = calculatePinCoordinates({
        clientX: baseMapRect.left + (baseMapRect.width * (1 / 3)),
        clientY: baseMapRect.top + (baseMapRect.height * (1 / 7)),
        mapRect: baseMapRect,
        positionX: 0,
        positionY: 0,
        scale: 1,
      })

      expect(res.mapX).toBe(33.33)
      expect(res.mapY).toBe(14.29)
      expect(res.mapX.toString().split('.')[1]?.length ?? 0).toBeLessThanOrEqual(2)
      expect(res.mapY.toString().split('.')[1]?.length ?? 0).toBeLessThanOrEqual(2)
    })

    it('handles floating point values with repeating fractions without precision drift', () => {
      // 2/3 = 0.6666666... -> 66.67%
      const res = calculatePinCoordinates({
        clientX: baseMapRect.left + (baseMapRect.width * (2 / 3)),
        clientY: baseMapRect.top + (baseMapRect.height * (5 / 6)),
        mapRect: baseMapRect,
        positionX: 0,
        positionY: 0,
        scale: 1,
      })

      expect(res.mapX).toBe(66.67)
      expect(res.mapY).toBe(83.33)
    })
  })

  describe('Fuzz / Monte Carlo Roundtrip Invariant Verification (1,000 Random Points)', () => {
    it('maintains [0.00, 100.00] range and reversible precision across 1,000 random setups', () => {
      const numTests = 1000
      let seed = 42
      const pseudoRandom = () => {
        seed = (seed * 9301 + 49297) % 233280
        return seed / 233280
      }

      for (let i = 0; i < numTests; i++) {
        const left = 50 + pseudoRandom() * 200
        const top = 50 + pseudoRandom() * 200
        const width = 300 + pseudoRandom() * 1500
        const height = 300 + pseudoRandom() * 1200
        const scale = 0.5 + pseudoRandom() * 4.0
        const positionX = -500 + pseudoRandom() * 1000
        const positionY = -500 + pseudoRandom() * 1000

        // Target map percentage between 0 and 100 (step 0.01)
        const targetX = Math.round(pseudoRandom() * 10000) / 100
        const targetY = Math.round(pseudoRandom() * 10000) / 100

        // Derive client coordinate that produces this percentage
        const clientX = left + positionX + (targetX / 100) * width * scale
        const clientY = top + positionY + (targetY / 100) * height * scale

        const result = calculatePinCoordinates({
          clientX,
          clientY,
          mapRect: { left, top, width, height },
          positionX,
          positionY,
          scale,
        })

        // Invariants:
        expect(result.mapX).toBeGreaterThanOrEqual(0)
        expect(result.mapX).toBeLessThanOrEqual(100)
        expect(result.mapY).toBeGreaterThanOrEqual(0)
        expect(result.mapY).toBeLessThanOrEqual(100)

        // Floating precision: difference should be at most 0.01 due to rounding
        expect(Math.abs(result.mapX - targetX)).toBeLessThanOrEqual(0.0100001)
        expect(Math.abs(result.mapY - targetY)).toBeLessThanOrEqual(0.0100001)

        // Verification of 2 decimal places max
        const decimalPlacesX = (result.mapX.toString().split('.')[1] || '').length
        const decimalPlacesY = (result.mapY.toString().split('.')[1] || '').length
        expect(decimalPlacesX).toBeLessThanOrEqual(2)
        expect(decimalPlacesY).toBeLessThanOrEqual(2)
      }
    })
  })

  describe('isDropOutsideCanvas Boundary Tests', () => {
    const canvasBounds = {
      left: 100,
      top: 50,
      right: 700,
      bottom: 450,
    }

    it('returns false for points exactly ON the 4 boundaries and 4 corners', () => {
      // 4 corners
      expect(isDropOutsideCanvas(100, 50, canvasBounds)).toBe(false)
      expect(isDropOutsideCanvas(700, 50, canvasBounds)).toBe(false)
      expect(isDropOutsideCanvas(100, 450, canvasBounds)).toBe(false)
      expect(isDropOutsideCanvas(700, 450, canvasBounds)).toBe(false)

      // 4 edges
      expect(isDropOutsideCanvas(400, 50, canvasBounds)).toBe(false) // top edge
      expect(isDropOutsideCanvas(400, 450, canvasBounds)).toBe(false) // bottom edge
      expect(isDropOutsideCanvas(100, 250, canvasBounds)).toBe(false) // left edge
      expect(isDropOutsideCanvas(700, 250, canvasBounds)).toBe(false) // right edge
    })

    it('returns false for points 1px inside the canvas', () => {
      expect(isDropOutsideCanvas(101, 51, canvasBounds)).toBe(false)
      expect(isDropOutsideCanvas(699, 449, canvasBounds)).toBe(false)
    })

    it('returns true for points 1px outside the canvas in all 4 cardinal directions', () => {
      expect(isDropOutsideCanvas(99, 250, canvasBounds)).toBe(true) // left
      expect(isDropOutsideCanvas(701, 250, canvasBounds)).toBe(true) // right
      expect(isDropOutsideCanvas(400, 49, canvasBounds)).toBe(true) // top
      expect(isDropOutsideCanvas(400, 451, canvasBounds)).toBe(true) // bottom
    })

    it('returns true for subpixel values outside boundaries', () => {
      expect(isDropOutsideCanvas(99.99, 250, canvasBounds)).toBe(true)
      expect(isDropOutsideCanvas(700.01, 250, canvasBounds)).toBe(true)
      expect(isDropOutsideCanvas(400, 49.99, canvasBounds)).toBe(true)
      expect(isDropOutsideCanvas(400, 450.01, canvasBounds)).toBe(true)
    })

    it('derives right and bottom correctly when only width and height are provided', () => {
      const boundsWithoutRightBottom = {
        left: 200,
        top: 150,
        width: 600,
        height: 400,
      }
      // right should be 800, bottom should be 550
      expect(isDropOutsideCanvas(800, 550, boundsWithoutRightBottom)).toBe(false)
      expect(isDropOutsideCanvas(801, 550, boundsWithoutRightBottom)).toBe(true)
      expect(isDropOutsideCanvas(800, 551, boundsWithoutRightBottom)).toBe(true)
      expect(isDropOutsideCanvas(199, 300, boundsWithoutRightBottom)).toBe(true)
      expect(isDropOutsideCanvas(500, 149, boundsWithoutRightBottom)).toBe(true)
    })

    it('handles negative coordinates (e.g. multi-monitor setups or offsets)', () => {
      const negativeBounds = {
        left: -800,
        top: -600,
        right: -200,
        bottom: -100,
      }
      expect(isDropOutsideCanvas(-500, -350, negativeBounds)).toBe(false)
      expect(isDropOutsideCanvas(-801, -350, negativeBounds)).toBe(true)
      expect(isDropOutsideCanvas(-199, -350, negativeBounds)).toBe(true)
      expect(isDropOutsideCanvas(-500, -601, negativeBounds)).toBe(true)
      expect(isDropOutsideCanvas(-500, -99, negativeBounds)).toBe(true)
    })

    it('empirically evaluates behavior of isDropOutsideCanvas with NaN coordinates', () => {
      // In JS: (NaN < left) is false, (NaN > right) is false, etc.
      // Therefore isDropOutsideCanvas(NaN, NaN, canvasBounds) returns false (considered inside)
      expect(isDropOutsideCanvas(Number.NaN, 250, canvasBounds)).toBe(false)
      expect(isDropOutsideCanvas(400, Number.NaN, canvasBounds)).toBe(false)
    })
  })
})

describe('Adversarial Stress Test: validateAllBoothsPlaced', () => {
  describe('Empty and Edge-Case Booth Lists', () => {
    it('returns isValid: false when allBooths is empty array', () => {
      const res = validateAllBoothsPlaced([], [])
      expect(res).toEqual({
        isValid: false,
        missingBoothIds: [],
        missingCount: 0,
        totalCount: 0,
      })
    })

    it('handles null or undefined allBooths gracefully', () => {
      const resNull = validateAllBoothsPlaced(null as unknown as [], [])
      expect(resNull.isValid).toBe(false)
      expect(resNull.totalCount).toBe(0)

      const resUndef = validateAllBoothsPlaced(undefined as unknown as [], [])
      expect(resUndef.isValid).toBe(false)
      expect(resUndef.totalCount).toBe(0)
    })

    it('checks behavior when placedBooths is null or undefined (runtime defensive check)', () => {
      // If placedBooths is null or undefined at runtime, does it throw or handle gracefully?
      expect(() =>
        validateAllBoothsPlaced([{ boothId: 'b-1' }], null as unknown as PlacedBoothCoordinate[]),
      ).toThrow()

      expect(() =>
        validateAllBoothsPlaced([{ boothId: 'b-1' }], undefined as unknown as PlacedBoothCoordinate[]),
      ).toThrow()
    })

    it('checks behavior when placedBooths is empty but allBooths has items', () => {
      const allBooths = [{ boothId: 'b-1' }, { boothId: 'b-2' }]
      const res = validateAllBoothsPlaced(allBooths, [])
      expect(res.isValid).toBe(false)
      expect(res.missingBoothIds).toEqual(['b-1', 'b-2'])
      expect(res.missingCount).toBe(2)
      expect(res.totalCount).toBe(2)
    })
  })

  describe('ID Mismatches and Duplicate IDs', () => {
    it('flags booths whose IDs exist in allBooths but not in placedBooths', () => {
      const allBooths = [{ boothId: 'alpha' }, { boothId: 'beta' }, { boothId: 'gamma' }]
      const placedBooths: PlacedBoothCoordinate[] = [
        { boothId: 'alpha', mapX: 10, mapY: 20 },
        { boothId: 'unknown-id-1', mapX: 50, mapY: 50 },
        { boothId: 'unknown-id-2', mapX: 60, mapY: 60 },
      ]

      const res = validateAllBoothsPlaced(allBooths, placedBooths)
      expect(res.isValid).toBe(false)
      expect(res.missingBoothIds).toEqual(['beta', 'gamma'])
      expect(res.missingCount).toBe(2)
      expect(res.totalCount).toBe(3)
    })

    it('handles duplicate placedBooth entries by checking the final coordinate state in Map', () => {
      const allBooths = [{ boothId: 'b-1' }]
      // First entry is invalid (null mapX), but second entry is valid (15, 25)
      const placedWithFix: PlacedBoothCoordinate[] = [
        { boothId: 'b-1', mapX: null, mapY: 50 },
        { boothId: 'b-1', mapX: 15, mapY: 25 },
      ]
      const resFixed = validateAllBoothsPlaced(allBooths, placedWithFix)
      expect(resFixed.isValid).toBe(true)

      // Conversely: first valid, but overwritten with invalid
      const placedWithInvalidOverwrite: PlacedBoothCoordinate[] = [
        { boothId: 'b-1', mapX: 15, mapY: 25 },
        { boothId: 'b-1', mapX: null, mapY: 25 },
      ]
      const resInvalid = validateAllBoothsPlaced(allBooths, placedWithInvalidOverwrite)
      expect(resInvalid.isValid).toBe(false)
      expect(resInvalid.missingBoothIds).toEqual(['b-1'])
    })
  })

  describe('Corrupted & Boundary Coordinates (NaN, Infinity, Strings, Out-of-Bounds)', () => {
    const allBooths = [{ boothId: 'b-test' }]

    it.each([
      ['null mapX', { boothId: 'b-test', mapX: null, mapY: 50 }],
      ['null mapY', { boothId: 'b-test', mapX: 50, mapY: null }],
      ['undefined mapX', { boothId: 'b-test', mapX: undefined, mapY: 50 }],
      ['undefined mapY', { boothId: 'b-test', mapX: 50, mapY: undefined }],
      ['NaN mapX', { boothId: 'b-test', mapX: Number.NaN, mapY: 50 }],
      ['NaN mapY', { boothId: 'b-test', mapX: 50, mapY: Number.NaN }],
      ['Infinity mapX', { boothId: 'b-test', mapX: Infinity, mapY: 50 }],
      ['Infinity mapY', { boothId: 'b-test', mapX: 50, mapY: Infinity }],
      ['-Infinity mapX', { boothId: 'b-test', mapX: -Infinity, mapY: 50 }],
      ['-Infinity mapY', { boothId: 'b-test', mapX: 50, mapY: -Infinity }],
      ['Negative mapX (-0.001)', { boothId: 'b-test', mapX: -0.001, mapY: 50 }],
      ['Negative mapY (-10)', { boothId: 'b-test', mapX: 50, mapY: -10 }],
      ['Excessive mapX (100.001)', { boothId: 'b-test', mapX: 100.001, mapY: 50 }],
      ['Excessive mapY (150)', { boothId: 'b-test', mapX: 50, mapY: 150 }],
      ['String mapX (type confusion)', { boothId: 'b-test', mapX: '50' as unknown as number, mapY: 50 }],
      ['String mapY (type confusion)', { boothId: 'b-test', mapX: 50, mapY: '50' as unknown as number }],
    ])('rejects invalid coordinate variant: %s', (_, placedItem) => {
      const res = validateAllBoothsPlaced(allBooths, [placedItem])
      expect(res.isValid).toBe(false)
      expect(res.missingBoothIds).toEqual(['b-test'])
    })

    it('accepts exact boundaries 0.00 and 100.00', () => {
      const boundaryBooths = [
        { boothId: 'b-zero' },
        { boothId: 'b-max' },
        { boothId: 'b-mixed' },
      ]
      const placed: PlacedBoothCoordinate[] = [
        { boothId: 'b-zero', mapX: 0.0, mapY: 0.0 },
        { boothId: 'b-max', mapX: 100.0, mapY: 100.0 },
        { boothId: 'b-mixed', mapX: 0.0, mapY: 100.0 },
      ]
      const res = validateAllBoothsPlaced(boundaryBooths, placed)
      expect(res.isValid).toBe(true)
      expect(res.missingBoothIds).toEqual([])
      expect(res.missingCount).toBe(0)
    })

    it('accepts high precision floating coordinates inside [0, 100]', () => {
      const precisionBooths = [{ boothId: 'b-1' }, { boothId: 'b-2' }]
      const placed: PlacedBoothCoordinate[] = [
        { boothId: 'b-1', mapX: 99.99999, mapY: 0.00001 },
        { boothId: 'b-2', mapX: 12.3456789, mapY: 87.654321 },
      ]
      const res = validateAllBoothsPlaced(precisionBooths, placed)
      expect(res.isValid).toBe(true)
      expect(res.missingCount).toBe(0)
    })

    it('correctly handles sparse or null items inside placedBooths array', () => {
      const allBooths = [{ boothId: 'b-1' }, { boothId: 'b-2' }]
      const placedWithGaps: PlacedBoothCoordinate[] = [
        null as unknown as PlacedBoothCoordinate,
        { boothId: 'b-1', mapX: 50, mapY: 50 },
        undefined as unknown as PlacedBoothCoordinate,
        { boothId: 'b-2', mapX: 75, mapY: 25 },
      ]

      const res = validateAllBoothsPlaced(allBooths, placedWithGaps)
      expect(res.isValid).toBe(true)
      expect(res.missingCount).toBe(0)
    })
  })

  describe('Scalability & Stress Testing (1,000 Stations)', () => {
    it('evaluates 1,000 fully placed stations in <50ms', () => {
      const allBooths = Array.from({ length: 1000 }, (_, i) => ({
        boothId: `booth-${i}`,
      }))
      const placedBooths: PlacedBoothCoordinate[] = Array.from({ length: 1000 }, (_, i) => ({
        boothId: `booth-${i}`,
        mapX: (i * 0.09) % 100,
        mapY: (i * 0.08) % 100,
      }))

      const start = performance.now()
      const res = validateAllBoothsPlaced(allBooths, placedBooths)
      const duration = performance.now() - start

      expect(res.isValid).toBe(true)
      expect(res.totalCount).toBe(1000)
      expect(res.missingCount).toBe(0)
      expect(duration).toBeLessThan(50)
    })

    it('identifies exact single missing station among 1,000 stations', () => {
      const allBooths = Array.from({ length: 1000 }, (_, i) => ({
        boothId: `booth-${i}`,
      }))
      // Omit booth-543
      const placedBooths: PlacedBoothCoordinate[] = allBooths
        .filter((b) => b.boothId !== 'booth-543')
        .map((b, i) => ({
          boothId: b.boothId,
          mapX: (i * 0.05) % 100,
          mapY: (i * 0.07) % 100,
        }))

      const res = validateAllBoothsPlaced(allBooths, placedBooths)
      expect(res.isValid).toBe(false)
      expect(res.totalCount).toBe(1000)
      expect(res.missingCount).toBe(1)
      expect(res.missingBoothIds).toEqual(['booth-543'])
    })
  })
})
