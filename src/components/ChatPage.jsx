import { useState, useEffect, useRef } from 'react'

// 直接使用后端API地址
const API_BASE_URL = 'http://localhost:8000'

function ChatPage({ t }) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 页面加载时恢复会话
  useEffect(() => {
    const loadSession = async () => {
      // 从 localStorage 获取 session_id
      const savedSessionId = localStorage.getItem('chat_session_id')
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
          }
        } catch (error) {
          console.error('加载历史消息失败:', error)
        }
      }
    }

    loadSession()
  }, [])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    setInputValue('')

    // 添加用户消息到界面
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      console.log('发送请求到:', `${API_BASE_URL}/api/chat`)
      console.log('请求数据:', { message: userMessage, session_id: sessionId })

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId,
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

      // 保存session_id
      if (data.data.session_id) {
        setSessionId(data.data.session_id)
        // 保存到 localStorage
        localStorage.setItem('chat_session_id', data.data.session_id)
        console.log('✓ 保存 session_id 到 localStorage:', data.data.session_id)
      }

      // 添加AI回复到界面
      setMessages(prev => [...prev, { role: 'assistant', content: data.data.message }])
    } catch (error) {
      console.error('Error sending message:', error)
      console.error('Error details:', error.message)
      setMessages(prev => [...prev, { role: 'assistant', content: `抱歉，发送消息失败：${error.message}` }])
    } finally {
      setIsLoading(false)
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
          onChange={(e) => setInputValue(e.target.value)}
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

