import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  changeWorkflowStatus,
  createWorkflow,
  deleteWorkflow,
  getWorkflowCatalog,
  getWorkflowRuns,
  getWorkflows,
  simulateWorkflow,
  updateWorkflow,
} from '../../api/workflow.api'
import type { SaveWorkflowRequest } from '../workflow.contract'

const keys = {
  list: (raceId: string) => ['card-workflows', raceId] as const,
  catalog: ['workflow-catalog'] as const,
  runs: (workflowId: string) => ['workflow-runs', workflowId] as const,
}

export const useCardWorkflows = (raceId?: string) => useQuery({
  queryKey: keys.list(raceId ?? ''),
  queryFn: ({ signal }) => getWorkflows(raceId ?? '', signal),
  enabled: Boolean(raceId),
})

export const useWorkflowCatalog = () => useQuery({
  queryKey: keys.catalog,
  queryFn: ({ signal }) => getWorkflowCatalog(signal),
  staleTime: 30 * 60 * 1000,
})

export const useWorkflowRuns = (workflowId?: string) => useQuery({
  queryKey: keys.runs(workflowId ?? ''),
  queryFn: ({ signal }) => getWorkflowRuns(workflowId ?? '', signal),
  enabled: Boolean(workflowId),
})

export const useWorkflowMutations = (raceId: string) => {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: keys.list(raceId) })

  const save = useMutation({
    mutationFn: ({ workflowId, request }: { workflowId?: string; request: SaveWorkflowRequest }) => (
      workflowId
        ? updateWorkflow(workflowId, request)
        : createWorkflow(raceId, request)
    ),
    onSuccess: invalidate,
  })
  const status = useMutation({
    mutationFn: ({ workflowId, nextStatus, expectedModifiedAt }: {
      workflowId: string
      nextStatus: 'draft' | 'published' | 'disabled'
      expectedModifiedAt: string
    }) => changeWorkflowStatus(workflowId, nextStatus, expectedModifiedAt),
    onSuccess: invalidate,
  })
  const remove = useMutation({ mutationFn: deleteWorkflow, onSuccess: invalidate })
  const simulate = useMutation({
    mutationFn: ({ workflowId, actorTeamId, targetTeamId }: {
      workflowId: string
      actorTeamId?: string
      targetTeamId?: string
    }) => simulateWorkflow(workflowId, actorTeamId, targetTeamId),
    onSettled: (_data, _error, variables) => queryClient.invalidateQueries({ queryKey: keys.runs(variables.workflowId) }),
  })

  return { save, status, remove, simulate }
}
