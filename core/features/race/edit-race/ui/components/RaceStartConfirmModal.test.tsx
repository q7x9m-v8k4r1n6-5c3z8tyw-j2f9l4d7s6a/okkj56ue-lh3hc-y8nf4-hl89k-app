import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { RaceStartConfirmModal } from './RaceStartConfirmModal'

vi.mock('@/core/shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/core/shared')>()
  return {
    ...actual,
    Modal: ({
      open,
      title,
      children,
      footer,
      onClose,
    }: {
      open: boolean
      title?: string
      children?: React.ReactNode
      footer?: React.ReactNode
      onClose: () => void
    }) => {
      if (!open) return null
      return (
        <div data-testid="modal" role="dialog" aria-modal="true">
          {title ? <h2 id="modal-title">{title}</h2> : null}
          <button type="button" aria-label="Đóng modal" onClick={onClose}>
            Close
          </button>
          <div data-testid="modal-body">{children}</div>
          {footer ? <footer>{footer}</footer> : null}
        </div>
      )
    },
  }
})

describe('RaceStartConfirmModal', () => {
  it('renders nothing when open is false', () => {
    const html = renderToStaticMarkup(
      <RaceStartConfirmModal
        open={false}
        onClose={() => {}}
        onConfirm={() => {}}
      />,
    )

    expect(html).toBe('')
  })

  it('renders warning modal with exact danger copy and title when open is true', () => {
    const html = renderToStaticMarkup(
      <RaceStartConfirmModal
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
      />,
    )

    expect(html).toContain('Xác nhận bắt đầu trận đấu')
    expect(html).toContain(
      '⚠️ Lưu ý: Khi trận đấu bắt đầu, toàn bộ sơ đồ bản đồ và vị trí các trạm sẽ bị KHÓA CỐ ĐỊNH VĨNH VIỄN, không thể chỉnh sửa hay di chuyển trạm nữa. Bạn có chắc chắn muốn bắt đầu?',
    )
    expect(html).toContain('Hủy')
    expect(html).toContain('Xác nhận bắt đầu')
  })

  it('renders confirm action button with exact red Tailwind classes', () => {
    const html = renderToStaticMarkup(
      <RaceStartConfirmModal
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
      />,
    )

    expect(html).toContain('bg-red-600')
    expect(html).toContain('hover:bg-red-700')
    expect(html).toContain('text-white')
  })

  it('renders loading text and disabled state when isSubmitting is true', () => {
    const html = renderToStaticMarkup(
      <RaceStartConfirmModal
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        isSubmitting={true}
      />,
    )

    expect(html).toContain('>Đang xử lý...</button>')
    expect(html).not.toContain('>Xác nhận bắt đầu</button>')
    expect(html).toContain('disabled=""')
  })

  it('triggers onClose when Cancel button is clicked and onConfirm when Confirm button is clicked', () => {
    const onClose = vi.fn()
    const onConfirm = vi.fn()

    const tree = RaceStartConfirmModal({
      open: true,
      onClose,
      onConfirm,
    })

    if (!React.isValidElement<{ footer: React.ReactElement }>(tree)) {
      throw new Error('Expected valid React element')
    }

    const footer = tree.props.footer
    if (
      !React.isValidElement<{
        children: React.ReactElement<{ onClick?: () => void }>[]
      }>(footer)
    ) {
      throw new Error('Expected valid footer element')
    }

    const [cancelBtn, confirmBtn] = React.Children.toArray(
      footer.props.children,
    ) as React.ReactElement<{ onClick?: () => void }>[]

    cancelBtn.props.onClick?.()
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()

    confirmBtn.props.onClick?.()
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
