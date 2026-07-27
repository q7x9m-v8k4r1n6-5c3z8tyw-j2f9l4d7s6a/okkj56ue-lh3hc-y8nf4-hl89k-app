# Entity Pattern Instruction

Tài liệu này mô tả pattern chuẩn để xây dựng và refactor entity trong dự án.
Đối tượng chính là Fresher/Junior Developer, vì vậy mỗi quy tắc đều ưu tiên:

- Dễ xác định code nên đặt ở đâu.
- Dễ đọc và thay đổi.
- Giảm coupling giữa entity và feature.
- Không tạo abstraction hoặc file không cần thiết.
- Có thể mở rộng mà không làm model trở nên mơ hồ.

`entities/race` là reference implementation của pattern này.

---

## 1. Entity là gì?

Entity đại diện cho một khái niệm nghiệp vụ cốt lõi, có thể được sử dụng bởi
nhiều feature.

Ví dụ:

- `race`: trận đấu.
- `team`: đội chơi.
- `organizer`: ban tổ chức.
- `user`: người dùng.

Entity có thể chứa:

- Canonical data model.
- Runtime schema cho canonical model.
- API dùng chung để đọc entity.
- Query hooks dùng chung.
- UI component trình bày entity.
- Helper thuần, dùng chung cho nhiều feature.

Entity không đại diện cho một user workflow.

Các workflow sau là feature, không phải entity:

- Tạo race.
- Chỉnh sửa race.
- Xóa user.
- Phê duyệt organizer.
- Mời team tham gia race.

---

## 2. Entity và feature khác nhau như thế nào?

Entity trả lời câu hỏi:

> Đây là dữ liệu gì và có thể trình bày/tái sử dụng như thế nào?

Feature trả lời câu hỏi:

> Người dùng đang thực hiện hành động nghiệp vụ nào?

Ví dụ:

```text
entities/race
  -> RaceSummary
  -> RaceStatus
  -> RaceCard

features/race/edit-race
  -> EditRaceRequest
  -> EditRaceForm
  -> usePatchRaceMutation
  -> EditRaceView
```

Không đưa `EditRaceForm`, `CreateRaceRequest` hoặc `PatchRaceCommand` vào race
entity. Chúng thuộc workflow cụ thể.

---

## 3. Dependency direction theo FSD

Dependency được phép:

```text
app/pages
    ↓
features
    ↓
entities
    ↓
shared
```

Entity được phép import:

- `shared`.
- Asset dùng chung.
- Type hoặc utility thuộc chính entity.

Entity không được import:

- `features`.
- `pages`.
- `app`.
- Route hoặc workflow cụ thể của feature.

Ví dụ đúng:

```ts
import { Badge, TableCard } from '@/core/shared'
import type { RaceSummary } from '../model/race'
```

Ví dụ sai:

```ts
import { useEditRaceForm } from '@/core/features/race/edit-race'
import { EDIT_RACE_ROUTE } from '@/core/pages/detail-race'
```

Feature được phép sử dụng public API của entity:

```ts
import { RaceCard } from '@/core/entities/race'
```

Đây là dependency một chiều, không phải coupling vòng:

```text
list-race -> race entity
race entity -X-> list-race
```

Feature có thể không phụ thuộc entity nếu contract của feature khác canonical
entity model. Ví dụ `edit-race` sở hữu detail DTO và form riêng.

---

## 4. Khi nào nên tạo entity?

Tạo entity khi ít nhất một điều đúng:

1. Khái niệm xuất hiện trong nhiều feature.
2. Có canonical identity, ví dụ `id`.
3. Có canonical status hoặc thuộc tính nghiệp vụ dùng chung.
4. Có UI presentation được tái sử dụng.
5. Có query/read API được nhiều feature dùng chung.

Không tạo entity chỉ vì backend có một table hoặc endpoint.

Không phải mọi DTO đều là entity:

- Search suggestion DTO có thể chỉ thuộc search feature.
- Dashboard statistics DTO có thể chỉ thuộc dashboard widget.
- Patch request thuộc mutation feature.
- Form draft thuộc frontend state của feature.

---

## 5. Cấu trúc entity chuẩn

Chỉ tạo segment khi có trách nhiệm thực sự.

Entity nhỏ:

```text
entity-name/
  model/
    entityName.ts

  ui/
    EntityCard.tsx

  index.ts
```

Entity có API đọc dùng chung:

```text
entity-name/
  api/
    entityName.api.ts

  model/
    entityName.ts

    server/
      entityName.queryKeys.ts
      useEntityQuery.ts

  ui/
    EntityCard.tsx
    EntitySearchBox.tsx

  index.ts
```

Entity phức tạp hơn:

```text
entity-name/
  api/
    getEntity.api.ts
    searchEntities.api.ts

  model/
    entity.ts
    entitySearch.ts
    mapEntityResponse.ts

    server/
      entity.queryKeys.ts
      useEntityQuery.ts
      useEntitySearchQuery.ts

  ui/
    EntityAvatar.tsx
    EntityCard.tsx
    EntitySearchBox.tsx

  index.ts
```

Không tạo sẵn tất cả folder theo template. Folder rỗng không mang lại giá trị.

---

## 6. Canonical model

Canonical model là representation nhỏ, rõ ràng và ổn định của entity.

Ví dụ:

```ts
export const raceSummarySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  status: raceStatusSchema,
})

export type RaceSummary = z.infer<typeof raceSummarySchema>
```

Canonical model không nên:

- Chứa mọi field từng xuất hiện trong mọi endpoint.
- Có nhiều tên cho cùng một giá trị.
- Là union của legacy DTO.
- Đặt hầu hết field thành optional để parse mọi response.
- Chứa form-only hoặc workflow-only state.

Không nên:

```ts
export const raceSchema = z.object({
  id: z.string().optional(),
  raceId: z.string().optional(),
  name: z.string().optional(),
  raceName: z.string().optional(),
  modifiedAt: z.string().optional(),
  updatedAt: z.string().optional(),
  modifiedAtUtc: z.string().optional(),
})
```

Schema trên không mô tả một model rõ ràng. Nó đang cố chứa nhiều API shape.

Nên tạo mapper tại nơi sở hữu API shape:

```ts
const mapLegacyRaceResponse = (
  response: LegacyRaceResponse,
): RaceSummary => ({
  id: response.raceId,
  name: response.raceName,
  status: response.status,
})
```

---

## 7. Schema và type

### 7.1 Schema-first cho dữ liệu runtime

Dùng Zod schema khi entity model:

- Được parse từ backend response.
- Được hydrate từ local storage.
- Được đọc từ URL hoặc external input.
- Là canonical contract cần runtime validation.

Type phải được suy ra từ schema:

```ts
export const teamSummarySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
})

export type TeamSummary = z.infer<typeof teamSummarySchema>
```

Không viết type trùng schema:

```ts
// Không nên
export const teamSummarySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
})

export type TeamSummary = {
  id: string
  name: string
}
```

Hai định nghĩa có thể drift theo thời gian.

### 7.2 TypeScript type cho presentation contract

Props hoặc callback không cần runtime schema:

```ts
export type TeamCardProps = {
  team: TeamSummary
  onSelect: (teamId: string) => void
}
```

Không tạo Zod schema cho:

- React props.
- Callback.
- Local component state đã được tạo từ trusted model.
- View-model object chỉ tồn tại trong React tree.

---

## 8. Status và enum

Canonical status nên được mô tả một lần trong entity nếu nhiều capability dùng
chung status đó:

```ts
export const raceStatusSchema = z.enum([
  'draft',
  'ready',
  'ongoing',
  'paused',
  'completed',
])

export type RaceStatus = z.infer<typeof raceStatusSchema>
```

Không dùng enum TypeScript và Zod schema riêng cho cùng một tập giá trị.

Không tự normalize status không hợp lệ trong UI:

```ts
// Không nên
const status = rawStatus.toLowerCase() || 'draft'
```

Unknown external status phải bị phát hiện tại API boundary. UI nhận canonical
model và render trực tiếp:

```ts
const status = statusMeta[race.status]
```

Feature-specific contract có thể giữ schema riêng khi cần isolation. Khi đó:

- Tên status và business meaning phải thống nhất.
- Không import entity chỉ để tái sử dụng một enum nhỏ nếu mục tiêu là giữ
  feature contract độc lập.
- Backend vẫn là nguồn xác thực cuối cùng cho transition rule.

---

## 9. Entity API

Entity chỉ nên sở hữu API read/query nếu capability đó dùng chung cho nhiều
feature.

Ví dụ hợp lý:

- Get entity by ID.
- Search teams.
- Search organizers.
- Get lightweight entity summary.

Mutation thường thuộc feature vì mutation thể hiện user intent:

- Create user.
- Edit race.
- Archive team.
- Assign organizer.

Entity API phải parse response:

```ts
/**
 * Searches and validates entity summaries returned by the backend.
 */
export const searchTeams = async (
  query: string,
  signal?: AbortSignal,
): Promise<TeamSummary[]> => {
  const response = await client.request<unknown>({
    path: '/Team/search',
    query: { query },
    signal,
  })

  return z.array(teamSummarySchema).parse(response)
}
```

Không chỉ cast generic type:

```ts
// Không đủ an toàn
return client.request<TeamSummary[]>({
  path: '/Team/search',
})
```

TypeScript không kiểm tra dữ liệu runtime từ backend.

---

## 10. Entity server state

Query hook dùng chung có thể nằm trong entity:

```ts
/**
 * Loads reusable team search server state.
 */
export const useTeamSearchQuery = (query: string) =>
  useQuery({
    queryKey: teamQueryKeys.search(query),
    queryFn: ({ signal }) => searchTeams(query, signal),
    enabled: Boolean(query.trim()),
  })
```

Entity query hook được phép quản lý:

- Query key.
- Fetching state.
- Cache.
- Refetch policy.
- Entity response mapping.

Entity query hook không được quản lý:

- Form đang edit.
- Wizard step.
- Modal open state của feature.
- Mutation workflow cụ thể.
- Route navigation.
- Toast dành riêng cho một use case.

Không đặt query hook trong folder chung tên `hooks` nếu hook thực chất là server
state. Dùng tên rõ:

```text
model/server/useTeamSearchQuery.ts
```

---

## 11. Query keys

Entity có thể sở hữu query-key factory khi nhiều feature dùng chung canonical
entity cache.

```ts
export const teamQueryKeys = {
  all: ['teams'] as const,
  detail: (teamId: string) =>
    [...teamQueryKeys.all, 'detail', teamId] as const,
  search: (query: string) =>
    [...teamQueryKeys.all, 'search', query] as const,
}
```

Feature có thể sở hữu query keys riêng khi cache chỉ phục vụ workflow đó:

```ts
export const editRaceQueryKeys = {
  all: ['races'] as const,
  detail: (raceId?: string) =>
    [...editRaceQueryKeys.all, 'detail', raceId] as const,
}
```

Không đặt query key trong một parent feature chỉ để sibling feature import:

```ts
// Tránh coupling ngang giữa features
import { raceQueryKey } from '@/core/features/race/constants'
```

Chọn ownership theo quy tắc:

- Canonical entity cache, dùng rộng → entity.
- Workflow-specific cache → feature.
- Generic query-key helper → shared.

---

## 12. Entity UI

Entity UI là reusable presentation của canonical entity model.

Ví dụ:

- `RaceCard`.
- `UserAvatar`.
- `TeamBadge`.
- `OrganizerSearchBox`.

Entity UI nên nhận:

- Canonical entity data.
- Callback do consumer cung cấp.
- Presentation option có ý nghĩa chung.

```tsx
export type RaceCardProps = {
  race: RaceSummary
  onSelect: (raceId: string) => void
}

export const RaceCard = ({
  onSelect,
  race,
}: RaceCardProps) => (
  <button type="button" onClick={() => onSelect(race.id)}>
    {race.name}
  </button>
)
```

Entity UI không được biết:

- Route đích.
- Feature nào đang render nó.
- Mutation nào chạy sau click.
- Permission của workflow cụ thể.
- Toast/message của page.

Không nên:

```tsx
export const RaceCard = ({ race }: RaceCardProps) => {
  const navigate = useNavigate()

  return (
    <button onClick={() => navigate(`/races/${race.id}`)}>
      {race.name}
    </button>
  )
}
```

Route thuộc feature/page. Entity chỉ phát event:

```tsx
<RaceCard race={race} onSelect={openRaceDetail} />
```

---

## 13. Entity UI và hook

Pure presentational component không bắt buộc phải có hook.

Ví dụ không cần hook:

```tsx
export const UserAvatar = ({ user }: UserAvatarProps) => (
  <img src={user.avatarUrl} alt={user.displayName} />
)
```

Tạo entity hook khi có reusable logic thật sự:

- Entity query.
- Reusable search state.
- Derived presentation phức tạp.
- Browser behavior độc lập với feature.

Không tạo hook chỉ để chuyển tiếp props:

```ts
// Không cần thiết
export const useRaceCard = (race: RaceSummary) => ({
  name: race.name,
  status: race.status,
})
```

UI mapping nhỏ và cố định có thể ở component:

```ts
const statusMeta: Record<RaceStatus, StatusMeta> = {
  // ...
}
```

Nếu mapping được nhiều UI component dùng chung, chuyển thành model helper thuần.

---

## 14. Callback thay cho workflow dependency

Callback giúp entity UI không biết consumer sẽ làm gì.

Ví dụ:

```ts
export type OrganizerSearchBoxProps = {
  value: OrganizerSummary[]
  onChange: (organizers: OrganizerSummary[]) => void
}
```

Consumer có thể:

- Cập nhật create form.
- Cập nhật edit form.
- Mở detail.
- Thêm relation.

Entity component không cần thay đổi.

Callback nên mô tả event của entity:

- `onSelect`
- `onChange`
- `onRemove`
- `onRetry`

Tránh tên gắn với feature:

- `onEditRaceOrganizerSelected`
- `onCreateUserTeamChanged`

---

## 15. Feature-specific API shape

Không ép feature dùng canonical entity schema nếu endpoint có purpose khác.

Ví dụ race summary:

```ts
type RaceSummary = {
  id: string
  name: string
  status: RaceStatus
}
```

Edit-race detail có thể chứa:

```ts
type EditRaceDetailResponse = {
  id: string
  raceName: string
  modifiedAt: string
  organizers: EditRaceOrganizerDto[]
  booths: EditRaceBoothDto[]
}
```

`EditRaceDetailResponse` thuộc feature vì:

- Chỉ phục vụ edit workflow.
- Có concurrency token.
- Có nested relation patch data.
- API naming có thể khác canonical entity.

Không mở rộng `RaceSummary` bằng hàng loạt optional field để chứa detail DTO.

Nếu feature cần canonical model, viết mapper rõ ràng:

```ts
const mapDetailToRaceSummary = (
  detail: FeatureRaceDetail,
): RaceSummary => ({
  id: detail.id,
  name: detail.raceName,
  status: detail.status,
})
```

---

## 16. Public API

Root `index.ts` là public API duy nhất của entity.

```ts
export {
  raceStatusSchema,
  raceSummarySchema,
  type RaceStatus,
  type RaceSummary,
} from './model/race'

export {
  RaceCard,
  type RaceCardProps,
} from './ui/RaceCard'
```

Consumer:

```ts
import {
  RaceCard,
  type RaceSummary,
} from '@/core/entities/race'
```

Không export toàn bộ nội bộ:

```ts
// Không nên
export * from './api'
export * from './hooks'
export * from './model'
export * from './ui'
```

Lợi ích của explicit public API:

- Biết capability nào ổn định.
- Dễ tìm consumer.
- Không vô tình phụ thuộc implementation.
- Dễ refactor folder nội bộ.

---

## 17. Barrel file và folder

Không tạo `index.ts` chỉ để re-export một file:

```text
model/
  race.ts
  index.ts
```

Nếu root public API có thể import thẳng `model/race`, xóa `model/index.ts`.

Không tạo folder rỗng:

```text
race/
  api/
  constants/
  hooks/
  model/
  ui/
```

Entity chỉ có model và UI thì cấu trúc đúng là:

```text
race/
  model/
    race.ts
  ui/
    RaceCard.tsx
  index.ts
```

Thêm segment sau khi xuất hiện responsibility thật sự.

---

## 18. Constants

Constant thuộc entity khi nó mô tả domain concept dùng chung:

```ts
export const MAX_TEAM_NAME_LENGTH = 255
```

Không tạo folder `constants` cho một constant duy nhất. Đặt gần model sử dụng
nó nếu không có nhu cầu public.

Không định nghĩa status bằng object và schema riêng:

```ts
// Dễ drift
export const RACE_STATUS = {
  DRAFT: 'draft',
}

export const raceStatusSchema = z.enum([
  'draft',
  'ready',
])
```

Ưu tiên schema làm source of truth và suy ra type.

Presentation metadata không phải domain constant:

```ts
const statusMeta = {
  draft: { label: 'Nháp', variant: 'neutral' },
}
```

Nếu chỉ `RaceCard` sử dụng metadata này, đặt gần `RaceCard`.

---

## 19. Naming convention

Schema:

- `raceStatusSchema`
- `raceSummarySchema`
- `teamSearchResultSchema`

Type:

- `RaceStatus`
- `RaceSummary`
- `TeamSearchResult`

API:

- `getRaceSummary`
- `searchTeams`
- `getOrganizerOptions`

Query hook:

- `useRaceQuery`
- `useTeamSearchQuery`
- `useOrganizerOptionsQuery`

UI:

- `RaceCard`
- `TeamBadge`
- `OrganizerSearchBox`

Tránh tên chung chung:

- `RaceModel` khi không rõ summary/detail/form.
- `RaceData`.
- `RaceObject`.
- `useRaceHooks`.
- `handleData`.
- `processRace`.

Tên phải thể hiện representation hoặc intent.

---

## 20. Comment convention

Comment giải thích boundary, purpose hoặc business rule.

Nên comment:

- Canonical schema.
- Exported API.
- Exported query hook.
- Reusable UI component có boundary không hiển nhiên.
- Mapper/helper có business rule.

```ts
/**
 * Canonical race summary rendered by reusable entity UI.
 *
 * Feature-specific detail fields do not belong in this model.
 */
export const raceSummarySchema = z.object({
  // ...
})
```

Không comment lại cú pháp:

```ts
// Get race name
const name = race.name
```

---

## 21. Error handling

API của entity phải:

- Parse external response.
- Preserve abort signal.
- Throw error có thể được React Query xử lý.
- Không tự hiển thị toast.

Entity query hook có thể expose error state nhưng không quyết định message của
workflow.

Entity UI có thể hiển thị fallback presentation:

- Không có cover → default cover.
- Không có optional place → “Chưa cập nhật”.

Entity UI không được âm thầm sửa invalid domain data:

- Invalid status không được đổi thành `draft`.
- Invalid ID không được tạo ID tạm.
- Missing required name không được tạo tên giả.

Invalid external data phải bị phát hiện trước khi tới entity UI.

---

## 22. Testing strategy

### Schema test

Kiểm tra:

- Canonical entity hợp lệ.
- Invalid identity bị reject.
- Unsupported status bị reject.
- Required field được enforce.
- Boundary length nếu có.

```ts
describe('race entity schemas', () => {
  it('rejects an unsupported lifecycle status', () => {
    expect(() => raceStatusSchema.parse('upcoming')).toThrow()
  })
})
```

### Mapper test

Nếu entity có mapper:

- Map đúng external DTO sang canonical model.
- Không làm mất required value.
- Legacy value được normalize có chủ đích.
- Input object không bị mutate.

### API test

Nếu project có API mocking:

- Parse success response.
- Reject malformed response.
- Pass query parameter.
- Pass abort signal.

### UI test

Chỉ cần khi component có behavior đáng kể:

- Render canonical data.
- Gọi callback đúng ID.
- Hiển thị optional fallback.
- Accessibility label đúng.

Không render React chỉ để test một schema hoặc helper thuần.

---

## 23. Anti-pattern cần tránh

### Entity chứa mọi API shape

```ts
type User = {
  id?: string
  userId?: string
  displayName?: string
  fullName?: string
  linkedEmail?: string
  email?: string
}
```

### Entity điều hướng route

```ts
const navigate = useNavigate()
navigate(`/users/${user.id}`)
```

### Entity import feature

```ts
import { editUserActions } from '@/core/features/user/edit-user'
```

### Entity chứa mutation workflow

```ts
export const useCreateRace = () => {
  // create wizard behavior
}
```

### Feature form được đặt trong entity

```text
entities/race/model/EditRaceFormProvider.tsx
```

### Mọi field đều optional

Schema không còn đảm bảo canonical invariant.

### Barrel export toàn bộ

Implementation nội bộ trở thành public API ngoài ý muốn.

### Folder template rỗng

Làm codebase có vẻ lớn nhưng không thể hiện responsibility thật.

---

## 24. Quy trình tạo entity mới

1. Xác định entity có thực sự được nhiều feature sử dụng không.
2. Xác định canonical representation nhỏ nhất.
3. Viết runtime schema.
4. Suy ra type bằng `z.infer`.
5. Xác định API read/query có thực sự dùng chung không.
6. Chỉ tạo API/server segment nếu cần.
7. Xác định reusable presentation component.
8. Truyền workflow behavior qua callback.
9. Export capability cần thiết qua root `index.ts`.
10. Viết schema tests.
11. Kiểm tra entity không import feature/page/app.
12. Chạy lint, tests và build.

Không bắt đầu bằng việc copy toàn bộ folder từ entity lớn nhất.

---

## 25. Quy trình refactor entity cũ

1. Tìm toàn bộ consumer bằng `rg`.
2. Xác định export nào thực sự được sử dụng.
3. Xóa folder/file rỗng.
4. Phân loại schema:
   - Canonical entity.
   - Feature-specific DTO.
   - Legacy/unused.
5. Chuyển feature-specific DTO về feature sở hữu nó.
6. Xóa schema/type không có consumer.
7. Thay model tên chung bằng representation cụ thể.
8. Loại router/workflow dependency khỏi entity UI.
9. Chuyển navigation/action về consuming feature.
10. Thu hẹp root public API.
11. Thêm schema và boundary documentation.
12. Chạy dependency checks, tests và build.

Không giữ dead schema “để sau này có thể dùng”. Khi use case xuất hiện, thêm
model đúng với use case thực tế.

---

## 26. Dependency audit commands

Kiểm tra entity có import feature:

```bash
rg -n "@/core/features|core/features" core/entities/entity-name
```

Kiểm tra entity có biết route:

```bash
rg -n "react-router|useNavigate|useLocation" core/entities/entity-name
```

Tìm public API consumers:

```bash
rg -n "@/core/entities/entity-name" core src
```

Tìm legacy exports:

```bash
rg -n "OldEntityModel|oldEntitySchema" core src
```

Kết quả dependency audit mong muốn:

- Entity không import feature/page/app.
- Entity UI không biết route cụ thể.
- Consumer import qua root entity public API.
- Feature-specific contract không nằm trong entity.

---

## 27. Pull request checklist

### Entity definition

- [ ] Entity đại diện cho domain concept dùng lại được.
- [ ] Canonical model có identity rõ ràng.
- [ ] Required field không bị đặt optional tùy tiện.
- [ ] Tên model cho biết summary/detail/search representation.

### Schema và type

- [ ] External/canonical data có Zod schema.
- [ ] Type được suy ra bằng `z.infer`.
- [ ] Không có type viết tay trùng schema.
- [ ] Invalid status/identity bị reject.

### Boundary

- [ ] Entity không import feature.
- [ ] Entity không import page/app.
- [ ] Feature-specific DTO/form không nằm trong entity.
- [ ] Reusable code được export qua root `index.ts`.

### API và state

- [ ] Entity API chỉ chứa reusable read capability.
- [ ] Response được parse tại API boundary.
- [ ] Query hook chỉ quản lý server state.
- [ ] Mutation workflow nằm trong feature.

### UI

- [ ] Entity UI nhận canonical model.
- [ ] Navigation/action được truyền qua callback.
- [ ] Entity UI không biết route.
- [ ] Invalid domain data không bị âm thầm normalize.
- [ ] Optional presentation có fallback hợp lý.

### Structure

- [ ] Không có folder rỗng.
- [ ] Không có `index.ts` chỉ re-export một file.
- [ ] Public API dùng explicit exports.
- [ ] Không còn legacy schema/type không có consumer.

### Quality

- [ ] Exported capability quan trọng có comment về purpose.
- [ ] Schema tests pass.
- [ ] Entity lint pass.
- [ ] Dependency audit pass.
- [ ] Production build pass.

