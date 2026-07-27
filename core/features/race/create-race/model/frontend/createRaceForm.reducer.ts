import type { OrganizerSummary } from '@/core/entities/organizer'
import type { TeamSummary } from '@/core/entities/team'
import type {
  CreateRaceBasicForm,
  CreateRaceFormState,
  CreateRaceSettingsForm,
  CreateRaceStationForm,
} from '../createRace.form'
import type {
  BasicValidationErrors,
  StationValidationErrors,
} from '../createRace.validation'

export type CreateRaceFormAction =
  | { type: 'step/set'; step: number }
  | { type: 'basic/update'; changes: Partial<CreateRaceBasicForm> }
  | { type: 'basic/errors/set'; errors: BasicValidationErrors }
  | { type: 'basic/error/clear'; field: keyof CreateRaceBasicForm }
  | { type: 'stations/add'; station: CreateRaceStationForm }
  | {
    type: 'stations/update'
    id: string
    changes: Partial<Omit<CreateRaceStationForm, 'id'>>
  }
  | { type: 'stations/remove'; id: string }
  | { type: 'stations/errors/set'; errors: StationValidationErrors }
  | {
    type: 'stations/error/clear'
    id: string
    field: 'name' | 'location' | 'managers'
  }
  | { type: 'teams/add'; team: TeamSummary }
  | { type: 'teams/remove'; id: string }
  | { type: 'organizers/add'; organizer: OrganizerSummary }
  | { type: 'organizers/remove'; id: string }
  | { type: 'settings/update'; changes: Partial<CreateRaceSettingsForm> }
  | { type: 'form/reset'; state: CreateRaceFormState }

/** Applies one explicit frontend form event to the create-race state. */
export const createRaceFormReducer = (
  state: CreateRaceFormState,
  action: CreateRaceFormAction,
): CreateRaceFormState => {
  switch (action.type) {
    case 'step/set':
      return { ...state, step: Math.min(5, Math.max(1, action.step)) }
    case 'basic/update':
      return { ...state, basic: { ...state.basic, ...action.changes } }
    case 'basic/errors/set':
      return { ...state, errors: { ...state.errors, basic: action.errors } }
    case 'basic/error/clear': {
      const basicErrors = { ...state.errors.basic }
      delete basicErrors[action.field]
      return { ...state, errors: { ...state.errors, basic: basicErrors } }
    }
    case 'stations/add':
      return { ...state, stations: [...state.stations, action.station] }
    case 'stations/update':
      return {
        ...state,
        stations: state.stations.map((station) => station.id === action.id
          ? { ...station, ...action.changes }
          : station),
      }
    case 'stations/remove': {
      const stationErrors = { ...state.errors.stations }
      delete stationErrors[action.id]
      return {
        ...state,
        stations: state.stations.filter((station) => station.id !== action.id),
        errors: { ...state.errors, stations: stationErrors },
      }
    }
    case 'stations/errors/set':
      return { ...state, errors: { ...state.errors, stations: action.errors } }
    case 'stations/error/clear': {
      const stationErrors = { ...state.errors.stations }
      const rowErrors = { ...stationErrors[action.id] }
      delete rowErrors[action.field]
      if (Object.keys(rowErrors).length) stationErrors[action.id] = rowErrors
      else delete stationErrors[action.id]
      return { ...state, errors: { ...state.errors, stations: stationErrors } }
    }
    case 'teams/add':
      return {
        ...state,
        teams: [...state.teams, action.team],
        errors: { ...state.errors, team: '' },
      }
    case 'teams/remove':
      return {
        ...state,
        teams: state.teams.filter((team) => team.id !== action.id),
      }
    case 'organizers/add':
      return {
        ...state,
        organizers: [...state.organizers, action.organizer],
        errors: { ...state.errors, organizer: '' },
      }
    case 'organizers/remove':
      return {
        ...state,
        organizers: state.organizers.filter(
          (organizer) => organizer.id !== action.id,
        ),
      }
    case 'settings/update':
      return { ...state, settings: { ...state.settings, ...action.changes } }
    case 'form/reset':
      return action.state
  }
}
