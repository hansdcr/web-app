// API配置
export const API_CONFIG = {
  baseURL: 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}

// Agent 聊天服务地址（docker 运行）
export const AGENT_SERVICES = {
  agent_libai:  'http://localhost:9001',
  agent_dufu:   'http://localhost:9002',
  agent_baijuyi:'http://localhost:9003',
}

// API端点
export const API_ENDPOINTS = {
  // 认证相关
  register: '/api/auth/register',
  login: '/api/auth/login',
  agentLogin: '/api/auth/agent-login',
  logout: '/api/auth/logout',
  refresh: '/api/auth/refresh',

  // 用户相关
  users: '/api/users',
  currentUser: '/api/users/me',
  userById: (id) => `/api/users/${id}`,

  // Agent 管理（cultrue）
  agents: '/api/agents',
  agentRegister: '/api/agents/register',
  agentById: (id) => `/api/agents/${id}`,
  agentRegenerateKey: (id) => `/api/agents/${id}/regenerate-key`,

  // 联系人
  contacts: '/api/contacts',
  contactById: (id) => `/api/contacts/${id}`,
}

