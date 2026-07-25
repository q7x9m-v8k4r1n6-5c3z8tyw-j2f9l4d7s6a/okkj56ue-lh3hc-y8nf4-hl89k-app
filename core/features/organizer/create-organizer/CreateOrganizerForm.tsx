import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Drawer, useToast } from '@/core/shared'
import { createOrganizerSchema } from '@/core/entities/organizer/models/organizer.schem'
import type { CreateOrganizerPayload } from '@/core/entities/organizer/models/organizer.type'
import { useCreateOrganizerMutation } from './useCreateOrganizerMutation'
import { useId } from 'react'
import { ChevronIcon, PlusIcon } from '@/core/assets'

export type CreateOrganizerFormProps = {
  open: boolean
  onClose: () => void
}

const fieldClassName = 'block'
const labelClassName = 'mb-2 block text-sm font-bold uppercase leading-[14px] tracking-[0.35px] text-[#1a1c1c]'
const inputClassName = 'h-12 w-full rounded-lg border border-[#e5e5e5] bg-white px-[17px] py-[14.5px] text-base leading-normal text-[#6b7280] outline-none transition placeholder:text-[#6b7280] focus:border-[#d4d4d4] focus:ring-2 focus:ring-[#de3336]/10'
const disabledInputClassName = `${inputClassName} cursor-not-allowed bg-[#fafafa]`
const selectClassName = `${inputClassName} appearance-none pr-11`

const RequiredMark = () => <span> (<span className="text-[#de3336]">*</span>)</span>

export const CreateOrganizerForm = ({ open, onClose }: CreateOrganizerFormProps) => {
  const formId = useId()
  const { mutate, isPending } = useCreateOrganizerMutation()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateOrganizerPayload>({
    resolver: zodResolver(createOrganizerSchema),
    defaultValues: {
      email: '',
      role: '',
    },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = (data: CreateOrganizerPayload) => {
    mutate(data, {
      onSuccess: () => {
        toast({ title: 'Thông báo', description: 'Đã tạo Ban Tổ chức mới.' })
        handleClose()
      },
    })
  }

  const footer = (
    <>
      <Button type="button" variant="secondary" size="sm" className="h-[37px] min-h-0 px-[33px] py-0 text-sm font-semibold leading-[14px] tracking-[0.7px]" onClick={handleClose} disabled={isPending}>
        Hủy
      </Button>
      <Button type="submit" variant="primary" size="sm" className="h-[37px] min-h-0 px-8 py-0 text-sm font-semibold leading-[14px] tracking-[0.7px]" form={formId} disabled={isPending}>
        Lưu
      </Button>
    </>
  )

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title="Thêm mới Ban Tổ chức"
      icon={<PlusIcon className="size-6 shrink-0 text-[#de3336]" />}
      footer={footer}
    >
      <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex min-h-full flex-col">
        <div className="space-y-8">
          <label className={fieldClassName}>
            <span className={labelClassName}>
              Email<RequiredMark />
            </span>
            <input
              type="email"
              placeholder="Nhập email"
              disabled={isPending}
              className={isPending ? disabledInputClassName : inputClassName}
              {...register('email')}
            />
            {errors.email?.message ? (
              <span className="mt-1.5 block text-xs text-[#de3336]">{errors.email.message}</span>
            ) : null}
          </label>

          <label className={`${fieldClassName} relative`}>
            <span className={labelClassName}>Vai trò<RequiredMark /></span>
            <select
              disabled={isPending}
              className={isPending ? `${selectClassName} cursor-not-allowed bg-[#fafafa]` : selectClassName}
              {...register('role')}
            >
              <option value="" disabled>Chọn vai trò</option>
              <option value="organizer">Ban Tổ chức</option>
              <option value="admin">Quản trị viên</option>
            </select>
            <ChevronIcon className="pointer-events-none absolute bottom-[18px] right-[17px] h-2 w-3 text-[#6b7280]" />
            {errors.role?.message ? (
              <span className="mt-1.5 block text-xs text-[#de3336]">{errors.role.message}</span>
            ) : null}
          </label>
        </div>
      </form>
    </Drawer>
  )
}
