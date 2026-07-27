# Race entity

The race entity contains only canonical race data and reusable presentation.
It does not know about routes, API endpoints, React Query, or feature forms.

## Public API

- `raceStatusSchema` and `RaceStatus`: canonical lifecycle status.
- `raceSummarySchema` and `RaceSummary`: minimal reusable race summary.
- `RaceCard`: presentational summary card.

## Boundary rules

- Feature-specific request/response contracts stay in that feature.
- Feature-specific form fields and validation stay in that feature.
- Navigation is provided to `RaceCard` through `onSelect`.
- The entity must never import from `features`.
- `edit-race` intentionally owns its detail contract and does not import this
  entity. This prevents the edit API shape from leaking into the canonical
  summary model.
- A consuming feature may use the entity public API. This is the allowed FSD
  dependency direction: `features -> entities`.
