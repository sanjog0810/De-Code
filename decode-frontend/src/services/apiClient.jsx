import axios from 'axios';
import { getToken } from '../utils/cookieHelper';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ Use Vite env variable
  withCredentials: true,
});

// 🔒 Interceptor to attach JWT
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
