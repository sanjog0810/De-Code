// src/services/apiClient.js
import axios from 'axios';
import { getToken } from '../utils/cookieHelper';

const apiClient = axios.create({
  baseURL: 'http://localhost:8081', // ✅ Use the API Gateway port
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
