export const cardDescriptionQueryKeys = {
  all: ['team', 'card-description'] as const,
  detail: (cardId?: string) => [...cardDescriptionQueryKeys.all, cardId] as const,
}