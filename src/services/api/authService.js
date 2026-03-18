import { httpClient } from './client'
import { API_ENDPOINTS } from './config'

// 认证API服务
export const authService = {
  // 用户注册
  async register(data) {
    const response = await httpClient.post(API_ENDPOINTS.register, {
      username: data.username,
      email: data.email,
      password: data.password,
    })
    return response
  },

  // 用户登录
  async login(data) {
    const response = await httpClient.post(API_ENDPOINTS.login, {
      email: data.email,
      password: data.password,
    })
    return response
  },

  // 用户登出
  async logout() {
    const response = await httpClient.post(API_ENDPOINTS.logout)
    return response
  },

  // Agent 登录
  async agentLogin(data) {
    const response = await httpClient.post(API_ENDPOINTS.agentLogin, {
      agent_id: data.agent_id,
      api_key: data.api_key,
    })
    return response
  },

  // 刷新token
  async refreshToken(refreshToken) {
    const response = await httpClient.post(API_ENDPOINTS.refresh, {
      refresh_token: refreshToken,
    })
    return response
  },
}
