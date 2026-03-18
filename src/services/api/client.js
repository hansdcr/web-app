import { API_CONFIG } from './config'
import { storage } from '../../utils/storage'

// HTTP客户端
class HttpClient {
  constructor(config) {
    this.baseURL = config.baseURL
    this.timeout = config.timeout
    this.headers = config.headers
  }

  // 请求拦截器
  async request(url, options = {}) {
    const token = storage.getToken()

    // 合并headers
    const headers = {
      ...this.headers,
      ...options.headers,
    }

    // 添加认证token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // 构建完整URL
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`

    // 设置超时
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(fullURL, {
        ...options,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // 响应拦截器
      return await this.handleResponse(response)
    } catch (error) {
      clearTimeout(timeoutId)
      throw this.handleError(error)
    }
  }

  // 响应处理
  async handleResponse(response) {
    const data = await response.json()

    if (!response.ok) {
      // 401未认证 - 清除token并跳转登录
      if (response.status === 401) {
        storage.clearAuth()
        window.location.href = '/login'
        throw new Error(data.message || '未认证，请重新登录')
      }

      // 其他错误
      throw new Error(data.message || `请求失败: ${response.status}`)
    }

    return data
  }

  // 错误处理
  handleError(error) {
    if (error.name === 'AbortError') {
      return new Error('请求超时')
    }

    if (!navigator.onLine) {
      return new Error('网络连接失败，请检查网络')
    }

    return error
  }

  // GET请求
  get(url, params = {}, options = {}) {
    const queryString = new URLSearchParams(params).toString()
    const fullURL = queryString ? `${url}?${queryString}` : url

    return this.request(fullURL, {
      ...options,
      method: 'GET',
    })
  }

  // POST请求
  post(url, data = {}, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // PUT请求
  put(url, data = {}, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // DELETE请求
  delete(url, options = {}) {
    return this.request(url, {
      ...options,
      method: 'DELETE',
    })
  }
}

// 创建默认实例
export const httpClient = new HttpClient(API_CONFIG)
