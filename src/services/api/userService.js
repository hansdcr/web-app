import { httpClient } from './client'
import { API_ENDPOINTS } from './config'

// 用户API服务
export const userService = {
  // 获取当前用户信息
  async getCurrentUser() {
    const response = await httpClient.get(API_ENDPOINTS.currentUser)
    return response
  },

  // 获取用户列表
  async getUsers(params = {}) {
    const response = await httpClient.get(API_ENDPOINTS.users, params)
    return response
  },

  // 获取指定用户信息
  async getUserById(id) {
    const response = await httpClient.get(API_ENDPOINTS.userById(id))
    return response
  },

  // 更新当前用户信息
  async updateCurrentUser(data) {
    const response = await httpClient.put(API_ENDPOINTS.currentUser, data)
    return response
  },

  // 更新指定用户信息
  async updateUser(id, data) {
    const response = await httpClient.put(API_ENDPOINTS.userById(id), data)
    return response
  },

  // 删除用户
  async deleteUser(id) {
    const response = await httpClient.delete(API_ENDPOINTS.userById(id))
    return response
  },
}
