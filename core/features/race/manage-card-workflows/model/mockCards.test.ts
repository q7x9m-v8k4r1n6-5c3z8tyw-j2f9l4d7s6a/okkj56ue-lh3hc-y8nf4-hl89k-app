import { describe, expect, it } from 'vitest'
import { defaultTriggerForCard, functionCardSchema } from './mockCards'

describe('function card rules', () => {
  it('uses attacked trigger only for defense cards', () => {
    expect(defaultTriggerForCard('attack')).toBe('activated')
    expect(defaultTriggerForCard('effect')).toBe('activated')
    expect(defaultTriggerForCard('defense')).toBe('attacked')
  })

  it('accepts the fixed card-list option source', () => {
    const result = functionCardSchema.safeParse({
      id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      raceId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      teamId: null,
      teamName: null,
      cardKey: 'target-card',
      name: 'Chọn mục tiêu',
      category: 'attack',
      description: '',
      backgroundUrl: '',
      inputs: [{
        id: 'target',
        key: 'target_team',
        label: 'Đội mục tiêu',
        type: 'select',
        required: true,
        placeholder: '',
        optionSource: 'cards',
        options: [],
      }],
      workflowId: null,
      workflowName: null,
      workflowStatus: null,
      createdAt: '2026-08-18T00:00:00Z',
      modifiedAt: '2026-08-18T00:00:00Z',
    })

    expect(result.success).toBe(true)
    if (result.success) expect(result.data.inputs[0].optionSource).toBe('cards')
  })

  it('normalizes a legacy backend team source without keeping its filter configuration', () => {
    const result = functionCardSchema.safeParse({
      id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      raceId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      teamId: null,
      teamName: null,
      cardKey: 'target-card',
      name: 'Chọn mục tiêu',
      category: 'attack',
      description: '',
      backgroundUrl: '',
      inputs: [{
        id: 'target',
        key: 'target_team',
        label: 'Đội mục tiêu',
        type: 'select',
        required: true,
        placeholder: '',
        optionSource: 'backend',
        options: [],
        backendSource: {
          entity: 'teams',
          conditions: [{ field: 'status', operator: 'equals', value: 'active' }],
        },
      }],
      workflowId: null,
      workflowName: null,
      workflowStatus: null,
      createdAt: '2026-08-18T00:00:00Z',
      modifiedAt: '2026-08-18T00:00:00Z',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.inputs[0].optionSource).toBe('teams')
      expect(result.data.inputs[0]).not.toHaveProperty('backendSource')
    }
  })
})
