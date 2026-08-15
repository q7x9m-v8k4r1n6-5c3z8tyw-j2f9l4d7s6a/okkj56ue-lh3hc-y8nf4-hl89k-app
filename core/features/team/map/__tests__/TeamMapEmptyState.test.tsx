import { describe, expect, it, vi } from 'vitest'
import { renderToString } from 'react-dom/server'
import React from 'react'
import { TeamMapEmptyState } from '../ui/components/TeamMapEmptyState'

describe('TeamMapEmptyState Component', () => {
  it('renders default required empty state message', () => {
    const html = renderToString(React.createElement(TeamMapEmptyState))

    expect(html).toContain('Ban tổ chức chưa công bố sơ đồ bản đồ trận đấu')
    expect(html).toContain('Vui lòng quay lại sau khi ban tổ chức cập nhật bản đồ và vị trí các trạm thi đấu.')
  })

  it('renders custom message when provided', () => {
    const html = renderToString(
      React.createElement(TeamMapEmptyState, {
        message: 'Thông báo trống tuỳ chỉnh',
      }),
    )

    expect(html).toContain('Thông báo trống tuỳ chỉnh')
  })

  it('renders retry button when onRetry callback is provided', () => {
    const onRetryMock = vi.fn()
    const html = renderToString(
      React.createElement(TeamMapEmptyState, {
        onRetry: onRetryMock,
      }),
    )

    expect(html).toContain('Tải lại')
  })
})
