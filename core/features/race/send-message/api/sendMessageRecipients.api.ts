import { client } from '@/core/shared/api'
import { z } from 'zod'
import {
  messageRecipientSchema,
  type MessageRecipient,
} from '../model/sendMessage.schema'

const staticRecipients: MessageRecipient[] = [
  {
    id: 'all',
    label: 'Tất cả mọi người',
    description: 'Gửi cho toàn bộ ban tổ chức và đội chơi trong trận đấu',
    type: 'all',
  },
  {
    id: 'all-organizers',
    label: 'Tất cả ban tổ chức',
    description: 'Gửi cho toàn bộ ban tổ chức trong trận đấu',
    type: 'all-organizers',
  },
  {
    id: 'all-teams',
    label: 'Tất cả team',
    description: 'Gửi cho toàn bộ đội chơi trong trận đấu',
    type: 'all-teams',
  },
]

const raceMessageRecipientDetailSchema = z.object({
  raceTeam: z.array(z.object({
    teamID: z.string().uuid(),
    name: z.string().optional(),
    leaderEmail: z.string().optional(),
  })).catch([]),
  organizers: z.array(z.object({
    id: z.string().uuid(),
    displayName: z.string().optional(),
    email: z.string().optional(),
  })).catch([]),
})

/** Loads recipient choices assigned to the current race. */
export const getMessageRecipients = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<MessageRecipient[]> => {
  const response = await client.request<unknown>({
    path: `/Race/${raceId}`,
    signal,
  })
  const detail = raceMessageRecipientDetailSchema.parse(response)

  return [
    ...staticRecipients,
    ...detail.organizers.map<MessageRecipient>((organizer) => ({
      id: `organizer:${organizer.id}`,
      label: organizer.displayName || organizer.email || 'Ban tổ chức',
      description: organizer.email || 'Ban tổ chức',
      type: 'organizer',
    })),
    ...detail.raceTeam.map<MessageRecipient>((team) => ({
      id: `team:${team.teamID}`,
      label: team.name || team.leaderEmail || 'Đội chơi',
      description: team.leaderEmail || 'Đội chơi',
      type: 'team',
    })),
  ].map((recipient) => messageRecipientSchema.parse(recipient))
}
