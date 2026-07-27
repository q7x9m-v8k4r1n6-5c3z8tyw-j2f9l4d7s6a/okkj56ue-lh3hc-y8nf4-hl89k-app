# Create/edit user feature

This feature owns the create and edit workflow for managed teams and staff.

- `model/userForm.contract.ts`: endpoint DTO contracts.
- `model/userForm.ts`: frontend form and public component props.
- `model/server/`: detail query and save mutation state.
- `model/userForm.validation.ts`: pure normalization and validation.
- `ui/hooks/`: browser form state and render-ready view models.
- `ui/UserForm/`: drawer rendering only.
- `ui/UserFormPanel.tsx`: reads the user-editor URL contract and mounts the
  drawer without receiving coordination logic from a page.

The feature does not own canonical user, team or organizer entity models.
Feature-specific passwords, form modes and endpoint DTOs remain local.

`UserFormPanel` supports:

```text
?editor=create&category=team
?editor=edit&category=staff&userId=12
```

Consumers import public UI from the feature root.
