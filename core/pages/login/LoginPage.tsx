import { useLogin } from '@/core/features/auth'
import { Button, Input } from '@/core/shared'
import { UserIcon, LockIcon, ArrowRightIcon } from '@/core/assets/icons'
import { waterMarkMove } from '@/core/assets'
import { loginBackground } from './assets'

export const LoginPage = () => {
  const {
    username,
    password,
    fieldErrors,
    globalError,
    isLoading,
    handleFieldChange,
    handleStandardLogin
  } = useLogin()

  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <div className="w-full max-w-md rounded-[20px] bg-white p-8 shadow-2xl">
        
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-[#de3336] shadow-sm">
            <img src={waterMarkMove} alt="Move Logo" className="h-10 w-10 object-contain" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#1a1c1c]">
            Đăng nhập
          </h1>
        </div>

        <form onSubmit={handleStandardLogin} className="space-y-5">
          <Input
            label="Tên đăng nhập"
            value={username}
            onChange={(e) => handleFieldChange('username', e.target.value)}
            leadingIcon={<UserIcon className="h-4 w-4" />}
            disabled={isLoading}
            requiredMark={true}
            error={fieldErrors.username} 
            placeholder='Điền tên đăng nhập vào đây'
          />

          <Input
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => handleFieldChange('password', e.target.value)}
            placeholder="Điền mật khẩu vào đây"
            leadingIcon={<LockIcon className="h-4 w-4" />}
            disabled={isLoading}
            requiredMark={true}
            error={fieldErrors.password}
          />

          <div 
            className={`rounded-lg text-xs font-medium text-red-600 ${
              globalError ? 'opacity-100' : 'bg-transparent opacity-0'
            }`}
          >
            {globalError || <span className="invisible">&nbsp;</span>}
          </div>

          <Button
            type="submit"
            size="md"
            variant="primary"
            className="w-full text-base"
            trailingIcon={<ArrowRightIcon className="h-5 w-5" />}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e5e5e5]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 font-bold text-[#737373]">Nếu bạn là Organizer</span>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <div id="googleSignInBtn" className="w-full flex justify-center overflow-hidden rounded-lg"></div>
          </div>
        </div>
        
      </div>
    </div>
  )
}