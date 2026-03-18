// Token存储工具
const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user_info'

export const storage = {
  // Token操作
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY)
  },

  // Refresh Token操作
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  setRefreshToken(token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  },

  removeRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  // 用户信息操作
  getUser() {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  },

  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  removeUser() {
    localStorage.removeItem(USER_KEY)
  },

  // 清除所有认证信息
  clearAuth() {
    this.removeToken()
    this.removeRefreshToken()
    this.removeUser()
  },
}
