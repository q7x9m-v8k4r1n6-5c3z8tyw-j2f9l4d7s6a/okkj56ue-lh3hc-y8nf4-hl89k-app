type LoginFormProps = {
  onSubmit?: () => void
}

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.()
      }}
    >
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Username
        <input className="rounded-md border border-slate-300 px-3 py-2" name="username" />
      </label>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Password
        <input className="rounded-md border border-slate-300 px-3 py-2" name="password" type="password" />
      </label>
      <button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white" type="submit">
        Login
      </button>
    </form>
  )
}
