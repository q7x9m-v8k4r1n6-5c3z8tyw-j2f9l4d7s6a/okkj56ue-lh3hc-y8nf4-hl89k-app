# Page Pattern Instruction

Tài liệu này định nghĩa pattern chuẩn cho `core/pages`.

---

## 1. Vai trò của page

Page là entry point của một route.

Page được phép:

1. Import public API của feature.
2. Ghép nhiều feature UI thành một màn hình.
3. Tạo semantic layout cấp route như `main`, `section`, spacing và scroll area.
4. Dùng shared UI primitive khi primitive chỉ phục vụ layout/presentation.
5. Giữ presentation state cấp route khi state đó chỉ quyết định cách ghép UI,
   ví dụ tab đang được hiển thị.

Page không được:

1. Gọi API.
2. Dùng React Query.
3. Chứa form state hoặc validation.
4. Map API DTO.
5. Biết reducer/action nội bộ của feature.
6. Import internal file của feature.
7. Import entity để xử lý domain data.
8. Truyền business callback hoặc render callback để nối hai feature.
9. Export asset, constant hoặc helper nội bộ không phải public route entry.

Tư duy:

```text
App router
  -> Page
      -> Feature public UI
          -> Entity public API
          -> Shared
```

Không được đảo chiều:

```text
Entity -> Feature     // sai
Feature -> Page       // sai
Shared -> Page        // sai
Shared -> Feature     // sai
```

---

## 2. Dependency direction

Chiều dependency chuẩn:

```text
app
  -> pages
      -> widgets (nếu có)
      -> features
      -> shared

features
  -> entities
  -> shared

entities
  -> shared
```

### Page import feature qua public API

Đúng:

```tsx
import { EditRaceView } from '@/core/features/race/edit-race'
```

Sai:

```tsx
import { useEditRaceEditor } from '@/core/features/race/edit-race/ui/hooks/useEditRaceEditor'
import { patchRace } from '@/core/features/race/edit-race/api/editRace.api'
```

Page không cần biết feature có hook, reducer, query hoặc mapper nào.

### Feature và entity không import page

Không đặt route constant trong page nếu feature cần import constant đó.

Sai:

```ts
import { DETAIL_RACE_ROUTE } from '@/core/pages/detail-race'
```

Nếu route path là application contract dùng ở nhiều nơi, đặt tại app routing
hoặc shared config phù hợp. Nếu chỉ là navigation action của một feature, giữ
action trong feature hook.

---

## 3. Ba loại page hợp lệ

### 3.1 Thin entry page

Dùng khi một feature sở hữu toàn bộ màn hình.

Ví dụ:

```tsx
import { LoginView } from '@/core/features/auth'

export const LoginPage = () => <LoginView />
```

Page:

- Không nhận workflow props.
- Không giữ state.
- Không import asset hoặc shared component.
- Không gọi hook nội bộ.

Feature sở hữu toàn bộ UI, asset và workflow.

Áp dụng tốt cho:

- Login
- Create race
- Một editor/view độc lập

### 3.2 Composition page

Dùng khi route ghép nhiều feature độc lập.

Ví dụ `race-list`:

```tsx
import { CreateRaceAction } from '@/core/features/race/create-race'
import { RaceCollection } from '@/core/features/race/list-race'

export const RaceListPage = () => (
  <main>
    <CreateRaceAction />
    <RaceCollection />
  </main>
)
```

Page chỉ quyết định:

- Feature nào xuất hiện.
- Thứ tự hiển thị.
- Layout cấp route.

Page không truyền:

- Query result.
- Mutation callback.
- Entity data.
- Mapper.
- Render callback nối feature A với feature B.

### 3.3 Route presentation page

Dùng khi page có UI composition state như tabs, section hoặc local view mode.

Ví dụ `detail-race`:

```text
DetailRacePage
  -> useDetailRacePage
      -> active tab presentation state
  -> EditRaceView
```

State này phải thỏa cả ba điều kiện:

1. Không đến từ backend.
2. Không thay đổi domain entity.
3. Không cần tái sử dụng ngoài route composition.

State phải nằm trong page-local hook, không viết trực tiếp trong component.

Đúng:

```tsx
const { activeTab, onTabChange } = useDetailRacePage()
```

Sai:

```tsx
const [race, setRace] = useState(...)
const query = useQuery(...)
```

Nếu state trở thành workflow có thể tái sử dụng, chuyển nó về feature.

---

## 4. Page component chỉ làm composition

Page component nên đọc được từ trên xuống như một bản mô tả màn hình.

Đúng:

```tsx
export const UserListPage = () => (
  <main>
    <UserTable />
    <UserFormPanel />
  </main>
)
```

Sai:

```tsx
const renderEditor = (options) => <UserForm {...options} />

export const UserListPage = () => (
  <UserTable renderEditor={renderEditor} />
)
```

Render callback làm:

- Feature A biết shape điều khiển Feature B.
- Page phải dịch internal protocol giữa hai feature.
- Khó thay feature mà không sửa page và type liên quan.

Nếu hai feature cần phối hợp trên cùng route, ưu tiên URL contract.

---

## 5. Phối hợp nhiều feature qua URL

URL là contract phù hợp cho page-level coordination:

```text
/users?editor=create&category=team
/users?editor=edit&category=staff&userId=12
```

Feature danh sách:

- Ghi trạng thái editor vào URL.
- Không import feature editor.

Feature editor:

- Đọc URL để biết có cần hiển thị hay không.
- Không import feature danh sách.

Khi từ hai feature trở lên cùng đọc/ghi search params, đặt parser/writer thuần
trong shared routing/config. Không để mỗi feature tự lặp magic string.

Page:

```tsx
export const UserListPage = () => (
  <main>
    <UserTable />
    <UserFormPanel />
  </main>
)
```

Lợi ích:

- Hai feature không phụ thuộc nhau.
- Page không truyền callback logic.
- Back/forward của trình duyệt hoạt động tự nhiên.
- Có thể deep-link đến edit form.
- Dễ thay UI drawer bằng modal hoặc route riêng.

Không dùng URL cho state nhập liệu chi tiết như password, form draft hoặc file.
Những state đó vẫn nằm trong feature frontend model.

---

## 6. Props của page

Route page thông thường không nhận feature workflow props.

Tránh:

```tsx
export const UserFormPage = (props: UserFormProps) => (
  <UserForm {...props} />
)
```

Router không cung cấp props kiểu này một cách tự nhiên. Nó tạo một wrapper
generic không đại diện cho route cụ thể.

Thay vào đó:

- Feature đọc route params/search params trong public view hook.
- Hoặc page cụ thể mount một public feature view không cần props.

Feature UI có thể nhận props khi nó thật sự là reusable embedded UI, nhưng page
không nên tự tạo một protocol business chỉ để chuyển props giữa feature.

---

## 7. Page-local model

Khi page cần presentation state, dùng cấu trúc nhỏ:

```text
detail-race/
  model/
    detailRace.tabs.ts
    useDetailRacePage.ts
  DetailRacePage.tsx
  index.ts
```

Không tạo folder/file chỉ để re-export.

`model/` chỉ hợp lý khi có:

- Tab configuration.
- Page-only view mode.
- Route composition selector.
- Presentation event handler.

Không đặt trong page model:

- API schema.
- Domain entity.
- Mutation payload.
- Form validation.
- Query key.

Những phần đó thuộc feature hoặc entity.

---

## 8. Shared UI trong page

Page có thể dùng shared UI để tạo route composition:

```tsx
import { Tabs } from '@/core/shared'
```

Chỉ dùng khi shared component:

- Không chứa business logic.
- Không cần entity data.
- Chỉ phục vụ presentation/layout.

Nếu một UI block có workflow, server state hoặc domain behavior, nó phải là
feature public UI hoặc widget, không phải shared component.

---

## 9. Entity trong page

Mặc định page không import entity.

Entity được feature sử dụng và render:

```text
Page
  -> Feature
      -> Entity
```

Tránh:

```tsx
import { RaceCard, type RaceSummary } from '@/core/entities/race'

export const RaceListPage = () => {
  // map/filter/open race logic
}
```

Danh sách race là workflow của `list-race`; page chỉ mount `RaceCollection`.

Ngoại lệ chỉ nên tồn tại khi page là static catalog/read-only composition và
không có feature behavior. Nếu bắt đầu có event, state hoặc navigation, tạo
feature.

---

## 10. Page public API

Mỗi page slice có một `index.ts` explicit:

```ts
export { RaceListPage } from './RaceListPage'
```

Không dùng:

```ts
export * from './RaceListPage'
```

Không export:

- Page-local hook.
- Tab constant.
- Asset.
- Helper.

App router import từng page slice:

```tsx
import { RaceListPage } from '@/core/pages/race-list'
import { DetailRacePage } from '@/core/pages/detail-race'
```

Không dùng global `core/pages/index.ts` để export mọi page. Global barrel làm
router phụ thuộc vào toàn bộ layer, tăng nguy cơ circular dependency và khiến
public boundary của từng page không rõ.

---

## 11. Naming

Page component:

```text
RaceListPage
DetailRacePage
LoginPage
```

Public feature surface:

```text
RaceCollection
EditRaceView
LoginView
UserFormPanel
```

Page-local hook:

```text
useDetailRacePage
usePrototypePage
```

Không đặt:

```text
useRaceMutation       // nếu thực tế là query
DetailRaceView        // nếu chỉ là alias thừa ngay trong page
PageUtils             // quá chung chung
```

Một page không cần thêm `*View` wrapper nếu wrapper không tạo boundary hoặc
không được tái sử dụng.

---

## 12. Comments

Public page component cần comment ngắn giải thích route responsibility:

```tsx
/**
 * Composes race-list actions and collection for the root route.
 */
export const RaceListPage = () => (...)
```

Page-local hook cần comment ownership:

```ts
/**
 * Owns presentation-only tab state for the race detail route.
 */
export const useDetailRacePage = () => (...)
```

Không viết comment kể lại JSX:

```tsx
// Render div
```

Comment phải giải thích boundary hoặc lý do ownership.

---

## 13. Loading, error và empty state

Feature sở hữu loading/error/empty state của dữ liệu feature.

Page không làm:

```tsx
const raceQuery = useRaceQuery()

if (raceQuery.isLoading) return ...
```

Đúng:

```tsx
export const DetailRacePage = () => <EditRaceView />
```

`EditRaceView` tự xử lý query state.

Page chỉ sở hữu route-level fallback nếu fallback liên quan việc compose route,
không phải dữ liệu nội bộ của một feature.

---

## 14. Not-found và static pages

`NotFoundPage` là ngoại lệ hợp lệ vì nó là routing fallback, không phải business
workflow.

Nó có thể render semantic HTML trực tiếp khi:

- Không có state.
- Không gọi API.
- Không dùng entity.
- Không có logic cần tái sử dụng.

Không cần tạo `not-found` feature chỉ để bọc vài dòng static UI.

---

## 15. Prototype/dev-only page

Prototype UI không phải business feature.

Nếu cần giữ:

- Đánh dấu rõ là development showcase.
- Tách state/event logic vào page-local hook.
- Component chỉ render từ hook.
- Không đưa mock entity data vào production feature/entity.
- Không dùng prototype làm mẫu cho business page.

Nếu prototype không còn được sử dụng, xóa route và page thay vì biến nó thành
feature giả.

---

## 16. Standard examples

### Race list

```tsx
import { CreateRaceAction } from '@/core/features/race/create-race'
import { RaceCollection } from '@/core/features/race/list-race'

/**
 * Composes race actions and collection for the race-list route.
 */
export const RaceListPage = () => (
  <main>
    <CreateRaceAction />
    <RaceCollection />
  </main>
)
```

### Detail race

```tsx
import { EditRaceView } from '@/core/features/race/edit-race'
import { Tabs } from '@/core/shared'
import { useDetailRacePage } from './model/useDetailRacePage'

/**
 * Composes race-detail sections while keeping domain state in each feature.
 */
export const DetailRacePage = () => {
  const page = useDetailRacePage()

  return (
    <main>
      <Tabs {...page.tabs} />
      {page.showsBasicInformation ? <EditRaceView /> : page.placeholder}
    </main>
  )
}
```

`useDetailRacePage` chỉ giữ presentation state. `EditRaceView` vẫn tự sở hữu
race query, form state và mutation.

### Login

```tsx
import { LoginView } from '@/core/features/auth'

export const LoginPage = () => <LoginView />
```

---

## 17. Anti-pattern checklist

Không chấp nhận page có các dấu hiệu sau:

- `useQuery`, `useMutation` hoặc `client.request`.
- Import `api/`, `model/`, `ui/hooks/` nội bộ của feature.
- Import Redux action/reducer.
- Form field state.
- Zod API contract.
- DTO-to-entity mapper.
- Entity mutation/navigation logic.
- Render prop để feature A tạo feature B.
- Page props sao chép toàn bộ feature props.
- Asset workflow nằm trong page nhưng được feature cần.
- Global page barrel export tất cả page.
- Component page có `useState` cho business state.

---

## 18. Review checklist

### Boundary

- [ ] App router import page qua page slice public API.
- [ ] Page chỉ import public feature API và shared presentation primitive.
- [ ] Feature/entity không import page.
- [ ] Page không deep-import feature.
- [ ] Page không import entity cho business workflow.

### State

- [ ] Không có server state trong page.
- [ ] Không có form/domain state trong page.
- [ ] Presentation state nếu có nằm trong page-local hook.
- [ ] Cross-feature coordination dùng URL/route contract.

### Composition

- [ ] Page không truyền render callback để nối feature.
- [ ] Page không map data từ feature này sang feature khác.
- [ ] Loading/error/empty state nằm trong feature sở hữu dữ liệu.
- [ ] Layout của page đọc được như một bản mô tả route.

### Public API

- [ ] Mỗi page `index.ts` export explicit page component.
- [ ] Không export hook, asset, constants nội bộ.
- [ ] Không có global `core/pages/index.ts`.

### Quality

- [ ] Page component có comment boundary ngắn.
- [ ] Không có file/folder wrapper không cần thiết.
- [ ] ESLint pass.
- [ ] Tests pass.
- [ ] Production build pass.

---

## 19. Quy trình apply cho page cũ

### Bước 1: Xác định route responsibility

Viết một câu:

```text
Page này compose feature nào cho route nào?
```

Nếu không trả lời được, page đang giữ quá nhiều nhiệm vụ.

### Bước 2: Phân loại state

| State | Owner |
|---|---|
| API loading/error/data | Feature `model/server` |
| Form draft/validation | Feature `model/frontend` |
| Domain model | Entity |
| Route tab/layout mode | Page-local hook |
| Cross-feature open/edit target | URL/search params |

### Bước 3: Chuyển workflow về feature

Chuyển khỏi page:

- API call.
- Query/mutation.
- Form hook.
- Asset đặc thù feature.
- Backend/frontend mapper.

Feature expose một public UI entry.

### Bước 4: Xóa glue callback

Nếu page có:

```tsx
const renderSomething = (...) => (...)
```

Kiểm tra hai feature có thể phối hợp qua URL hay route hay không. Page sau cùng
chỉ mount cả hai public UI.

### Bước 5: Tách presentation state

Nếu page có tab/view state hợp lệ, chuyển vào `model/use*Page.ts`.

### Bước 6: Siết public API

- Explicit export trong page slice.
- Router import từng page slice.
- Xóa global page barrel.

### Bước 7: Verify

```bash
rg -n "useQuery|useMutation|client\\.request" core/pages
rg -n "@/core/entities" core/pages
rg -n "@/core/pages|core/pages" core/features core/entities
rg -n "export \\*" core/pages
npm run lint
npm run test
npm run build
```

Kết quả mong muốn:

- Không có server/business state trong page.
- Không có reverse dependency.
- Không có wildcard page export.
- Page chỉ còn route composition rõ ràng.
