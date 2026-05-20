import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data: { username: string; password: string; phone?: string }) =>
    apiClient.post('/auth/register', data),
  login: (data: { login: string; password: string }) =>
    apiClient.post('/auth/login', data),
  refresh: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),
  getMe: () => apiClient.get('/auth/me'),
};

export const curseApi = {
  getAll: (params?: Record<string, string | number>) =>
    apiClient.get('/curse', { params }),
  getById: (id: string) => apiClient.get(`/curse/${id}`),
  getByCounty: (province: string, city: string, county: string, category?: string) =>
    apiClient.get('/curse/county', { params: { province, city, county, category } }),
  getRandom: () => apiClient.get('/curse/random'),
  getStats: () => apiClient.get('/curse/stats'),
  like: (id: string) => apiClient.put(`/curse/${id}/like`),
  create: (data: Record<string, unknown>) => apiClient.post('/curse', data),
};

export const rankingApi = {
  getCountyRanking: (params?: { page?: number; limit?: number; province?: string }) =>
    apiClient.get('/ranking/county', { params }),
  getProvinceRanking: () => apiClient.get('/ranking/province'),
  getCityRanking: (city: string) => apiClient.get(`/ranking/city/${city}`),
};

export const voiceApi = {
  getByEntryId: (entryId: string) => apiClient.get(`/voice/entry/${entryId}`),
  getById: (id: string) => apiClient.get(`/voice/${id}`),
  like: (id: string) => apiClient.put(`/voice/${id}/like`),
};

export const commentApi = {
  getByEntryId: (entryId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get(`/comment/entry/${entryId}`, { params }),
  create: (data: { entryId?: string; content: string; type?: string }) =>
    apiClient.post('/comment', data),
  report: (id: string, data: { reason: string; detail?: string }) =>
    apiClient.post(`/comment/${id}/report`, data),
};

export const uploadApi = {
  getPresignedUrl: (fileName: string, mimeType: string) =>
    apiClient.post('/upload/presigned-url', { fileName, mimeType }),
  validate: (mimeType: string, size: number) =>
    apiClient.post('/upload/validate', { mimeType, size }),
};

export const userApi = {
  getById: (id: string) => apiClient.get(`/user/${id}`),
  update: (id: string, data: Record<string, unknown>) => apiClient.put(`/user/${id}`, data),
  getContributions: (id: string) => apiClient.get(`/user/${id}/contributions`),
  getLeaderboard: () => apiClient.get('/user/leaderboard/contributors'),
};