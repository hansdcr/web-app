import { httpClient } from './client'
import { API_ENDPOINTS } from './config'

// 三个预置 agent 的基础信息
export const PRESET_AGENTS = [
  {
    agent_id: 'agent_libai',
    name: '李白',
    avatar: '🧙',
    description: '唐代浪漫主义诗人，诗仙，豪放不羁',
    system_prompt: '你是李白，唐代著名浪漫主义诗人，被誉为诗仙。',
  },
  {
    agent_id: 'agent_dufu',
    name: '杜甫',
    avatar: '📜',
    description: '唐代现实主义诗人，诗圣，忧国忧民',
    system_prompt: '你是杜甫，唐代著名现实主义诗人，被誉为诗圣。',
  },
  {
    agent_id: 'agent_baijuyi',
    name: '白居易',
    avatar: '🎋',
    description: '唐代诗人，诗风平易近人，关注民生',
    system_prompt: '你是白居易，唐代著名诗人，诗风平易近人。',
  },
]

export const agentService = {
  // 获取 agent 列表
  async getAgents(params = {}) {
    return httpClient.get(API_ENDPOINTS.agents, params)
  },

  // 获取单个 agent
  async getAgentById(agentId) {
    return httpClient.get(API_ENDPOINTS.agentById(agentId))
  },

  // 注册 agent（返回 api_key，仅一次）
  async registerAgent(data) {
    return httpClient.post(API_ENDPOINTS.agentRegister, data)
  },

  // 更新 agent
  async updateAgent(agentId, data) {
    return httpClient.put(API_ENDPOINTS.agentById(agentId), data)
  },

  // 删除 agent
  async deleteAgent(agentId) {
    return httpClient.delete(API_ENDPOINTS.agentById(agentId))
  },

  // 重新生成 API Key
  async regenerateApiKey(agentId) {
    return httpClient.post(API_ENDPOINTS.agentRegenerateKey(agentId))
  },

  // 确保三个预置 agent 已注册到 cultrue，返回最新 agent 列表
  async ensurePresetAgents() {
    const listRes = await this.getAgents({ limit: 100 })
    const existing = listRes.data?.items ?? []
    const existingIds = new Set(existing.map((a) => a.agent_id))

    for (const preset of PRESET_AGENTS) {
      if (!existingIds.has(preset.agent_id)) {
        try {
          await this.registerAgent(preset)
        } catch (e) {
          // 已存在则忽略
        }
      }
    }

    // 返回最新列表
    const updated = await this.getAgents({ limit: 100 })
    return updated.data?.items ?? []
  },
}
