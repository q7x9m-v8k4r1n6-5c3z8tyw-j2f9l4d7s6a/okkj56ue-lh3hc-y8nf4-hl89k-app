import { getOrganizers } from '@/core/entities/organizer/api/organizer.api'
import { getTeams } from '@/core/entities/team/api/team.api'
import {
  messageRecipientSchema,
  type MessageRecipient,
} from '../model/sendMessage.schema'

const staticRecipients: MessageRecipient[] = [
  {
    id: 'all',
    label: 'Tất cả mọi người',
    description: 'Gửi cho toàn bộ ban tổ chức và đội chơi',
    type: 'all',
  },
  {
    id: 'all-organizers',
    label: 'Tất cả ban tổ chức',
    description: 'Gửi cho toàn bộ ban tổ chức',
    type: 'all-organizers',
  },
  {
    id: 'all-teams',
    label: 'Tất cả team',
    description: 'Gửi cho toàn bộ đội chơi',
    type: 'all-teams',
  },
]

/** Loads recipient choices for race message composition. */
export const getMessageRecipients = async (
  signal?: AbortSignal,
): Promise<MessageRecipient[]> => {
  const [organizers, teams] = await Promise.all([
    getOrganizers('', signal),
    getTeams('', signal),
  ])

  return [
    ...staticRecipients,
    ...organizers.map<MessageRecipient>((organizer) => ({
      id: `organizer:${organizer.id}`,
      label: organizer.displayName || organizer.email,
      description: organizer.email || 'Ban tổ chức',
      type: 'organizer',
    })),
    ...teams.map<MessageRecipient>((team) => ({
      id: `team:${team.id}`,
      label: team.name,
      description: team.leaderEmail || 'Đội chơi',
      type: 'team',
    })),
  ].map((recipient) => messageRecipientSchema.parse(recipient))
}
