import { httpClient } from './client'
import { API_ENDPOINTS } from './config'

export const contactService = {
  // 获取当前用户/agent 的联系人列表
  async getContacts(ownerType, ownerId) {
    return httpClient.get(API_ENDPOINTS.contacts, {
      owner_type: ownerType,
      owner_id: ownerId,
      limit: 100,
    })
  },

  // 添加联系人
  async addContact(ownerType, ownerId, targetType, targetId) {
    const url = `${API_ENDPOINTS.contacts}?owner_type=${ownerType}&owner_id=${ownerId}`
    return httpClient.post(url, {
      target_type: targetType,
      target_id: targetId,
      contact_type: 'friend',
    })
  },

  // 删除联系人
  async removeContact(contactId) {
    return httpClient.delete(API_ENDPOINTS.contactById(contactId))
  },
}
