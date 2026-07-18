import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '../api';
import { setCredentials, logout, setInitialized } from '../stores/authSlice';
import type { RootState } from '@/src/app/store';
import { LoadingScreen } from '@/core/shared';

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const isInitialized = useSelector((state: RootState) => state.auth.isInitialized);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await authApi.refreshToken();
        const user = await authApi.getMe(); 
        
        dispatch(setCredentials({ user, accessToken: res.accessToken }));
      } catch (error) {
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