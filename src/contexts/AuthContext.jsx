import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api/authService'
import { userService } from '../services/api/userService'
import { agentService } from '../services/api/agentService'
import { storage } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [agents, setAgents] = useState([])

  // 加载 agent 列表（确保预置 agent 已注册）
  const loadAgents = async () => {
    try {
      const list = await agentService.ensurePresetAgents()
      setAgents(list)
    } catch (e) {
      console.error('Failed to load agents:', e)
    }
  }

  // 初始化：从localStorage恢复登录状态
  useEffect(() => {
    const initAuth = async () => {
      const token = storage.getToken()
      const savedUser = storage.getUser()

      if (token && savedUser) {
        setUser(savedUser)
        setIsAuthenticated(true)

        try {
          const response = await userService.getCurrentUser()
          if (response.code === 200) {
            setUser(response.data)
            storage.setUser(response.data)
          }
        } catch {
          logout()
        }

        await loadAgents()
      }

      setLoading(false)
    }

    initAuth()
  }, [])

  // 注册
  const register = async (data) => {
    const response = await authService.register(data)
    if (response.code === 200) {
      return await login({ email: data.email, password: data.password })
    }
    throw new Error(response.message || '注册失败')
  }

  // 登录
  const login = async (data) => {
    const response = await authService.login(data)
    if (response.code === 200) {
      const { access_token, refresh_token, user: userData } = response.data
      storage.setToken(access_token)
      storage.setRefreshToken(refresh_token)
      storage.setUser(userData)
      setUser(userData)
      setIsAuthenticated(true)
      // 登录后加载 agent 列表
      await loadAgents()
      return response
    }
    throw new Error(response.message || '登录失败')
  }

  // 登出
  const logout = async () => {
    try {
      await authService.logout()
    } catch { /* ignore */ } finally {
      storage.clearAuth()
      setUser(null)
      setIsAuthenticated(false)
      setAgents([])
    }
  }

  const updateUser = (userData) => {
    setUser(userData)
    storage.setUser(userData)
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    agents,
    register,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
