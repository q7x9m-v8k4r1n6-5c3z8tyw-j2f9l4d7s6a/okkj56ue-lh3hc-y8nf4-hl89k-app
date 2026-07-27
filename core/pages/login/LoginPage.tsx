import { LoginView } from '@/core/features/auth'

/**
 * Route entry point for login.
 *
 * The auth feature owns the complete workflow and UI; the page only mounts
 * its public view.
 */
export const LoginPage = () => <LoginView />
