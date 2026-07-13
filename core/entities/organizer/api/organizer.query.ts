import type { OrganizerModel } from '../models'

/**
 * Get organizers from the API (mock data)
 * @returns organizers list
 */
export const getOrganizers = async (): Promise<OrganizerModel[]> => {
  const mockData: OrganizerModel[] = [
    { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', displayName: 'Organizer 1', email: 'organizer1@example.com' },
    { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', displayName: 'Organizer 2', email: 'organizer2@example.com' },
    { id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', displayName: 'Organizer 3', email: 'organizer3@example.com' },
  ]

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, 1000)
  })
}
