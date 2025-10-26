// src/utils/cookieHelper.js
import Cookies from 'js-cookie';

const TOKEN_KEY = 'jwt_token';

// Store JWT token securely in cookie for 1 day
export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: 1, secure: true, sameSite: 'strict' });
};

// Retrieve JWT token from cookie
export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

// Remove JWT token from cookie
export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};
