import { useState } from 'react'
import { HelpCircleIcon, PlusIcon, SearchIcon, UsersIcon } from '@/core/assets'
import {
  Badge,
  Button,
  Checkbox,
  Drawer,
  Dropdown,
  Input,
  Modal,
  Pagination,
  Progress,
  SearchBox,
  Skeleton,
  Spinner,
  Table,
  TableBody,
  TableCard,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Tabs,
  Tooltip,
  useToast,
  type SearchOption,
} from '@/core/shared'

// Import toàn bộ icons để preview
import * as Icons from '@/core/assets/icons';

const roleOptions = [
  { value: 'admin', label: 'Quản trị viên', description: 'Toàn quyền quản lý giải đấu' },
  { value: 'organizer', label: 'Ban Tổ chức', description: 'Quản lý đội chơi và trận đấu' },
  { value: 'referee', label: 'Trọng tài', description: 'Cập nhật kết quả trận đấu' },
  { value: 'viewer', label: 'Khách xem', description: 'Chỉ có quyền xem dữ liệu' },
]

const searchOptions: SearchOption[] = Array.from({ length: 18 }, (_, index) => ({
  id: String(index + 1),
  label: `Đội thi ${String(index + 1).padStart(2, '0')}`,
  description: index % 2 === 0 ? 'Đại học Bách khoa Hà Nội' : 'Đại học Công nghệ',
  keywords: [`team-${index + 1}`, index % 2 === 0 ? 'bach khoa' : 'cong nghe'],
  icon: index < 2 ? <UsersIcon className="size-4" /> : undefined,
}))

const teams = [
  { id: 'olivia', name: 'Olivia Rhye', username: 'olivia', email: 'olivia@untitledui.com' },
  { id: 'phoenix', name: 'Phoenix Baker', username: 'phoenix', email: 'phoenix@untitledui.com' },
]

export const PrototypePage = () => {
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState('teams')
  const [role, setRole] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedSearch, setSelectedSearch] = useState<SearchOption | null>(null)

  return (
    <main className="min-h-full bg-[#fafafa] p-6 lg:p-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <header>
          <h2 className="mt-2 text-3xl font-semibold text-[#1a1c1c]">Common UI Prototype</h2>
        </header>

        <section className="rounded-xl border border-[#eeeeee] bg-white p-6">
          <h3 className="text-lg font-semibold">Buttons, inputs và dropdown</h3>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button leadingIcon={<PlusIcon className="size-5" />} onClick={() => setDrawerOpen(true)}>Thêm mới</Button>
            <Button variant="secondary" onClick={() => setModalOpen(true)}>Mở modal</Button>
            <Button variant="ghost">Ghost button</Button>
            <Button variant="danger">Xóa dữ liệu</Button>
            <Button disabled>Disabled</Button>
            <Button variant="secondary" onClick={() => toast({ title: 'Cập nhật thành công', description: 'Dữ liệu đã được lưu vào hệ thống.', variant: 'success' })}>Toast success</Button>
            <Button variant="secondary" onClick={() => toast({ title: 'Có lỗi xảy ra', description: 'Không thể hoàn tất thao tác. Vui lòng thử lại.', variant: 'danger' })}>Toast error</Button>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Input label="Địa điểm" requiredMark placeholder="Nhập địa điểm trận đấu" />
            <Dropdown label="Vai trò" requiredMark placeholder="Chọn vai trò" options={roleOptions} value={role} onChange={setRole} />
            <Input label="Tìm nhanh" leadingIcon={<SearchIcon className="size-5" />} placeholder="Nhập từ khóa" />
            <Input label="Email" requiredMark error="Email này đã tồn tại" defaultValue="admin@university.edu" />
            <Input label="Thông tin đã khóa" disabled value="Không thể chỉnh sửa" readOnly />
          </div>
        </section>

        <section className="rounded-xl border border-[#eeeeee] bg-white p-6">
          <h3 className="text-lg font-semibold">Search box</h3>
          <p className="mt-1 text-sm text-[#737373]">Gõ để lọc, dùng ↑ ↓ và Enter để chọn. Danh sách dài sẽ tự cuộn.</p>
          <div className="mt-5 max-w-2xl">
            <SearchBox options={searchOptions} defaultOptionIcon={<SearchIcon className="size-4" />} placeholder="Tìm đội thi..." onSelect={setSelectedSearch} />
            {selectedSearch ? <p className="mt-3 text-sm text-[#525252]">Đã chọn: <strong>{selectedSearch.label}</strong></p> : null}
          </div>
        </section>

        <section className="rounded-xl border border-[#eeeeee] bg-white p-6">
          <h3 className="text-lg font-semibold">Tooltip, progress và loading states</h3>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div className="max-w-lg">
              <Progress value={3} max={5} />
              <div className="mt-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase">Tên đội trưởng</span>
                  <Tooltip content="Nhập tên hoặc email đội trưởng">
                    <button type="button" className="text-[#737373] transition-colors hover:text-[#de3336]" aria-label="Hướng dẫn nhập tên đội trưởng">
                      <HelpCircleIcon className="size-4" />
                    </button>
                  </Tooltip>
                </div>
                <Input leadingIcon={<SearchIcon className="size-5" />} placeholder="Nhập tên đội" />
              </div>
            </div>
            <div className="grid content-start gap-5">
              <div className="flex items-center gap-6 rounded-lg border border-[#eeeeee] p-4">
                <Spinner size="sm" />
                <Spinner />
                <Spinner size="lg" />
                <span className="text-sm text-[#737373]">Các kích thước spinner</span>
              </div>
              <Skeleton lines={3} />
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Table và pagination</h3>
            <Badge>Active</Badge>
          </div>
          <TableCard>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell className="w-1/2"><span className="flex items-center gap-3"><Checkbox aria-label="Chọn tất cả" />Tên đội chơi</span></TableHeaderCell>
                  <TableHeaderCell>Tên đăng nhập</TableHeaderCell>
                  <TableHeaderCell>Trạng thái</TableHeaderCell>
                  <TableHeaderCell>Email đội trưởng</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team.id} className="hover:bg-[#fffafa]">
                    <TableCell className="font-medium text-[#171717]"><span className="flex items-center gap-3"><Checkbox aria-label={`Chọn ${team.name}`} />{team.name}</span></TableCell>
                    <TableCell>{team.username}</TableCell>
                    <TableCell><Badge>Active</Badge></TableCell>
                    <TableCell>{team.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination page={page} totalPages={10} onChange={setPage} />
          </TableCard>
        </section>

        <section className="rounded-xl border border-[#eeeeee] bg-white p-6">
          <h3 className="mb-5 text-lg font-semibold">Tabs</h3>
          <Tabs
            value={tab}
            onChange={setTab}
            items={[{ value: 'teams', label: 'Đội chơi' }, { value: 'organizers', label: 'Ban tổ chức' }]}
          />
          <div className="py-8 text-sm text-[#525252]">Nội dung tab: <strong>{tab === 'teams' ? 'Đội chơi' : 'Ban tổ chức'}</strong></div>
        </section>

        {/* THÊM PHẦN ICON GALLERY PREVIEW VÀO ĐÂY */}
        <section className="rounded-xl border border-[#eeeeee] bg-white p-6">
          <h3 className="mb-6 text-lg font-semibold text-gray-800">Icon Gallery Preview</h3>
          
          {/* Lưới hiển thị các Icon */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(Icons).map(([iconName, IconComponent]) => {
              // Bỏ qua nếu có export nào đó không phải là React Component hợp lệ
              if (typeof IconComponent !== 'function') return null;

              return (
                <div 
                  key={iconName} 
                  className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-[#de3336] transition-all cursor-pointer"
                  title={iconName}
                >
                  {/* Render Component Icon, truyền class để set kích thước và màu sắc mặc định */}
                  <IconComponent className="size-8 text-gray-700" />
                  
                  {/* Tên của Icon để dễ copy */}
                  <span className="mt-3 text-xs font-medium text-gray-500 text-center break-all">
                    {iconName}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
        
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Xác nhận thao tác"
        description="Modal dùng chung với overlay, Escape và click ra ngoài để đóng."
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Hủy</Button><Button onClick={() => setModalOpen(false)}>Xác nhận</Button></>}
      >
        <p className="text-sm leading-6 text-[#525252]">Bạn có thể đặt form, nội dung xác nhận hoặc thông tin chi tiết vào khu vực này.</p>
      </Modal>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Thêm mới Ban Tổ chức"
        icon={<PlusIcon className="size-6 text-[#de3336]" />}
        footer={<><Button variant="secondary" onClick={() => setDrawerOpen(false)}>Hủy</Button><Button onClick={() => setDrawerOpen(false)}>Lưu</Button></>}
      >
        <div className="grid gap-8">
          <Input label="Email" requiredMark placeholder="Nhập email Ban Tổ chức" type="email" />
          <Dropdown label="Vai trò" requiredMark placeholder="Chọn vai trò" options={roleOptions} value={role} onChange={setRole} />
        </div>
      </Drawer>
    </main>
  )
}