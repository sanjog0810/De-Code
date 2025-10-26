// src/services/authService.js
import apiClient from './apiClient';
import { setToken, removeToken } from '../utils/cookieHelper';

export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token } = response.data; // { token: "..." }
    setToken(token);
    return token;
  } catch (error) {
    const msg = error.response?.data || error.message || 'Login failed';
    throw new Error(msg);
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await apiClient.post('/auth/register', { username, email, password });
    const { token } = response.data; // store JWT after registration
    setToken(token);
    return token;
  } catch (error) {
    const msg = error.response?.data || error.message || 'Registration failed';
    throw new Error(msg);
  }
};

export const logoutUser = () => {
  removeToken();
};
