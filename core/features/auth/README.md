# Auth feature

`auth` owns the authentication workflow, not the user domain model.

## Structure

- `api/auth.api.ts`: HTTP calls and runtime parsing.
- `model/auth.contract.ts`: login, refresh and logout API contracts.
- `model/authSession.slice.ts`: app-wide authenticated-session state.
- `model/server/`: login, logout and session-restoration server state.
- `model/frontend/`: browser-only login and Google profile helpers.
- `ui/hooks/`: view-model hooks used by rendering components.
- `ui/LoginView.tsx`: complete public login screen and feature-owned asset.
- `ui/AuthInitializer.tsx`: public initialization boundary.

The stable authenticated user profile is imported from `entities/user`.
Tokens, refresh behavior and session transitions remain inside this feature.

`LoginPage` only renders `LoginView`; it does not pass form logic, state,
entities, or assets into the feature.

Consumers must import only from `@/core/features/auth`.
