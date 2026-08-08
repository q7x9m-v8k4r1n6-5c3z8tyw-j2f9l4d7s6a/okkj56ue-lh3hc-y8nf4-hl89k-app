import { describe, expect, it } from 'vitest'
import { isSettingsTab, settingsTabs } from './settings.tabs'

describe('settings tabs', () => {
  it('starts with the Security workspace', () => {
    expect(settingsTabs[0]).toEqual({ value: 'security', label: 'Security' })
  })

  it('rejects unknown URL tabs', () => {
    expect(isSettingsTab('security')).toBe(true)
    expect(isSettingsTab('unknown')).toBe(false)
  })
})

