import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import React from 'react'
import { CoordinateLockControls } from './CoordinateLockControls'

describe('CoordinateLockControls Component', () => {
  it('renders "Khóa vị trí" button when unlocked in Draft mode', () => {
    const html = renderToString(
      React.createElement(CoordinateLockControls, {
        isLocked: false,
        isDraft: true,
        isSaving: false,
        onToggleLock: () => {},
      }),
    )

    expect(html).toContain('Khóa vị trí')
    expect(html).toContain('data-testid="coordinate-lock-btn"')
    expect(html).not.toContain('disabled')
    expect(html).toContain('bg-[#de3336]')
  })

  it('renders "Mở khóa vị trí" button when locked in Draft mode', () => {
    const html = renderToString(
      React.createElement(CoordinateLockControls, {
        isLocked: true,
        isDraft: true,
        isSaving: false,
        onToggleLock: () => {},
      }),
    )

    expect(html).toContain('Mở khóa vị trí')
    expect(html).toContain('data-testid="coordinate-lock-btn"')
    expect(html).not.toContain('disabled')
    expect(html).toContain('bg-white/95')
  })

  it('renders disabled state when race is not in Draft mode', () => {
    const html = renderToString(
      React.createElement(CoordinateLockControls, {
        isLocked: true,
        isDraft: false,
        isSaving: false,
        onToggleLock: () => {},
      }),
    )

    expect(html).toContain('disabled')
    expect(html).toContain('cursor-not-allowed')
    expect(html).toContain('opacity-60')
    expect(html).toContain('Trận đấu đang diễn ra. Vị trí trạm đã được khóa cố định.')
  })

  it('renders saving spinner when isSaving is true', () => {
    const html = renderToString(
      React.createElement(CoordinateLockControls, {
        isLocked: false,
        isDraft: true,
        isSaving: true,
        onToggleLock: () => {},
      }),
    )

    expect(html).toContain('Đang lưu...')
    expect(html).toContain('disabled')
  })
})
