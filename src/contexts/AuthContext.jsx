import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api/authService'
import { userService } from '../services/api/userService'
import { agentService } from '../services/api/agentService'
import { contactService } from '../services/api/contactService'
import { storage } from '../utils/storage'

const AuthContext = createContext(null)

// localStorage key，存储待处理的好友请求（人类用户之间）
const PENDING_KEY = 'pending_friend_requests'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [friends, setFriends] = useState([])          // 已确认的好友列表
  const [pendingRequests, setPendingRequests] = useState([]) // 待处理的好友请求
  const [authType, setAuthType] = useState(null)      // 'user' | 'agent'
  const [currentAgent, setCurrentAgent] = useState(null)

  // 从 localStorage 加载 pending 请求
  const loadPending = () => {
    try {
      const raw = localStorage.getItem(PENDING_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  const savePending = (list) => {
    localStorage.setItem(PENDING_KEY, JSON.stringify(list))
    setPendingRequests(list)
  }

  // 加载已确认的联系人列表，补全 agent/user 详情
  const loadFriends = async (ownerType, ownerId) => {
    if (!ownerId) return
    try {
      const res = await contactService.getContacts(ownerType, ownerId)
      const contacts = res.data?.items ?? []
      if (contacts.length === 0) {
        setFriends([])
        return
      }

      // 分别处理 agent 和 user 类型的联系人
      const agentIds = contacts.filter(c => c.target?.actor_type === 'agent').map(c => c.target.actor_id)
      const userIds  = contacts.filter(c => c.target?.actor_type === 'user').map(c => c.target.actor_id)

      const result = []

      if (agentIds.length > 0) {
        const agentRes = await agentService.getAgents({ limit: 100 })
        const allAgents = agentRes.data?.items ?? []
        const agentMap = Object.fromEntries(allAgents.map(a => [a.id, a]))
        for (const id of agentIds) {
          const a = agentMap[id]
          if (a) result.push({ id: a.id, agent_id: a.agent_id, name: a.name, avatar: a.avatar || '🤖', description: a.description || '', type: 'agent' })
        }
      }

      if (userIds.length > 0) {
        for (const id of userIds) {
          try {
            const r = await userService.getUserById(id)
            if (r.code === 200 && r.data) {
              const u = r.data
              result.push({ id: u.id, name: u.username || u.email, avatar: u.avatar || '👤', description: u.email || '', type: 'user' })
            }
          } catch { /* skip */ }
        }
      }

      setFriends(result)
    } catch (e) {
      console.error('Failed to load friends:', e)
      setFriends([])
    }
  }

  // 确保预置 agent 已注册（不自动添加为联系人）
  const ensurePresetAgents = async () => {
    try { await agentService.ensurePresetAgents() } catch { /* ignore */ }
  }

  // 添加好友
  // - agent 类型：直接调用后端接口，立即加入好友列表
  // - user 类型：加入 pending，等对方同意（前端模拟，后端暂无 request API）
  const addFriend = async ({ targetType, targetId, targetName, targetAvatar, targetDesc }) => {
    const ownerType = authType || 'user'
    const ownerId = storage.getUser()?.id
    if (!ownerId) throw new Error('未登录')

    if (targetType === 'agent') {
      const res = await contactService.addContact(ownerType, ownerId, 'agent', targetId)
      if (res.code === 200 || res.code === 201) {
        await loadFriends(ownerType, ownerId)
        return { status: 'added' }
      }
      throw new Error(res.message || '添加失败')
    }

    // user 类型：加入 pending 列表
    const pending = loadPending()
    const already = pending.find(p => p.targetId === targetId)
    if (already) throw new Error('已发送过好友请求')
    const newPending = [...pending, { targetId, targetName, targetAvatar: targetAvatar || '👤', targetDesc: targetDesc || '', sentAt: Date.now() }]
    savePending(newPending)
    return { status: 'pending' }
  }

  // 同意好友请求（对方发来的请求，当前用户同意）
  const acceptFriendRequest = async (request) => {
    const ownerType = authType || 'user'
    const ownerId = storage.getUser()?.id
    if (!ownerId) throw new Error('未登录')
    const res = await contactService.addContact(ownerType, ownerId, request.fromType || 'user', request.fromId)
    if (res.code === 200 || res.code === 201) {
      await loadFriends(ownerType, ownerId)
    }
  }

  // 初始化
  useEffect(() => {
    const initAuth = async () => {
      const token = storage.getToken()
      const savedUser = storage.getUser()

      if (token && savedUser) {
        setUser(savedUser)
        setIsAuthenticated(true)
        const savedAuthType = storage.getAuthType() || 'user'
        setAuthType(savedAuthType)
        const savedAgent = storage.getAgentIdentity()
        if (savedAgent) setCurrentAgent(savedAgent)

        try {
          const response = await userService.getCurrentUser()
          if (response.code === 200) {
            setUser(response.data)
            storage.setUser(response.data)
          }
        } catch {
          await logout()
          setLoading(false)
          return
        }

        setPendingRequests(loadPending())
        await loadFriends(savedAuthType, savedUser.id)
      }

      setLoading(false)
    }

    initAuth()
  }, [])

  const register = async (data) => {
    const response = await authService.register(data)
    if (response.code === 200) {
      return await login({ email: data.email, password: data.password })
    }
    throw new Error(response.message || '注册失败')
  }

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
      await ensurePresetAgents()
      setPendingRequests(loadPending())
      await loadFriends('user', userData.id)
      return response
    }
    throw new Error(response.message || '登录失败')
  }

  const logout = async () => {
    try { await authService.logout() } catch { /* ignore */ }
    finally {
      storage.clearAuth()
      setUser(null)
      setIsAuthenticated(false)
      setFriends([])
      setPendingRequests([])
      setAuthType(null)
      setCurrentAgent(null)
    }
  }

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
      setPendingRequests(loadPending())
      await loadFriends('agent', agent.id)
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
    friends,
    pendingRequests,
    authType,
    currentAgent,
    register,
    login,
    loginAsAgent,
    logout,
    updateUser,
    addFriend,
    acceptFriendRequest,
    // 兼容旧代码中使用 agents 的地方
    agents: friends,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
