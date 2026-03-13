import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'

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

function ChatSidebar({ t, onOpenProfile }) {
  return (
    <>
      <div className="sidebar-head">
        <label className="search-box">
          <span className="search-icon">⌕</span>
          <input className="search-input" placeholder={t('searchPlaceholder')} aria-label={t('searchPlaceholder')} />
        </label>
        <button type="button" className="sidebar-plus" aria-label={t('chatSidebarAdd')}>
          +
        </button>
      </div>
      <NavLink to="/home" className="chat-item chat-link-item" aria-label={t('chatAgentName')}>
        <div className="avatar robot">{t('chatRobotIcon')}</div>
        <div className="chat-meta">
          <p className="chat-name">{t('chatAgentName')}</p>
        </div>
      </NavLink>
      <div className="chat-item active">
        <button type="button" className="avatar-trigger" onClick={onOpenProfile} aria-label={t('chatFriendName')}>
          <div className="avatar friend">{t('chatFriendAvatar')}</div>
        </button>
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

function PersonalMenuPopover({ t }) {
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
      <button type="button" className="personal-logout">{t('personalLogout')}</button>
    </section>
  )
}

function App() {
  const { t, i18n } = useTranslation()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isWalletOpen, setIsWalletOpen] = useState(false)
  const [isPersonalOpen, setIsPersonalOpen] = useState(false)
  const location = useLocation()
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
            {isPersonalOpen ? <PersonalMenuPopover t={t} /> : null}
          </div>
        </div>
      </aside>

      <aside className="sidebar" aria-label="Conversation List">
        {/* Home 页使用专属侧栏内容，其他页面暂保留最小占位。 */}
        {isHome ? (
          <HomeSidebar t={t} />
        ) : isChat ? (
          <ChatSidebar t={t} onOpenProfile={() => setIsProfileOpen(true)} />
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
            <Route path="/home" element={<HomePage t={t} />} />
            <Route path="/chat" element={<ChatPage t={t} />} />
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
