/** Query keys for reusable team server state. */
export const teamQueryKeys = {
  all: ['teams'] as const,
  search: (searchQuery: string) =>
    [...teamQueryKeys.all, 'search', searchQuery] as const,
}
