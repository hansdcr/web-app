# 迭代1: API服务层

> 封装后端API调用，建立统一的服务层

## 📋 迭代信息

- **迭代编号**: 1
- **预计时间**: 0.5天
- **当前状态**: ⬜ 未开始
- **依赖迭代**: 无
- **开始日期**: 待定
- **完成日期**: 待定

## 🎯 迭代目标

创建统一的API服务层，封装所有后端API调用，提供统一的错误处理和认证机制。

## 📝 任务清单

### 1. 创建API配置

**任务**:
- [ ] 创建API基础配置文件
- [ ] 定义API基础URL
- [ ] 配置请求超时等参数

**交付物**:
- `src/services/api/config.js`

### 2. 创建HTTP客户端

**任务**:
- [ ] 封装fetch API
- [ ] 实现请求拦截器（添加认证token）
- [ ] 实现响应拦截器（统一错误处理）
- [ ] 实现请求重试机制

**交付物**:
- `src/services/api/client.js`

### 3. 创建用户API服务

**任务**:
- [ ] 实现获取用户列表API
- [ ] 实现获取用户详情API
- [ ] 实现创建用户API
- [ ] 实现更新用户API
- [ ] 实现删除用户API

**交付物**:
- `src/services/api/userService.js`

### 4. 创建认证API服务

**任务**:
- [ ] 实现登录API
- [ ] 实现注册API
- [ ] 实现登出API
- [ ] 实现token刷新API

**交付物**:
- `src/services/api/authService.js`

### 5. 创建工具函数

**任务**:
- [ ] 创建token存储工具
- [ ] 创建错误处理工具
- [ ] 创建响应数据转换工具

**交付物**:
- `src/utils/storage.js`
- `src/utils/errorHandler.js`

## ✅ 验收标准

- [ ] API服务层可以正常调用后端接口
- [ ] 请求自动携带认证token
- [ ] 错误统一处理并返回友好提示
- [ ] 代码结构清晰，易于维护

## 🔜 下一步

完成迭代1后，进入**迭代2: 用户列表页面**

## 📊 技术要点

### API服务层架构

```
src/
├── services/
│   └── api/
│       ├── config.js          # API配置
│       ├── client.js          # HTTP客户端
│       ├── userService.js     # 用户API
│       └── authService.js     # 认证API
└── utils/
    ├── storage.js             # 存储工具
    └── errorHandler.js        # 错误处理
```

### 关键功能

1. **请求拦截器**：
   - 自动添加Authorization header
   - 添加Content-Type等通用header

2. **响应拦截器**：
   - 统一处理401未认证错误
   - 统一处理500服务器错误
   - 转换响应数据格式

3. **错误处理**：
   - 网络错误提示
   - 业务错误提示
   - 认证失败跳转登录

---

**创建日期**: 2026-03-18
