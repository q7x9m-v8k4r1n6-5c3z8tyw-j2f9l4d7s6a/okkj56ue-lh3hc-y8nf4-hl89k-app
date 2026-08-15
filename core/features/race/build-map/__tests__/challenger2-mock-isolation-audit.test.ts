import { describe, expect, it } from 'vitest'

describe('Challenger 2: Repository-Wide Mock Isolation & Architecture Audit', () => {
  // Vite import.meta.glob loads all typescript files as raw strings
  const coreModules = import.meta.glob(
    ['../../../../**/*.{ts,tsx}', '!../../../../**/__tests__/**', '!../../../../**/*.test.*'],
    { query: '?raw', import: 'default', eager: true },
  ) as Record<string, string>

  it('verifies zero occurrences of mockMapData or deprecated mock data in production source code', () => {
    const fileEntries = Object.entries(coreModules)
    expect(fileEntries.length).toBeGreaterThan(20)

    const invalidImports: Array<{ file: string; match: string }> = []

    fileEntries.forEach(([filePath, content]) => {
      if (typeof content !== 'string') return

      const lines = content.split('\n')
      lines.forEach((line) => {
        const trimmed = line.trim()
        if (
          (/from\s+['"].*mockMapData.*['"]/i.test(trimmed) ||
            /from\s+['"].*mockBooth.*['"]/i.test(trimmed) ||
            /require\(['"].*mockMapData.*['"]\)/i.test(trimmed)) &&
          !trimmed.startsWith('//')
        ) {
          invalidImports.push({ file: filePath, match: trimmed })
        }
      })
    })

    expect(invalidImports).toEqual([])
  })

  it('verifies Note Ribbon (<Đây là thanh ribbon.../>) is strictly excluded per Requirement R4', () => {
    const fileEntries = Object.entries(coreModules)

    fileEntries.forEach(([, content]) => {
      if (typeof content !== 'string') return
      // The note ribbon from Figma must never be in any UI template
      expect(content).not.toContain('Đây là thanh ribbon')
    })
  })
})
