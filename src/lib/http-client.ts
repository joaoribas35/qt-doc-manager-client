import Axios, { type AxiosInstance } from 'axios';

import { env } from '@/config/env';
import { useLogout } from '@/hooks/use-auth';
import { useUserStore } from '@/store/user.store';

const axiosInstance: AxiosInstance = Axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
  const token = useUserStore.getState().user?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    const isIvalidCredentials = error.response?.data?.code === 'AUT-003';

    if (error.response?.status === 401 && !isIvalidCredentials) {
      useLogout();
    }

    return Promise.reject(error);
  }
);

export const apiClient = {
  get: <T = unknown>(url: string): Promise<T> => {
    return axiosInstance.get<T>(url) as Promise<T>;
  },
  getBlob: (url: string): Promise<Blob> => {
    // Response interceptor returns response.data, so we get the blob at runtime
    return axiosInstance.get<Blob>(url, { responseType: 'blob' }) as unknown as Promise<Blob>;
  },
  post: <T = unknown>(url: string, data?: unknown): Promise<T> => {
    return axiosInstance.post<T>(url, data) as Promise<T>;
  },
  patch: <T = unknown>(url: string, data?: unknown): Promise<T> => {
    return axiosInstance.patch<T>(url, data) as Promise<T>;
  },
  delete: <T = unknown>(url: string): Promise<T> => {
    return axiosInstance.delete<T>(url) as Promise<T>;
  },
} as {
  get: <T = unknown>(url: string) => Promise<T>;
  getBlob: (url: string) => Promise<Blob>;
  post: <T = unknown>(url: string, data?: unknown) => Promise<T>;
  patch: <T = unknown>(url: string, data?: unknown) => Promise<T>;
  delete: <T = unknown>(url: string) => Promise<T>;
};
