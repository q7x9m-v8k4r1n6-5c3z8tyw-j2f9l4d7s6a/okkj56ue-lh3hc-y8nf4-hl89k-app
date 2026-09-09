import { describe, expect, it } from 'vitest'
import {
  calculatePinCoordinates,
  clamp,
  isDropOutsideCanvas,
} from './calculatePinCoordinates'

describe('calculatePinCoordinates', () => {
  const defaultRect = {
    left: 100,
    top: 50,
    width: 800,
    height: 600,
  }

  it('calculates unscaled exact 50% center coordinates', () => {
    const coords = calculatePinCoordinates({
      clientX: 500, // 100 + 400 = 500
      clientY: 350, // 50 + 300 = 350
      mapRect: defaultRect,
      positionX: 0,
      positionY: 0,
      scale: 1,
    })

    expect(coords.mapX).toBe(50)
    expect(coords.mapY).toBe(50)
  })

  it('compensates for zoom scale and pan offset correctly', () => {
    // scale = 2
    // unscaled width = 800, scaled width = 1600
    // positionX = -200 (panned left by 200px)
    // clientX = 300
    // (clientX - left - positionX) = 300 - 100 - (-200) = 400
    // (400 / (800 * 2)) * 100 = (400 / 1600) * 100 = 25%
    const coords = calculatePinCoordinates({
      clientX: 300,
      clientY: 200, // 200 - 50 - (-150) = 300 / 1200 * 100 = 25%
      mapRect: defaultRect,
      positionX: -200,
      positionY: -150,
      scale: 2,
    })

    expect(coords.mapX).toBe(25)
    expect(coords.mapY).toBe(25)
  })

  it('clamps coordinates below 0 to 0.00', () => {
    const coords = calculatePinCoordinates({
      clientX: 50, // before left bound of 100
      clientY: 20, // before top bound of 50
      mapRect: defaultRect,
      positionX: 0,
      positionY: 0,
      scale: 1,
    })

    expect(coords.mapX).toBe(0)
    expect(coords.mapY).toBe(0)
  })

  it('clamps coordinates above 100 to 100.00', () => {
    const coords = calculatePinCoordinates({
      clientX: 1200, // beyond right bound of 900
      clientY: 800, // beyond bottom bound of 650
      mapRect: defaultRect,
      positionX: 0,
      positionY: 0,
      scale: 1,
    })

    expect(coords.mapX).toBe(100)
    expect(coords.mapY).toBe(100)
  })

  it('rounds to 2 decimal places', () => {
    // 1/3 of 800 = 266.666...
    const coords = calculatePinCoordinates({
      clientX: 100 + 800 / 3,
      clientY: 50 + 600 / 7,
      mapRect: defaultRect,
      positionX: 0,
      positionY: 0,
      scale: 1,
    })

    expect(coords.mapX).toBe(33.33)
    expect(coords.mapY).toBe(14.29)
  })

  it('handles zero or negative dimensions safely', () => {
    expect(
      calculatePinCoordinates({
        clientX: 100,
        clientY: 100,
        mapRect: { left: 0, top: 0, width: 0, height: 600 },
        positionX: 0,
        positionY: 0,
        scale: 1,
      }),
    ).toEqual({ mapX: 0, mapY: 0 })

    expect(
      calculatePinCoordinates({
        clientX: 100,
        clientY: 100,
        mapRect: { left: 0, top: 0, width: 800, height: -10 },
        positionX: 0,
        positionY: 0,
        scale: 1,
      }),
    ).toEqual({ mapX: 0, mapY: 0 })

    expect(
      calculatePinCoordinates({
        clientX: 100,
        clientY: 100,
        mapRect: defaultRect,
        positionX: 0,
        positionY: 0,
        scale: 0,
      }),
    ).toEqual({ mapX: 0, mapY: 0 })
  })
})

describe('clamp', () => {
  it('clamps values correctly', () => {
    expect(clamp(50, 0, 100)).toBe(50)
    expect(clamp(-10, 0, 100)).toBe(0)
    expect(clamp(150, 0, 100)).toBe(100)
  })
})

describe('isDropOutsideCanvas', () => {
  const canvasRect = {
    left: 200,
    top: 100,
    right: 800,
    bottom: 600,
  }

  it('returns false when point is inside canvas', () => {
    expect(isDropOutsideCanvas(300, 200, canvasRect)).toBe(false)
    expect(isDropOutsideCanvas(200, 100, canvasRect)).toBe(false)
    expect(isDropOutsideCanvas(800, 600, canvasRect)).toBe(false)
  })

  it('returns true when point is outside canvas bounds', () => {
    expect(isDropOutsideCanvas(150, 200, canvasRect)).toBe(true) // left
    expect(isDropOutsideCanvas(850, 200, canvasRect)).toBe(true) // right
    expect(isDropOutsideCanvas(300, 50, canvasRect)).toBe(true) // top
    expect(isDropOutsideCanvas(300, 650, canvasRect)).toBe(true) // bottom
  })

  it('computes right and bottom from width and height if not directly provided', () => {
    const rectWithDimensions = {
      left: 100,
      top: 50,
      width: 400,
      height: 300,
    }
    expect(isDropOutsideCanvas(200, 150, rectWithDimensions)).toBe(false)
    expect(isDropOutsideCanvas(550, 150, rectWithDimensions)).toBe(true)
  })
})
