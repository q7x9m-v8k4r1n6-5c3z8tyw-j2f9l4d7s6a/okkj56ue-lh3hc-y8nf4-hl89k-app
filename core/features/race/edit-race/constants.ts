import type { EditRaceForm } from './models'

export const EDIT_RACE_INITIAL_FORM: EditRaceForm = {
  raceName: '',
  timeStart: '',
  timeEnd: '',
  coverUrl: '',
  coverFileName: '',
  place: '',
  status: 'draft',
  modifiedAt: '',
  booths: [],
  teams: [],
  organizers: [],
  settings: {
    isToggledLeaderboard: false,
    isHiddenPoint: false,
  },
}
