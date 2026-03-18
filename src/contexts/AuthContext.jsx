import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api/authService'
import { userService } from '../services/api/userService'
import { storage } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 初始化：从localStorage恢复登录状态
  useEffect(() => {
    const initAuth = async () => {
      const token = storage.getToken()
      const savedUser = storage.getUser()

      if (token && savedUser) {
        setUser(savedUser)
        setIsAuthenticated(true)

        // 验证token是否有效（可选）
        try {
          const response = await userService.getCurrentUser()
          if (response.code === 200) {
            setUser(response.data)
            storage.setUser(response.data)
          }
        } catch (error) {
          // Token无效，清除认证信息
          logout()
        }
      }

      setLoading(false)
    }

    initAuth()
  }, [])

  // 注册
  const register = async (data) => {
    try {
      const response = await authService.register(data)

      if (response.code === 200) {
        // 注册成功后自动登录
        const loginData = {
          email: data.email,
          password: data.password,
        }
        return await login(loginData)
      }

      throw new Error(response.message || '注册失败')
    } catch (error) {
      throw error
    }
  }

  // 登录
  const login = async (data) => {
    try {
      const response = await authService.login(data)

      if (response.code === 200) {
        const { access_token, refresh_token, user: userData } = response.data

        // 保存token和用户信息
        storage.setToken(access_token)
        storage.setRefreshToken(refresh_token)
        storage.setUser(userData)

        setUser(userData)
        setIsAuthenticated(true)

        return response
      }

      throw new Error(response.message || '登录失败')
    } catch (error) {
      throw error
    }
  }

  // 登出
  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // 无论API调用是否成功，都清除本地认证信息
      storage.clearAuth()
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  // 更新用户信息
  const updateUser = (userData) => {
    setUser(userData)
    storage.setUser(userData)
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 自定义Hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
