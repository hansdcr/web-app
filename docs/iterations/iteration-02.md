# 迭代2: Agent 注册与联系人集成

> 实现 Agent 自动注册到 cultrue 平台，并在联系人列表中显示

## 📋 迭代信息

- **迭代编号**: 2
- **预计时间**: 0.5天
- **当前状态**: ✅ 已完成
- **依赖迭代**: 迭代1 ✅
- **开始日期**: 2026-03-18
- **完成日期**: 2026-03-18

## 🎯 迭代目标

将三个运行中的 Agent（李白/杜甫/白居易）自动注册到 cultrue 管理平台，并在前端联系人列表中显示，实现用户与 Agent 的联系人关系。

## 📝 已完成功能

### 1. API 服务层扩展 ✅

**新增文件**:
- `src/services/api/agentService.js` - Agent API 服务

**功能**:
- 获取 Agent 列表
- 注册 Agent（返回 API Key）
- 更新/删除 Agent
- 重新生成 API Key
- `ensurePresetAgents()` - 确保三个预置 Agent 已注册

**预置 Agent 数据**:
```javascript
{
  agent_id: 'agent_libai',
  name: '李白',
  avatar: '🧙',
  description: '唐代浪漫主义诗人，诗仙，豪放不羁',
}
{
  agent_id: 'agent_dufu',
  name: '杜甫',
  avatar: '📜',
  description: '唐代现实主义诗人，诗圣，忧国忧民',
}
{
  agent_id: 'agent_baijuyi',
  name: '白居易',
  avatar: '🎋',
  description: '唐代诗人，诗风平易近人，关注民生',
}
```

### 2. 认证上下文增强 ✅

**更新**: `src/contexts/AuthContext.jsx`

**新增功能**:
- 添加 `agents` 状态（存储已注册的 Agent 列表）
- 添加 `loadAgents()` 方法（自动注册预置 Agent）
- 登录后自动加载 Agent 列表
- 退出时清空 Agent 列表

### 3. 联系人列表集成 ✅

**更新**: `src/App.jsx`

**ContactsPage 组件**:
- 从 `agents` 数据动态生成联系人列表
- 按名称首字母自动分组
- 显示 Agent 头像、名称、描述
- 点击 Agent 跳转到聊天页面
- 空状态提示

**样式**:
- `.contacts-row` - Agent 行样式
- `.contacts-row-avatar` - 头像样式
- `.contacts-row-info` - 信息区域
- `.contacts-row-name` - 名称样式
- `.contacts-row-desc` - 描述样式（带省略号）

### 4. 聊天侧栏更新 ✅

**ChatSidebar 组件**:
- 从 `agents` 数据动态生成好友列表
- 移除手动添加好友功能（Agent 由后端管理）
- 显示 Agent 描述信息
- 空状态提示（加载中...）

### 5. 个人菜单增强 ✅

**PersonalMenuPopover 组件**:
- 显示真实用户信息（用户名、邮箱）
- 动态生成用户首字母头像
- 保持原有菜单功能

### 6. API 配置扩展 ✅

**更新**: `src/services/api/config.js`

**新增**:
- `AGENT_SERVICES` - Agent 聊天服务地址映射
  - `agent_libai`: http://localhost:9001
  - `agent_dufu`: http://localhost:9002
  - `agent_baijuyi`: http://localhost:9003
- Agent 管理 API 端点
- 联系人 API 端点

## 🏗️ 架构设计

### 数据流向

```
用户登录
  ↓
AuthContext.login()
  ↓
loadAgents()
  ↓
agentService.ensurePresetAgents()
  ↓
检查 cultrue 的 /api/agents 列表
  ↓
如果预置 Agent 不存在，调用 /api/agents/register 注册
  ↓
返回最新 Agent 列表
  ↓
更新 AuthContext.agents 状态
  ↓
App 组件从 agents 生成 friends 列表
  ↓
ContactsPage 和 ChatSidebar 显示 Agent 列表
```

### Agent 注册流程

```
前端启动
  ↓
用户登录成功
  ↓
调用 agentService.ensurePresetAgents()
  ↓
遍历 PRESET_AGENTS (libai, dufu, baijuyi)
  ↓
检查每个 agent_id 是否已存在
  ↓
不存在则调用 POST /api/agents/register
  ↓
cultrue 后端创建 Agent 记录
  ↓
生成 API Key（仅返回一次）
  ↓
前端忽略 API Key（Agent 服务已独立运行）
  ↓
返回完整 Agent 列表给前端
```

### 关键设计决策

1. **Agent 自动注册**：
   - 三个 Agent 服务（9001/9002/9003）已通过 Docker 运行
   - 前端登录时自动将它们注册到 cultrue 管理平台
   - 注册是幂等的（已存在则跳过）

2. **Agent 列表来源**：
   - 从 cultrue 的 `/api/agents` 获取
   - 不再使用硬编码的 friends 数据
   - 支持动态添加/删除 Agent

3. **联系人关系**：
   - 当前实现：所有已注册 Agent 自动显示在联系人列表
   - 未来扩展：可以实现用户选择性添加 Agent 为联系人（使用 cultrue 的 Contact API）

4. **Agent 认证**：
   - Agent 注册时生成 API Key
   - 前端暂不使用（Agent 服务独立运行）
   - 未来可用于 Agent 主动调用 cultrue API

## ✅ 验收标准

- [x] 用户登录后自动注册三个预置 Agent
- [x] 联系人页面显示已注册的 Agent 列表
- [x] Agent 按名称首字母分组显示
- [x] 显示 Agent 头像、名称、描述
- [x] 点击 Agent 可跳转到聊天页面
- [x] 聊天侧栏显示 Agent 列表
- [x] 个人菜单显示真实用户信息
- [x] 空状态提示正常显示

## 🔜 下一步

完成迭代2后，可以进入以下迭代：

- **迭代3**: 用户选择性添加 Agent 为联系人（使用 Contact API）
- **迭代4**: Agent 详情页面（查看 Agent 信息、重新生成 API Key）
- **迭代5**: 用户列表管理（查看所有注册用户）

## 📊 技术要点

### 1. Agent 数据结构

**cultrue 返回的 Agent 数据**:
```json
{
  "id": "uuid",
  "agent_id": "agent_libai",
  "name": "李白",
  "avatar": "🧙",
  "description": "唐代浪漫主义诗人，诗仙，豪放不羁",
  "system_prompt": "你是李白...",
  "agent_model_config": {
    "temperature": 0.7,
    "max_tokens": 2000,
    "model": "claude-sonnet-4"
  },
  "api_key_prefix": "ak_MAxkjk-BACMsu",
  "is_active": true,
  "created_at": "2026-03-18T06:58:45.603239Z"
}
```

### 2. 前端数据转换

```javascript
// agents (from cultrue) → friends (for UI)
const friends = agents.map((a) => ({
  id: a.agent_id,        // agent_libai
  name: a.name,          // 李白
  avatar: a.avatar,      // 🧙
  description: a.description,
}))
```

### 3. 幂等注册

```javascript
async ensurePresetAgents() {
  const existing = await this.getAgents()
  const existingIds = new Set(existing.map(a => a.agent_id))

  for (const preset of PRESET_AGENTS) {
    if (!existingIds.has(preset.agent_id)) {
      try {
        await this.registerAgent(preset)
      } catch (e) {
        // 已存在则忽略
      }
    }
  }

  return await this.getAgents()
}
```

## 🎯 架构优势

1. **统一管理**：所有 Agent 在 cultrue 平台统一注册和管理
2. **动态加载**：Agent 列表从后端动态获取，支持扩展
3. **自动注册**：用户登录时自动确保预置 Agent 已注册
4. **数据一致性**：Agent 信息由 cultrue 统一维护
5. **未来扩展**：支持用户自定义添加/删除联系人

---

**创建日期**: 2026-03-18
**完成日期**: 2026-03-18
