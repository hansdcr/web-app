// API配置
export const API_CONFIG = {
  baseURL: 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}

// API端点
export const API_ENDPOINTS = {
  // 认证相关
  register: '/api/auth/register',
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  refresh: '/api/auth/refresh',

  // 用户相关
  users: '/api/users',
  currentUser: '/api/users/me',
  userById: (id) => `/api/users/${id}`,
}
