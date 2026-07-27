# User list feature

`user-list` owns management filters, pagination, list queries, deletion and
the URL action that requests a create/edit panel.

- `model/userList.contract.ts`: team/organizer management endpoint DTOs.
- `model/frontend/`: browser-only tab, search and panel state.
- `model/server/`: list query and delete mutation state.
- `model/mapUserListToSummary.ts`: maps DTOs to `entities/user`.
- `ui/hooks/useUserTable.ts`: combines both state sources for rendering.

The feature does not import `create-user`. It writes the public editor
selection to search params; `create-user` reads the same URL contract.
`UserListPage` only mounts the two independent public feature surfaces.

Consumers import only from the feature root.
