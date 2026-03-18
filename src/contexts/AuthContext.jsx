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
  const [authType, setAuthType] = useState(null) // 'user' | 'agent'
  const [currentAgent, setCurrentAgent] = useState(null) // agent 身份登录时的 agent 信息

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
        setAuthType(storage.getAuthType() || 'user')
        const savedAgent = storage.getAgentIdentity()
        if (savedAgent) setCurrentAgent(savedAgent)

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
      setAuthType('user')
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
      setAuthType(null)
      setCurrentAgent(null)
    }
  }

  // Agent 身份登录
  const loginAsAgent = async (data) => {
    const response = await authService.agentLogin(data)
    if (response.code === 200) {
      const { access_token, refresh_token, agent } = response.data
      storage.setToken(access_token)
      storage.setRefreshToken(refresh_token)
      storage.setUser(agent)
      storage.setAuthType('agent')
      storage.setAgentIdentity(agent)
      setUser(agent)
      setCurrentAgent(agent)
      setIsAuthenticated(true)
      setAuthType('agent')
      await loadAgents()
      return response
    }
    throw new Error(response.message || 'Agent 登录失败')
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
    authType,
    currentAgent,
    register,
    login,
    loginAsAgent,
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
