import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosInstance } from 'axios'
import type { ApiResponseModel } from '../types/api-types' // Sửa lại đường dẫn type nếu cần

// --- QUẢN LÝ STATE ---
let currentAccessToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void; }> = [];

export const setAuthToken = (token: string | null) => {
  currentAccessToken = token;
}

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

// --- HÀM CẮM RÚT (PLUGIN) ---
export const setupAuthInterceptors = (instance: AxiosInstance) => {
    
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (currentAccessToken && config.headers) {
      config.headers.Authorization = `Bearer ${currentAccessToken}`;
    }
    return config;
  });

  // 2. Bắt lỗi 401 & Silent Refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      const isAuthEndpoint = 
        originalRequest.url?.includes('/auth/login') || 
        originalRequest.url?.includes('/auth/refresh-token') ||
        originalRequest.url?.includes('/auth/google-login');

      if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
        
        if (isRefreshing) {
          try {
            const token = await new Promise<string>((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return instance(originalRequest);
          } catch (err) {
            return Promise.reject(err);
          }
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshResponse = await axios.post<ApiResponseModel<{ accessToken: string }>>(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
            {}, 
            { withCredentials: true } 
          );

          const newAccessToken = refreshResponse.data.data?.accessToken;
          if (!newAccessToken) throw new Error('No access token in refresh response');

          setAuthToken(newAccessToken);
          processQueue(null, newAccessToken);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return instance(originalRequest);

        } catch (refreshError) {
          processQueue(refreshError, null);
          setAuthToken(null);
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject({
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }
  );
};