import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import ChatPage from './components/ChatPage'
import Login from './pages/Login'
import Register from './pages/Register'
import { useAuth } from './contexts/AuthContext'

function HomeSidebar({ t }) {
  return (
    <>
      <div className="sidebar-head">
        <label className="search-box">
          <span className="search-icon">⌕</span>
          <input className="search-input" placeholder={t('searchPlaceholder')} aria-label={t('searchPlaceholder')} />
        </label>
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
      <NavLink to="/chat" className="chat-item chat-link-item" aria-label={t('homeFriendName')}>
        <div className="avatar friend">{t('homeFriendAvatar')}</div>
        <div className="chat-meta">
          <p className="chat-name">{t('homeFriendName')}</p>
          <p className="chat-desc">{t('homeFriendPreview')}</p>
        </div>
      </NavLink>
    </>
  )
}

function AddFriendPopover({ t, onAdd, onClose }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleAdd = () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError(t('addFriendRequired'))
      return
    }
    onAdd(trimmed)
    setName('')
    setError('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="add-friend-pop">
      <div className="add-friend-pop-head">
        <span>{t('addFriendTitle')}</span>
        <button type="button" className="add-friend-close" onClick={onClose} aria-label={t('addFriendClose')}>×</button>
      </div>
      <input
        className={`add-friend-input${error ? ' has-error' : ''}`}
        placeholder={t('addFriendPlaceholder')}
        value={name}
        onChange={(e) => { setName(e.target.value); setError('') }}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      {error && <p className="add-friend-error">{error}</p>}
      <button type="button" className="add-friend-btn" onClick={handleAdd}>
        {t('addFriendConfirm')}
      </button>
    </div>
  )
}

function ChatSidebar({ t, onOpenProfile, friends, currentFriend, onSelectFriend, onAddFriend }) {
  const [isAddOpen, setIsAddOpen] = useState(false)

  const handleAdd = (name) => {
    onAddFriend(name)
    setIsAddOpen(false)
  }

  return (
    <>
      <div className="sidebar-head" style={{ position: 'relative' }}>
        <label className="search-box">
          <span className="search-icon">⌕</span>
          <input className="search-input" placeholder={t('searchPlaceholder')} aria-label={t('searchPlaceholder')} />
        </label>
        <button
          type="button"
          className={`sidebar-plus${isAddOpen ? ' active' : ''}`}
          aria-label={t('chatSidebarAdd')}
          onClick={() => setIsAddOpen((prev) => !prev)}
        >
          +
        </button>
        {isAddOpen && (
          <AddFriendPopover t={t} onAdd={handleAdd} onClose={() => setIsAddOpen(false)} />
        )}
      </div>
      {friends.map((friend) => (
        <div
          key={friend.id}
          className={`chat-item ${currentFriend?.id === friend.id ? 'active' : ''}`}
          onClick={() => onSelectFriend(friend)}
          style={{ cursor: 'pointer' }}
        >
          <div className="avatar friend">{friend.avatar}</div>
          <div className="chat-meta">
            <p className="chat-name">{friend.name}</p>
            <p className="chat-desc">{t('chatClickToChat')}</p>
          </div>
        </div>
      ))}
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

// ChatPage组件已移至 ./components/ChatPage.jsx

function DiscoverPage({ t }) {
  const cardKeys = [
    'dailyNews',
    'smartPhoto',
    'shareMovie',
    'eatTogether',
    'shareAi',
    'dailyGym',
    'dailyReading',
    'dailyStock',
    'languageStudy',
    'generateImages',
    'shareMusic',
    'shareSports',
  ]

  return (
    <div className="discover-page">
      <section className="discover-section">
        <div className="discover-section-head">
          <h2>{t('discoverTrendingGroups')}</h2>
          <button type="button">{t('discoverViewAll')}</button>
        </div>
        <div className="discover-grid">
          {cardKeys.map((key, index) => (
            <article key={key} className="discover-card">
              <div className={`discover-cover discover-cover-${index + 1}`} />
              <div className="discover-body">
                <div className="discover-body-head">
                  <p>{t(`discoverCard.${key}.title`)}</p>
                  <span>{t('discoverJoin')}</span>
                </div>
                <p>{t(`discoverCard.${key}.desc`)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="discover-footer-title">{t('discoverRecommendedAgents')}</section>
    </div>
  )
}

function ContactsSidebar({ t }) {
  return (
    <div className="contacts-sidebar">
      <div className="contacts-sidebar-head">
        <h2>{t('contactsTitle')}</h2>
        <button type="button" aria-label={t('contactsAdd')}>+</button>
      </div>
      <div className="contacts-sidebar-tabs">
        <button type="button" className="active">{t('contactsTabAgents')}</button>
        <button type="button">{t('contactsTabFriends')}</button>
        <button type="button">{t('contactsTabRequests')}</button>
      </div>
    </div>
  )
}

function ContactsPage({ t }) {
  const groups = [
    { letter: 'A', items: ['Accounting Assistant', 'AI Stock Assistant'] },
    { letter: 'F', items: ['Finance Assistant'] },
    { letter: 'H', items: ['Health Assistant'] },
    { letter: 'M', items: ['Market Research'] },
    { letter: 'S', items: ['Slides Assistant'] },
    { letter: 'T', items: ['Travel Planner'] },
    { letter: 'W', items: ['Webpage Developer'] },
  ]

  return (
    <div className="contacts-page">
      <div className="contacts-list">
        {groups.map((group) => (
          <section key={group.letter} className="contacts-group">
            <p className="contacts-letter">{group.letter}</p>
            <div className="contacts-items">
              {group.items.map((item) => (
                <div key={item} className={`contacts-row ${item === 'Travel Planner' ? 'active' : ''}`}>
                  <span className="contacts-row-icon">✦</span>
                  <span>{t(`contactsItem.${item}`)}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="contacts-index">A F H M S T W</div>
    </div>
  )
}

function ChatProfileDrawer({ t, onClose }) {
  return (
    <div className="profile-overlay" role="dialog" aria-modal="true">
      <button type="button" className="profile-backdrop" onClick={onClose} aria-label={t('chatProfileClose')} />
      <aside className="profile-drawer">
        <button type="button" className="profile-close" onClick={onClose} aria-label={t('chatProfileClose')}>×</button>
        <div className="profile-head">
          <div className="profile-avatar">{t('chatFriendAvatar')}</div>
          <h3>{t('chatFriendName')}</h3>
          <p>{t('chatProfileEmail')}</p>
        </div>
        <button type="button" className="profile-primary">{t('chatProfileCreateGroup')}</button>
        <div className="profile-list">
          <button type="button">{t('chatProfileSetRemark')}</button>
          <button type="button">{t('chatProfileMute')}</button>
          <button type="button">{t('chatProfilePinTop')}</button>
          <button type="button">{t('chatProfileBlockUser')}</button>
          <button type="button" className="danger-text">{t('chatProfileClearHistory')}</button>
        </div>
        <button type="button" className="profile-danger">{t('chatProfileDeleteFriend')}</button>
      </aside>
    </div>
  )
}

function WalletPopover({ t }) {
  return (
    <section className="wallet-pop">
      <div className="wallet-head">
        <p>{t('walletPlan')}</p>
        <button type="button">{t('walletUpgrade')}</button>
      </div>
      <div className="wallet-lines">
        <div><span>{t('walletCredits')}</span><strong>{t('walletValueCredits')}</strong></div>
        <div><span>{t('walletSubscription')}</span><span>{t('walletValueSubscription')}</span></div>
        <div><span>{t('walletDailyCredit')}</span><span>{t('walletValueDailyCredit')}</span></div>
        <div><span>{t('walletNewUser')}</span><strong>{t('walletValueNewUser')}</strong></div>
        <div><span>{t('walletPurchased')}</span><span>{t('walletValuePurchased')}</span></div>
      </div>
      <button type="button" className="wallet-detail">{t('walletUsageDetails')}</button>
    </section>
  )
}

function PersonalMenuPopover({ t, onLogout }) {
  return (
    <section className="personal-pop">
      <div className="personal-account">
        <div className="personal-avatar">{t('personalInitial')}</div>
        <div>
          <p>{t('personalAccount')}</p>
          <span>{t('personalEmail')}</span>
        </div>
      </div>
      <div className="personal-menu">
        <button type="button">{t('personalSettings')}</button>
        <button type="button">{t('personalInviteFriends')}</button>
        <button type="button">{t('personalAbout')}</button>
        <button type="button">{t('personalPricing')}</button>
        <button type="button">{t('personalRefundPolicy')}</button>
        <button type="button">{t('personalTerms')}</button>
        <button type="button">{t('personalPrivacy')}</button>
      </div>
      <button type="button" className="personal-logout" onClick={onLogout}>{t('personalLogout')}</button>
    </section>
  )
}

function App() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated, loading, logout } = useAuth()
  const location = useLocation()

  // 所有 Hooks 必须在条件判断之前调用
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isWalletOpen, setIsWalletOpen] = useState(false)
  const [isPersonalOpen, setIsPersonalOpen] = useState(false)

  // 好友列表（agent列表）
  const [friends, setFriends] = useState([
    { id: 'agent_hans', name: 'Hans', avatar: '🤖' },
    { id: 'agent_alice', name: 'Alice', avatar: '👩' },
    { id: 'agent_bob', name: 'Bob', avatar: '👨' },
  ])

  const handleAddFriend = (name) => {
    const id = `agent_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`
    const avatars = ['😊', '🧑', '👤', '🙂', '😄']
    const avatar = avatars[Math.floor(Math.random() * avatars.length)]
    setFriends((prev) => [...prev, { id, name, avatar }])
  }

  // 当前选中的好友 - 从localStorage恢复
  const [currentFriend, setCurrentFriend] = useState(() => {
    const savedFriendId = localStorage.getItem('current_friend_id')
    if (savedFriendId) {
      const friend = friends.find(f => f.id === savedFriendId)
      if (friend) {
        return friend
      }
    }
    return friends[0]
  })

  // 当切换好友时，保存到localStorage
  const handleSelectFriend = (friend) => {
    setCurrentFriend(friend)
    localStorage.setItem('current_friend_id', friend.id)
  }

  // 处理退出
  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // 如果正在加载认证状态，显示loading
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ fontSize: '48px' }}>🤖</div>
      </div>
    )
  }

  // 如果未登录且不在登录/注册页面，跳转到登录页
  const publicPaths = ['/login', '/register']
  if (!isAuthenticated && !publicPaths.includes(location.pathname)) {
    return <Navigate to="/login" replace />
  }

  // 如果已登录且在登录/注册页面，跳转到首页
  if (isAuthenticated && publicPaths.includes(location.pathname)) {
    return <Navigate to="/home" replace />
  }

  // 如果在登录/注册页面，只显示页面内容，不显示导航栏
  if (publicPaths.includes(location.pathname)) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    )
  }

  const isHome = location.pathname === '/home'
  const isChat = location.pathname === '/chat'
  const isDiscover = location.pathname === '/discover'
  const isContacts = location.pathname === '/contacts'
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
    <div className={`web-shell ${isDiscover ? 'is-discover-shell' : ''}`}>
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
        <div className="rail-footer">
          <div className="wallet-wrap">
            <button
              type="button"
              className="wallet-trigger"
              onClick={() => setIsWalletOpen((prev) => !prev)}
              aria-label={t('walletTrigger')}
            >
              💎
            </button>
            <span className="wallet-count">{t('walletTriggerCount')}</span>
            {isWalletOpen ? <WalletPopover t={t} /> : null}
          </div>
          <div className="personal-wrap">
            <button
              type="button"
              className="personal-trigger"
              onClick={() => setIsPersonalOpen((prev) => !prev)}
              aria-label={t('personalTrigger')}
            >
              {t('personalInitial')}
            </button>
            {isPersonalOpen ? <PersonalMenuPopover t={t} onLogout={handleLogout} /> : null}
          </div>
        </div>
      </aside>

      <aside className="sidebar" aria-label="Conversation List">
        {/* Home 页使用专属侧栏内容，其他页面暂保留最小占位。 */}
        {isHome ? (
          <HomeSidebar t={t} />
        ) : isChat ? (
          <ChatSidebar
            t={t}
            onOpenProfile={() => setIsProfileOpen(true)}
            friends={friends}
            currentFriend={currentFriend}
            onSelectFriend={handleSelectFriend}
            onAddFriend={handleAddFriend}
          />
        ) : isContacts ? (
          <ContactsSidebar t={t} />
        ) : isDiscover ? (
          <></>
        ) : (
          <label className="search-box">
            <span className="search-icon">⌕</span>
            <input className="search-input" placeholder={t('searchPlaceholder')} aria-label={t('searchPlaceholder')} />
          </label>
        )}
      </aside>

      <main className="main" aria-label="Main Content">
        <header className="topbar">
          {isChat ? (
            <div className="chat-topbar">
              <div className="chat-topbar-user">
                <button
                  type="button"
                  className="chat-topbar-avatar-btn"
                  onClick={() => setIsProfileOpen(true)}
                  aria-label={t('chatFriendName')}
                >
                  <span className="chat-topbar-avatar">{t('chatFriendAvatar')}</span>
                </button>
                <span>{t('chatFriendName')}</span>
              </div>
              <span className="chat-topbar-menu">...</span>
            </div>
          ) : isDiscover ? (
            <div className="discover-topbar">
              <span>{t('railDiscover')}</span>
              <div className="discover-tabs">
                <button type="button" className="active">{t('discoverTabGroups')}</button>
                <button type="button">{t('discoverTabAgents')}</button>
                <button type="button">{t('discoverTabPlaybooks')}</button>
              </div>
            </div>
          ) : isContacts ? (
            <div className="contacts-topbar">{t('contactsMainTitle')}</div>
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
        <section
          className={`main-content ${isHome ? 'is-home' : ''} ${isChat ? 'is-chat' : ''} ${isDiscover ? 'is-discover' : ''} ${isContacts ? 'is-contacts' : ''}`}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<HomePage t={t} />} />
            <Route path="/chat" element={<ChatPage t={t} currentFriend={currentFriend} />} />
            <Route path="/discover" element={<DiscoverPage t={t} />} />
            <Route path="/contacts" element={<ContactsPage t={t} />} />
            <Route path="/create" element={<div className="route-placeholder">{t('pageCreate')}</div>} />
          </Routes>
        </section>
      </main>
      {isChat && isProfileOpen ? <ChatProfileDrawer t={t} onClose={() => setIsProfileOpen(false)} /> : null}
    </div>
  )
}

export default App
