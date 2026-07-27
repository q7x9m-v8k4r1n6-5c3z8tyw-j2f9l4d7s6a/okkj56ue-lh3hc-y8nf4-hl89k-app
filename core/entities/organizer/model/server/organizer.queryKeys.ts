/** Query keys for reusable organizer server state. */
export const organizerQueryKeys = {
  all: ['organizers'] as const,
  search: (searchQuery: string) =>
    [...organizerQueryKeys.all, 'search', searchQuery] as const,
}
