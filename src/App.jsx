import { useTranslation } from 'react-i18next'
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'

function HomeSidebar({ t }) {
  return (
    <>
      <div className="sidebar-head">
        <div className="search-box">{t('searchPlaceholder')}</div>
        <button type="button" className="sidebar-plus" aria-label={t('homeSidebarAdd')}>
          +
        </button>
      </div>
      <div className="chat-item active">
        <div className="avatar robot">{t('homeRobotIcon')}</div>
        <div className="chat-meta">
          <p className="chat-name">{t('homeAgentName')}</p>
          <p className="chat-desc">{t('homeAgentDesc')}</p>
        </div>
      </div>
      <div className="chat-item">
        <div className="avatar friend">{t('homeFriendAvatar')}</div>
        <div className="chat-meta">
          <p className="chat-name">{t('homeFriendName')}</p>
          <p className="chat-desc">{t('homeFriendPreview')}</p>
        </div>
      </div>
    </>
  )
}

function ChatSidebar({ t }) {
  return (
    <>
      <div className="sidebar-head">
        <div className="search-box">{t('searchPlaceholder')}</div>
        <button type="button" className="sidebar-plus" aria-label={t('chatSidebarAdd')}>
          +
        </button>
      </div>
      <div className="chat-item">
        <div className="avatar robot">{t('chatRobotIcon')}</div>
        <div className="chat-meta">
          <p className="chat-name">{t('chatAgentName')}</p>
        </div>
      </div>
      <div className="chat-item active">
        <div className="avatar friend">{t('chatFriendAvatar')}</div>
        <div className="chat-meta">
          <p className="chat-name">{t('chatFriendName')}</p>
          <p className="chat-desc">{t('chatFriendPreview')}</p>
        </div>
      </div>
    </>
  )
}

function HomePage({ t }) {
  return (
    <div className="home-map-layout">
      <section className="map-surface full">
        <div className="map-head map-head-floating">
          <div>
            <p className="map-title">{t('homeMapTitle')}</p>
            <p className="map-subtitle">{t('homeMapSubtitle')}</p>
          </div>
          <button type="button" className="map-action">{t('homeMapAction')}</button>
        </div>
        {/* 地图为主视觉区域，先用静态样式占位，后续迭代接入真实地图 SDK。 */}
        <div className="map-grid" />
        <span className="map-marker marker-dufu">{t('homeMarkerDufu')}</span>
        <span className="map-marker marker-liqingzhao">{t('homeMarkerLiqingzhao')}</span>
        <span className="map-marker marker-lubunwei">{t('homeMarkerLuban')}</span>
      </section>
      {/* Home 页采用上下结构：上方地图主视觉 + 下方输入区域。 */}
      <section className="home-input-panel">
        <p className="composer-prompt">{t('homeComposerPrompt')}</p>
        <div className="composer-row">
          <button type="button" className="composer-send" aria-label={t('homePromptSend')}>
            {t('homePromptSend')}
          </button>
        </div>
      </section>
    </div>
  )
}

function ChatPage({ t }) {
  return (
    <div className="chat-page">
      <div className="chat-stage">
        <div className="chat-row left">
          <span className="chat-msg-avatar friend">{t('chatFriendAvatar')}</span>
          <div className="chat-bubble left">{t('chatBubble1')}</div>
        </div>
        <div className="chat-row right">
          <div className="chat-bubble right">{t('chatBubble2')}</div>
          <span className="chat-msg-avatar self">{t('chatSelfAvatar')}</span>
        </div>
        <div className="chat-row left">
          <span className="chat-msg-avatar friend">{t('chatFriendAvatar')}</span>
          <div className="chat-bubble left">{t('chatBubble3')}</div>
        </div>
        <div className="chat-row right">
          <div className="chat-bubble right">{t('chatBubble4')}</div>
          <span className="chat-msg-avatar self">{t('chatSelfAvatar')}</span>
        </div>
        {/* 迭代 6 先还原静态输入条，后续迭代再接入真实输入交互。 */}
        <div className="chat-input-bar">
          <span className="chat-input-icon">☺</span>
          <span className="chat-input-placeholder">{t('chatInputPlaceholder')}</span>
          <span className="chat-input-icon">📎</span>
          <span className="chat-input-icon">📷</span>
          <span className="chat-mic">{t('chatMic')}</span>
        </div>
      </div>
    </div>
  )
}

function App() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const isHome = location.pathname === '/home'
  const isChat = location.pathname === '/chat'
  const isZh = i18n.language === 'zh-CN'
  const nextLocale = isZh ? 'en-US' : 'zh-CN'
  const railItems = [
    { key: 'chat', path: '/chat', icon: '💬', label: t('railChat') },
    { key: 'discover', path: '/discover', icon: '🧭', label: t('railDiscover') },
    { key: 'contacts', path: '/contacts', icon: '👥', label: t('railContacts') },
    { key: 'create', path: '/create', icon: '✨', label: t('railCreate') },
  ]
  const currentTitle = railItems.find((item) => item.path === location.pathname)?.label ?? t('topbarTitle')

  return (
    <div className="web-shell">
      <aside className="rail" aria-label={t('railAria')}>
        <NavLink to="/home" className="rail-brand" aria-label={t('railHome')}>
          {t('railBrand')}
        </NavLink>
        <div className="rail-nav">
          {/* 迭代 4：接入真实路由，激活态由 URL 自动驱动。 */}
          {railItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) => `rail-icon ${isActive ? 'active' : ''}`}
              aria-label={item.label}
            >
              <span aria-hidden="true">{item.icon}</span>
            </NavLink>
          ))}
        </div>
      </aside>

      <aside className="sidebar" aria-label="Conversation List">
        {/* Home 页使用专属侧栏内容，其他页面暂保留最小占位。 */}
        {isHome ? (
          <HomeSidebar t={t} />
        ) : isChat ? (
          <ChatSidebar t={t} />
        ) : (
          <div className="search-box">{t('searchPlaceholder')}</div>
        )}
      </aside>

      <main className="main" aria-label="Main Content">
        <header className="topbar">
          {isChat ? (
            <div className="chat-topbar">
              <div className="chat-topbar-user">
                <span className="chat-topbar-avatar">{t('chatFriendAvatar')}</span>
                <span>{t('chatFriendName')}</span>
              </div>
              <span className="chat-topbar-menu">...</span>
            </div>
          ) : (
            <>
              <span>{currentTitle}</span>
              <button
                type="button"
                className="locale-btn"
                onClick={() => i18n.changeLanguage(nextLocale)}
                aria-label={t('localeLabel')}
              >
                {isZh ? 'EN' : '中'}
              </button>
            </>
          )}
        </header>
        <section className={`main-content ${isHome ? 'is-home' : ''} ${isChat ? 'is-chat' : ''}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<HomePage t={t} />} />
            <Route path="/chat" element={<ChatPage t={t} />} />
            <Route path="/discover" element={<div className="route-placeholder">{t('pageDiscover')}</div>} />
            <Route path="/contacts" element={<div className="route-placeholder">{t('pageContacts')}</div>} />
            <Route path="/create" element={<div className="route-placeholder">{t('pageCreate')}</div>} />
          </Routes>
        </section>
      </main>
    </div>
  )
}

export default App
