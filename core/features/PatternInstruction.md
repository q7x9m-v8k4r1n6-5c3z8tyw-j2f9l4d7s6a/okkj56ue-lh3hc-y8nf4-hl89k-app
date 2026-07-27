# Feature Pattern Instruction

Tài liệu này mô tả pattern chuẩn để xây dựng và refactor feature trong dự án.
Mục tiêu là giúp Fresher/Junior Developer có thể nhanh chóng xác định:

- Code nên đặt ở đâu.
- State nào thuộc frontend, state nào thuộc backend.
- Component, hook, model và API chịu trách nhiệm gì.
- Khi nào cần tách file và khi nào không nên tách.
- Cách giữ feature cô lập, dễ test, dễ mở rộng và dễ tái sử dụng.

Feature `race/edit-race` là reference implementation của pattern này.

---

## 1. Nguyên tắc nền tảng

Mỗi feature phải có một trách nhiệm nghiệp vụ rõ ràng, ví dụ:

- `race/edit-race`: chỉnh sửa một race.
- `race/create-race`: tạo một race.
- `user/create-user`: tạo người dùng.

Một feature không được trở thành nơi chứa mọi logic liên quan đến entity. Logic
dùng chung cho nhiều feature phải được đặt tại `entities` hoặc `shared`.

Áp dụng các nguyên tắc sau:

1. Component chỉ render dữ liệu và bind event từ hook.
2. API contract không được dùng trực tiếp làm frontend form state.
3. Server state và frontend state phải được tách riêng.
4. Mapping giữa API DTO và frontend model phải nằm ở một nơi xác định.
5. Mỗi file chỉ nên có một lý do chính để thay đổi.
6. Chỉ export những capability mà bên ngoài feature thực sự cần.
7. Không tạo folder hoặc `index.ts` chỉ để bọc một file.
8. Logic quan trọng phải có test độc lập với UI.

---

## 2. Cấu trúc feature chuẩn

Không phải feature nào cũng cần toàn bộ file dưới đây. Chỉ tạo segment khi
feature thực sự có trách nhiệm tương ứng.

```text
feature-name/
  api/
    featureName.api.ts

  model/
    featureName.contract.ts
    featureName.form.ts
    featureName.validation.ts
    mapResponseToForm.ts
    mapFormToRequest.ts

    frontend/
      FeatureFormProvider.tsx
      featureForm.context.ts
      featureForm.reducer.ts
      useFeatureForm.ts
      useFeatureFormState.ts
      useFilePreview.ts
      useUnsavedChangesWarning.ts

    server/
      feature.queryKeys.ts
      useFeatureDetailQuery.ts
      useFeatureMutation.ts

  ui/
    FeatureView.tsx
    FeatureEditor.tsx

    components/
      BasicInformationSection.tsx
      SettingsSection.tsx

    hooks/
      useFeaturePage.ts
      useFeatureEditor.ts
      useBasicInformationSection.ts
      useSettingsSection.ts

  index.ts
```

Không tạo file rỗng hoặc file chỉ re-export một file khác. Ví dụ, nếu `api/`
chỉ có `featureName.api.ts`, không cần thêm `api/index.ts`.

---

## 3. Public API và feature isolation

File `index.ts` ở root feature là public API duy nhất.

Ví dụ:

```ts
// feature-name/index.ts
export { FeatureView } from './ui/FeatureView'
```

Consumer phải import qua public API:

```ts
import { FeatureView } from '@/core/features/domain/feature-name'
```

Không import implementation nội bộ từ feature khác:

```ts
// Không nên
import { useFeatureForm } from '@/core/features/domain/feature-name/model/frontend/useFeatureForm'
```

Nếu một capability cần được tái sử dụng bên ngoài feature, cần xác định lại:

- Thuộc nghiệp vụ entity → chuyển xuống `entities`.
- Dùng chung toàn ứng dụng → chuyển xuống `shared`.
- Chỉ là entry point của feature → export có chủ đích từ `index.ts`.

Không export toàn bộ `api`, `model` hoặc `hooks` bằng `export *`.

---

## 4. API contract và TypeScript type

### 4.1 Dữ liệu qua API phải dùng schema

Mọi dữ liệu không đáng tin cậy từ backend phải được kiểm tra bằng Zod tại API
boundary.

```ts
import { z } from 'zod'

export const featureDetailResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  modifiedAt: z.string(),
})

export type FeatureDetailResponse = z.infer<
  typeof featureDetailResponseSchema
>
```

API phải request dữ liệu dưới dạng `unknown`, sau đó parse:

```ts
/**
 * Fetches and validates feature detail returned by the backend.
 */
export const getFeatureDetail = async (
  id: string,
  signal?: AbortSignal,
): Promise<FeatureDetailResponse> => {
  const response = await client.request<unknown>({
    path: `/Feature/${id}`,
    signal,
  })

  return featureDetailResponseSchema.parse(response)
}
```

Request payload cũng nên được định nghĩa bằng schema:

```ts
export const updateFeatureRequestSchema = z.object({
  expectedModifiedAt: z.string().min(1),
  name: z.string().min(1).max(255).optional(),
})

export type UpdateFeatureRequest = z.infer<
  typeof updateFeatureRequestSchema
>
```

### 4.2 Frontend form model có thể dùng TypeScript type

Frontend form model chứa dữ liệu phục vụ browser/UI và không nhất thiết giống
API DTO.

```ts
export type FeatureForm = {
  name: string
  coverFileName: string
  modifiedAt: string
  selectedItems: Array<{
    id: string
    displayName: string
  }>
}
```

Dùng TypeScript type cho frontend model khi:

- Dữ liệu đã được tạo từ response đã parse.
- Model có field chỉ phục vụ UI.
- Validation cần kiểm tra `File`, browser API hoặc error theo UI row.
- Model không trực tiếp đi qua network/storage boundary.

Có thể tạo Zod schema cho form nếu form được hydrate từ nguồn không đáng tin
cậy như local storage hoặc URL payload. Không cần tạo schema chỉ để thay thế
một TypeScript type đơn giản.

---

## 5. Mapper: ranh giới giữa backend và frontend

API DTO không được truyền trực tiếp vào component hoặc reducer.

Luồng đọc:

```text
API response
  -> response schema
  -> mapResponseToForm
  -> frontend form state
```

Luồng ghi:

```text
frontend form state
  -> validate form
  -> mapFormToRequest
  -> request schema
  -> API
```

Tách mapper theo chiều nếu mỗi chiều có logic độc lập:

```text
model/
  mapFeatureDetailToForm.ts
  mapFeatureFormToRequest.ts
```

Không gom cả hai chiều vào một file lớn chỉ vì đều được gọi là “mapping”.

Ví dụ:

```ts
/**
 * Converts a validated backend DTO into values suitable for HTML inputs.
 */
export const mapFeatureDetailToForm = (
  detail: FeatureDetailResponse,
): FeatureForm => ({
  name: detail.name,
  modifiedAt: detail.modifiedAt,
  coverFileName: '',
  selectedItems: [],
})
```

Với PATCH API, mapper nên chỉ gửi field thay đổi:

```ts
/**
 * Creates a minimal PATCH request from the current form and server baseline.
 */
export const mapFeatureFormToRequest = (
  form: FeatureForm,
  original: FeatureForm,
): UpdateFeatureRequest => ({
  expectedModifiedAt: original.modifiedAt,
  ...(form.name.trim() !== original.name
    ? { name: form.name.trim() }
    : {}),
})
```

Mapper phải là pure function:

- Không gọi API.
- Không đọc React context.
- Không dispatch state.
- Không hiển thị toast.
- Không thay đổi input object.

---

## 6. Phân biệt server state và frontend state

### 6.1 Server state

Server state là dữ liệu thuộc backend:

- Detail được tải từ API.
- Loading/error của request.
- Cache.
- Refetch.
- Mutation status.
- Cache invalidation.

Server state được quản lý trong `model/server` bằng React Query.

```ts
/**
 * Loads and caches validated detail from the backend.
 */
export const useFeatureDetailQuery = (id?: string) =>
  useQuery({
    queryKey: featureQueryKeys.detail(id),
    queryFn: ({ signal }) => getFeatureDetail(id ?? '', signal),
    select: mapFeatureDetailToForm,
    enabled: Boolean(id),
  })
```

Mutation hook chỉ chịu trách nhiệm network và cache:

```ts
/**
 * Updates server state and invalidates related queries.
 */
export const useUpdateFeatureMutation = (id?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateFeatureRequest) => {
      if (!id) throw new Error('Missing feature id.')
      return updateFeature(id, updateFeatureRequestSchema.parse(payload))
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: featureQueryKeys.all,
      })
    },
  })
}
```

Server hook không được:

- Giữ state của input đang nhập.
- Quản lý edit mode.
- Quản lý browser object URL.
- Chứa JSX.
- Biết cách hiển thị error trên UI.

### 6.2 Frontend state

Frontend state là state chỉ tồn tại trong browser:

- Giá trị input đang chỉnh sửa.
- Edit mode.
- Validation error visibility.
- Dirty state.
- Selected `File`.
- Local image preview.
- UI selection.

Frontend state được đặt trong `model/frontend`.

Với form lớn, ưu tiên reducer thay vì nhiều `useState`:

```ts
export type FeatureFormAction =
  | { type: 'START_EDITING' }
  | { type: 'CANCEL_EDITING' }
  | { type: 'UPDATE_NAME'; name: string }
  | { type: 'SAVE_SUCCEEDED'; savedForm: FeatureForm }
```

Reducer phải là pure function và mô tả state transition tường minh:

```ts
/**
 * Applies predictable transitions to local form state.
 */
export const featureFormReducer = (
  state: FeatureFormState,
  action: FeatureFormAction,
): FeatureFormState => {
  switch (action.type) {
    case 'UPDATE_NAME':
      return {
        ...state,
        form: { ...state.form, name: action.name },
      }
    default:
      return state
  }
}
```

Không gọi API, tạo object URL hoặc thực hiện side effect trong reducer.

---

## 7. Provider và context

Provider chỉ nên kết nối state hook với context:

```tsx
export const FeatureFormProvider = ({
  children,
  initialForm,
}: FeatureFormProviderProps) => {
  const editor = useFeatureFormState(initialForm)

  return (
    <FeatureFormContext.Provider value={editor}>
      {children}
    </FeatureFormContext.Provider>
  )
}
```

Không viết toàn bộ form logic trực tiếp trong provider component.

Context hook phải báo lỗi rõ ràng khi dùng sai:

```ts
/**
 * Reads frontend form state from the nearest provider.
 */
export const useFeatureForm = () => {
  const context = useContext(FeatureFormContext)

  if (!context) {
    throw new Error(
      'useFeatureForm must be used inside FeatureFormProvider.',
    )
  }

  return context
}
```

Không đồng bộ `initialForm` bằng cách gọi `setState` trong render. Khi server
version thay đổi, có thể remount provider bằng version key:

```tsx
<FeatureFormProvider
  key={`${id}:${initialForm.modifiedAt}`}
  initialForm={initialForm}
>
  <FeatureEditor />
</FeatureFormProvider>
```

---

## 8. View-model hook và component

Component không được tự xử lý business logic hoặc chuyển đổi model.

Mỗi component có state/logic nên đọc từ một view-model hook:

```ts
/**
 * Adapts form state and browser events for the basic information UI.
 */
export const useBasicInformationSection = () => {
  const editor = useFeatureForm()

  return {
    error: editor.errors.name,
    isEditing: editor.isEditing,
    name: editor.form.name,
    onNameChange: (event: ChangeEvent<HTMLInputElement>) => {
      editor.updateName(event.target.value)
    },
  }
}
```

Component chỉ render:

```tsx
export const BasicInformationSection = () => {
  const section = useBasicInformationSection()

  return section.isEditing ? (
    <Input
      error={section.error}
      value={section.name}
      onChange={section.onNameChange}
    />
  ) : (
    <ReadonlyField value={section.name} />
  )
}
```

Không nên đặt trong component:

- Gọi mutation.
- Map API response.
- Tính request payload.
- Validate form.
- Map entity model thành form model.
- Xử lý conflict.
- Format collection phức tạp.
- Tạo callback có business meaning.

Component được phép:

- Render điều kiện.
- Render danh sách.
- Bind giá trị và named handler từ hook.
- Chọn markup, className và accessibility attributes.

Pure presentational component nhỏ không bắt buộc phải có hook nếu nó không có
state hoặc logic, ví dụ `IconButton`, `StatusBadge`.

---

## 9. Page hook và editor hook

Nên tách page loading boundary khỏi editor mutation orchestration.

### Page hook

Chịu trách nhiệm:

- Đọc route parameter.
- Gọi detail query.
- Chuẩn hóa loading/error state.
- Tạo editor version key.

```ts
export const useFeaturePage = () => {
  const { id } = useParams()
  const query = useFeatureDetailQuery(id)

  return {
    id,
    initialForm: query.data ?? null,
    isLoading: query.isLoading,
    errorMessage: query.error
      ? getFeatureErrorMessage(query.error)
      : '',
  }
}
```

### Editor hook

Chịu trách nhiệm:

- Kết nối frontend form với mutation.
- Validate trước khi save.
- Map form thành request.
- Map response thành baseline mới.
- Xử lý conflict/reload.
- Chuẩn bị action cho UI.

```ts
export const useFeatureEditor = (id?: string) => {
  const editor = useFeatureForm()
  const mutation = useUpdateFeatureMutation(id)

  const save = () => {
    if (!editor.validateForSave()) return

    mutation.mutate(
      mapFeatureFormToRequest(editor.form, editor.originalForm),
      {
        onSuccess: (detail) => {
          editor.finishEditing(mapFeatureDetailToForm(detail))
        },
      },
    )
  }

  return {
    isSaving: mutation.isPending,
    save,
  }
}
```

---

## 10. Side-effect hook

Browser resource hoặc navigation effect cần hook riêng khi chúng làm state hook
khó đọc.

Ví dụ nên tách:

- Object URL lifecycle.
- Unsaved changes warning.
- Clipboard.
- Geolocation.
- WebSocket subscription.
- Polling.

```ts
/**
 * Owns a selected file and revokes its object URL when no longer needed.
 */
export const useFilePreview = () => {
  // File and URL lifecycle only.
}
```

Không tách hook chỉ để đổi tên một field:

```ts
// Không cần thiết
export const useFeatureName = () => {
  const editor = useFeatureForm()
  return editor.form.name
}
```

---

## 11. Quy tắc comment

Comment giải thích mục đích và lý do, không lặp lại cú pháp.

Nên comment:

- Exported API function.
- Exported hook.
- Mapper có business rule.
- Reducer hoặc state transition phức tạp.
- Side effect và cleanup.
- Workaround hoặc quyết định kiến trúc không hiển nhiên.

```ts
/**
 * Creates a minimal PATCH request and preserves the server concurrency token.
 */
export const mapFormToRequest = () => {
  // ...
}
```

Không nên:

```ts
// Set name
setName(value)

// Loop through booths
booths.map(...)
```

Tên hàm phải tự giải thích hành động. Comment không được dùng để bù cho tên hàm
mơ hồ như `handleData`, `process`, `doAction`.

---

## 12. Khi nào nên tách file

Tách file khi ít nhất một điều đúng:

1. File có nhiều trách nhiệm độc lập.
2. Logic có thể test riêng mà không cần render component.
3. Logic được tái sử dụng.
4. File chứa cả network state và frontend state.
5. File chứa cả mapping hai chiều phức tạp.
6. Side effect che khuất state transition chính.
7. Component chứa business logic hoặc nhiều event adapter.

Ví dụ nên tách:

```text
useFeatureFormState.ts
useFilePreview.ts
useUnsavedChangesWarning.ts
```

Không tách chỉ vì:

- File vượt một số dòng cố định.
- Một function dài 10–20 dòng nhưng chỉ có một nhiệm vụ.
- Muốn mọi function nằm trong file riêng.
- Muốn tạo cấu trúc giống một feature lớn hơn.

Folder component riêng chỉ hợp lý khi component có nhiều file thực sự liên
quan, ví dụ:

```text
DataGrid/
  DataGrid.tsx
  DataGridRow.tsx
  DataGrid.types.ts
  useDataGrid.ts
```

Nếu chỉ có `SettingsSection.tsx`, đặt trực tiếp trong `ui/components`.

---

## 13. Error và optimistic concurrency

Không chỉ hiển thị lỗi; UI cần có recovery path nếu người dùng không thể tự sửa.

Với conflict `409`:

1. Giữ message dễ hiểu.
2. Cho phép tải server version mới nhất.
3. Reset stale mutation error.
4. Refetch detail query.
5. Reset hoặc remount frontend baseline.

Không tự động ghi đè server version mới bằng dữ liệu cũ.

Lifecycle action và form save là hai user intent khác nhau:

- Không âm thầm lưu form khi người dùng chỉ muốn đổi status.
- Disable lifecycle action khi đang chỉnh sửa, hoặc yêu cầu xác nhận rõ ràng.
- Backend vẫn phải kiểm tra state transition; frontend validation không thay thế
  backend validation.

---

## 14. Testing strategy

### Bắt buộc

Mapper test:

- Không thay đổi → chỉ gửi concurrency token.
- Chỉ field thay đổi được đưa vào PATCH.
- Add/remove relation.
- Add/update/remove nested collection.
- Duplicate ID không tạo patch sai.

Validation test:

- Required field.
- Boundary length.
- Cross-field rule như end time phải sau start time.
- File type và file size.
- Nested row error.

Reducer test:

- Cancel phục hồi baseline.
- Save success tạo baseline mới.
- Add/update/remove collection.
- Không mutate state cũ.

### Khi feature có rủi ro cao

Thêm component/integration test:

- Loading và API error.
- Save success.
- Save validation error.
- Conflict recovery.
- Lifecycle action bị disable khi edit.
- Unsaved changes behavior.

Test pure function trước. Không render React component chỉ để kiểm tra một mapper
hoặc reducer.

---

## 15. Anti-pattern cần tránh

### Một hook làm tất cả

```ts
// Không nên
const useFeatureView = () => {
  // route
  // query
  // mutation
  // 20 form fields
  // mapping
  // validation
  // file preview
  // notification
}
```

### Redux/global store cho page-local form

Không đưa form chỉ dùng trong một screen vào global store nếu không có nhu cầu:

- Chia sẻ qua nhiều route.
- Persist xuyên navigation.
- Điều khiển bởi phần khác ngoài feature subtree.

### API DTO dùng trực tiếp trong UI

API naming, optionality và legacy field không được lan vào component.

### Validation chỉ ở frontend

Frontend validation phục vụ UX. Backend vẫn phải kiểm tra business invariant.

### Barrel export quá rộng

```ts
// Không nên
export * from './api'
export * from './model'
export * from './hooks'
export * from './ui'
```

### Tạo folder cho từng file

```text
SettingsSection/
  SettingsSection.tsx
  index.ts
```

Nếu không có file thứ hai có trách nhiệm thật sự, cấu trúc này chỉ làm import
path dài hơn.

### Logic trong JSX

Không map DTO, build payload hoặc viết business condition phức tạp ngay trong
JSX.

---

## 16. Quy trình tạo feature mới

1. Xác định use case và public entry point.
2. Viết API response/request schema.
3. Suy ra API types bằng `z.infer`.
4. Viết frontend form/view model nếu UI khác API DTO.
5. Viết mapper response → frontend.
6. Viết validation.
7. Viết mapper frontend → request.
8. Viết server query/mutation hooks.
9. Viết reducer/state hook nếu form đủ phức tạp.
10. Viết page/editor view-model hooks.
11. Viết component chỉ render từ hook.
12. Export entry point qua feature `index.ts`.
13. Viết mapper, validation và reducer tests.
14. Chạy feature lint, tests và production build.

Không bắt đầu bằng cách tạo toàn bộ folder template. Tạo file theo đúng nhu cầu
phát sinh ở từng bước.

---

## 17. Quy trình refactor feature cũ

Refactor theo từng boundary để giảm rủi ro:

1. Xác định public consumer bằng `rg`.
2. Viết schema cho API response/request hiện tại.
3. Tách frontend model khỏi API DTO.
4. Di chuyển mapping thành pure function và thêm test.
5. Tách React Query hooks khỏi form hook.
6. Chuyển form state phức tạp sang reducer.
7. Tách browser side effect.
8. Tạo view-model hook cho từng component có logic.
9. Làm component chỉ còn rendering.
10. Thu hẹp public `index.ts`.
11. Xóa barrel, folder và abstraction không còn giá trị.
12. Chạy lint/test/build sau mỗi nhóm thay đổi.

Không refactor đồng thời các feature không liên quan nếu chúng không chặn việc
hoàn thành feature đang làm.

---

## 18. Pull request checklist

### Boundary

- [ ] Feature có một use case rõ ràng.
- [ ] Bên ngoài chỉ import qua root `index.ts`.
- [ ] Không export implementation nội bộ không cần thiết.
- [ ] Logic dùng chung đã được đặt đúng ở `entities` hoặc `shared`.

### Contract và model

- [ ] API response được parse bằng schema.
- [ ] API type được suy ra bằng `z.infer`.
- [ ] Frontend model không phụ thuộc legacy API shape.
- [ ] Mapper là pure function.

### State

- [ ] React Query chỉ quản lý server state.
- [ ] Frontend form state không nằm trong server hook.
- [ ] Reducer không chứa side effect.
- [ ] File/object URL có cleanup.
- [ ] Có unsaved-changes protection nếu cần.

### UI

- [ ] Component lấy state/action từ hook.
- [ ] Component không build request hoặc map DTO.
- [ ] Event có business meaning đã được đặt tên trong view-model hook.
- [ ] Không có folder/index trung gian không cần thiết.

### Error

- [ ] Loading, empty và error state được xử lý.
- [ ] Conflict có recovery path.
- [ ] Mutation pending ngăn double submit.
- [ ] Lifecycle action không vô tình lưu form.

### Quality

- [ ] Exported method/hook quan trọng có comment về mục đích.
- [ ] Mapper test pass.
- [ ] Validation test pass.
- [ ] Reducer test pass nếu có reducer.
- [ ] Feature lint pass.
- [ ] Production build pass.

