type LogoutButtonProps = {
  onLogout?: () => void
}

export const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  return (
    <button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium" onClick={onLogout} type="button">
      Logout
    </button>
  )
}
