import { client } from '@/core/shared/api'
import {
  createRaceRequestSchema,
  createRaceResponseSchema,
  type CreateRaceRequest,
  type CreateRaceResponse,
} from '../model/createRace.contract'

/** Creates a race and validates both outgoing and incoming API boundaries. */
export const createRace = async (
  request: CreateRaceRequest,
  coverImage: File | null,
): Promise<CreateRaceResponse> => {
  const formData = new FormData()
  formData.append('payload', JSON.stringify(createRaceRequestSchema.parse(request)))
  if (coverImage) formData.append('coverImage', coverImage)

  const response = await client.request<unknown, FormData>({
    path: '/Race',
    method: 'POST',
    body: formData,
  })

  return createRaceResponseSchema.parse(response)
}
