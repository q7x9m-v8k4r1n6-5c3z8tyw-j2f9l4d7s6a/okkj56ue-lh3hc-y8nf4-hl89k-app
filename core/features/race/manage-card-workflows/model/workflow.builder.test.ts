import { describe, expect, it } from 'vitest'
import { mapBuilderToDefinition, mapWorkflowToBuilder, type BuilderNode } from './workflow.builder'
import type { Workflow, WorkflowCatalogItem } from './workflow.contract'

const catalog: WorkflowCatalogItem[] = [
  { type: 'trigger.activated', category: 'trigger', label: 'Kích hoạt', description: '', isTrigger: true, defaultConfig: {} },
  { type: 'flow.stop', category: 'flow', label: 'Dừng', description: '', isTrigger: false, defaultConfig: {} },
]

describe('workflow builder mapping', () => {
  it('preserves graph nodes, positions, configs, and branch handles', () => {
    const workflow: Workflow = {
      id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      cardId: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
      raceId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      cardKey: 'shield-card',
      cardName: 'Khiên',
      name: 'Khiên cơ bản',
      description: '',
      triggerType: 'activated',
      status: 'draft',
      version: 1,
      createdAt: '2026-08-17T00:00:00Z',
      modifiedAt: '2026-08-17T00:00:00Z',
      definition: {
        schemaVersion: 1,
        nodes: [
          { id: 'trigger', type: 'trigger.activated', position: { x: 10, y: 20 }, config: {} },
          { id: 'stop', type: 'flow.stop', position: { x: 300, y: 20 }, config: {} },
        ],
        edges: [{ id: 'edge', source: 'trigger', target: 'stop', sourceHandle: 'true' }],
      },
    }

    const builder = mapWorkflowToBuilder(workflow, catalog)
    const definition = mapBuilderToDefinition(builder.nodes as BuilderNode[], builder.edges)

    expect(definition).toEqual(workflow.definition)
  })

  it('keeps an editable title while preserving the catalog action name', () => {
    const workflow: Workflow = {
      id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      cardId: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
      raceId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      cardKey: 'shield-card',
      cardName: 'Khiên',
      name: 'Khiên cơ bản',
      description: '',
      triggerType: 'activated',
      status: 'draft',
      version: 1,
      createdAt: '2026-08-17T00:00:00Z',
      modifiedAt: '2026-08-17T00:00:00Z',
      definition: {
        schemaVersion: 1,
        nodes: [
          { id: 'trigger', type: 'trigger.activated', position: { x: 10, y: 20 }, config: {} },
          { id: 'stop', type: 'flow.stop', position: { x: 300, y: 20 }, config: { title: 'Tên tùy chỉnh cũ' } },
        ],
        edges: [{ id: 'edge', source: 'trigger', target: 'stop', sourceHandle: null }],
      },
    }

    const builder = mapWorkflowToBuilder(workflow, catalog)
    const definition = mapBuilderToDefinition(builder.nodes as BuilderNode[], builder.edges)

    expect(builder.nodes[1].data.label).toBe('Tên tùy chỉnh cũ')
    expect(builder.nodes[1].data.actionName).toBe('Dừng')
    expect(definition.nodes[1].config).toHaveProperty('title', 'Tên tùy chỉnh cũ')
  })
})
