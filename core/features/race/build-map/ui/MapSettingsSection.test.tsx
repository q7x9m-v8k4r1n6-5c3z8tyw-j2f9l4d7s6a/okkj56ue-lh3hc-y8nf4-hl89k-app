import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContext } from '@/core/shared/ui/Toast/ToastContext'
import { MapSettingsSection, type MapSettingsSectionProps } from './MapSettingsSection'
import * as mutationModule from '../model/server/useUpdateRaceMapSettingsMutation'

describe('MapSettingsSection', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const renderSection = (props: MapSettingsSectionProps, toastFn = vi.fn()) => {
    return renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <ToastContext.Provider
          value={{ toast: toastFn, dismiss: vi.fn(), dismissAll: vi.fn() }}
        >
          <MapSettingsSection {...props} />
        </ToastContext.Provider>
      </QueryClientProvider>,
    )
  }

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders section title, table header and 3 switches with labels and descriptions', () => {
    const html = renderSection({
      raceId: 'race-123',
      isFrozen: false,
    })

    // Title and table header
    expect(html).toContain('CÀI ĐẶT BẢN ĐỒ')
    expect(html).toContain('Nội dung')
    expect(html).toContain('Chi tiết')

    // Row 1
    expect(html).toContain('Hiện vị trí trạm ẩn trên bản đồ')
    expect(html).toContain(
      'Khi bật, các trạm được đánh dấu là &#x27;trạm ẩn&#x27; sẽ được hiển thị trên bản đồ của đội chơi',
    )

    // Row 2
    expect(html).toContain('Ẩn mô tả trạm')
    expect(html).toContain(
      'Khi bật, nội dung mô tả chi tiết của trạm sẽ bị ẩn trên bản đồ của đội chơi.',
    )

    // Row 3
    expect(html).toContain('Tắt hiển thị trạng thái trạm')
    expect(html).toContain(
      'Khi bật, bản đồ của đội chơi sẽ không hiển thị trạng thái trống/bận',
    )

    // Default false state
    const matches = html.match(/aria-checked="false"/g)
    expect(matches).not.toBeNull()
    expect(matches!.length).toBe(3)
  })

  it('renders checked states when settings prop has true values', () => {
    const html = renderSection({
      raceId: 'race-123',
      isFrozen: false,
      settings: {
        isShowHiddenBooths: true,
        isHideBoothDescription: false,
        isDisabledBoothStatus: true,
      },
    })

    const checkedMatches = html.match(/aria-checked="true"/g)
    const uncheckedMatches = html.match(/aria-checked="false"/g)
    expect(checkedMatches).not.toBeNull()
    expect(checkedMatches!.length).toBe(2)
    expect(uncheckedMatches).not.toBeNull()
    expect(uncheckedMatches!.length).toBe(1)
  })

  it('disables all 3 switches when isFrozen is true and shows read-only badge', () => {
    const html = renderSection({
      raceId: 'race-123',
      isFrozen: true,
    })

    expect(html).toContain('Chỉ đọc (Trận đấu đã khóa)')
    const disabledMatches = html.match(/disabled=""/g)
    expect(disabledMatches).not.toBeNull()
    expect(disabledMatches!.length).toBe(3)
  })

  it('disables switches when update mutation is pending', () => {
    vi.spyOn(mutationModule, 'useUpdateRaceMapSettingsMutation').mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    } as unknown as ReturnType<typeof mutationModule.useUpdateRaceMapSettingsMutation>)

    const html = renderSection({
      raceId: 'race-123',
      isFrozen: false,
    })

    const disabledMatches = html.match(/disabled=""/g)
    expect(disabledMatches).not.toBeNull()
    expect(disabledMatches!.length).toBe(3)
  })

  it('triggers custom callbacks when provided and switch is clicked', () => {
    const onToggleHiddenBooths = vi.fn()
    const onToggleDescription = vi.fn()
    const onToggleDisabledStatus = vi.fn()

    let capturedSwitches: Array<{ onChange?: (checked: boolean) => void }> = []

    const TestComponent = () => {
      const element = MapSettingsSection({
        raceId: 'race-123',
        isFrozen: false,
        onToggleHiddenBooths,
        onToggleDescription,
        onToggleDisabledStatus,
      })

      const cardChildren = React.Children.toArray(element.props.children)
      const tableWrapper = cardChildren[1] as React.ReactElement<{ children: React.ReactNode }>
      const tableRows = React.Children.toArray(tableWrapper.props.children) as React.ReactElement<{ children: React.ReactNode }>[]

      const getSwitchProps = (row: React.ReactElement<{ children: React.ReactNode }>) => {
        const rowChildren = React.Children.toArray(row.props.children) as React.ReactElement<{ children: React.ReactNode }>[]
        const switchWrapper = rowChildren[2]
        const switchEl = switchWrapper.props.children as React.ReactElement<{ onChange?: (checked: boolean) => void }>
        return switchEl.props
      }

      capturedSwitches = [
        getSwitchProps(tableRows[1]),
        getSwitchProps(tableRows[2]),
        getSwitchProps(tableRows[3]),
      ]

      return element
    }

    renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <ToastContext.Provider
          value={{ toast: vi.fn(), dismiss: vi.fn(), dismissAll: vi.fn() }}
        >
          <TestComponent />
        </ToastContext.Provider>
      </QueryClientProvider>,
    )

    expect(capturedSwitches).toHaveLength(3)

    // Trigger row 1
    capturedSwitches[0].onChange?.(true)
    expect(onToggleHiddenBooths).toHaveBeenCalledWith(true)

    // Trigger row 2
    capturedSwitches[1].onChange?.(true)
    expect(onToggleDescription).toHaveBeenCalledWith(true)

    // Trigger row 3
    capturedSwitches[2].onChange?.(true)
    expect(onToggleDisabledStatus).toHaveBeenCalledWith(true)
  })

  it('triggers update mutation with expectedModifiedAt and raceSettings on toggle', () => {
    const mockMutate = vi.fn()
    vi.spyOn(mutationModule, 'useUpdateRaceMapSettingsMutation').mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof mutationModule.useUpdateRaceMapSettingsMutation>)

    let capturedFirstSwitch: { onChange?: (checked: boolean) => void } | null = null

    const TestComponent = () => {
      const element = MapSettingsSection({
        raceId: 'race-abc',
        isFrozen: false,
        settings: {
          isShowHiddenBooths: false,
          isHideBoothDescription: false,
          isDisabledBoothStatus: false,
          modifiedAt: '2026-09-09T10:00:00.000Z',
        },
      })

      const cardChildren = React.Children.toArray(element.props.children)
      const tableWrapper = cardChildren[1] as React.ReactElement<{ children: React.ReactNode }>
      const tableRows = React.Children.toArray(tableWrapper.props.children) as React.ReactElement<{ children: React.ReactNode }>[]
      const row1Children = React.Children.toArray(tableRows[1].props.children) as React.ReactElement<{ children: React.ReactNode }>[]
      const switchEl = row1Children[2].props.children as React.ReactElement<{ onChange?: (checked: boolean) => void }>
      capturedFirstSwitch = switchEl.props

      return element
    }

    renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <ToastContext.Provider
          value={{ toast: vi.fn(), dismiss: vi.fn(), dismissAll: vi.fn() }}
        >
          <TestComponent />
        </ToastContext.Provider>
      </QueryClientProvider>,
    )

    expect(capturedFirstSwitch).not.toBeNull()
    capturedFirstSwitch!.onChange?.(true)

    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        expectedModifiedAt: '2026-09-09T10:00:00.000Z',
        raceSettings: {
          isShowHiddenBooths: true,
        },
      }),
      expect.any(Object),
    )
  })
})

