import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const isBrowser = typeof window !== 'undefined';
const isLocalhost =
  isBrowser &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.'));

export const PRODUCTION_API_URL = 'https://zuno-erp-api.onrender.com/api/v1';
export const LOCAL_API_URL = '/api/v1';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (isLocalhost ? LOCAL_API_URL : PRODUCTION_API_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT access token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('zuno_access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle expired tokens and auto-refresh
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('zuno_refresh_token');

      if (refreshToken) {
        try {
          const res: any = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          if (res.data?.data?.accessToken) {
            const newAccess = res.data.data.accessToken;
            localStorage.setItem('zuno_access_token', newAccess);
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            }
            return axios(originalRequest);
          }
        } catch {
          localStorage.removeItem('zuno_access_token');
          localStorage.removeItem('zuno_refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

