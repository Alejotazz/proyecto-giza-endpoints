import axios from 'axios';
import { getToken, clearToken } from '../utils/token';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const esAuth = err.config?.url?.includes('/auth/'); // login/registro no redirigen
    if (err.response?.status === 401 && !esAuth) {
      clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;