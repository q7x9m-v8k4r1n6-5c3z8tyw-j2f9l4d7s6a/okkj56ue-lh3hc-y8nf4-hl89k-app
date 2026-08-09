import type {
  EditRaceBooth,
  EditRaceForm,
  EditRaceOrganizer,
  EditRaceTeam,
} from '../editRace.form'

export type BasicInformationChanges = Partial<
  Pick<EditRaceForm, 'raceName' | 'timeStart' | 'timeEnd' | 'place' | 'rules'>
>

export type EditRaceFormState = {
  form: EditRaceForm
  originalForm: EditRaceForm
  isEditing: boolean
  showErrors: boolean
}

export type EditRaceFormAction =
  | { type: 'START_EDITING' }
  | { type: 'CANCEL_EDITING' }
  | { type: 'SAVE_SUCCEEDED'; savedForm: EditRaceForm }
  | { type: 'SHOW_ERRORS' }
  | { type: 'UPDATE_BASIC'; changes: BasicInformationChanges }
  | { type: 'SET_COVER_FILE_NAME'; fileName: string }
  | { type: 'ADD_BOOTH'; booth: EditRaceBooth }
  | { type: 'UPDATE_BOOTH'; boothId: string; changes: Partial<EditRaceBooth> }
  | { type: 'REMOVE_BOOTH'; boothId: string }
  | { type: 'ADD_TEAMS'; teams: EditRaceTeam[] }
  | { type: 'REMOVE_TEAM'; teamId: string }
  | { type: 'ADD_ORGANIZERS'; organizers: EditRaceOrganizer[] }
  | { type: 'REMOVE_ORGANIZER'; organizerId: string }
  | {
    type: 'UPDATE_SETTING'
    key: keyof EditRaceForm['settings']
    value: boolean
  }

/** Creates the frontend state owned by one mounted race editor. */
export const createEditRaceFormState = (
  initialForm: EditRaceForm,
): EditRaceFormState => ({
  form: initialForm,
  originalForm: initialForm,
  isEditing: false,
  showErrors: false,
})

/**
 * Applies explicit, predictable transitions to local editor state.
 *
 * Side effects such as object URL cleanup and API calls deliberately live
 * outside this reducer.
 */
export const editRaceFormReducer = (
  state: EditRaceFormState,
  action: EditRaceFormAction,
): EditRaceFormState => {
  switch (action.type) {
    case 'START_EDITING':
      return { ...state, isEditing: true, showErrors: false }
    case 'CANCEL_EDITING':
      return {
        ...state,
        form: state.originalForm,
        isEditing: false,
        showErrors: false,
      }
    case 'SAVE_SUCCEEDED':
      return {
        form: action.savedForm,
        originalForm: action.savedForm,
        isEditing: false,
        showErrors: false,
      }
    case 'SHOW_ERRORS':
      return { ...state, showErrors: true }
    case 'UPDATE_BASIC':
      return { ...state, form: { ...state.form, ...action.changes } }
    case 'SET_COVER_FILE_NAME':
      return {
        ...state,
        form: { ...state.form, coverFileName: action.fileName },
      }
    case 'ADD_BOOTH':
      return {
        ...state,
        form: { ...state.form, booths: [...state.form.booths, action.booth] },
      }
    case 'UPDATE_BOOTH':
      return {
        ...state,
        form: {
          ...state.form,
          booths: state.form.booths.map((booth) =>
            booth.id === action.boothId
              ? { ...booth, ...action.changes }
              : booth,
          ),
        },
      }
    case 'REMOVE_BOOTH':
      return {
        ...state,
        form: {
          ...state.form,
          booths: state.form.booths.filter(
            (booth) => booth.id !== action.boothId,
          ),
        },
      }
    case 'ADD_TEAMS': {
      const currentIds = new Set(state.form.teams.map((team) => team.id))
      const newTeams = action.teams.filter((team) => !currentIds.has(team.id))
      return {
        ...state,
        form: {
          ...state.form,
          teams: [...state.form.teams, ...newTeams],
        },
      }
    }
    case 'REMOVE_TEAM':
      return {
        ...state,
        form: {
          ...state.form,
          teams: state.form.teams.filter((team) => team.id !== action.teamId),
        },
      }
    case 'ADD_ORGANIZERS': {
      const currentIds = new Set(
        state.form.organizers.map((organizer) => organizer.id),
      )
      const newOrganizers = action.organizers.filter(
        (organizer) => !currentIds.has(organizer.id),
      )
      return {
        ...state,
        form: {
          ...state.form,
          organizers: [...state.form.organizers, ...newOrganizers],
        },
      }
    }
    case 'REMOVE_ORGANIZER':
      return {
        ...state,
        form: {
          ...state.form,
          organizers: state.form.organizers.filter(
            (organizer) => organizer.id !== action.organizerId,
          ),
        },
      }
    case 'UPDATE_SETTING':
      return {
        ...state,
        form: {
          ...state.form,
          settings: {
            ...state.form.settings,
            [action.key]: action.value,
          },
        },
      }
  }
}
