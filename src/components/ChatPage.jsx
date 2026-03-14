import { useState, useEffect, useRef } from 'react'

// 直接使用后端API地址
const API_BASE_URL = 'http://localhost:8000'

function ChatPage({ t, currentFriend }) {
  const [messages, setMessages] = useState([])
  const [inputValues, setInputValues] = useState({})  // 每个好友独立的输入框内容
  const [loadingStates, setLoadingStates] = useState({})  // 每个好友独立的loading状态
  const [sessionId, setSessionId] = useState(null)
  const messagesEndRef = useRef(null)
  const currentFriendRef = useRef(currentFriend)  // 保存当前好友的引用

  // 当前用户ID（可以从登录信息获取，这里暂时硬编码）
  const currentUserId = 'user_001'

  // 获取当前好友的输入框内容和loading状态
  const inputValue = inputValues[currentFriend?.id] || ''
  const isLoading = loadingStates[currentFriend?.id] || false

  // 更新当前好友引用
  useEffect(() => {
    currentFriendRef.current = currentFriend
  }, [currentFriend])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 当切换好友时，加载对应的会话
  useEffect(() => {
    const loadFriendSession = async () => {
      if (!currentFriend) return

      console.log('切换到好友:', currentFriend.id, currentFriend.name)

      // 从 localStorage 获取该好友的 session_id
      const storageKey = `chat_session_${currentUserId}_${currentFriend.id}`
      const savedSessionId = localStorage.getItem(storageKey)
      console.log('从 localStorage 读取 session_id:', savedSessionId)

      if (savedSessionId) {
        setSessionId(savedSessionId)

        // 加载历史消息
        try {
          console.log('加载历史消息...')
          const response = await fetch(`${API_BASE_URL}/api/chat/history/${savedSessionId}`)
          const data = await response.json()

          console.log('历史消息响应:', data)

          if (data.code === 200 && data.data.messages.length > 0) {
            setMessages(data.data.messages)
            console.log(`✓ 已加载 ${data.data.messages.length} 条历史消息`)
          } else {
            console.log('没有历史消息')
            setMessages([])
          }
        } catch (error) {
          console.error('加载历史消息失败:', error)
          setMessages([])
        }
      } else {
        // 没有历史会话，清空消息
        console.log('没有历史会话，清空消息')
        setSessionId(null)
        setMessages([])
      }
    }

    loadFriendSession()
  }, [currentFriend, currentUserId])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !currentFriend) return

    const userMessage = inputValue.trim()
    const requestFriend = currentFriend  // 保存发送请求时的好友
    const requestUserId = currentUserId

    // 清空当前好友的输入框
    setInputValues(prev => ({ ...prev, [currentFriend.id]: '' }))

    // 添加用户消息到界面
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    // 设置当前好友的loading状态
    setLoadingStates(prev => ({ ...prev, [requestFriend.id]: true }))

    try {
      console.log('发送请求到:', `${API_BASE_URL}/api/chat`)
      console.log('请求数据:', {
        message: userMessage,
        session_id: sessionId,
        user_id: requestUserId,
        agent_id: requestFriend.id
      })

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId,
          user_id: requestUserId,
          agent_id: requestFriend.id,
        }),
      })

      console.log('响应状态:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('响应错误:', errorText)
        throw new Error(`Network response was not ok: ${response.status}`)
      }

      const data = await response.json()
      console.log('响应数据:', data)

      // 保存session_id到localStorage（无论当前是否还在该好友的聊天界面）
      if (data.data.session_id) {
        const storageKey = `chat_session_${requestUserId}_${requestFriend.id}`
        localStorage.setItem(storageKey, data.data.session_id)
        console.log('✓ 保存 session_id 到 localStorage:', storageKey, data.data.session_id)
      }

      // 检查当前好友是否还是发送请求时的好友
      if (currentFriendRef.current?.id === requestFriend.id) {
        // 如果还在同一个好友的聊天界面，直接更新消息
        console.log('✓ 当前仍在', requestFriend.name, '的聊天界面，直接显示回复')
        setSessionId(data.data.session_id)
        setMessages(prev => [...prev, { role: 'assistant', content: data.data.message }])
        setLoadingStates(prev => ({ ...prev, [requestFriend.id]: false }))
      } else {
        // 如果已经切换到其他好友，不更新当前界面，但消息已保存到数据库
        console.log('⚠️ 已切换到其他好友，', requestFriend.name, '的回复已保存，切换回去可以看到')
        // 关闭该好友的loading状态（即使不在当前界面）
        setLoadingStates(prev => ({ ...prev, [requestFriend.id]: false }))
      }
    } catch (error) {
      console.error('Error sending message:', error)
      console.error('Error details:', error.message)

      // 只有在好友没有切换时才显示错误消息
      if (currentFriendRef.current?.id === requestFriend.id) {
        setMessages(prev => [...prev, { role: 'assistant', content: `抱歉，发送消息失败：${error.message}` }])
        setLoadingStates(prev => ({ ...prev, [requestFriend.id]: false }))
      } else {
        // 即使切换了好友，也要关闭loading状态
        setLoadingStates(prev => ({ ...prev, [requestFriend.id]: false }))
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-stage">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <p>{t('chatEmptyState') || '开始对话吧！'}</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`chat-row ${msg.role === 'user' ? 'right' : 'left'}`}>
              {msg.role === 'assistant' && (
                <span className="chat-msg-avatar friend">{t('chatFriendAvatar')}</span>
              )}
              <div className={`chat-bubble ${msg.role === 'user' ? 'right' : 'left'}`}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <span className="chat-msg-avatar self">{t('chatSelfAvatar')}</span>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="chat-row left">
            <span className="chat-msg-avatar friend">{t('chatFriendAvatar')}</span>
            <div className="chat-bubble left">
              <span className="typing-indicator">...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 真实的输入框 */}
      <div className="chat-input-bar-real">
        <input
          type="text"
          className="chat-input-field"
          placeholder={t('chatInputPlaceholder')}
          value={inputValue}
          onChange={(e) => setInputValues(prev => ({ ...prev, [currentFriend.id]: e.target.value }))}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          type="button"
          className="chat-send-btn"
          onClick={sendMessage}
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? '...' : '发送'}
        </button>
      </div>
    </div>
  )
}

export default ChatPage

