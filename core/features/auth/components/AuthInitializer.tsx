import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '../api';
import { setCredentials, logout, setInitialized } from '../stores/authSlice';
import type { UserInfo } from '../stores/authSlice';
import type { RootState } from '@/src/app/store';
import { LoadingScreen } from '@/core/shared';

let initializationPromise: Promise<{ accessToken: string; user: UserInfo }> | null = null;

const restoreSession = () => {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      const res = await authApi.refreshToken();
      const user = await authApi.getMe();
      return { accessToken: res.accessToken, user };
    })().finally(() => {
      initializationPromise = null;
    });
  }

  return initializationPromise;
};

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const isInitialized = useSelector((state: RootState) => state.auth.isInitialized);

  useEffect(() => {
    // The login page is public and a first-time visitor has no refresh-token
    // cookie yet. Calling the refresh endpoint here only creates an expected
    // 401 before the user has had a chance to sign in.
    if (window.location.pathname === '/login' || window.location.pathname === '/login/') {
      dispatch(setInitialized());
      return;
    }

    const initAuth = async () => {
      try {
        const { accessToken, user } = await restoreSession();
        
        dispatch(setCredentials({ user, accessToken }));
      } catch {
        dispatch(logout());
      } finally {
        dispatch(setInitialized());
      }
    };

    initAuth();
  }, [dispatch]);

  if (!isInitialized) {
    return <LoadingScreen text="Đang tải dữ liệu hệ thống..." />;
  }

  return <>{children}</>;
};
