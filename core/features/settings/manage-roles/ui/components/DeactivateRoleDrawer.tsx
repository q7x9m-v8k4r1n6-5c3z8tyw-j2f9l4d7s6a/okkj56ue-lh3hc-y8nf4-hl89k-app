import { PauseCircleIcon } from '@/core/assets'
import { Button, Drawer } from '@/core/shared'
import type { RoleResponse } from '../../model/securityRoles.contract'

type DeactivateRoleDrawerProps = {
  role: RoleResponse | null
  pending: boolean
  onClose: () => void
  onConfirm: () => void
}

/** Confirms a lifecycle action without introducing a blocking modal. */
export const DeactivateRoleDrawer = ({
  onClose,
  onConfirm,
  pending,
  role,
}: DeactivateRoleDrawerProps) => (
  <Drawer
    open={Boolean(role)}
    title="Ngừng hoạt động vai trò"
    icon={<PauseCircleIcon className="size-6 text-[#de3336]" />}
    onClose={onClose}
    footer={(
      <>
        <Button variant="secondary" disabled={pending} onClick={onClose}>Quay lại</Button>
        <Button variant="danger" disabled={pending} onClick={() => void onConfirm()}>
          {pending ? 'Đang xử lý...' : 'Ngừng hoạt động'}
        </Button>
      </>
    )}
  >
    <div className="rounded-xl border border-[#fdcacb] bg-[#fff8f8] p-5">
      <p className="text-sm leading-6 text-[#525252]">
        Vai trò <strong className="text-[#1a1c1c]">{role?.name}</strong> sẽ không còn xuất hiện khi phân quyền cho người dùng mới.
      </p>
      <p className="mt-3 text-sm leading-6 text-[#737373]">
        Các tài khoản đang sử dụng vai trò này có thể mất quyền truy cập tương ứng. Hãy kiểm tra người dùng được gán trước khi tiếp tục.
      </p>
    </div>
  </Drawer>
)

