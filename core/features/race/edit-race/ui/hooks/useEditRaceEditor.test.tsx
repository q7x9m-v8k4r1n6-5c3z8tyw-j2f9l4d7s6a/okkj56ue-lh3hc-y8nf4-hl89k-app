import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEditRaceEditor } from './useEditRaceEditor'
import * as editRaceFormModule from '../../model/frontend/useEditRaceForm'
import * as patchMutationModule from '../../model/server/usePatchRaceMutation'
import * as sharedModule from '@/core/shared'

describe('useEditRaceEditor - Race Start Confirmation', () => {
  const mockMutate = vi.fn()
  const mockToast = vi.fn()
  const mockValidateForSave = vi.fn().mockReturnValue(true)
  const mockFinishEditing = vi.fn()
  const mockCancelEditing = vi.fn()

  const defaultFormState = {
    form: {
      raceId: 'race-1',
      raceName: 'Giải Chạy Xuân 2026',
      status: 'ready' as const,
      modifiedAt: '2026-09-01T00:00:00Z',
      rules: '',
      timeStart: '',
      timeEnd: '',
      coverUrl: '',
      coverFileName: '',
      place: '',
      booths: [],
      teams: [],
      organizers: [],
      settings: {
        isToggledLeaderboard: false,
        isHiddenPoint: false,
      },
    },
    originalForm: {
      raceId: 'race-1',
      raceName: 'Giải Chạy Xuân 2026',
      status: 'ready' as const,
      modifiedAt: '2026-09-01T00:00:00Z',
      rules: '',
      timeStart: '',
      timeEnd: '',
      coverUrl: '',
      coverFileName: '',
      place: '',
      booths: [],
      teams: [],
      organizers: [],
      settings: {
        isToggledLeaderboard: false,
        isHiddenPoint: false,
      },
    },
    coverFile: null,
    isDirty: false,
    isEditing: false,
    startEditing: vi.fn(),
    cancelEditing: mockCancelEditing,
    finishEditing: mockFinishEditing,
    validateForSave: mockValidateForSave,
  }

  let queryClient: QueryClient

  beforeEach(() => {
    vi.restoreAllMocks()
    mockMutate.mockClear()
    mockToast.mockClear()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })

    vi.spyOn(editRaceFormModule, 'useEditRaceForm').mockReturnValue(
      defaultFormState as unknown as ReturnType<typeof editRaceFormModule.useEditRaceForm>,
    )

    vi.spyOn(patchMutationModule, 'usePatchRaceMutation').mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
      reset: vi.fn(),
    } as unknown as ReturnType<typeof patchMutationModule.usePatchRaceMutation>)

    vi.spyOn(sharedModule, 'useToast').mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      dismissAll: vi.fn(),
    })
  })

  it('initializes with isStartConfirmOpen = false', () => {
    let captured: ReturnType<typeof useEditRaceEditor> | null = null

    function Harness() {
      captured = useEditRaceEditor('race-1')
      return <div data-open={captured.isStartConfirmOpen} />
    }

    renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <Harness />
      </QueryClientProvider>,
    )

    expect(captured).not.toBeNull()
    expect(captured!.isStartConfirmOpen).toBe(false)
  })

  it('opens confirmation modal and does not mutate when ribbon.onStart is called', () => {
    let captured: ReturnType<typeof useEditRaceEditor> | null = null

    function Harness() {
      const editor = useEditRaceEditor('race-1')
      captured = editor
      return (
        <button
          type="button"
          onClick={editor.ribbon.onStart}
          data-open={editor.isStartConfirmOpen}
        />
      )
    }

    renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <Harness />
      </QueryClientProvider>,
    )

    expect(captured).not.toBeNull()

    // Trigger onStart
    captured!.ribbon.onStart()

    // Mutation should NOT be called immediately
    expect(mockMutate).not.toHaveBeenCalled()
  })

  it('triggers mutation with ongoing status when handleConfirmStart is called', () => {
    let captured: ReturnType<typeof useEditRaceEditor> | null = null

    function Harness() {
      captured = useEditRaceEditor('race-1')
      return <div />
    }

    renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <Harness />
      </QueryClientProvider>,
    )

    expect(captured).not.toBeNull()

    // Confirm start
    captured!.handleConfirmStart()

    expect(mockMutate).toHaveBeenCalledTimes(1)
    const mutateCallArg = mockMutate.mock.calls[0][0]
    expect(mutateCallArg.payload.basicInfo).toEqual(
      expect.objectContaining({
        status: 'ongoing',
      }),
    )
  })

  it('closes modal and does not call mutation when handleCloseStartConfirm is called', () => {
    let captured: ReturnType<typeof useEditRaceEditor> | null = null

    function Harness() {
      captured = useEditRaceEditor('race-1')
      return <div />
    }

    renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <Harness />
      </QueryClientProvider>,
    )

    expect(captured).not.toBeNull()

    captured!.handleCloseStartConfirm()
    expect(mockMutate).not.toHaveBeenCalled()
  })
})
