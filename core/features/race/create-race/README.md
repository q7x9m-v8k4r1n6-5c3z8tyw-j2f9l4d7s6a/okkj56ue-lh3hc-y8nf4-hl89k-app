# Create race feature

This feature is one isolated five-step create workflow.

## State ownership

- `model/createRace.contract.ts`: backend request/response schema.
- `model/createRace.form.ts`: frontend form shape.
- `model/frontend/`: provider, reducer and feature-scoped browser state.
- `model/server/`: create mutation state.
- `model/*.validation.ts`: pure validation rules.
- `model/mapCreateRaceFormToRequest.ts`: explicit frontend-to-backend mapper.
- `ui/**/use*.ts`: component view-model hooks.

Team and organizer selections use their entity public APIs. The form provider
is mounted by `CreateRaceView`, so draft state cannot leak into the app store
or another create-race instance.

Consumers import `CreateRaceView` or `CreateRaceAction` only from this
feature's root `index.ts`.
