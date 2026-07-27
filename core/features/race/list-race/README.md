# List race feature

`list-race` owns pagination, list fetching and navigation to a selected race.

- `model/listRace.contract.ts`: paginated API contract.
- `model/server/`: query keys and React Query server state.
- `ui/hooks/useRaceCollection.ts`: browser pagination and page navigation.
- `ui/RaceCollection/`: rendering only.

The API response reuses `raceSummarySchema` and the UI reuses `RaceCard` from
`entities/race`. The entity never imports this feature.

Consumers import `RaceCollection` from the feature root.
