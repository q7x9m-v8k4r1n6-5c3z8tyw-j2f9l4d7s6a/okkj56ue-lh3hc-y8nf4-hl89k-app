import type { TeamModel } from '../models'

export const getTeams = async (): Promise<TeamModel[]> => {
  const mockData: TeamModel[] = [
    { id: '11111111-1111-4111-8111-111111111111', name: 'Team Alpha', leaderEmail: 'alpha@example.com' },
    { id: '22222222-2222-4222-8222-222222222222', name: 'Team Beta', leaderEmail: 'beta@example.com' },
    { id: '33333333-3333-4333-8333-333333333333', name: 'Team Gamma', leaderEmail: 'gamma@example.com' },
  ]

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, 1000)
  })
}
