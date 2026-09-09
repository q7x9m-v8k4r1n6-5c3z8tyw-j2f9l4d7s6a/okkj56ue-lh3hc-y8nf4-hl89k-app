import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { CoordinateLockControls } from './CoordinateLockControls'

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

describe('CoordinateLockControls', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('renders all 4 floating buttons with proper test IDs and aria labels', () => {
    const html = renderToStaticMarkup(
      <CoordinateLockControls
        isLocked={true}
        onToggleLock={() => {}}
      />,
    )

    expect(html).toContain('data-testid="coordinate-lock-controls"')
    expect(html).toContain('data-testid="btn-reset-viewport"')
    expect(html).toContain('data-testid="btn-zoom-in"')
    expect(html).toContain('data-testid="btn-zoom-out"')
    expect(html).toContain('data-testid="btn-toggle-lock"')

    expect(html).toContain('aria-label="Đặt lại góc nhìn"')
    expect(html).toContain('aria-label="Phóng to"')
    expect(html).toContain('aria-label="Thu nhỏ"')
    expect(html).toContain('aria-label="Mở khóa vị trí trạm"')
  })

  it('renders locked state with closed padlock icon and emerald indicator dot', () => {
    const html = renderToStaticMarkup(
      <CoordinateLockControls
        isLocked={true}
        onToggleLock={() => {}}
      />,
    )

    expect(html).toContain('data-testid="lock-indicator-locked"')
    expect(html).toContain('bg-emerald-500')
    expect(html).toContain('Mở khóa vị trí trạm')
    expect(html).not.toContain('data-testid="lock-indicator-unlocked"')
  })

  it('renders unlocked state with open padlock icon and amber pulsing indicator dot', () => {
    const html = renderToStaticMarkup(
      <CoordinateLockControls
        isLocked={false}
        onToggleLock={() => {}}
      />,
    )

    expect(html).toContain('data-testid="lock-indicator-unlocked"')
    expect(html).toContain('bg-amber-500')
    expect(html).toContain('animate-pulse')
    expect(html).toContain('aria-label="Khóa vị trí trạm"')
    expect(html).not.toContain('data-testid="lock-indicator-locked"')
  })

  it('renders spinner and disables toggle button when isSaving is true', () => {
    const html = renderToStaticMarkup(
      <CoordinateLockControls
        isLocked={false}
        isSaving={true}
        onToggleLock={() => {}}
      />,
    )

    expect(html).toContain('aria-label="Đang lưu vị trí..."')
    expect(html).toContain('disabled=""')
    expect(html).not.toContain('data-testid="lock-indicator-locked"')
    expect(html).not.toContain('data-testid="lock-indicator-unlocked"')
  })

  it('disables toggle button with custom tooltip when disabled is true', () => {
    const customTooltip = 'Trận đấu đang diễn ra. Vị trí trạm đã được khóa cố định.'
    const html = renderToStaticMarkup(
      <CoordinateLockControls
        isLocked={true}
        disabled={true}
        disabledTooltip={customTooltip}
        onToggleLock={() => {}}
      />,
    )

    expect(html).toContain('disabled=""')
    expect(html).toContain(`title="${customTooltip}"`)
  })

  it('triggers onReset, onZoomIn, onZoomOut, and onToggleLock callbacks', () => {
    const onReset = vi.fn()
    const onZoomIn = vi.fn()
    const onZoomOut = vi.fn()
    const onToggleLock = vi.fn()

    const tree = CoordinateLockControls({
      isLocked: false,
      onToggleLock,
      onReset,
      onZoomIn,
      onZoomOut,
    })

    if (!React.isValidElement<{ children: React.ReactElement<{ onClick: () => void }>[] }>(tree)) {
      throw new Error('Expected valid React element')
    }

    const children = React.Children.toArray(tree.props.children) as React.ReactElement<{ onClick: () => void }>[]
    const resetBtn = children[0]
    const zoomInBtn = children[1]
    const zoomOutBtn = children[2]
    const lockBtn = children[3]

    resetBtn.props.onClick()
    expect(onReset).toHaveBeenCalledTimes(1)

    zoomInBtn.props.onClick()
    expect(onZoomIn).toHaveBeenCalledTimes(1)

    zoomOutBtn.props.onClick()
    expect(onZoomOut).toHaveBeenCalledTimes(1)

    lockBtn.props.onClick()
    expect(onToggleLock).toHaveBeenCalledTimes(1)
  })

  it('calls useControls methods when onReset, onZoomIn, onZoomOut are not provided', () => {
    const tree = CoordinateLockControls({
      isLocked: false,
      onToggleLock: () => {},
    })

    if (!React.isValidElement<{ children: React.ReactElement<{ onClick: () => void }>[] }>(tree)) {
      throw new Error('Expected valid React element')
    }

    const children = React.Children.toArray(tree.props.children) as React.ReactElement<{ onClick: () => void }>[]
    const resetBtn = children[0]
    const zoomInBtn = children[1]
    const zoomOutBtn = children[2]

    resetBtn.props.onClick()
    expect(mockResetTransform).toHaveBeenCalledTimes(1)

    zoomInBtn.props.onClick()
    expect(mockZoomIn).toHaveBeenCalledTimes(1)

    zoomOutBtn.props.onClick()
    expect(mockZoomOut).toHaveBeenCalledTimes(1)
  })
})


