import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MapFloatingControls } from '../ui/components/MapFloatingControls'

const mockResetTransform = vi.fn()
const mockZoomIn = vi.fn()
const mockZoomOut = vi.fn()

vi.mock('react-zoom-pan-pinch', () => ({
  useControls: () => ({
    resetTransform: mockResetTransform,
    zoomIn: mockZoomIn,
    zoomOut: mockZoomOut,
  }),
}))

describe('MapFloatingControls', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Zoom In, Zoom Out, and Reset Zoom buttons with type="button"', () => {
    const html = renderToStaticMarkup(<MapFloatingControls />)

    expect(html).toContain('aria-label="Reset Zoom"')
    expect(html).toContain('aria-label="Zoom In"')
    expect(html).toContain('aria-label="Zoom Out"')
    expect(html).toContain('type="button"')
  })

  it('invokes zoomIn, zoomOut, and resetTransform when respective buttons are clicked', () => {
    const element = MapFloatingControls()
    const buttons = element.props.children

    // Button 0: Reset Zoom
    buttons[0].props.onClick()
    expect(mockResetTransform).toHaveBeenCalledTimes(1)

    // Button 1: Zoom In
    buttons[1].props.onClick()
    expect(mockZoomIn).toHaveBeenCalledTimes(1)

    // Button 2: Zoom Out
    buttons[2].props.onClick()
    expect(mockZoomOut).toHaveBeenCalledTimes(1)
  })
})
