import { client } from '@/core/shared/api'
import { myBoothSchema, type MyBooth } from '../model/myBooth.ts'

/** Fetches the booth assigned to the current organizer for one race. */
export const getMyBooth = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<MyBooth> => {
  const response = await client.request<unknown>({
    path: '/Booth/my-booth',
    method: 'GET',
    query: { raceId },
    signal,
  })

  return myBoothSchema.parse(response)
}
