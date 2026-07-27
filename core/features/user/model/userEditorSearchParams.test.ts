import { describe, expect, it } from 'vitest'
import {
  clearUserEditorTarget,
  parseUserEditorTarget,
  setUserEditorTarget,
} from './userEditorSearchParams'

describe('user editor search-param contract', () => {
  it('round-trips a valid edit target and preserves unrelated params', () => {
    const params = setUserEditorTarget(
      new URLSearchParams('search=alpha'),
      { category: 'staff', mode: 'edit', userId: '9c1b6d4e-6e20-4c4c-a36c-f8a8e3d1e7a1' },
    )

    expect(params.get('search')).toBe('alpha')
    expect(parseUserEditorTarget(params)).toEqual({
      category: 'staff',
      mode: 'edit',
      userId: '9c1b6d4e-6e20-4c4c-a36c-f8a8e3d1e7a1',
    })
  })

  it('rejects edit targets without a positive user id', () => {
    expect(parseUserEditorTarget(
      new URLSearchParams('editor=edit&category=team'),
    )).toBeNull()
  })

  it('clears only editor-owned params', () => {
    const params = clearUserEditorTarget(
      new URLSearchParams(
        'editor=create&category=team&search=alpha',
      ),
    )
    expect(params.toString()).toBe('search=alpha')
  })
})
