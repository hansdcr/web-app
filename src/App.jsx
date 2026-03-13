import { useTranslation } from 'react-i18next'
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'

function App() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
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
        <div className="rail-brand">{t('railBrand')}</div>
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
        <div className="search-box">{t('searchPlaceholder')}</div>
      </aside>

      <main className="main" aria-label="Main Content">
        <header className="topbar">
          <span>{currentTitle}</span>
          <button
            type="button"
            className="locale-btn"
            onClick={() => i18n.changeLanguage(nextLocale)}
            aria-label={t('localeLabel')}
          >
            {isZh ? 'EN' : '中'}
          </button>
        </header>
        <section className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/chat" element={<div className="route-placeholder">{t('pageChat')}</div>} />
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
