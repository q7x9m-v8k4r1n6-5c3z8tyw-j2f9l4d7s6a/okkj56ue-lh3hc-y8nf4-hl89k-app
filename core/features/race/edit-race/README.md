# Edit race feature

This slice follows Feature-Sliced Design boundaries and exposes only
`EditRaceView` through its public `index.ts`.

## Responsibilities

- `api/`: HTTP calls only. Requests and responses use backend DTOs.
- `model/editRace.contract.ts`: runtime API contracts and DTO types.
- `model/editRace.form.ts`: browser-side form types.
- `model/mapRaceDetailToForm.ts`: translates a backend DTO into a form.
- `model/mapEditRaceFormToRequest.ts`: creates a minimal PATCH DTO from a form.
- `model/editRace.validation.ts`: browser-side validation rules.
- `model/server/`: React Query hooks and query keys. This is server state.
- `model/frontend/`: reducer, context, and editor lifecycle. This is frontend
  state and must not call the API.
- `ui/hooks/`: view-model hooks that prepare state and named event handlers for
  components.
- `ui/components/`: rendering only.

## Data flow

```text
GET API
  -> response schema
  -> mapRaceDetailToForm
  -> EditRaceFormProvider
  -> UI view-model hooks
  -> components

component event
  -> UI view-model hook
  -> frontend reducer
  -> mapEditRaceFormToRequest
  -> request schema
  -> PATCH API
```

When adding a field, update the API contract, frontend form model, mapper,
validation if required, and the relevant view-model hook. Do not import an
internal file from outside this feature; add a deliberate export to `index.ts`
only when the capability must become public.
