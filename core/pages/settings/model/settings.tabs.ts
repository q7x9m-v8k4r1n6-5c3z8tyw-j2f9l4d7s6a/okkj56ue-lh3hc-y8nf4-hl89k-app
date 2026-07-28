export const settingsTabs = [
  { value: 'security', label: 'Security' },
] as const

export type SettingsTab = (typeof settingsTabs)[number]['value']

/** Checks values received from the generic Tabs component and the URL. */
export const isSettingsTab = (value: string): value is SettingsTab =>
  settingsTabs.some((tab) => tab.value === value)

