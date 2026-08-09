import { client } from '@/core/shared/api'
import { myBoothSchema, type MyBooth } from '../model/myBooth.ts'

/** Fetches the booth assigned to the current organizer for one race. */
export const getMyBooth = async (raceId: string): Promise<MyBooth> => {
  const response = await client.request<unknown>({
    path: `/Booth/my-booth?raceId=${encodeURIComponent(raceId)}`,
    method: 'GET',
  })

  return myBoothSchema.parse(response)
}